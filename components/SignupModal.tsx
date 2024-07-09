import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FeedbackModal } from './FeedbackModal';

interface SignupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignupModal({ isOpen, onOpenChange }: SignupModalProps) {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState<boolean>(true);
  const [authCode, setAuthCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isHangul, setIsHangul] = useState(false);
  const router = useRouter();

  const resetState = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setUsernameError('');
    setIsWelcomeOpen(false);
    setIsEmailVerificationOpen(true);
    setAuthCode('');
    setIsCodeSent(false);
    setIsLoading(false);
    setIsCodeLoading(false);
    setTimeLeft(300);
    setCapsLockOn(false);
    setIsHangul(false);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUsername = (username: string): boolean => {
    const re = /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]*$/;
    return re.test(String(username).toLowerCase());
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setUsername(username);
    if(!validateUsername(username)) {
      setUsernameError('닉네임은 한글, 영어(대소문자), 숫자와 _ 만 사용 가능합니다.')
    } else {
      setUsernameError('');
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
    } else {
      setEmailError('');
    }
  };

  const handleSendCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) {
      showFeedback('오류', '이메일을 입력하세요.');
      return;
    }

    setIsCodeLoading(true);
    try {
      const response = await axios.post('https://www.chogeumbi.kr/api/v1/auth/signup/mail-send', { email });
      if (response.status === 200) {
        setIsCodeSent(true);
        setTimeLeft(300);
        showFeedback('성공', '인증 코드가 이메일로 발송되었습니다.');
      }
    } catch (error) {
      showFeedback('오류', '이메일 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCodeLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCodeLoading(true);
    try {
      const response = await axios.post('https://www.chogeumbi.kr/api/v1/auth/signup/mail-check', {
        email,
        authCode
      });

      if (response.status === 200) {
        showFeedback('성공', '이메일 인증 성공!');
        setIsEmailVerificationOpen(false);
        setIsCodeSent(false);
      }
    } catch (error) {
      showFeedback('오류', '인증 코드가 유효하지 않습니다. 다시 시도해주세요.');
    } finally {
      setIsCodeLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      showFeedback('오류', '올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!validateUsername(username)) {
      showFeedback('오류', '올바른 닉네임 형식이 아닙니다.');
      return;
    }

    if (password !== confirmPassword) {
      showFeedback('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://www.chogeumbi.kr/api/v1/auth/signup', {
        email,
        username,
        password,
        role: 'USER',
      });

      if (response.status === 201) {
        setIsWelcomeOpen(true);
      }
    } catch (error) {
      showFeedback('오류', '회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    resetState();
    onOpenChange(false);
    router.push('/');
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCodeSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsCodeSent(false);
      setIsEmailVerificationOpen(true);
      setEmail('');
      setAuthCode('');
    }

    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            resetState();
          }
          onOpenChange(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원가입</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">이메일</Label>
              <Input 
                id="signup-email" 
                type="email" 
                className="w-full" 
                value={email} 
                onChange={handleEmailChange} 
                disabled={!isEmailVerificationOpen || isCodeSent}
              />
              {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
            </div>
            {isEmailVerificationOpen && isCodeSent && (
              <div className="space-y-2">
                <Label htmlFor="verification-code">인증 코드</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={authCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
                  className="w-full"
                />
                <div className="text-right text-gray-500 text-sm">{formatTime(timeLeft)}</div>
              </div>
            )}
            {isEmailVerificationOpen && (
              <div className="flex justify-end">
                <Button onClick={isCodeSent ? handleVerifyCode : handleSendCode} disabled={isCodeLoading}>
                  {isCodeSent ? "인증 코드 확인" : "인증 코드 발송"}
                </Button>
              </div>
            )}
            {!isEmailVerificationOpen && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signup-nickname">닉네임</Label>
                  <Input 
                    id="signup-nickname" 
                    type="text"
                    className="w-full" 
                    value={username} 
                    onChange={handleUsernameChange} 
                  />
                  {usernameError && <div className="text-red-500 text-sm">{usernameError}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    className="w-full" 
                    value={password} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onCompositionStart={handleComposition}
                    onCompositionEnd={handleComposition}
                  />
                  {capsLockOn && <div className="text-yellow-500 text-sm">Caps Lock이 켜져 있습니다.</div>}
                  {isHangul && <div className="text-yellow-500 text-sm">한글 입력 모드입니다.</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                  <Input 
                    id="signup-confirm-password" 
                    type="password" 
                    className="w-full" 
                    value={confirmPassword} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onCompositionStart={handleComposition}
                    onCompositionEnd={handleComposition}
                  />
                  {capsLockOn && <div className="text-yellow-500 text-sm">Caps Lock이 켜져 있습니다.</div>}
                  {isHangul && <div className="text-yellow-500 text-sm">한글 입력 모드입니다.</div>}
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSignup} disabled={isLoading}>가입</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
  
      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>환영합니다!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>회원가입을 축하합니다! 메인 페이지로 돌아갑니다.</p>
            <div className="flex justify-end">
              <Button onClick={handleWelcomeClose}>확인</Button>
            </div>
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