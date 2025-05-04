"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [toggleOn, setToggleOn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = async () => {
    const newValue = !toggleOn;
    setToggleOn(newValue);

    if (newValue) {
      try {
        const response = await fetch("http://127.0.0.1:5000/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toggle: true }),
        });

        const data = await response.json();
        console.log("Flask response:", data);
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  return (
    <nav
      className={`fixed w-full z-20 transition-colors duration-300 ${
        isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <svg
            viewBox="0 0 111 30"
            className="h-6 md:h-8 fill-red-600"
            aria-hidden="true"
            focusable="false"
          >
            <g>
              <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
            </g>
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            Home
          </Link>
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            TV Shows
          </Link>
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            Movies
          </Link>
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            New & Popular
          </Link>
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            My List
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showMobileMenu
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/?query=")}
            className="text-white hover:text-white/80"
          >
            <Search className="h-5 w-5" />
          </button>
          {/* Toggle with cursor icon */}
          <div
  onClick={handleToggle}
  className={`w-14 h-7 flex items-center bg-white rounded-full px-1 cursor-pointer transition-colors duration-300 ${
    toggleOn ? "bg-green-500" : "bg-gray-400"
  }`}
>
  <div
    className={`w-5 h-5 bg-black rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ease-in-out ${
      toggleOn ? "translate-x-7" : "translate-x-0"
    }`}
  >
    🖐️
  </div>
</div>

          <button className="text-white hover:text-white/80">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-white hover:text-white/80">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-black/95 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-white py-2">
              Home
            </Link>
            <Link href="/" className="text-white py-2">
              TV Shows
            </Link>
            <Link href="/" className="text-white py-2">
              Movies
            </Link>
            <Link href="/" className="text-white py-2">
              New & Popular
            </Link>
            <Link href="/" className="text-white py-2">
              My List
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
