import { useState, FormEvent, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from 'js-cookie';
import { FeedbackModal } from "./FeedbackModal";

interface EditMusicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onMusicUpdated: (music: MusicData, newCategory: boolean, newArtist: boolean) => void;
  selectedAlbumArtUrl: string;
  setSelectedAlbumArtUrl: (url: string) => void;
  setIsSearchMusicModalOpen: (isOpen: boolean) => void;
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

export default function EditMusicModal({ 
  isOpen, 
  onOpenChange, 
  selectedAlbumArtUrl, 
  setSelectedAlbumArtUrl,
  setIsSearchMusicModalOpen,
  onMusicUpdated,
  initialMusic,
}: EditMusicModalProps) {
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
    if (isOpen && initialMusic) {
      setMusicName(initialMusic.musicName);
      setArtistName(initialMusic.author.authorName);
      setCategoryName(initialMusic.category.categoryName);
      setSelectedAlbumArtUrl(initialMusic.albumCover);
      fetchCategories();
      fetchArtists();
    }
  }, [isOpen, initialMusic, setSelectedAlbumArtUrl]);

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

  const handleEditMusic = async (e: FormEvent) => {
    e.preventDefault();

    if (!musicName || !artistName || !categoryName || !selectedAlbumArtUrl || !initialMusic) {
      setFeedbackTitle("실패");
      setFeedbackMessage("모든 필드를 채워주세요.");
      setIsFeedbackModalOpen(true);
      return;
    }

    const accessToken = Cookies.get('accessToken');
    const musicData = {
      musicName: musicName,
      albumCover: selectedAlbumArtUrl,
      author: artistName,
      category: categoryName
    };

    try {
      const response = await axios.put(`https://chogeumbi.kr/api/v1/music/${initialMusic.id}`, musicData, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.data.statusCode === 200) {
        let feedbackMessage = `음악 "${response.data.data.music.musicName}"이(가) 성공적으로 수정되었습니다.`;
        let newCategory = response.data.data.generatedCategory;
        let newArtist = response.data.data.generatedAuthor;
        
        if (newArtist) {
            feedbackMessage += `\n새로운 아티스트 "${response.data.data.music.author.authorName}"가 생성되었습니다.`;
        }
        if (newCategory) {
            feedbackMessage += `\n새로운 카테고리 "${response.data.data.music.category.categoryName}"가 생성되었습니다.`;
        }
    
        setFeedbackTitle("성공");
        setFeedbackMessage(feedbackMessage);
        
        const updatedMusicData: MusicData = {
          id: response.data.data.music.id,
          albumCover: response.data.data.music.albumCover,
          musicName: response.data.data.music.musicName,
          author: { authorName: response.data.data.music.author.authorName },
          category: { 
            categoryName: response.data.data.music.category.categoryName,
            categoryColor: response.data.data.music.category.categoryColor
          }
        };

        onMusicUpdated(updatedMusicData, newCategory, newArtist);
        onOpenChange(false);
        setIsFeedbackModalOpen(true);
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error("Failed to edit music:", error);
      setFeedbackTitle("실패");
      setFeedbackMessage("음악 수정에 실패했습니다. 다시 시도해주세요.");
      setIsFeedbackModalOpen(true);
    }
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>음악 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditMusic} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="music-name">음악 이름</Label>
              <Input
                id="music-name"
                value={musicName}
                onChange={(e) => setMusicName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="music-artist">아티스트</Label>
              <Input
                id="music-artist"
                value={artistName}
                onChange={(e) => handleArtistSearch(e.target.value)}
                className="w-full"
              />
              {filteredArtists.length > 0 && (
                <ul className="mt-1 max-h-32 overflow-auto bg-background border rounded-md">
                  {filteredArtists.map((artist) => (
                    <li
                      key={artist.id}
                      onClick={() => handleArtistSelect(artist)}
                      className="cursor-pointer hover:bg-muted px-2 py-1 text-sm"
                    >
                      {artist.authorName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="music-category">카테고리</Label>
              <Input
                id="music-category"
                value={categoryName}
                onChange={(e) => handleCategorySearch(e.target.value)}
                className="w-full"
              />
              {filteredCategories.length > 0 && (
                <ul className="mt-1 max-h-32 overflow-auto bg-background border rounded-md">
                  {filteredCategories.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="cursor-pointer hover:bg-muted px-2 py-1 text-sm"
                    >
                      {category.categoryName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="album-art-url">앨범아트 URL</Label>
              <Input
                id="album-art-url"
                value={selectedAlbumArtUrl}
                onChange={(e) => setSelectedAlbumArtUrl(e.target.value)}
                className="w-full"
                disabled
              />
            </div>
            <Button 
              type="button"
              onClick={() => setIsSearchMusicModalOpen(true)}
              className="w-full"
            >
              앨범 아트 검색
            </Button>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit">
                수정
              </Button>
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