import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeaderProps {
  setIsMenuOpen: (isOpen: boolean) => void;
  onSearch: (searchTerm: string) => void;
  onLocalSearch: (searchTerm: string) => void;
}

export default function Header({ setIsMenuOpen, onSearch, onLocalSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onLocalSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onLocalSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-primary text-primary-foreground px-8 py-3 shadow-md">
      <div className="text-lg font-bold">초금비 MUSIC-BOOK</div>
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-8">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search music..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 focus:bg-primary-foreground/20"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50" />
        </div>
      </form>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsMenuOpen(true)} 
        className="rounded-full hover:bg-primary-foreground/10"
      >
        <MenuIcon className="w-6 h-6" />
      </Button>
    </header>
  );
}


function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}