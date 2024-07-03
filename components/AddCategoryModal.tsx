import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AddCategoryModal({ isOpen, onOpenChange }: AddCategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("");

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    // 카테고리 추가 로직 구현
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddCategory}>
          <div>
            <Label htmlFor="category-name">카테고리 이름</Label>
            <Input
              id="category-name"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="category-color">카테고리 색상</Label>
            <Input
              id="category-color"
              type="text"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
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