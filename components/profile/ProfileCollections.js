"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LockKeyhole, Pencil, Plus, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";

const ProfileCollections = ({ username }) => {
  const { data: session } = useSession();
  const isOwner = !username || username === session?.user?.name;
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = username
        ? `/api/user-collections?username=${encodeURIComponent(username)}`
        : "/api/user-collections";
      const response = await fetch(endpoint);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load collections");
      setCollections(data.collections || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const saveCollection = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/user-collections", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId: editingId || undefined,
          name,
          isPrivate,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save collection");
      setName("");
      setIsPrivate(true);
      setEditingId("");
      await loadCollections();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (collection) => {
    setEditingId(collection._id);
    setName(collection.name);
    setIsPrivate(collection.isPrivate);
    setError("");
  };

  const deleteCollection = async (collection) => {
    if (!window.confirm(`Delete "${collection.name}" and all its movies?`)) return;
    setError("");
    try {
      const response = await fetch(
        `/api/user-collections?collectionId=${encodeURIComponent(collection._id)}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete collection");
      setCollections((current) => current.filter((item) => item._id !== collection._id));
      if (editingId === collection._id) {
        setEditingId("");
        setName("");
      }
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const removeMovie = async (item) => {
    setError("");
    try {
      const response = await fetch("/api/user-collections/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item._id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove movie");
      setCollections((current) =>
        current.map((collection) => ({
          ...collection,
          items: collection.items.filter((entry) => entry._id !== item._id),
        }))
      );
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{isOwner ? "My Collections" : "Public Collections"}</h2>
        <p className="mt-1 text-sm text-white/50">
          {isOwner
            ? "Create collections, choose who can see them, and manage their movies."
            : "Collections shared publicly by this user."}
        </p>
      </div>

      {isOwner && <form
        onSubmit={saveCollection}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            required
            placeholder="Collection name"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-purple-400"
          />
          <select
            value={isPrivate ? "private" : "public"}
            onChange={(event) => setIsPrivate(event.target.value === "private")}
            aria-label="Collection visibility"
            className="rounded-xl border border-white/10 bg-[#120d18] px-3 py-2.5 text-sm text-white"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold hover:bg-purple-500 disabled:opacity-60"
          >
            {editingId ? <Pencil size={15} /> : <Plus size={16} />}
            {saving ? "Saving…" : editingId ? "Save changes" : "Create collection"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId("");
                setName("");
                setIsPrivate(true);
              }}
              aria-label="Cancel editing"
              className="rounded-xl border border-white/10 px-3 py-2.5 text-white/60 hover:bg-white/5"
            >
              <X size={17} />
            </button>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      </form>}

      {loading ? (
        <p className="text-sm text-white/50">Loading collections…</p>
      ) : collections.length === 0 ? (
        <p className="rounded-2xl border border-white/10 p-6 text-center text-sm text-white/50">
          You haven’t created any collections yet.
        </p>
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => (
            <article
              key={collection._id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{collection.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                    {isOwner && collection.isPrivate ? <LockKeyhole size={13} /> : null}
                    {isOwner ? `${collection.isPrivate ? "Private" : "Public"} · ` : ""}
                    {collection.items.length}{" "}
                    {collection.items.length === 1 ? "movie" : "movies"}
                  </p>
                </div>
                {isOwner && <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(collection)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/75 hover:bg-white/5"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCollection(collection)}
                    aria-label={`Delete ${collection.name}`}
                    className="rounded-lg border border-red-400/20 p-2 text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>}
              </div>
              {collection.items.length > 0 ? (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {collection.items.map((item) => (
                    <div
                      key={item._id}
                      className="group relative w-24 shrink-0 sm:w-28"
                    >
                      <Link href={`/movie/${item.movieId}?type=${item.mediaType}`}>
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                              : "/placeholder.png"
                          }
                          alt={item.title}
                          className="aspect-[2/3] w-full rounded-lg object-cover"
                        />
                        <p className="mt-1 truncate text-xs text-white/75">{item.title}</p>
                      </Link>
                      {isOwner && <button
                        type="button"
                        onClick={() => removeMovie(item)}
                        aria-label={`Remove ${item.title}`}
                        className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <X size={13} />
                      </button>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/40">No movies in this collection yet.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProfileCollections;
