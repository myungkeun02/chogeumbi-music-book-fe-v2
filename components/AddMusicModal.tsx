import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddMusicModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setIsSearchMusicModalOpen: (isOpen: boolean) => void;
}

export default function AddMusicModal({ isOpen, onOpenChange, setIsSearchMusicModalOpen }: AddMusicModalProps) {
  const [musicName, setMusicName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const handleAddMusic = (e: FormEvent) => {
    e.preventDefault();
    // 음악 추가 로직 구현
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}