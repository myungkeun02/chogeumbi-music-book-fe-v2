import { useState, FormEvent, useEffect } from "react";
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
  onCategoryAdded: (category: any) => void;
  initialCategory?: {
    id: number;
    categoryName: string;
    categoryColor: string;
  };
}

export default function AddCategoryModal({ isOpen, onOpenChange, onCategoryAdded, initialCategory }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#000000");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (initialCategory) {
      setCategoryName(initialCategory.categoryName);
      setCategoryColor("#" + initialCategory.categoryColor);
    } else {
      resetForm();
    }
  }, [initialCategory, isOpen]);

  const resetForm = () => {
    setCategoryName("");
    setCategoryColor("#000000");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    
    try {
      let response;
      if (initialCategory) {
        response = await axios.put(
          `https://chogeumbi.kr/api/v1/category/${initialCategory.id}`,
          {
            categoryName: categoryName,
            categoryColor: categoryColor.slice(1)
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
          "https://chogeumbi.kr/api/v1/category", 
          {
            categoryName: categoryName,
            categoryColor: categoryColor.slice(1)
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
        setFeedbackMessage(`카테고리 "${response.data.data.categoryName}"가 성공적으로 ${initialCategory ? '수정' : '추가'}되었습니다.`);
        resetForm();
        onCategoryAdded(response.data.data);
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (error) {
      console.error("Error adding/editing category:", error);
      setFeedbackTitle("실패");
      setFeedbackMessage(`카테고리 ${initialCategory ? '수정' : '추가'}에 실패했습니다. 다시 시도해주세요.`);
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
            <DialogTitle>{initialCategory ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">카테고리 이름</Label>
              <Input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-color">카테고리 색상</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="category-color"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <span className="text-sm">{categoryColor}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit">
                {initialCategory ? '수정' : '추가'}
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