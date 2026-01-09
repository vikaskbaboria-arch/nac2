"use client"
import { useState } from "react"
import Reviewdata from "./Reviewdata"
import ReviewForm from "./ReviewForm"

export default function ReviewsSection({ movieId }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReviewSuccess = () => {
    // trigger re-fetch
    setRefreshKey(prev => prev + 1)
  }

  return (
    <>
      <ReviewForm movieId={movieId} onSuccess={handleReviewSuccess} />
      <Reviewdata movieId={movieId} refreshKey={refreshKey} />
    </>
  )
}
