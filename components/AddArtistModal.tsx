import { useState, FormEvent, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import { FeedbackModal } from "./FeedbackModal";

interface AddArtistModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onArtistAdded: (artist: any) => void;
  initialArtist?: {
    id: number;
    authorName: string;
    subName: string;
  };
}

export default function AddArtistModal({ isOpen, onOpenChange, onArtistAdded, initialArtist }: AddArtistModalProps) {
  const [artistName, setArtistName] = useState("");
  const [artistSubName, setArtistSubName] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (initialArtist) {
      setArtistName(initialArtist.authorName);
      setArtistSubName(initialArtist.subName);
    } else {
      resetForm();
    }
  }, [initialArtist, isOpen]);

  const resetForm = () => {
    setArtistName("");
    setArtistSubName("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');

    try {
      let response;
      if (initialArtist) {
        response = await axios.put(
          `https://chogeumbi.kr/api/v1/author/${initialArtist.id}`,
          {
            authorName: artistName,
            subName: artistSubName
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          'https://chogeumbi.kr/api/v1/author',
          {
            authorName: artistName,
            subName: artistSubName
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        setFeedbackTitle("성공");
        setFeedbackMessage(`아티스트 "${response.data.data.authorName}"이(가) 성공적으로 ${initialArtist ? '수정' : '추가'}되었습니다.`);
        resetForm();
        onArtistAdded(response.data.data);
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding/editing artist:", error);
      setFeedbackTitle("실패");
      setFeedbackMessage(`아티스트 ${initialArtist ? '수정' : '추가'}에 실패했습니다. 다시 시도해주세요.`);
    }

    setIsFeedbackModalOpen(true);
    onOpenChange(false);
  };

  const handleFeedbackModalClose = (isOpen: boolean) => {
    setIsFeedbackModalOpen(isOpen);
    if (!isOpen) {
      onOpenChange(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{initialArtist ? '아티스트 수정' : '아티스트 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artist-name">아티스트 이름</Label>
              <Input
                id="artist-name"
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist-subname">아티스트 별명</Label>
              <Input
                id="artist-subname"
                type="text"
                value={artistSubName}
                onChange={(e) => setArtistSubName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit">
                {initialArtist ? '수정' : '추가'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onOpenChange={handleFeedbackModalClose}
        title={feedbackTitle}
        message={feedbackMessage}
      />
    </>
  );
}