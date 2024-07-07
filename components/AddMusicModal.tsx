import { useState, FormEvent, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from 'js-cookie';
import { FeedbackModal } from "./FeedbackModal";

interface AddMusicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedAlbumArtUrl: string;
  setSelectedAlbumArtUrl: (url: string) => void;
  setIsSearchMusicModalOpen: (isOpen: boolean) => void;
  onMusicAdded: (music: MusicData) => void;
  initialMusic: MusicData | null;
}

interface Category {
  id: number;
  categoryName: string;
}

interface Artist {
  id: number;
  authorName: string;
}

interface MusicData {
  id: string;
  albumCover: string;
  musicName: string;
  author: { authorName: string };
  category: { categoryName: string; categoryColor: string };
}

export default function AddMusicModal({ 
  isOpen, 
  onOpenChange, 
  selectedAlbumArtUrl, 
  setSelectedAlbumArtUrl,
  setIsSearchMusicModalOpen,
  onMusicAdded,
  initialMusic
}: AddMusicModalProps) {
  const [musicName, setMusicName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      fetchCategories();
      fetchArtists();
      if (initialMusic) {
        setMusicName(initialMusic.musicName);
        setArtistName(initialMusic.author.authorName);
        setCategoryName(initialMusic.category.categoryName);
        setSelectedAlbumArtUrl(initialMusic.albumCover);
      }
    }
  }, [isOpen, initialMusic, setSelectedAlbumArtUrl]);

  const resetForm = () => {
    setMusicName("");
    setArtistName("");
    setCategoryName("");
    setSelectedAlbumArtUrl("");
    setFilteredCategories([]);
    setFilteredArtists([]);
  };

  const fetchCategories = useCallback(async () => {
    const accessToken = Cookies.get('accessToken');
    try {
      const response = await axios.get('https://chogeumbi.kr/api/v1/category/all', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setCategories(response.data.data.categoryList);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchArtists = useCallback(async () => {
    const accessToken = Cookies.get('accessToken');
    try {
      const response = await axios.get('https://chogeumbi.kr/api/v1/author/all', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setArtists(response.data.data.authorList);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    }
  }, []);

  const handleAddOrEditMusic = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    const musicData = {
      musicName: musicName,
      albumCover: selectedAlbumArtUrl,
      author: artistName,
      category: categoryName
    };

    
    try {
      let response;
      if (initialMusic) {
        response = await axios.put(`https://chogeumbi.kr/api/v1/music/${initialMusic.id}`, musicData, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      } else {
        response = await axios.post('https://chogeumbi.kr/api/v1/music', musicData, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        setFeedbackTitle("성공");
        setFeedbackMessage(`음악 "${response.data.data.musicName}"이(가) 성공적으로 ${initialMusic ? '수정' : '추가'}되었습니다.`);
        resetForm();
        onMusicAdded(response.data.data);
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error(`Failed to ${initialMusic ? 'edit' : 'add'} music:`, error);
      setFeedbackTitle("실패");
      setFeedbackMessage(`음악 ${initialMusic ? '수정' : '추가'}에 실패했습니다. 다시 시도해주세요.`);
    }
    setIsFeedbackModalOpen(true);
    onOpenChange(false);
  };

  const handleCategorySearch = (searchTerm: string) => {
    setCategoryName(searchTerm);
    setFilteredCategories(
      categories.filter(category => 
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleArtistSearch = (searchTerm: string) => {
    setArtistName(searchTerm);
    setFilteredArtists(
      artists.filter(artist => 
        artist.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleCategorySelect = (category: Category) => {
    setCategoryName(category.categoryName);
    setFilteredCategories([]);
  };

  const handleArtistSelect = (artist: Artist) => {
    setArtistName(artist.authorName);
    setFilteredArtists([]);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialMusic ? '음악 수정' : '음악 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrEditMusic}>
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
                onChange={(e) => handleArtistSearch(e.target.value)}
                className="w-full"
              />
              {filteredArtists.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-auto">
                  {filteredArtists.map((artist) => (
                    <li
                      key={artist.id}
                      onClick={() => handleArtistSelect(artist)}
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      {artist.authorName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Label htmlFor="music-category">카테고리</Label>
              <Input
                id="music-category"
                type="text"
                value={categoryName}
                onChange={(e) => handleCategorySearch(e.target.value)}
                className="w-full"
              />
              {filteredCategories.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-auto">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      {category.categoryName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Label htmlFor="album-art-url">앨범아트 URL</Label>
              <Input
                id="album-art-url"
                type="text"
                value={selectedAlbumArtUrl}
                onChange={(e) => setSelectedAlbumArtUrl(e.target.value)}
                className="w-full"
                disabled
              />
            </div>
            <div>
              <Button 
                type="button"
                onClick={() => setIsSearchMusicModalOpen(true)}
                className="w-full mt-2"
              >앨범 아트 검색</Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">{initialMusic ? '수정' : '추가'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onOpenChange={setIsFeedbackModalOpen}
        title={feedbackTitle}
        message={feedbackMessage}
      />
    </>
  );
}