"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?query=${encodeURIComponent(query.trim())}`)
    } else {
      router.push("/")
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto my-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm bg-gray-800 border border-gray-700 rounded-md focus:ring-red-600 focus:border-red-600 text-white placeholder-gray-400"
          placeholder="Search for movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 bottom-2 top-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
        >
          Search
        </button>
      </div>
    </form>
  )
}
