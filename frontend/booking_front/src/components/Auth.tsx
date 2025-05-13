import React, { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin ? `${API_BASE_URL}/api/auth/login/` : `${API_BASE_URL}/api/auth/register/`;
      console.log('Sending request to:', url);
      console.log('Request data:', { username, password });
      
      const response = await axios({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          username,
          password
        },
        timeout: 10000
      });

      console.log('Response:', response);

      if (isLogin) {
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          window.location.href = '/';
        } else {
          throw new Error('Токен не получен');
        }
      } else {
        // После регистрации автоматически входим
        await handleSubmit(e);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      if (axios.isAxiosError(err)) {
        console.error('Request details:', {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });

        if (err.code === 'ECONNABORTED') {
          setError('Превышено время ожидания ответа от сервера');
        } else if (err.response?.status === 400) {
          setError(err.response.data.detail || 'Неверные данные');
        } else if (err.response?.status === 401) {
          setError('Неверное имя пользователя или пароль');
        } else if (err.response?.status === 403) {
          setError('Доступ запрещен');
        } else if (err.response?.status === 404) {
          setError('Сервер не найден');
        } else if (err.response?.status === 500) {
          setError('Ошибка сервера');
        } else {
          setError('Ошибка сети. Проверьте подключение к интернету');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {isLogin ? 'Вход' : 'Регистрация'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Имя пользователя"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth; 