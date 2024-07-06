import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeedbackModal } from "./FeedbackModal";
import axios from "axios";
import Cookies from "js-cookie";

interface AddCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCategoryAdded: () => void;
}

export default function AddCategoryModal({ isOpen, onOpenChange, onCategoryAdded }: AddCategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#000000");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryColor("#000000");
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    
    try {
      const response = await axios.post(
        "https://chogeumbi.kr/api/v1/category", 
        {
          categoryName: newCategoryName,
          categoryColor: newCategoryColor.slice(1) // '#'를 제거하여 문자열 형태로 변환
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.statusCode === 201) {
        setFeedbackTitle("성공");
        setFeedbackMessage(`카테고리 "${response.data.data.categoryName}"가 성공적으로 추가되었습니다.`);
        resetForm();
        onCategoryAdded();  // 카테고리 추가 후 SideMenu의 카테고리 목록 갱신
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setFeedbackTitle("실패");
      setFeedbackMessage("카테고리 추가에 실패했습니다. 다시 시도해주세요.");
    }

    setIsFeedbackModalOpen(true);
    onOpenChange(false);
  };

  const handleFeedbackModalClose = (isOpen: boolean) => {
    setIsFeedbackModalOpen(isOpen);
    if (!isOpen) {
      onOpenChange(true); // 피드백 모달이 닫힐 때 카테고리 추가 모달을 다시 엽니다.
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory}>
            <div className="mb-4">
              <Label htmlFor="category-name">카테고리 이름</Label>
              <Input
                id="category-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="category-color">카테고리 색상</Label>
              <div className="flex items-center">
                <Input
                  id="category-color"
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-12 h-12 p-1 mr-2"
                />
                <span>{newCategoryColor}</span>
              </div>
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