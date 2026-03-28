'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setMobileSearchOpen(false);
    }
  }

  useEffect(() => {
    if (mobileSearchOpen) inputRef.current?.focus();
  }, [mobileSearchOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-[#23252B]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
            AnimeStream
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/search?q=action" className="hover:text-primary transition-colors">Action</Link>
            <Link href="/search?q=romance" className="hover:text-primary transition-colors">Romance</Link>
            <Link href="/search?q=isekai" className="hover:text-primary transition-colors">Isekai</Link>
          </nav>
        </div>

        {/* Right: Search + Mobile */}
        <div className="flex items-center gap-3">
          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden sm:flex relative items-center">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="bg-[#23252B] border border-gray-700 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors w-56 text-white placeholder-gray-400"
            />
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile search toggle */}
          <button
            className="sm:hidden p-2 hover:bg-[#23252B] rounded-full transition-colors text-gray-300"
            onClick={() => setMobileSearchOpen(v => !v)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 hover:bg-[#23252B] rounded-full transition-colors text-gray-300"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-[#23252B] pt-3 bg-[#141414]">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any anime..."
              className="w-full bg-[#23252B] border border-gray-700 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors text-white placeholder-gray-400"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#23252B] bg-[#141414] px-4 py-4 flex flex-col gap-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-primary font-semibold transition-colors py-1">Home</Link>
          <Link href="/search?q=action" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-primary font-semibold transition-colors py-1">Action</Link>
          <Link href="/search?q=romance" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-primary font-semibold transition-colors py-1">Romance</Link>
          <Link href="/search?q=isekai" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-primary font-semibold transition-colors py-1">Isekai</Link>
        </div>
      )}
    </header>
  );
}
