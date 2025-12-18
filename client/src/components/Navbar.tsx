import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-md border-b border-archivist-teal/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-archivist-teal/30">
                <img
                  src="/archivist-icon.png"
                  alt="The Archivist Method"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-semibold text-lg hidden sm:inline">
                The Archivist Method™
              </span>
            </a>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/#products">
              <a className="text-gray-300 hover:text-archivist-teal transition-colors font-medium">
                Pricing
              </a>
            </Link>
            <Link href="/#method">
              <a className="text-gray-300 hover:text-archivist-teal transition-colors font-medium">
                Method
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
