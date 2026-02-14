import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 px-5 md:px-10 py-5 flex items-center justify-between ${
        isScrolled
          ? "bg-[rgba(10,10,10,0.9)] backdrop-blur-[10px] border-b border-white/10"
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <Link href="/" className="flex items-center gap-3 no-underline group">
        <img
          src="/archivist-icon.png"
          alt="The Archivist Method"
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
        <span className="font-['Bebas_Neue',Oswald,sans-serif] text-base md:text-xl font-bold tracking-wide text-white uppercase">
          THE ARCHIVIST METHOD™
        </span>
      </Link>

      <nav className="flex items-center gap-4 md:gap-6">
        <Link 
          href="/quiz"
          className="hidden md:inline-block text-slate-300 hover:text-teal-400 no-underline text-sm font-medium transition-colors"
          data-testid="link-quiz-nav"
        >
          Take the Quiz
        </Link>
        <Link 
          href="/portal"
          className="text-teal-500 no-underline text-sm font-semibold px-4 py-2 border border-teal-500 rounded-md transition-all duration-200 hover:bg-teal-500 hover:text-white"
          data-testid="button-portal-login"
        >
          Portal Login
        </Link>
      </nav>
    </header>
  );
}
