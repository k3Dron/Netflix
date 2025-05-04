"use client"

import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import { X, Pause, Play, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import type { Movie } from "@/lib/omdb"

interface VideoPlayerProps {
  movie: Movie
  onClose: () => void
}

const socket = io("http://localhost:5000") // Update with your socket server URL

const EMOJI_MAP: { [key: string]: string } = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  neutral: "😐",
}

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null)

  // Play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
        setIsPlaying(false)
      })
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Progress updater
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

  // Socket listeners
  useEffect(() => {
    socket.on("emotion-detected", (emotion: string) => {
      console.log("Emotion received:", emotion)
      setDetectedEmotion(emotion)
      setTimeout(() => setDetectedEmotion(null), 2000) // Hide emoji after 2s
    })

    return () => {
      socket.off("emotion-detected")
    }
  }, [])

  const sendEmotion = (emotion: string) => {
    socket.emit("send-emotion", emotion)
  }

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
    <div ref={containerRef} className="fixed inset-0 top-0 bg-black z-[90] flex flex-col">
      {/* Video */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm">
          Demo Mode: Playing sample video
        </div>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster={movie.Poster !== "N/A" ? movie.Poster : undefined}
          controls={false}
          autoPlay
          onError={(e) => {
            console.error("Video error:", e)
            setIsPlaying(false)
          }}
          onClick={togglePlay}
        >
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-2">Video Paused</h3>
              <p className="mb-4">The video is paused. This is a demo application.</p>
              <button onClick={togglePlay} className="netflix-button">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Emotion overlay */}
        {detectedEmotion && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl">
            {EMOJI_MAP[detectedEmotion] || "🤔"}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute top-4 left-4 text-white text-shadow">
          <h2 className="text-xl font-bold">{movie.Title}</h2>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[9999] bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 fixed bottom-0 left-0 right-0 flex flex-col space-y-2">
        {/* Progress */}
        <div className="h-1 bg-gray-700 cursor-pointer" onClick={handleProgressClick}>
          <div className="h-full bg-red-600" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
            {/* Send emotion buttons for testing */}
            {["happy", "sad", "angry"].map((e) => (
              <button
                key={e}
                onClick={() => sendEmotion(e)}
                className="text-white hover:text-gray-300 text-sm border px-2 py-1 rounded"
              >
                Send {e}
              </button>
            ))}
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
