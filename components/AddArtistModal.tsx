import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddArtistModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AddArtistModal({ isOpen, onOpenChange }: AddArtistModalProps) {
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistSubName, setNewArtistSubName] = useState("");

  const handleAddArtist = (e: FormEvent) => {
    e.preventDefault();
    // 아티스트 추가 로직 구현
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
}