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

      if (isLogin) {
        if (response.data && response.data.token) {
          await login(username, password);
        } else {
          throw new Error('Токен не получен');
        }
      } else {
        // После успешной регистрации сразу логиним пользователя
        await login(username, password);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Превышено время ожидания ответа от сервера');
        } else if (err.response?.status === 400) {
          if (err.response.data?.username) {
            setError(Array.isArray(err.response.data.username) ? err.response.data.username[0] : err.response.data.username);
          } else if (err.response.data?.detail) {
            setError(err.response.data.detail);
          } else {
            setError('Неверные данные');
          }
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