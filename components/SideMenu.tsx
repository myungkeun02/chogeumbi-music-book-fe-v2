import React, { useState, ChangeEvent, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '../hooks/useAuth';
import AddArtistModal from "./AddArtistModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteModal from "./DeleteModal";
import UserInfoModal from './UserInfoModal';
import axios from 'axios';
import Cookies from "js-cookie";

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
  onCategorySelect: (categoryName: string) => void;
  onArtistSelect: (artistName: string) => void;
  selectedCategories: string[];
  selectedArtists: string[];
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
  onCategorySelect,
  onArtistSelect,
  selectedCategories,
  selectedArtists,
}, ref) => {
  const { user, logout, fetchUser } = useAuth();
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Author[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [artistPage, setArtistPage] = useState(1);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [artistHasMore, setArtistHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<'category' | 'artist' | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemType, setEditItemType] = useState<'category' | 'artist' | null>(null);
  const [editItem, setEditItem] = useState<Category | Author | null>(null);

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
        params: { pageNo: categoryPage, pageSize: 30, sortBy: 'categoryName', sortDir: 'asc' }
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
        params: { pageNo: artistPage, pageSize: 30, sortBy: 'authorName', sortDir: 'asc' }
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
        params: { pageNo: 1, pageSize: 30, sortBy: 'categoryName', sortDir: 'asc' }
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
        params: { pageNo: 1, pageSize: 30, sortBy: 'authorName', sortDir: 'asc' }
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
    onCategorySelect(category.categoryName);
  };

  const handleArtistSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setArtistSearchTerm(e.target.value);
  };

  const handleArtistSelect = (artist: Author) => {
    onArtistSelect(artist.authorName);
  };

  const filteredCategories = categorySearchTerm
    ? categories.filter(category => 
        category.categoryName.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
    : categories;

  const filteredArtists = artistSearchTerm
    ? artists.filter(artist => 
        artist.authorName.toLowerCase().includes(artistSearchTerm.toLowerCase())
      )
    : artists;

  const handleDelete = async () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken || !deleteItemType || !deleteItemId) return;

    try {
      const endpoint = deleteItemType === 'category' 
        ? `https://chogeumbi.kr/api/v1/category/${deleteItemId}`
        : `https://chogeumbi.kr/api/v1/author/${deleteItemId}`;

      await axios.delete(endpoint, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      deleteItemType === 'category' ? refreshCategories() : refreshArtists();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(`Failed to delete ${deleteItemType}:`, error);
    }
  };

  const handleEdit = (item: Category | Author, type: 'category' | 'artist') => {
    setEditItem(item);
    setEditItemType(type);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedItem: Category | Author) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken || !editItemType) return;

    try {
      const endpoint = editItemType === 'category' 
        ? `https://chogeumbi.kr/api/v1/category/${updatedItem.id}`
        : `https://chogeumbi.kr/api/v1/author/${updatedItem.id}`;

      await axios.put(endpoint, updatedItem, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      editItemType === 'category' ? refreshCategories() : refreshArtists();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(`Failed to edit ${editItemType}:`, error);
    }
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent className="overflow-y-auto p-6">
            <div className="flex flex-col items-start gap-6 p-8">
          {user ? (
            <>
                <div className="flex flex-col items-start gap-4 w-full mb-8">
                    <span className="text-xl font-semibold">{user.username}</span>
                    <div className="flex items-center gap-4">
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
          <div className="w-full mb-8">
          <Label htmlFor="category" className="text-lg font-semibold mb-2 block">Category</Label>
          <Input
            id="category"
            type="text"
            placeholder="Search category"
            value={categorySearchTerm}
            onChange={handleCategorySearch}
            className="w-full rounded-md bg-background border border-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
            />
            {filteredCategories.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-auto">
                {filteredCategories.map((category, index) => (
                  <li
                  key={category.id}
                  ref={index === filteredCategories.length - 1 ? lastCategoryElementRef : null}
                  className="flex justify-between items-center p-2 hover:bg-secondary rounded-md transition-colors duration-200"
                >
                  <span 
                    onClick={() => handleCategorySelect(category)}
                    className="cursor-pointer flex-grow"
                  >
                    {category.categoryName}
                  </span>
                  {user && user.role === 'ADMIN' && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(category, 'category')}
                        className="px-2 py-1 text-xs hover:bg-secondary"
                      >
                        수정
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => {
                          setDeleteItemType('category');
                          setDeleteItemId(category.id);
                          setDeleteItemName(category.categoryName);
                          setIsDeleteModalOpen(true);
                        }}
                        className="px-2 py-1 text-xs hover:bg-red-600"
                      >
                        삭제
                      </Button>
                    </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
            {categories.filter(category => selectedCategories.includes(category.categoryName)).map((category) => (
                <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => handleCategorySelect(category)}
                className="rounded-full"
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
          <div className="w-full mb-8">
            <Label htmlFor="artist" className="text-lg font-semibold mb-2 block">Artist</Label>
            <Input
              id="artist"
              type="text"
              placeholder="Search artist"
              value={artistSearchTerm}
              onChange={handleArtistSearch}
              className="w-full rounded-md bg-background border border-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                  />
            {filteredArtists.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-auto">
                {filteredArtists.map((artist, index) => (
                <li
                key={artist.id}
                ref={index === filteredArtists.length - 1 ? lastArtistElementRef : null}
                className="flex justify-between items-center p-2 hover:bg-secondary rounded-md transition-colors duration-200"
              >
                <span 
                  onClick={() => handleArtistSelect(artist)}
                  className="cursor-pointer flex-grow"
                >
                  {artist.authorName}
                </span>
                {user && user.role === 'ADMIN' && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(artist, 'artist')}
                      className="px-2 py-1 text-xs hover:bg-secondary"
                    >
                      수정
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => {
                        setDeleteItemType('artist');
                        setDeleteItemId(artist.id);
                        setDeleteItemName(artist.authorName);
                        setIsDeleteModalOpen(true);
                      }}
                      className="px-2 py-1 text-xs hover:bg-red-600"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
            {artists.filter(artist => selectedArtists.includes(artist.authorName)).map((artist) => (
                <Button
                  key={artist.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleArtistSelect(artist)}
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

          <div className="flex items-center justify-between w-full mb-8">
            <Label htmlFor="dark-mode" className="text-lg font-semibold">Dark Mode</Label>
            <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={(checked) => setIsDarkMode(checked)}
            />
        </div>
        {user && user.role === 'ADMIN' && (
            <div className="flex flex-col gap-4 w-full">
                <Button variant="outline" onClick={() => setIsAddMusicModalOpen(true)} className="w-full">음악 추가</Button>
                <Button variant="outline" onClick={() => setIsAddArtistModalOpen(true)} className="w-full">아티스트 추가</Button>
                <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(true)} className="w-full">카테고리 추가</Button>
            </div>
        )}
        </div>
      </SheetContent>
      <UserInfoModal isOpen={isUserInfoModalOpen} onOpenChange={setIsUserInfoModalOpen} user={user} />
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemType={deleteItemType}
        itemName={deleteItemName}
        onConfirm={handleDelete}
      />
      {editItemType === 'category' && (
        <AddCategoryModal 
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onCategoryAdded={handleEditSubmit}
          initialCategory={editItem as Category}
        />
      )}
      {editItemType === 'artist' && (
        <AddArtistModal 
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onArtistAdded={handleEditSubmit}
          initialArtist={editItem as Author}
        />
      )}
    </Sheet>
  );
});

export default SideMenu;