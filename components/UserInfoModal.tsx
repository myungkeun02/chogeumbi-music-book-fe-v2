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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">회원 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium w-20">이름:</span>
                <span className="font-semibold">{user.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium w-20">이메일:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium w-20">권한:</span>
                <span className="font-semibold">
                  {user.role === 'ADMIN' ? '관리자' : '일반 사용자'}
                </span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium w-20">레벨:</span>
                <span className="font-semibold">{user.level}</span>
              </div> */}
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={() => setIsChangeNicknameModalOpen(true)}
                className="w-full"
              >
                닉네임 변경
              </Button>
            </div>
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