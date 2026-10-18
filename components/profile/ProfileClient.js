"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Clapperboard,
  Globe2,
  MapPin,
  Pencil,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { GENRES } from "@/lib/genres";
import Userwatchlist from "@/components/profile/userwatchlist";
import MyInterested from "@/components/profile/myinterested";
import ProfileCollections from "@/components/profile/ProfileCollections";
import { ShowRevonProflie } from "@/components/reviews/showrevonprofile";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/70";

const initials = (name = "") =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "N";

function ProfileEditor({ profile, username, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    name: profile.name === profile.username ? "" : profile.name,
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    profilepic: profile.profilepic || "",
    coverpic: profile.coverpic || "",
    fav_genres: profile.fav_genres || [],
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleGenre = (name) => {
    setForm((current) => {
      const selected = current.fav_genres.includes(name);
      if (selected) return { ...current, fav_genres: current.fav_genres.filter((genre) => genre !== name) };
      if (current.fav_genres.length >= 5) return current;
      return { ...current, fav_genres: [...current.fav_genres, name] };
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/profile/${encodeURIComponent(username)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save your profile");
      onSaved(data.profile);
    } catch (saveError) {
      setError(saveError.message || "Unable to save your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#100d14] p-5 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">Your NAC identity</p>
            <h2 id="edit-profile-title" className="mt-1 text-2xl font-semibold">Edit profile</h2>
            <p className="mt-1 text-sm text-white/50">Tell people what you love watching.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close editor" className="rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={save} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/75">
              Display name
              <input className={fieldClass} name="name" value={form.name} onChange={setField} maxLength={50} placeholder={profile.username} />
            </label>
            <label className="text-sm text-white/75">
              Location
              <input className={fieldClass} name="location" value={form.location} onChange={setField} maxLength={80} placeholder="City, country" />
            </label>
          </div>

          <label className="block text-sm text-white/75">
            Bio <span className="text-white/35">({form.bio.length}/280)</span>
            <textarea className={`${fieldClass} min-h-24 resize-y`} name="bio" value={form.bio} onChange={setField} maxLength={280} placeholder="A line or two about your taste in movies and shows." />
          </label>

          <label className="block text-sm text-white/75">
            Website
            <input className={fieldClass} name="website" type="url" value={form.website} onChange={setField} maxLength={200} placeholder="https://your-site.example" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/75">
              Avatar image URL
              <input className={fieldClass} name="profilepic" type="url" value={form.profilepic} onChange={setField} maxLength={500} placeholder="https://…" />
            </label>
            <label className="text-sm text-white/75">
              Cover image URL
              <input className={fieldClass} name="coverpic" type="url" value={form.coverpic} onChange={setField} maxLength={500} placeholder="https://…" />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm text-white/75">Favorite genres <span className="text-white/35">(up to 5)</span></legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const selected = form.fav_genres.includes(genre.name);
                const disabled = !selected && form.fav_genres.length >= 5;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => toggleGenre(genre.name)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-35 ${selected ? "border-purple-400/60 bg-purple-500/20 text-purple-100" : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"}`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-200">{error}</p>}
          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60">
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
      <p className="text-xl font-semibold tabular-nums text-white">{value ?? "—"}</p>
      <p className="mt-0.5 text-xs text-white/45">{label}</p>
    </div>
  );
}

function Overview({ profile, isOwner, onEdit }) {
  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" })
    : null;
  const website = useMemo(() => {
    if (!profile.website) return "";
    try {
      const parsed = new URL(profile.website);
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
    } catch {
      return "";
    }
  }, [profile.website]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">About</p>
            <h2 className="mt-1 text-xl font-semibold">A little about {isOwner ? "you" : profile.name}</h2>
          </div>
          {isOwner && <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/5"><Pencil size={13} /> Edit</button>}
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-white/70">
          {profile.bio || (isOwner ? "Add a short bio and let other movie fans know what you love watching." : "This member hasn’t added a bio yet.")}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/50">
          {profile.location && <span className="inline-flex items-center gap-2"><MapPin size={15} />{profile.location}</span>}
          {website && <a className="inline-flex items-center gap-2 text-purple-200 hover:text-white" href={website} target="_blank" rel="noreferrer"><Globe2 size={15} />Website</a>}
          {joined && <span className="inline-flex items-center gap-2"><CalendarDays size={15} />Joined {joined}</span>}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-white/80"><Sparkles size={16} className="text-purple-300" /><h2 className="text-sm font-semibold">Favorite genres</h2></div>
        {profile.fav_genres?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.fav_genres.map((genre) => <span key={genre} className="rounded-full border border-purple-300/20 bg-purple-400/[0.08] px-3 py-1.5 text-xs text-purple-100">{genre}</span>)}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-white/45">{isOwner ? "Pick up to five genres to personalize your profile." : "No favorite genres listed yet."}</p>
        )}
        {isOwner && !profile.fav_genres?.length && <button type="button" onClick={onEdit} className="mt-4 text-xs font-medium text-purple-300 hover:text-white">Choose genres <span aria-hidden="true">→</span></button>}
      </section>
    </div>
  );
}

const ProfileClient = () => {
  const routeParams = useParams();
  const username = Array.isArray(routeParams?.username) ? routeParams.username[0] : routeParams?.username;
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ reviews: 0, collections: 0, watchlist: null, interested: null });
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadProfile = useCallback(async (signal) => {
    if (!username) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/profile/${encodeURIComponent(username)}`, { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load profile");
      setProfile(data.profile);
      setStats(data.stats || {});
      setIsOwner(Boolean(data.isOwner));
    } catch (loadError) {
      if (loadError.name !== "AbortError") setError(loadError.message || "Unable to load profile");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const controller = new AbortController();
    loadProfile(controller.signal);
    return () => controller.abort();
  }, [loadProfile]);

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn’t copy the profile link. Copy it from your browser address bar.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews", count: stats.reviews },
    { id: "collections", label: "Collections", count: stats.collections },
    ...(isOwner ? [
      { id: "watchlist", label: "Watchlist", count: stats.watchlist },
      { id: "interested", label: "Interested", count: stats.interested },
    ] : []),
  ];

  if (loading) {
    return <main className="min-h-[75vh] bg-[#050407] px-4 py-10 text-white sm:px-8"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-52 rounded-3xl bg-white/[0.05]" /><div className="mt-6 h-24 rounded-2xl bg-white/[0.04]" /><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-20 rounded-2xl bg-white/[0.04]" />)}</div></div></main>;
  }

  if (!profile || error) {
    return <main className="flex min-h-[65vh] items-center justify-center bg-[#050407] px-4 text-center text-white"><div className="max-w-md"><div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-purple-200"><Clapperboard /></div><h1 className="mt-5 text-2xl font-semibold">{error || "Profile unavailable"}</h1><p className="mt-2 text-sm text-white/50">Check the username or try again in a moment.</p><Link href="/" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/5">Back to NAC</Link></div></main>;
  }

  const avatar = profile.profilepic || "";
  const cover = profile.coverpic || "";

  return (
    <main className="min-h-screen bg-[#050407] px-3 pb-16 pt-6 text-white sm:px-8 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b090e] shadow-[0_24px_90px_rgba(0,0,0,0.42)]">
          <div
            className="relative h-40 bg-[radial-gradient(ellipse_at_20%_0%,rgba(124,58,237,.55),transparent_52%),linear-gradient(115deg,#17111d,#09080c_62%,#121020)] sm:h-56"
            style={cover ? { backgroundImage: `linear-gradient(0deg,rgba(5,4,7,.8),rgba(5,4,7,.08)),url("${cover.replaceAll('"', '')}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}
          >
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b090e] to-transparent" />
            <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
              {isOwner && <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 text-xs font-medium backdrop-blur transition hover:bg-black/70 sm:text-sm"><Pencil size={14} />Edit profile</button>}
              <button type="button" onClick={copyProfile} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur transition hover:bg-black/70 sm:text-sm"><Share2 size={14} />{copied ? "Copied" : "Share"}</button>
            </div>
          </div>

          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-5">
              <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] border-4 border-[#0b090e] bg-gradient-to-br from-purple-500/70 to-blue-500/50 text-2xl font-bold text-white shadow-lg sm:size-32 sm:text-3xl">
                {avatar ? <img src={avatar} alt={`${profile.name} avatar`} className="size-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : initials(profile.name)}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200/75">NAC member</p>
                <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight sm:text-3xl">{profile.name}</h1>
                <p className="mt-1 text-sm text-white/45">@{profile.username}</p>
              </div>
              {isOwner && <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="self-start rounded-xl border border-white/10 px-3.5 py-2 text-sm text-white/55 transition hover:border-red-300/20 hover:bg-red-400/[0.06] hover:text-red-200 sm:self-end">Sign out</button>}
            </div>

            {profile.bio && <p className="mt-5 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">{profile.bio}</p>}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <Stat label="Reviews" value={stats.reviews ?? 0} />
              <Stat label="Collections" value={stats.collections ?? 0} />
              {isOwner && <Stat label="Watchlist" value={stats.watchlist ?? 0} />}
              {isOwner && <Stat label="Interested" value={stats.interested ?? 0} />}
            </div>
          </div>
        </section>

        <nav aria-label="Profile sections" className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-white/10">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActive(tab.id)} aria-current={active === tab.id ? "page" : undefined} className={`mb-[-1px] shrink-0 border-b-2 px-4 py-3 text-sm transition ${active === tab.id ? "border-purple-400 text-white" : "border-transparent text-white/50 hover:text-white/80"}`}>
              {tab.label}{tab.count !== null && tab.count !== undefined && <span className="ml-1.5 text-white/35">{tab.count}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {active === "overview" && <Overview profile={profile} isOwner={isOwner} onEdit={() => setEditing(true)} />}
          {active === "reviews" && <ShowRevonProflie username={profile.username} isOwner={isOwner} />}
          {active === "collections" && <ProfileCollections username={profile.username} />}
          {active === "watchlist" && isOwner && <Userwatchlist />}
          {active === "interested" && isOwner && <MyInterested />}
        </div>
      </div>

      {editing && isOwner && <ProfileEditor profile={profile} username={profile.username} onClose={() => setEditing(false)} onSaved={(updatedProfile) => { setProfile(updatedProfile); setEditing(false); }} />}
    </main>
  );
};

export default ProfileClient;
