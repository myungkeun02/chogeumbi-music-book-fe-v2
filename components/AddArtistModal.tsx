import { useState, FormEvent } from "react";
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
  onArtistAdded: () => void;
}

export default function AddArtistModal({ isOpen, onOpenChange, onArtistAdded }: AddArtistModalProps) {
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistSubName, setNewArtistSubName] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const resetForm = () => {
    setNewArtistName("");
    setNewArtistSubName("");
  };

  const handleAddArtist = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');

    try {
      const response = await axios.post(
        'https://chogeumbi.kr/api/v1/author',
        {
          authorName: newArtistName,
          subName: newArtistSubName
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      
      if (response.data.statusCode === 200) {
        setFeedbackTitle("성공");
        setFeedbackMessage(`아티스트 "${response.data.data.authorName}"이(가) 성공적으로 추가되었습니다.`);
        resetForm();
        onArtistAdded();
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding author:", error);
      setFeedbackTitle("실패");
      setFeedbackMessage("아티스트 추가에 실패했습니다. 다시 시도해주세요.");
    }

    setIsFeedbackModalOpen(true);
    onOpenChange(false);
  };

  const handleFeedbackModalClose = (isOpen: boolean) => {
    setIsFeedbackModalOpen(isOpen);
    if (!isOpen) {
      onOpenChange(true); // 피드백 모달이 닫힐 때 아티스트 추가 모달을 다시 엽니다.
    }
  };

  return (
    <>
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
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onOpenChange={handleFeedbackModalClose}
        title={feedbackTitle}
        message={feedbackMessage}
      />
    </>
  );
}