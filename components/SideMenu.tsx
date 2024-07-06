import React, { useState, ChangeEvent, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '../hooks/useAuth';
import UserInfoModal from './UserInfoModal';
import axios from 'axios';

interface Category {
  id: number;
  categoryName: string;
  categoryColor: string;
}

interface Author {
  id: number;
  authorName: string;
  subName: string;
}

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

export interface SideMenuRef {
  refreshData: () => void;
}

const SideMenu = forwardRef<SideMenuRef, SideMenuProps>(({
  isMenuOpen,
  setIsMenuOpen,
  isDarkMode,
  setIsDarkMode,
  setIsLoginModalOpen,
  setIsSignupModalOpen,
  setIsAddMusicModalOpen,
  setIsAddArtistModalOpen,
  setIsAddCategoryModalOpen,
}, ref) => {
  const { user, logout, fetchUser } = useAuth();
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Author[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [artistPage, setArtistPage] = useState(1);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [artistHasMore, setArtistHasMore] = useState(true);

  const categoryObserver = useRef<IntersectionObserver | null>(null);
  const artistObserver = useRef<IntersectionObserver | null>(null);

  const lastCategoryElementRef = useCallback((node: HTMLLIElement | null) => {
    if (categoryObserver.current) categoryObserver.current.disconnect();
    categoryObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && categoryHasMore) {
        setCategoryPage(prevPage => prevPage + 1);
      }
    });
    if (node) categoryObserver.current.observe(node);
  }, [categoryHasMore]);

  const lastArtistElementRef = useCallback((node: HTMLLIElement | null) => {
    if (artistObserver.current) artistObserver.current.disconnect();
    artistObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && artistHasMore) {
        setArtistPage(prevPage => prevPage + 1);
      }
    });
    if (node) artistObserver.current.observe(node);
  }, [artistHasMore]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`https://chogeumbi.kr/api/v1/category/all`, {
        params: { pageNo: categoryPage, pageSize: 30, sortBy: 'id', sortDir: 'desc' }
      });
      const newCategories = response.data.data.categoryList;
      setCategories(prev => {
        const uniqueCategories = Array.from(new Set([...prev, ...newCategories].map(c => c.id)))
          .map(id => [...prev, ...newCategories].find(c => c.id === id)!);
        return uniqueCategories;
      });
      setCategoryHasMore(!response.data.data.last);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [categoryPage]);

  const fetchArtists = useCallback(async () => {
    try {
      const response = await axios.get(`https://chogeumbi.kr/api/v1/author/all`, {
        params: { pageNo: artistPage, pageSize: 30, sortBy: 'id', sortDir: 'desc' }
      });
      const newArtists = response.data.data.authorList;
      setArtists(prev => {
        const uniqueArtists = Array.from(new Set([...prev, ...newArtists].map(a => a.id)))
          .map(id => [...prev, ...newArtists].find(a => a.id === id)!);
        return uniqueArtists;
      });
      setArtistHasMore(!response.data.data.last);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    }
  }, [artistPage]);

  const refreshCategories = useCallback(async () => {
    try {
      const response = await axios.get(`https://chogeumbi.kr/api/v1/category/all`, {
        params: { pageNo: 1, pageSize: 30, sortBy: 'id', sortDir: 'desc' }
      });
      const newCategories = response.data.data.categoryList;
      setCategories(newCategories);
      setCategoryPage(1);
      setCategoryHasMore(!response.data.data.last);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
    }
  }, []);

  const refreshArtists = useCallback(async () => {
    try {
      const response = await axios.get(`https://chogeumbi.kr/api/v1/author/all`, {
        params: { pageNo: 1, pageSize: 30, sortBy: 'id', sortDir: 'desc' }
      });
      const newArtists = response.data.data.authorList;
      setArtists(newArtists);
      setArtistPage(1);
      setArtistHasMore(!response.data.data.last);
    } catch (error) {
      console.error("Failed to refresh artists:", error);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    refreshData: () => {
      refreshCategories();
      refreshArtists();
    }
  }));

  useEffect(() => {
    if (isMenuOpen) {
      fetchUser();
    }
  }, [isMenuOpen, fetchUser]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleCategorySearch = (e: ChangeEvent<HTMLInputElement>) => {
    setCategorySearchTerm(e.target.value);
  };

  const handleCategorySelect = (category: Category) => {
    if (!selectedCategories.some(c => c.id === category.id)) {
      setSelectedCategories(prev => [...prev, category]);
    }
    setCategorySearchTerm("");
  };

  const handleCategoryRemove = (id: number) => {
    setSelectedCategories(prev => prev.filter(category => category.id !== id));
  };

  const handleArtistSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setArtistSearchTerm(e.target.value);
  };

  const handleArtistSelect = (artist: Author) => {
    if (!selectedArtists.some(a => a.id === artist.id)) {
      setSelectedArtists(prev => [...prev, artist]);
    }
    setArtistSearchTerm("");
  };

  const handleArtistRemove = (id: number) => {
    setSelectedArtists(prev => prev.filter(artist => artist.id !== id));
  };

  const filteredCategories = categorySearchTerm
    ? categories.filter(category => 
        category.categoryName.toLowerCase().includes(categorySearchTerm.toLowerCase()) &&
        !selectedCategories.some(sc => sc.id === category.id)
      )
    : categories.filter(category => !selectedCategories.some(sc => sc.id === category.id));

  const filteredArtists = artistSearchTerm
    ? artists.filter(artist => 
        artist.authorName.toLowerCase().includes(artistSearchTerm.toLowerCase()) &&
        !selectedArtists.some(sa => sa.id === artist.id)
      )
    : artists.filter(artist => !selectedArtists.some(sa => sa.id === artist.id));

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetContent className="overflow-y-auto">
        <div className="flex flex-col items-start gap-6 p-8">
          {user ? (
            <>
              <div className="flex flex-col items-start gap-2 w-full">
                <span className="text-lg font-semibold">{user.username}</span>
                <div className="flex items-center gap-4 mt-2">
                  <Button variant="outline" onClick={() => setIsUserInfoModalOpen(true)}>
                    회원 정보
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </Button>
              <Button variant="outline" onClick={() => setIsSignupModalOpen(true)}>
                Signup
              </Button>
            </div>
          )}
          
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
            {filteredCategories.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-auto">
                {filteredCategories.map((category, index) => (
                  <li
                    key={category.id}
                    ref={index === filteredCategories.length - 1 ? lastCategoryElementRef : null}
                    onClick={() => handleCategorySelect(category)}
                    className="cursor-pointer hover:bg-gray-100 p-2"
                  >
                    {category.categoryName}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryRemove(category.id)}
                  style={{ 
                    backgroundColor: `#${category.categoryColor}`,
                    color: 'white'
                  }}
                >
                  {category.categoryName}
                  <span className="ml-2">×</span>
                </Button>
              ))}
            </div>
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
            {filteredArtists.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-auto">
                {filteredArtists.map((artist, index) => (
                  <li
                    key={artist.id}
                    ref={index === filteredArtists.length - 1 ? lastArtistElementRef : null}
                    onClick={() => handleArtistSelect(artist)}
                    className="cursor-pointer hover:bg-gray-100 p-2"
                  >
                    {artist.authorName}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedArtists.map((artist) => (
                <Button
                  key={artist.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleArtistRemove(artist.id)}
                  style={{ 
                    backgroundColor: 'black',
                    color: 'white'
                  }}
                >
                  {artist.authorName}
                  <span className="ml-2">×</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={(checked) => setIsDarkMode(checked)}
            />
          </div>
          
          {user && user.role === 'ADMIN' && (
            <>
              <Button onClick={() => setIsAddMusicModalOpen(true)}>음악 추가</Button>
              <Button onClick={() => setIsAddArtistModalOpen(true)}>아티스트 추가</Button>
              <Button onClick={() => setIsAddCategoryModalOpen(true)}>카테고리 추가</Button>
            </>
          )}
        </div>
      </SheetContent>
      <UserInfoModal isOpen={isUserInfoModalOpen} onOpenChange={setIsUserInfoModalOpen} user={user} />
    </Sheet>
  );
});

export default SideMenu;