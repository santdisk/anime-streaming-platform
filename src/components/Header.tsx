import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-[#23252B]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
            AnimeStream
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
            <Link href="/browse" className="hover:text-primary transition-colors">Browse</Link>
            <Link href="/manga" className="hover:text-primary transition-colors">Manga</Link>
            <Link href="/games" className="hover:text-primary transition-colors">Games</Link>
            <Link href="/news" className="hover:text-primary transition-colors">News</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative items-center">
            <input 
              type="text" 
              placeholder="Search anime..." 
              className="bg-[#23252B] border border-gray-700 rounded-full py-1.5 px-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors w-48 text-white placeholder-gray-400"
            />
            <Search className="absolute right-3 w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-[#23252B] rounded-full transition-colors">
            <User className="w-5 h-5 text-gray-300" />
          </button>
          <button className="md:hidden p-2 hover:bg-[#23252B] rounded-full transition-colors">
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
