import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from 'js-cookie';

interface SearchMusicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImageSelect: (imageUrl: string) => void;
}

export default function SearchMusicModal({ isOpen, onOpenChange, onImageSelect }: SearchMusicModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://chogeumbi.kr/api/v1/crawl", {
        params: { keyword: searchTerm },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.statusCode === 200) {
        setSearchResults(response.data.data);
      } else {
        setError(response.data.message || "검색에 실패했습니다.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "검색 중 오류가 발생했습니다.");
      } else {
        setError("검색 중 오류가 발생했습니다.");
      }
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>앨범 아트 검색</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input 
              type="text" 
              placeholder="검색시 노래제목 아티스트로 입력하면 좀 더 정확한 결과가 나옵니다 ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {searchResults.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square bg-background rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Album Art ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}