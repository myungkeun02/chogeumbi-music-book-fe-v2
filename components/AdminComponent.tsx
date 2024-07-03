"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import  MusicGrid from "./MusicGrid";
import SideMenu from "./SideMenu";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import AddMusicModal from "./AddMusicModal";
import SearchMusicModal from "./SearchMusicModal";
import AddArtistModal from "./AddArtistModal";
import AddCategoryModal from "./AddCategoryModal";
import axios from "axios";

interface MusicData {
  id: string;
  albumCover: string;
  musicName: string;
  author: { authorName: string };
  category: { categoryName: string };
}

export default function AdminComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);
  const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isSearchMusicModalOpen, setIsSearchMusicModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData[]>([]);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await axios.get("https://www.chogeumbi.kr/api/v1/music/all");
        if (response.data && response.data.data && response.data.data.musicList) {
          setMusicData(response.data.data.musicList);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch music data:", error);
      }
    };
    fetchMusicData();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header setIsMenuOpen={setIsMenuOpen} />
      <MusicGrid musicData={musicData} />
      <SideMenu
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
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <SignupModal isOpen={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} />
      <AddMusicModal
        isOpen={isAddMusicModalOpen}
        onOpenChange={setIsAddMusicModalOpen}
        setIsSearchMusicModalOpen={setIsSearchMusicModalOpen}
      />
      <SearchMusicModal isOpen={isSearchMusicModalOpen} onOpenChange={setIsSearchMusicModalOpen} />
      <AddArtistModal isOpen={isAddArtistModalOpen} onOpenChange={setIsAddArtistModalOpen} />
      <AddCategoryModal isOpen={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen} />
    </div>
  );
}