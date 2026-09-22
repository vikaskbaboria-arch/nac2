"use client";

import {  useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { Bookmark, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";


/**
 * Review shape:
 * {
 *   id, movieTitle, movieHref, reviewHref,
 *   quote, author, avatarUrl?, rating, likes,
 *   featured?   // highlights the card in amber (use on one review)
 * }
 */


const SAMPLE_REVIEWS = [
  {
    id: "1",
    movieTitle: "After the Orchard",
    movieHref: "/movie/after-the-orchard",
    reviewHref: "/reviews/1",
    quote:
      "A patient, sun-dappled meditation on the stories families prune away.",
    author: "Mara Ellison",
    rating: 4.5,
    likes: 128,
  },
  {
    id: "2",
    movieTitle: "Midnight Frequency",
    movieHref: "/movie/midnight-frequency",
    reviewHref: "/reviews/2",
    quote:
      "Every hiss of static feels like a door opening somewhere it shouldn't.",
    author: "Theo Grant",
    rating: 4,
    likes: 98,
    featured: true,
  },
  {
    id: "3",
    movieTitle: "The Quiet Atlas",
    movieHref: "/movie/the-quiet-atlas",
    reviewHref: "/reviews/3",
    quote:
      "Grand adventure rendered with the intimacy of a handwritten letter.",
    author: "Imani Cole",
    rating: 4.5,
    likes: 133,
  },
];

const compact = new Intl.NumberFormat("en", { notation: "compact" });

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name, src }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-xs font-medium text-secondary-foreground ring-1 ring-border">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function ReviewCard({ review, onSaveChange }) {
  const [saved, setSaved] = useState(false);
  const { featured } = review;
 
  function toggleSave() {
    const next = !saved;
    setSaved(next);
    onSaveChange?.(review.id, next);
  }

  return (
    <article
      className={cn(
        "flex flex-col justify-between gap-8 rounded-xl border p-6",
        featured
          ? "border-primary/40 bg-white/50 shadow-[0_16px_40px_-20px_rgba(232,169,74,0.35)]"
          : "border-border bg-card"
      )}
    >
      <div className="space-y-5">
        <div className="flex items-start  justify-between gap-3">
     <p className="text-black">yarr chale bahar</p>

          <button
            type="button"
            onClick={toggleSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved reviews" : "Save review"}
            className={cn(
              "-mr-2 -mt-2 grid size-8 place-items-center rounded-md transition-colors hover:bg-accent",
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark className={cn("size-4", saved && "fill-current")} aria-hidden="true" />
          </button>
        </div>

    <p className="text-sm text-black line-clamp-3">
            {review.review }
    </p>
      </div>

      <footer className="flex items-center gap-3">
        <Avatar name={review.author} src={review.avatarUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-black">{review.user.username}</p>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
              {Number(review.rating).toFixed(1)}
              <span className="sr-only">rating</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3" aria-hidden="true" />
              {compact.format(review.likes)}
              <span className="sr-only">likes</span>
            </span>
          </p>
        </div>
      </footer>
    </article>
  );
}

/**
 * <ReviewsSection />                       // renders with sample data
 * <ReviewsSection reviews={reviewsFromDb} href="/reviews" />
 */
export function ShowRevonProflie({
  
  title = "Reviews worth reading",
  description = "From the front row",
  href = "/reviews",
  linkLabel = "Browse all reviews",
  onSaveChange,
  className,
}) {

 const [reviews, setReviews] = useState([]);
     useEffect(() => {
    const writtenReview = async ()=>{
        const res = await fetch(`/api/review/user/`)
        const data = await res.json()
        console.log(data.reviews) 
        setReviews(data.reviews)
    }
    writtenReview()
   
  },[])

  return (
    <section className={cn("bg-black   py-8  mt-6 sm:py-16", className)}>
      <div className="container-page">
      
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} onSaveChange={onSaveChange} />
          ))}
        </div>
      </div>
    </section>
  );
}