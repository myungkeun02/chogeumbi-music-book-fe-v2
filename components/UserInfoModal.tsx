import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import ChangeNicknameModal from './ChangeNicknameModal';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
//   level: number;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
}

export default function UserInfoModal({ isOpen, onOpenChange, user }: UserInfoModalProps) {
  const [isChangeNicknameModalOpen, setIsChangeNicknameModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <strong>이름:</strong> {user.username}
            </div>
            <div>
              <strong>이메일:</strong> {user.email}
            </div>
            <div>
              <strong>권한:</strong> {user.role === 'ADMIN' ? '관리자' : '일반 사용자'}
            </div>
            {/* <div>
              <strong>레벨:</strong> {user.level}
            </div> */}
            <Button onClick={() => setIsChangeNicknameModalOpen(true)}>
              닉네임 변경
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ChangeNicknameModal
        isOpen={isChangeNicknameModalOpen}
        onOpenChange={setIsChangeNicknameModalOpen}
        currentNickname={user.username}
      />
    </>
  );
}