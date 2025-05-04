"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Movie } from "@/lib/omdb"
import MovieCard from "./movie-card"

export default function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  // If no movies are provided or the array is empty, don't render anything
  if (!movies || movies.length === 0) {
    return null
  }

  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)

  useEffect(() => {
    const observer: IntersectionObserver | null = null
    const checkScroll = () => {
      if (rowRef.current) {
        setShowLeftArrow(rowRef.current.scrollLeft > 0)
      }
    }

    if (rowRef.current) {
      rowRef.current.addEventListener("scroll", checkScroll)
      checkScroll() // Initial check in case the content is already scrolled

      return () => {
        rowRef.current?.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true)

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-1 py-6">
      <h2 className="text-xl md:text-2xl font-bold pl-2">{title}</h2>
      <div className="relative group">
        {showLeftArrow && (
          <div className="absolute top-0 bottom-0 left-0 z-40 flex items-center justify-center bg-black/30 hover:bg-black/50 cursor-pointer w-10 md:w-16 transition duration-200 opacity-0 group-hover:opacity-100">
            <ChevronLeft className="h-6 w-6 text-white" onClick={() => handleClick("left")} />
          </div>
        )}

        <div ref={rowRef} className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide py-4 pl-2">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>

        <div className="absolute top-0 bottom-0 right-0 z-40 flex items-center justify-center bg-black/30 hover:bg-black/50 cursor-pointer w-10 md:w-16 transition duration-200 opacity-0 group-hover:opacity-100">
          <ChevronRight className="h-6 w-6 text-white" onClick={() => handleClick("right")} />
        </div>
      </div>
    </div>
  )
}
