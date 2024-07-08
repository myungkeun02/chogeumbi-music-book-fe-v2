import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { FeedbackModal } from './FeedbackModal';

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function LoginModal({ isOpen, onOpenChange, setIsMenuOpen }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isHangul, setIsHangul] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await login(email, password);
    if (success) {
      showFeedback('성공', '로그인에 성공했습니다.');
      onOpenChange(false);
      setIsMenuOpen(false);
      setTimeout(() => setIsMenuOpen(true), 100);
    } else {
      showFeedback('오류', '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
    setIsLoading(false);
  };

  const showFeedback = (title: string, message: string) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsHangul(e.type === 'compositionstart');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="login-email">이메일</Label>
            <Input 
              id="login-email" 
              type="email" 
              className="w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="login-password">비밀번호</Label>
            <Input 
              id="login-password" 
              type="password" 
              className="w-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onCompositionStart={handleComposition}
              onCompositionEnd={handleComposition}
            />
            {capsLockOn && <div className="text-yellow-500">Caps Lock이 켜져 있습니다.</div>}
            {isHangul && <div className="text-yellow-500">한글 입력 모드입니다.</div>}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
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