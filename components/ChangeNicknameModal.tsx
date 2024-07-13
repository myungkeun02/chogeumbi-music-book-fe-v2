import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import { FeedbackModal } from './FeedbackModal';

interface ChangeNicknameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentNickname: string;
}

export default function ChangeNicknameModal({ isOpen, onOpenChange, currentNickname }: ChangeNicknameModalProps) {
  const [newNickname, setNewNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { fetchUser } = useAuth();

  const handleNicknameChange = async () => {
    setIsLoading(true);

    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      showFeedback('오류', '인증 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put('https://chogeumbi.kr/api/v1/user/update/info', {
        username: newNickname
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        await fetchUser();
        showFeedback('성공', '닉네임이 성공적으로 변경되었습니다.');
        onOpenChange(false);
      }
    } catch (error) {
      showFeedback('오류', '닉네임 변경에 실패했습니다. 다시 시도해주세요.');
      console.error('Failed to change nickname:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (title: string, message: string) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>닉네임 변경</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="nickname">새 닉네임</Label>
            <Input 
              id="nickname" 
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full" 
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleNicknameChange} disabled={isLoading || newNickname === currentNickname}>
              {isLoading ? '변경 중...' : '변경하기'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        title={feedbackTitle}
        message={feedbackMessage}
      />
    </>
  );
}