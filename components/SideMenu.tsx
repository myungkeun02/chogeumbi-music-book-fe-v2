import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SideMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  setIsSignupModalOpen: (isOpen: boolean) => void;
  setIsAddMusicModalOpen: (isOpen: boolean) => void;
  setIsAddArtistModalOpen: (isOpen: boolean) => void;
  setIsAddCategoryModalOpen: (isOpen: boolean) => void;
}

export default function SideMenu({
  isMenuOpen,
  setIsMenuOpen,
  isDarkMode,
  setIsDarkMode,
  setIsLoginModalOpen,
  setIsSignupModalOpen,
  setIsAddMusicModalOpen,
  setIsAddArtistModalOpen,
  setIsAddCategoryModalOpen,
}: SideMenuProps) {
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const handleCategorySearch = (e: ChangeEvent<HTMLInputElement>) => {
    setCategorySearchTerm(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories([...selectedCategories, category]);
    setCategorySearchTerm("");
  };

  const handleCategoryRemove = (index: number) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories.splice(index, 1);
    setSelectedCategories(updatedCategories);
  };

  const handleArtistSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setArtistSearchTerm(e.target.value);
  };

  const handleArtistSelect = (artist: string) => {
    setSelectedArtists([...selectedArtists, artist]);
    setArtistSearchTerm("");
  };

  const handleArtistRemove = (index: number) => {
    const updatedArtists = [...selectedArtists];
    updatedArtists.splice(index, 1);
    setSelectedArtists(updatedArtists);
  };

  const filteredCategories = categorySearchTerm
    ? ["랩", "댄스", "J-팝", "발라드", "인디", "힙합", "팝", "K-팝"].filter((category) =>
        category.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
    : [];

  const filteredArtists = artistSearchTerm
    ? ["아이유", "빅뱅", "방탄소년단", "뉴진스", "에스파", "검정치마", "김광석", "김필"].filter((artist) =>
        artist.toLowerCase().includes(artistSearchTerm.toLowerCase())
      )
    : [];

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent>
        <div className="flex flex-col items-start gap-6 p-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
              Login
            </Button>
            <Button variant="outline" onClick={() => setIsSignupModalOpen(true)}>
              Signup
            </Button>
          </div>
          {/* Category search */}
          <div className="w-full">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="Search category"
              value={categorySearchTerm}
              onChange={handleCategorySearch}
              className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {/* Category search results */}
            {/* Selected categories */}
          </div>
          {/* Artist search */}
          <div className="w-full">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              type="text"
              placeholder="Search artist"
              value={artistSearchTerm}
              onChange={handleArtistSearch}
              className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {/* Artist search results */}
            {/* Selected artists */}
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={(checked) => setIsDarkMode(checked)}
            />
          </div>
          <Button onClick={() => setIsAddMusicModalOpen(true)}>음악 추가</Button>
          <Button onClick={() => setIsAddArtistModalOpen(true)}>아티스트 추가</Button>
          <Button onClick={() => setIsAddCategoryModalOpen(true)}>카테고리 추가</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}