import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemType: 'category' | 'artist' | 'music' | null;
  itemName: string;
  onConfirm: () => void;
}

export default function DeleteModal({ isOpen, onOpenChange, itemType, itemName, onConfirm }: DeleteModalProps) {
  const getItemTypeText = () => {
    switch(itemType) {
      case 'category':
        return '카테고리';
      case 'artist':
        return '아티스트';
      case 'music':
        return '음악';
      default:
        return '항목';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
        </DialogHeader>
        <p>{itemName} {getItemTypeText()}를 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button variant="destructive" onClick={onConfirm}>삭제</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}