import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="login-email">이메일</Label>
          <Input id="login-email" type="email" className="w-full" />
        </div>
        <div>
          <Label htmlFor="login-password">비밀번호</Label>
          <Input id="login-password" type="password" className="w-full" />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>로그인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}