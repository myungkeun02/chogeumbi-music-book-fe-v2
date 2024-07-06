import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://www.chogeumbi.kr/api/v1/user/info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('https://www.chogeumbi.kr/api/v1/auth/login', {
        email,
        password
      });
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
        await fetchUser();  // 로그인 성공 후 즉시 사용자 정보를 가져옵니다.
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
  };

  return { user, login, logout, loading, fetchUser };
}