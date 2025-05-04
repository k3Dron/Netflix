import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Social Media Icons */}
        <div className="flex space-x-6 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            <Youtube className="h-6 w-6" />
          </Link>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="space-y-3">
            <Link href="/" className="block text-sm hover:underline">
              Audio Description
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Investor Relations
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Legal Notices
            </Link>
          </div>
          <div className="space-y-3">
            <Link href="/" className="block text-sm hover:underline">
              Help Center
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Jobs
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Cookie Preferences
            </Link>
          </div>
          <div className="space-y-3">
            <Link href="/" className="block text-sm hover:underline">
              Gift Cards
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Terms of Use
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Corporate Information
            </Link>
          </div>
          <div className="space-y-3">
            <Link href="/" className="block text-sm hover:underline">
              Media Center
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Privacy
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Service Code Button */}
        <button className="border border-gray-600 text-sm px-3 py-1 mb-6 hover:text-white">Service Code</button>

        {/* Copyright */}
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Netflix Clone. This is a demo project and not affiliated with Netflix.
        </p>
      </div>
    </footer>
  )
}
