import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  message: string;
}

export function FeedbackModal({ isOpen, onOpenChange, title, message }: FeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="whitespace-pre-wrap">{message}</div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}