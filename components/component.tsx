"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface MusicData {
  id: string;
  albumCover: string;
  musicName: string;
  author: { authorName: string };
  category: { categoryName: string };
}

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isSearchMusicModalOpen, setIsSearchMusicModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [musicData, setMusicData] = useState<MusicData[]>([]);
  const [musicName, setMusicName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistSubName, setNewArtistSubName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("");

  // 전체 음악 조회 API
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await fetch("https://www.chogeumbi.kr/api/v1/music/all");
        const result = await response.json();
        console.log("Fetched music data:", result); // 추가된 로그
        if (result.data && result.data.musicList) {
          setMusicData(result.data.musicList);
        } else {
          console.error("Unexpected response structure:", result);
        }
      } catch (error) {
        console.error("Failed to fetch music data:", error);
      }
    };
    fetchMusicData();
  }, []);

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

  const handleAddMusic = (e: FormEvent) => {
    e.preventDefault();
    // 음악 추가 로직 구현
  };

  const handleSeachAlbumArt = (e: FormEvent) => {
    e.preventDefault();
    // 앨범 아트 검색 로직 구현
  }

  const handleAddArtist = (e: FormEvent) => {
    e.preventDefault();
    // 아티스트 추가 로직 구현
  };

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    // 카테고리 추가 로직 구현
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
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-primary text-primary-foreground px-8 py-3 shadow-md">
        <div className="text-lg font-bold">초금비 MUSIC-BOOK</div>
        <div className="relative flex-1 max-w-md mx-8">
          <Input
            type="search"
            placeholder="Search music..."
            className="w-full rounded-full bg-primary-foreground/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/50" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </header>
      <div className="container mx-auto px-12 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {musicData.map((music) => (
          <div key={music.id} className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
            <div className="relative aspect-square">
              <img
                src={music.albumCover}
                alt={music.musicName}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-3">
              <div className="text-lg font-bold">{music.musicName}</div>
              <div className="text-sm text-muted-foreground">
                {music.author.authorName} | {music.category.categoryName}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} side="right" className="bg-background text-foreground">
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
            <div className="flex items-center gap-2">
              <Label htmlFor="category">Category</Label>
            </div>
            <div className="w-full">
              <Input
                id="category"
                type="text"
                placeholder="Search category"
                value={categorySearchTerm}
                onChange={handleCategorySearch}
                className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {categorySearchTerm && (
                <div className="mt-2 space-y-2">
                  {filteredCategories.map((category) => (
                    <div
                      key={category}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <span>{category}</span>
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedCategories.length > 0 && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleCategoryRemove(index)}
                    >
                      <span>{category}</span>
                      <XIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="artist">Artist</Label>
            </div>
            <div className="w-full">
              <Input
                id="artist"
                type="text"
                placeholder="Search artist"
                value={artistSearchTerm}
                onChange={handleArtistSearch}
                className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {artistSearchTerm && (
                <div className="mt-2 space-y-2">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      <span>{artist}</span>
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedArtists.length > 0 && (
              <div className="w-full">
                <div className="flex flex-wrap gap-2">
                  {selectedArtists.map((artist, index) => (
                    <div
                      key={index}
                      className="bg-muted rounded-full px-4 py-2 flex items-center justify-between cursor-pointer"
                      onClick={() => handleArtistRemove(index)}
                    >
                      <span>{artist}</span>
                      <XIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      
      {/* 로그인 모달 */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" className="w-full" />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" className="w-full" />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsLoginModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 회원가입 모달 */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signup</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" className="w-full" />
          </div>
          <div>
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" className="w-full" />
          </div>
          <div>
            <Label htmlFor="signup-confirm-password">Confirm Password</Label>
            <Input id="signup-confirm-password" type="password" className="w-full" />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsSignupModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 음악 추가 모달 */}
      <Dialog open={isAddMusicModalOpen} onOpenChange={setIsAddMusicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>음악 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMusic}>
            <div>
              <Label htmlFor="music-name">음악 이름</Label>
              <Input
                id="music-name"
                type="text"
                value={musicName}
                onChange={(e) => setMusicName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="music-artist">아티스트</Label>
              <Input
                id="music-artist"
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="music-category">카테고리</Label>
              <Input
                id="music-category"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="search-album-art">앨범아트검색</Label>
              <Button 
                onClick={() => setIsSearchMusicModalOpen(true)}
                className="w-full"
              >앨범 아트 검색</Button>
              </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">추가</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 음악검색모달 */}
      <Dialog open={isSearchMusicModalOpen} onOpenChange={setIsSearchMusicModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Album Art</DialogTitle>
            <Button variant="ghost" onClick={() => setIsSearchMusicModalOpen(false)} aria-label="Close">
              <XIcon className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <Input type="text" placeholder="Search album art..." />
            {/* 앨범 아트 검색 구현 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative aspect-square bg-background rounded-lg overflow-hidden cursor-pointer">
                <img
                  src="https://via.placeholder.com/300"
                  alt="Album Art"
                  className="object-cover w-full h-full"
                />
              </div>
              {/* 여기에 다른 검색 결과 이미지 추가 */}
            </div>
            <div className="flex justify-end gap-4">
              <Button>Search</Button>
              <Button variant="ghost" onClick={() => setIsSearchMusicModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 아티스트 추가 모달 */}
      <Dialog open={isAddArtistModalOpen} onOpenChange={setIsAddArtistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>아티스트 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddArtist}>
            <div>
              <Label htmlFor="artist-name">아티스트 이름</Label>
              <Input
                id="artist-name"
                type="text"
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="artist-subname">아티스트 별명</Label>
              <Input
                id="artist-subname"
                type="text"
                value={newArtistSubName}
                onChange={(e) => setNewArtistSubName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">추가</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 카테고리 추가 모달 */}
      <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory}>
            <div>
              <Label htmlFor="category-name">카테고리 이름</Label>
              <Input
                id="category-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="category-color">카테고리 색상</Label>
              <Input
                id="category-color"
                type="text"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">추가</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
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

