import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  DialogActions,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addHours, parseISO, isSameDay, addMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';

interface Space {
  id: number;
  name: string;
  description: string;
  image: string;
  work_start?: string;
  work_end?: string;
}

interface Booking {
  id: number;
  space: number;
  start_time: string;
  duration: number;
  description: string;
}

const Calendar: React.FC = () => {
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [openSpacesDialog, setOpenSpacesDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [startTime, setStartTime] = useState('00:00');
  const [duration, setDuration] = useState('01:00');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSpaces();
    fetchMyBookings();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/spaces/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSpaces(response.data);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Ошибка при загрузке пространств');
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/my/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      console.log('My bookings response:', response.data);
      setMyBookings(response.data);
    } catch (err) {
      console.error('Error fetching my bookings:', err);
      setError('Ошибка при загрузке ваших броней');
    }
  };

  const getSpaceById = (spaceId: number): Space | undefined => {
    return spaces.find(space => space.id === spaceId);
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return format(addMinutes(parseISO(startTime), totalMinutes), "yyyy-MM-dd'T'HH:mm:ssXXX");
  };

  const handleDeleteBooking = async (bookingId: number) => {
    setDeleteBookingId(bookingId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (!deleteBookingId) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${deleteBookingId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setMyBookings(myBookings.filter(booking => booking.id !== deleteBookingId));
      if (selectedSpace) {
        const dateStr = format(selectedDate!, 'yyyy-MM-dd');
        const response = await axios.get(`${API_BASE_URL}/api/spaces/${selectedSpace.id}/bookings/?date=${dateStr}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setBookings(response.data);
      }
      setDeleteConfirmOpen(false);
      setDeleteBookingId(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Ошибка при удалении брони');
    }
  };

  const handleDateSelect = async (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setOpenSpacesDialog(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/spaces/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSpaces(response.data);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Ошибка при загрузке пространств');
    }
  };

  const handleSpaceSelect = async (space: Space) => {
    setSelectedSpace(space);
    setOpenSpacesDialog(false);
    setOpenBookingDialog(true);
    try {
      const dateStr = format(selectedDate!, 'yyyy-MM-dd');
      const response = await axios.get(`${API_BASE_URL}/api/spaces/${space.id}/bookings/?date=${dateStr}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Ошибка при загрузке броней');
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedSpace || !selectedDate) return;

    try {
      const startDateTime = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`);
      const [hours, minutes] = duration.split(':').map(Number);
      const totalDurationMinutes = hours * 60 + minutes;

      if (startDateTime < new Date()) {
        setError('Нельзя создать бронь в прошлом');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/bookings/`, {
        space: selectedSpace.id,
        start_time: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        duration: totalDurationMinutes,
        description: description || '-'
      }, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setBookings([...bookings, response.data]);
      setMyBookings([...myBookings, response.data]);
      setOpenBookingDialog(false);
      setError('');
      setDescription('');
    } catch (err) {
      console.error('Error creating booking:', err);
      if (axios.isAxiosError(err) && err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else {
        setError('Ошибка при создании брони');
      }
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}/media/${imageUrl}`;
  };

  const isMyBooking = (booking: Booking) => {
    return myBookings.some(myBooking => myBooking.id === booking.id);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: { xs: 1, sm: 2, md: 3 }, bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: 'primary.main' }}>
          Календарь бронирований
        </Typography>

        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Календарь" />
          <Tab label="Мои брони" />
        </Tabs>

        {activeTab === 0 ? (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateSelect}
                sx={{ 
                  width: '100%',
                  maxWidth: isMobile ? '100%' : 600,
                  '& .MuiPickersCalendarHeader-root': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2
                  },
                  '& .MuiPickersDay-root': {
                    width: isMobile ? 36 : 48,
                    height: isMobile ? 36 : 48,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>Мои брони:</Typography>
            {myBookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                У вас пока нет броней
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {myBookings.map((booking) => {
                  const space = getSpaceById(booking.space);
                  const endTime = calculateEndTime(booking.start_time, `${Math.floor(booking.duration / 60)}:${(booking.duration % 60).toString().padStart(2, '0')}`);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {space?.name || 'Загрузка...'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {format(parseISO(booking.start_time), 'dd.MM.yyyy HH:mm')} - 
                                {format(parseISO(endTime), 'HH:mm')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {booking.description}
                              </Typography>
                            </Box>
                            <IconButton 
                              onClick={() => handleDeleteBooking(booking.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={openSpacesDialog} onClose={() => setOpenSpacesDialog(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ textAlign: 'center' }}>Выберите пространство</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {spaces.map((space) => (
              <Grid item xs={12} sm={6} md={4} key={space.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => handleSpaceSelect(space)}
                >
                  {space.image && (
                    <CardMedia
                      component="img"
                      height={isMobile ? 160 : 200}
                      image={getImageUrl(space.image)}
                      alt={space.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
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
        </DialogContent>
      </Dialog>

      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Бронирование {selectedSpace?.name} на {selectedDate && format(selectedDate, 'dd.MM.yyyy')}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Занятое время:</Typography>
            {bookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                На этот день нет броней
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {bookings.map((booking) => {
                  const startTime = format(parseISO(booking.start_time), 'HH:mm');
                  const endTime = format(parseISO(calculateEndTime(booking.start_time, `${Math.floor(booking.duration / 60)}:${(booking.duration % 60).toString().padStart(2, '0')}`)), 'HH:mm');
                  const isMyBookingItem = isMyBooking(booking);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                      <Paper 
                        elevation={2}
                        sx={{ 
                          p: 1.5,
                          bgcolor: isMyBookingItem ? 'primary.light' : 'error.light',
                          color: isMyBookingItem ? 'primary.contrastText' : 'error.contrastText',
                          textAlign: 'center',
                          borderRadius: 1,
                          position: 'relative',
                          cursor: isMyBookingItem ? 'pointer' : 'default',
                          '&:hover': isMyBookingItem ? {
                            bgcolor: 'primary.main',
                          } : {}
                        }}
                        onClick={() => isMyBookingItem && handleDeleteBooking(booking.id)}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {startTime} - {endTime}
                        </Typography>
                        {isMyBookingItem && (
                          <Tooltip title="Нажмите, чтобы удалить">
                            <DeleteIcon sx={{ 
                              position: 'absolute', 
                              top: 4, 
                              right: 4, 
                              fontSize: 16 
                            }} />
                          </Tooltip>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2, 
            mb: 2 
          }}>
            <TextField
              label="Время начала"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              sx={{ width: isMobile ? '100%' : '50%' }}
            />
            <TextField
              label="Продолжительность"
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              sx={{ width: isMobile ? '100%' : '50%' }}
            />
          </Box>

          <TextField
            label="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Время окончания: {selectedDate && startTime && duration && 
              format(addMinutes(parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`), 
                parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1])), 'HH:mm')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenBookingDialog(false)}
            variant="outlined"
            fullWidth={isMobile}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleCreateBooking} 
            variant="contained" 
            color="primary"
            fullWidth={isMobile}
          >
            Забронировать
          </Button>
        </DialogActions>
      </Dialog>
      {/* Диалог подтверждения удаления брони */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту бронь?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={confirmDeleteBooking} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;

export const handleCreateBooking = async ({
  selectedSpace,
  selectedDate,
  startTime,
  duration,
  description,
  token,
  setBookings,
  setMyBookings,
  setOpenBookingDialog,
  setError,
  setDescription
}: any) => {
  if (!selectedSpace || !selectedDate) return;
  try {
    const startDateTime = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`);
    const [hours, minutes] = duration.split(':').map(Number);
    const totalDurationMinutes = hours * 60 + minutes;
    if (startDateTime < new Date()) {
      setError('Нельзя создать бронь в прошлом');
      return;
    }
    const response = await axios.post(`${API_BASE_URL}/api/bookings/`, {
      space: selectedSpace.id,
      start_time: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      duration: totalDurationMinutes,
      description: description || '-'
    }, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    setBookings((prev: any) => [...prev, response.data]);
    setMyBookings((prev: any) => [...prev, response.data]);
    setOpenBookingDialog(false);
    setError('');
    setDescription('');
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.non_field_errors) {
      setError(err.response.data.non_field_errors[0]);
    } else {
      setError('Ошибка при создании брони');
    }
  }
};

export const handleDeleteBooking = async ({
  bookingId,
  token,
  setMyBookings,
  setBookings,
  selectedSpace,
  selectedDate,
  setError
}: any) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    setMyBookings((prev: any) => prev.filter((booking: any) => booking.id !== bookingId));
    if (selectedSpace && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.get(`${API_BASE_URL}/api/spaces/${selectedSpace.id}/bookings/?date=${dateStr}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setBookings(response.data);
    }
  } catch (err) {
    setError('Ошибка при удалении брони');
  }
};

export const calculateEndTime = (startTime: string, duration: string): string => {
  const [hours, minutes] = duration.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return format(addMinutes(parseISO(startTime), totalMinutes), "yyyy-MM-dd'T'HH:mm:ssXXX");
}; 