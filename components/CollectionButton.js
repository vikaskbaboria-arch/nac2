"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { useSession } from "next-auth/react";

const CollectionButton = ({ movie }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open || !session) return;
    let active = true;
    setLoading(true);
    fetch("/api/user-collections")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load collections");
        if (active) {
          setCollections(data.collections || []);
          setSelectedId(data.collections?.[0]?._id || "");
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, session]);

  const addToCollection = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    const creatingCollection = createNew || collections.length === 0;
    const movieDetails = {
      movieId: movie.id,
      mediaType: movie.mediaType,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      genres: movie.genres,
      overview: movie.overview,
    };

    try {
      const response = await fetch("/api/user-collections/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          creatingCollection
            ? { collectionName: name, isPrivate, movie: movieDetails }
            : { collectionId: selectedId, movie: movieDetails }
        ),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add this title");
      setSuccess(`Added to ${data.collection.name}`);
      if (creatingCollection) {
        setCollections((current) => [data.collection, ...current]);
        setSelectedId(data.collection._id);
        setName("");
        setCreateNew(false);
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
          setSuccess("");
        }}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <Bookmark size={17} /> Collections
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-dialog-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120d18] p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="collection-dialog-title" className="text-lg font-semibold">
                Add to a collection
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1 truncate text-sm text-white/55">{movie.title}</p>

            {!session ? (
              <p className="mt-5 text-sm text-white/70">
                <Link href="/login" className="text-purple-300 hover:underline">
                  Sign in
                </Link>{" "}
                to create and manage your collections.
              </p>
            ) : loading ? (
              <p className="mt-5 text-sm text-white/60">Loading your collections…</p>
            ) : (
              <form onSubmit={addToCollection} className="mt-5 space-y-4">
                {collections.length > 0 && (
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-white/65">Your collections</span>
                    <select
                      value={createNew ? "__new__" : selectedId}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCreateNew(value === "__new__");
                        if (value !== "__new__") setSelectedId(value);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white"
                    >
                      {collections.map((collection) => (
                        <option key={collection._id} value={collection._id}>
                          {collection.name}
                        </option>
                      ))}
                      <option value="__new__">Create a new collection…</option>
                    </select>
                  </label>
                )}

                {(createNew || collections.length === 0) && (
                  <>
                    <label className="block text-sm">
                      <span className="mb-1.5 block text-white/65">Collection name</span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={60}
                        required
                        placeholder="e.g. Sci-fi favorites"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none focus:border-purple-400"
                      />
                    </label>
                    <fieldset className="flex gap-4 text-sm text-white/75">
                      <legend className="mb-2 text-white/65">Visibility</legend>
                      {[
                        { value: true, label: "Private" },
                        { value: false, label: "Public" },
                      ].map((option) => (
                        <label key={option.label} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isPrivate === option.value}
                            onChange={() => setIsPrivate(option.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}

                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                {success && <p role="status" className="text-sm text-emerald-300">{success}</p>}
                <button
                  type="submit"
                  disabled={saving || (!createNew && collections.length > 0 && !selectedId)}
                  className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Adding…" : "Add movie"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionButton;
