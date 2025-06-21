import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardMedia,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

interface Space {
  id: number;
  name: string;
  description: string;
  image: string;
  work_start?: string;
  work_end?: string;
}

const Spaces: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/spaces/`);
        console.log('Spaces response:', response.data);
        setSpaces(response.data);
      } catch (err) {
        console.error('Error fetching spaces:', err);
        setError('Ошибка при загрузке пространств');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}/media/${imageUrl}`;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Доступные пространства
      </Typography>
      <Grid container spacing={3}>
        {spaces.map((space) => (
          <Grid item xs={12} sm={6} md={4} key={space.id}>
            <Card 
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => navigate(`/spaces/${space.id}`)}
            >
              {space.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(space.image)}
                  alt={space.name}
                  sx={{ 
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5'
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {space.name}
                </Typography>
                {space.work_start && space.work_end && (
                  <Typography variant="body2" color="text.secondary">
                    Часы работы: {space.work_start} — {space.work_end}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Spaces; 