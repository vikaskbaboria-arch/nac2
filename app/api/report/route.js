import connectDB from "@/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Movie from "@/models/movie.models";
import Report from "@/models/report";
import Review from "@/models/review";
import Space from "@/models/space.model";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const REPORT_TYPES = ["review", "movie", "provider", "space", "movie_info"];
const REPORT_REASONS = [
  "inaccurate_information",
  "inappropriate_content",
  "spam",
  "harassment",
  "not_available",
  "incorrect_provider",
  "wrong_region",
  "other",
];
const REPORT_STATUSES = ["pending", "in_review", "resolved", "dismissed"];

async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { session: null, user: null };

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  return { session, user };
}

function isAdmin(user, session) {
  return Boolean(user?.isAdmin || session?.user?.isAdmin);
}

export async function POST(request) {
  try {
    const { session, user } = await getCurrentUser();
    if (!session || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "A valid JSON body is required" }, { status: 400 });
    }

    const {
      targetType,
      targetId,
      targetTitle,
      targetContent = "",
      mediaId,
      mediaType,
      providerId,
      providerName,
      reason,
      details = "",
    } = body || {};

    if (!REPORT_TYPES.includes(targetType)) {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }
    if (!REPORT_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid report reason" }, { status: 400 });
    }
    if (
      typeof targetTitle !== "string" ||
      !targetTitle.trim() ||
      targetTitle.trim().length > 200
    ) {
      return NextResponse.json({ error: "A valid target title is required" }, { status: 400 });
    }
    if (
      typeof targetContent !== "string" ||
      targetContent.length > 5000 ||
      typeof details !== "string" ||
      details.length > 1000
    ) {
      return NextResponse.json({ error: "Report text exceeds the allowed length" }, { status: 400 });
    }

    let safeTargetId = String(targetId || "").trim();
    let safeTitle = targetTitle.trim();
    let safeContent = targetContent.trim();
    let safeMediaId;
    let safeMediaType;
    let safeProviderId;
    let safeProviderName;

    if (targetType === "review" || targetType === "space") {
      if (!/^[a-f\d]{24}$/i.test(safeTargetId)) {
        return NextResponse.json({ error: "A valid target ID is required" }, { status: 400 });
      }

      if (targetType === "review") {
        const review = await Review.findById(safeTargetId).select("review movie").lean();
        if (!review) {
          return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        const movie = review.movie
          ? await Movie.findById(review.movie)
              .select("movieTitle movieid movieId media_type")
              .lean()
          : null;
        safeTitle = movie?.movieTitle
          ? `Review of ${movie.movieTitle}`
          : targetTitle.trim();
        safeContent = review.review || "";
        safeMediaId = Number(movie?.movieid || movie?.movieId) || undefined;
        safeMediaType = movie?.media_type;
      } else {
        const space = await Space.findById(safeTargetId)
          .populate("movieId", "movieTitle movieid movieId media_type")
          .lean();
        if (!space) {
          return NextResponse.json({ error: "Space post not found" }, { status: 404 });
        }
        safeTitle = space.title || space.movieId?.movieTitle || "Space post";
        safeContent = space.content || "";
        safeMediaId = Number(space.movieId?.movieid || space.movieId?.movieId) || undefined;
        safeMediaType = space.movieId?.media_type;
      }
    } else {
      safeMediaId = Number(mediaId);
      if (
        !Number.isSafeInteger(safeMediaId) ||
        safeMediaId < 1 ||
        !["movie", "tv"].includes(mediaType)
      ) {
        return NextResponse.json(
          { error: "A valid movie or series ID and type are required" },
          { status: 400 }
        );
      }
      safeMediaType = mediaType;
      safeTargetId = `${safeMediaType}:${safeMediaId}`;

      if (targetType === "provider") {
        safeProviderId = Number(providerId);
        safeProviderName = typeof providerName === "string" ? providerName.trim() : "";
        if (
          !Number.isSafeInteger(safeProviderId) ||
          safeProviderId < 1 ||
          !safeProviderName ||
          safeProviderName.length > 150
        ) {
          return NextResponse.json(
            { error: "A valid streaming provider is required" },
            { status: 400 }
          );
        }
        safeTargetId += `:provider:${safeProviderId}`;
      }
    }

    const report = await Report.create({
      reportedBy: user._id,
      targetType,
      targetId: safeTargetId,
      targetTitle: safeTitle,
      targetContent: safeContent,
      mediaId: safeMediaId,
      mediaType: safeMediaType,
      providerId: safeProviderId,
      providerName: safeProviderName,
      reason,
      details: details.trim(),
    });

    return NextResponse.json(
      { message: "Report submitted", reportId: report._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/report error:", error);
    return NextResponse.json({ error: "Unable to submit report" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { session, user } = await getCurrentUser();
    if (!session || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const wantsAdminQueue = new URL(request.url).searchParams.get("scope") === "admin";
    const admin = isAdmin(user, session);
    if (wantsAdminQueue && !admin) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }

    const query = admin && wantsAdminQueue ? {} : { reportedBy: user._id };
    let reportsQuery = Report.find(query).sort({ createdAt: -1 }).limit(200);
    if (admin && wantsAdminQueue) {
      reportsQuery = reportsQuery.populate("reportedBy", "username email");
    } else {
      reportsQuery = reportsQuery.select("-adminNote");
    }
    const reports = await reportsQuery.lean();

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error("GET /api/report error:", error);
    return NextResponse.json({ error: "Unable to load reports" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { session, user } = await getCurrentUser();
    if (!session || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!isAdmin(user, session)) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "A valid JSON body is required" }, { status: 400 });
    }

    const { reportId, status, adminNote = "" } = body || {};
    if (!/^[a-f\d]{24}$/i.test(String(reportId || ""))) {
      return NextResponse.json({ error: "A valid report ID is required" }, { status: 400 });
    }
    if (!REPORT_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid report status" }, { status: 400 });
    }
    if (typeof adminNote !== "string" || adminNote.length > 1000) {
      return NextResponse.json(
        { error: "Admin note exceeds the allowed length" },
        { status: 400 }
      );
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status, adminNote: adminNote.trim() },
      { new: true, runValidators: true }
    ).lean();
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/report error:", error);
    return NextResponse.json({ error: "Unable to update report" }, { status: 500 });
  }
}
