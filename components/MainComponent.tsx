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
import Notification from "./Notification";
import axios from "axios";
import { useAuth } from '../hooks/useAuth';

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
  const [selectedAlbumArtUrl, setSelectedAlbumArtUrl] = useState("");
  const [notificationState, setNotificationState] = useState({
    message: '',
    isVisible: false
  });

  const sideMenuRef = useRef<{ refreshData: () => void } | null>(null);

  const refreshSideMenu = useCallback(() => {
    if (sideMenuRef.current) {
      sideMenuRef.current.refreshData();
    }
  }, []);

  const fetchMusicData = useCallback(async () => {
    try {
      const response = await axios.get("https://www.chogeumbi.kr/api/v1/music/all");
      if (response.data && response.data.data && response.data.data.musicList) {
        const musicListWithColor = response.data.data.musicList.map((music: MusicData) => ({
          ...music,
          category: {
            ...music.category,
            categoryColor: music.category.categoryColor || generateRandomColor()
          }
        }));
        setMusicData(musicListWithColor);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch music data:", error);
    }
  }, []);

  const generateRandomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
  }

  useEffect(() => {
    fetchMusicData();
  }, [fetchMusicData]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header setIsMenuOpen={setIsMenuOpen} />
      <MusicGrid musicData={musicData} onCopy={handleCopy} />
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
            onMusicAdded={fetchMusicData}
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