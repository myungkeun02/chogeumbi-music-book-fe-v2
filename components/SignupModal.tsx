import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";

interface SignupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignupModal({ isOpen, onOpenChange }: SignupModalProps) {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState<boolean>(true);
  const [authCode, setAuthCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const router = useRouter();

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
      setEmailError("이메일을 입력하세요.");
      return;
    }

    setIsCodeLoading(true);
    try {
      const response = await axios.post('https://www.chogeumbi.kr/api/v1/auth/signup/mail-send', { email });
      if (response.status === 200) {
        setIsCodeSent(true);
        setTimeLeft(300); // Reset the timer
        alert('인증 코드가 이메일로 발송되었습니다.');
      }
    } catch (error) {
      setEmailError('이메일 발송에 실패했습니다. 다시 시도해주세요.');
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
        alert('이메일 인증 성공!');
        setIsEmailVerificationOpen(false);
        setIsCodeSent(false);  // 인증 코드 입력 필드를 숨기기 위해 추가
      }
    } catch (error) {
      setVerificationError('인증 코드가 유효하지 않습니다. 다시 시도해주세요.');
      console.log(error)
    } finally {
      setIsCodeLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!validateUsername(username)) {
        setUsernameError('올바른 닉네임 형식이 아닙니다.');
        return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
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
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false);
    onOpenChange(false);
    router.push('/');
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                {isCodeSent ? "인증코드 발송" : "인증 코드 발송"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="signup-email">이메일</Label>
            <Input 
              id="signup-email" 
              type="email" 
              className="w-full" 
              value={email} 
              onChange={handleEmailChange} 
              disabled={!isEmailVerificationOpen}
            />
            {emailError && <div className="text-red-500">{emailError}</div>}
          </div>
          {isEmailVerificationOpen && isCodeSent && (
            <div>
              <Label htmlFor="verification-code">인증 코드</Label>
              <Input
                id="verification-code"
                type="text"
                value={authCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
                className="w-full"
              />
              {verificationError && <div className="text-red-500">{verificationError}</div>}
              <div className="text-right text-gray-500">{formatTime(timeLeft)}</div>
            </div>
          )}
          {isEmailVerificationOpen && (
            <div className="flex justify-end mt-4">
              <Button onClick={isCodeSent ? handleVerifyCode : handleSendCode} disabled={isCodeLoading}>
                {isCodeSent ? "인증 코드 확인" : "인증 코드 발송"}
              </Button>
            </div>
          )}
          {!isEmailVerificationOpen && (
            <>
              <div>
                <Label htmlFor="signup-nickname">닉네임</Label>
                <Input 
                  id="signup-nickname" 
                  type="text"
                  className="w-full" 
                  value={username} 
                  onChange={handleUsernameChange} 
                />
                {usernameError && <div className="text-red-500">{usernameError}</div>}
              </div>
              <div>
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  className="w-full" 
                  value={password} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                <Input 
                  id="signup-confirm-password" 
                  type="password" 
                  className="w-full" 
                  value={confirmPassword} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-end mt-4">
                <Button onClick={handleSignup} disabled={isLoading}>가입</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>환영합니다!</DialogTitle>
          </DialogHeader>
          <div>
            회원가입을 축하합니다! 메인 페이지로 돌아갑니다.
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleWelcomeClose}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}



// todo: 백엔드에서 이메일 중복, 닉네임 중복 api 만들기