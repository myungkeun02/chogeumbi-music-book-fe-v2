"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Header from "./Header";
import MusicGrid from "./MusicGrid";
import SideMenu from "./SideMenu";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import AddMusicModal from "./AddMusicModal";
import SearchMusicModal from "./SearchMusicModal";
import AddArtistModal from "./AddArtistModal";
import AddCategoryModal from "./AddCategoryModal";
import DeleteModal from "./DeleteModal";
import Notification from "./Notification";
import axios from "axios";
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';

interface MusicData {
  id: string;
  albumCover: string;
  musicName: string;
  author: { authorName: string };
  category: { categoryName: string; categoryColor: string };
}

export default function MainComponent() {
  const { user, loading, fetchUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isSearchMusicModalOpen, setIsSearchMusicModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData[]>([]);
  const [filteredMusicData, setFilteredMusicData] = useState<MusicData[]>([]);
  const [selectedAlbumArtUrl, setSelectedAlbumArtUrl] = useState("");
  const [notificationState, setNotificationState] = useState({
    message: '',
    isVisible: false
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MusicData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMusicId, setDeleteMusicId] = useState<string | null>(null);
  const [deleteMusicName, setDeleteMusicName] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const sideMenuRef = useRef<{ refreshData: () => void } | null>(null);

  const refreshSideMenu = useCallback(() => {
    if (sideMenuRef.current) {
      sideMenuRef.current.refreshData();
    }
  }, []);

  const fetchMusicData = useCallback(async (pageNum: number, search: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.get("https://www.chogeumbi.kr/api/v1/music/all", {
        params: {
          pageNo: pageNum,
          pageSize: 20,
          sortBy: 'id',
          sortDir: 'desc',
          searchKeyword: search
        }
      });
      if (response.data && response.data.data && response.data.data.musicList) {
        const musicListWithColor = response.data.data.musicList.map((music: MusicData) => ({
          ...music,
          category: {
            ...music.category,
            categoryColor: music.category.categoryColor || generateRandomColor()
          }
        }));
        const filteredMusicList = musicListWithColor.filter(music => 
          (selectedCategories.length === 0 || selectedCategories.includes(music.category.categoryName)) &&
          (selectedArtists.length === 0 || selectedArtists.includes(music.author.authorName))
        );
        setMusicData(prev => pageNum === 1 ? filteredMusicList : [...prev, ...filteredMusicList]);
        setFilteredMusicData(prev => pageNum === 1 ? filteredMusicList : [...prev, ...filteredMusicList]);
        setHasMore(!response.data.data.last);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch music data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories, selectedArtists]);

  const generateRandomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
  }

  useEffect(() => {
    setPage(1);
    setMusicData([]);
    setFilteredMusicData([]);
    fetchMusicData(1, searchTerm);
  }, [fetchMusicData, searchTerm, selectedCategories, selectedArtists]);

  useEffect(() => {
    if (page > 1) {
      fetchMusicData(page, searchTerm);
    }
  }, [fetchMusicData, page, searchTerm]);

  useEffect(() => {
    const filtered = musicData.filter(music => 
      music.musicName.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
      music.author.authorName.toLowerCase().includes(localSearchTerm.toLowerCase())
    );
    setFilteredMusicData(filtered);
  }, [musicData, localSearchTerm]);

  useEffect(() => {
    if (user) {
      setIsLoginModalOpen(false);
    }
  }, [user]);

  const handleLoginModalClose = (isOpen: boolean) => {
    setIsLoginModalOpen(isOpen);
    if (!isOpen) {
      fetchUser();
    }
  };

  const handleAlbumArtSelect = (imageUrl: string) => {
    setSelectedAlbumArtUrl(imageUrl);
    setIsSearchMusicModalOpen(false);
    setIsAddMusicModalOpen(true);
  };

  const handleCopy = useCallback((musicName: string, authorName: string) => {
    navigator.clipboard.writeText(`${musicName} - ${authorName}`)
      .then(() => {
        setNotificationState({
          message: `${musicName} - ${authorName}`,
          isVisible: true
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
    setLocalSearchTerm(searchTerm);
    setMusicData([]);
    setFilteredMusicData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const handleLocalSearch = useCallback((searchTerm: string) => {
    setLocalSearchTerm(searchTerm);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, isLoading]);

  const handleEditMusic = useCallback((music: MusicData) => {
    setSelectedMusic(music);
    setSelectedAlbumArtUrl(music.albumCover);
    setIsAddMusicModalOpen(true);
  }, []);

  const handleDeleteMusic = useCallback((musicId: string, musicName: string) => {
    setDeleteMusicId(musicId);
    setDeleteMusicName(musicName);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteMusic = useCallback(async () => {
    if (!deleteMusicId) return;

    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return;

    try {
      await axios.delete(`https://www.chogeumbi.kr/api/v1/music/${deleteMusicId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      setMusicData(prev => prev.filter(music => music.id !== deleteMusicId));
      setFilteredMusicData(prev => prev.filter(music => music.id !== deleteMusicId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete music:", error);
    }
  }, [deleteMusicId]);

  const handleMusicAdded = useCallback((music: MusicData) => {
    setMusicData(prev => [music, ...prev]);
    setFilteredMusicData(prev => [music, ...prev]);
    setSelectedMusic(null);
    setIsAddMusicModalOpen(false);
  }, []);

  const handleCategorySelect = useCallback((categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(name => name !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  }, []);

  const handleArtistSelect = useCallback((artistName: string) => {
    setSelectedArtists(prev => {
      if (prev.includes(artistName)) {
        return prev.filter(name => name !== artistName);
      } else {
        return [...prev, artistName];
      }
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header setIsMenuOpen={setIsMenuOpen} onSearch={handleSearch} onLocalSearch={handleLocalSearch} />
      <MusicGrid 
        musicData={filteredMusicData} 
        onCopy={handleCopy} 
        loadMore={loadMore} 
        hasMore={hasMore} 
        isLoading={isLoading}
        isAdmin={user?.role === 'ADMIN'}
        onEdit={handleEditMusic}
        onDelete={handleDeleteMusic}
      />
      <SideMenu
        ref={sideMenuRef}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsSignupModalOpen={setIsSignupModalOpen}
        setIsAddMusicModalOpen={setIsAddMusicModalOpen}
        setIsAddArtistModalOpen={setIsAddArtistModalOpen}
        setIsAddCategoryModalOpen={setIsAddCategoryModalOpen}
        onCategorySelect={handleCategorySelect}
        onArtistSelect={handleArtistSelect}
        selectedCategories={selectedCategories}
        selectedArtists={selectedArtists}
      />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={handleLoginModalClose} 
        setIsMenuOpen={setIsMenuOpen}
      />
      <SignupModal isOpen={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} />
      {user && user.role === 'ADMIN' && (
        <>
          <AddMusicModal
            isOpen={isAddMusicModalOpen}
            onOpenChange={setIsAddMusicModalOpen}
            selectedAlbumArtUrl={selectedAlbumArtUrl}
            setSelectedAlbumArtUrl={setSelectedAlbumArtUrl}
            setIsSearchMusicModalOpen={setIsSearchMusicModalOpen}
            onMusicAdded={handleMusicAdded}
            initialMusic={selectedMusic}
          />
          <SearchMusicModal 
            isOpen={isSearchMusicModalOpen} 
            onOpenChange={setIsSearchMusicModalOpen}
            onImageSelect={handleAlbumArtSelect}
          />
          <AddArtistModal 
            isOpen={isAddArtistModalOpen} 
            onOpenChange={setIsAddArtistModalOpen}
            onArtistAdded={refreshSideMenu}
          />
          <AddCategoryModal 
            isOpen={isAddCategoryModalOpen} 
            onOpenChange={setIsAddCategoryModalOpen}
            onCategoryAdded={refreshSideMenu}
          />
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            itemType="music"
            itemName={deleteMusicName}
            onConfirm={confirmDeleteMusic}
          />
        </>
      )}
      <Notification
        message={notificationState.message}
        isVisible={notificationState.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
}