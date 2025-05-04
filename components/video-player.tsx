"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X, Pause, Play, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import type { Movie } from "@/lib/omdb"
import { useState } from "react"

interface VideoPlayerProps {
  movie: Movie
  onClose: () => void
}

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Start playing the video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
        setIsPlaying(false)
      })
    }

    // Prevent body scrolling when video is playing
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }

    video.addEventListener("timeupdate", updateProgress)
    return () => {
      video.removeEventListener("timeupdate", updateProgress)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {/* Demo notification */}
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm">
          Demo Mode: Playing sample video
        </div>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Using a sample video from a public CDN
          poster={movie.Poster !== "N/A" ? movie.Poster : undefined}
          controls={false}
          autoPlay
          onError={(e) => {
            console.error("Video error:", e)
            setIsPlaying(false)
          }}
        >
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-2">Video Playback Error</h3>
              <p className="mb-4">The video could not be loaded. This is a demo application.</p>
              <button onClick={togglePlay} className="netflix-button">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Video title overlay */}
        <div className="absolute top-4 left-4 text-white text-shadow">
          <h2 className="text-xl font-bold">{movie.Title}</h2>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        {/* Progress bar */}
        <div className="h-1 bg-gray-700 mb-4 cursor-pointer" onClick={handleProgressClick}>
          <div className="h-full bg-red-600" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          <div>
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
