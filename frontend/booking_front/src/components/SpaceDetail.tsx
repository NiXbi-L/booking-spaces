import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Card, CardMedia, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Paper, Tooltip, IconButton } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import BookingDialog from './BookingDialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { format, addMinutes, parseISO } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';

interface Space {
  id: number;
  name: string;
  description: string;
  image: string;
  work_start: string;
  work_end: string;
}

const SpaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const { token, isSuperuser } = useAuth();
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('01:00');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [adminBookingsOpen, setAdminBookingsOpen] = useState(false);
  const [adminBookingsDate, setAdminBookingsDate] = useState<Date | null>(null);
  const [adminBookings, setAdminBookings] = useState<any[]>([]);
  const [adminBookingsLoading, setAdminBookingsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);
  const [adminDeleteConfirmOpen, setAdminDeleteConfirmOpen] = useState(false);
  const [adminDeleteBookingId, setAdminDeleteBookingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/spaces/${id}/`);
        setSpace(response.data);
      } catch (err) {
        setError('Ошибка при загрузке пространства');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    // Загрузка своих броней
    const fetchMyBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings/my/`, {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        });
        // Сортировка броней по времени начала (от ранних к поздним)
        const sortedBookings = response.data.sort((a: any, b: any) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setMyBookings(sortedBookings);
      } catch (err) {
        // ignore
      }
    };
    fetchMyBookings();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBookClick = () => setCalendarOpen(true);
  const handleBookingDialogClose = () => setBookingDialogOpen(false);

  const handleDateSelect = async (date: Date | null) => {
    setSelectedDate(date);
    setCalendarOpen(false);
    if (date && space?.id) {
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const response = await axios.get(`${API_BASE_URL}/api/spaces/${space.id}/bookings/?date=${dateStr}`, {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        });
        // Сортировка броней по времени начала (от ранних к поздним)
        const sortedBookings = response.data.sort((a: any, b: any) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setBookings(sortedBookings);
      } catch (err) {
        setBookings([]);
      }
    } else {
      setBookings([]);
    }
    setBookingDialogOpen(true);
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    const [hours, minutes] = duration.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return format(addMinutes(parseISO(startTime), totalMinutes), "yyyy-MM-dd'T'HH:mm:ssXXX");
  };

  const handleCreateBooking = async () => {
    if (!space || !selectedDate) return;
    try {
      const startDateTime = parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}`);
      const [hours, minutes] = duration.split(':').map(Number);
      const totalDurationMinutes = hours * 60 + minutes;
      if (startDateTime < new Date()) {
        setBookingError('Нельзя создать бронь в прошлом');
        return;
      }
      await axios.post(`${API_BASE_URL}/api/bookings/`, {
        space: space.id,
        start_time: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        duration: totalDurationMinutes,
        description: description || '-'
      }, {
        headers: token ? { 'Authorization': `Token ${token}` } : {}
      });
      setBookingDialogOpen(false);
      setBookingError('');
      setDescription('');
      // обновить список броней на дату
      if (selectedDate && space?.id) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await axios.get(`${API_BASE_URL}/api/spaces/${space.id}/bookings/?date=${dateStr}`, {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        });
        // Сортировка броней по времени начала (от ранних к поздним)
        const sortedBookings = response.data.sort((a: any, b: any) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setBookings(sortedBookings);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.non_field_errors) {
        setBookingError(err.response.data.non_field_errors[0]);
      } else {
        setBookingError('Ошибка при создании брони');
      }
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    setDeleteBookingId(bookingId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (!deleteBookingId) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${deleteBookingId}/`, {
        headers: token ? { 'Authorization': `Token ${token}` } : {}
      });
      setBookings(bookings.filter(b => b.id !== deleteBookingId));
      setDeleteConfirmOpen(false);
      setDeleteBookingId(null);
    } catch (err) {
      setBookingError('Ошибка при удалении брони');
    }
  };

  const isMyBooking = (booking: any) => {
    return myBookings.some((myBooking) => myBooking.id === booking.id);
  };

  const handleAdminBookingsClick = () => {
    console.log('Admin bookings button clicked');
    console.log('isSuperuser:', isSuperuser);
    setAdminBookingsOpen(true);
  };
  const handleAdminBookingsDateSelect = async (date: Date | null) => {
    setAdminBookingsDate(date);
    if (date && space?.id) {
      setAdminBookingsLoading(true);
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const response = await axios.get(`${API_BASE_URL}/api/spaces/${space.id}/bookings/?date=${dateStr}`, {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        });
        // Сортировка броней по времени начала (от ранних к поздним)
        const sortedBookings = response.data.sort((a: any, b: any) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setAdminBookings(sortedBookings);
      } catch {
        setAdminBookings([]);
      } finally {
        setAdminBookingsLoading(false);
      }
    } else {
      setAdminBookings([]);
    }
  };
  const handleAdminDeleteBooking = async (bookingId: number) => {
    setAdminDeleteBookingId(bookingId);
    setAdminDeleteConfirmOpen(true);
  };

  const confirmAdminDeleteBooking = async () => {
    if (!adminDeleteBookingId) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/bookings/${adminDeleteBookingId}/`, {
        headers: token ? { 'Authorization': `Token ${token}` } : {}
      });
      setAdminBookings(adminBookings.filter(b => b.id !== adminDeleteBookingId));
      setAdminDeleteConfirmOpen(false);
      setAdminDeleteBookingId(null);
    } catch {}
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  }
  if (error || !space) {
    return <Alert severity="error">{error || 'Пространство не найдено'}</Alert>;
  }

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mt={4}>
      <Card sx={{ minWidth: 320, maxWidth: 400 }}>
        <CardMedia
          component="img"
          height="320"
          image={space.image.startsWith('http') ? space.image : `${API_BASE_URL}/media/${space.image}`}
          alt={space.name}
          sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
        />
      </Card>
      <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>{space.name}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{space.description}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Часы работы: {space.work_start} — {space.work_end}
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" size="large" onClick={handleBookClick}>Забронировать</Button>
          {isSuperuser && (
            <Button 
              variant="outlined" 
              color="secondary" 
              size="large" 
              onClick={handleAdminBookingsClick}
              sx={{ ml: 2 }}
            >
              Просмотр бронирований
            </Button>
          )}
        </Box>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <Dialog open={calendarOpen} onClose={() => setCalendarOpen(false)}>
          <DialogTitle>Выберите дату</DialogTitle>
          <DialogContent>
            <DateCalendar value={selectedDate} onChange={handleDateSelect} />
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
      <Dialog open={bookingDialogOpen} onClose={handleBookingDialogClose} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Бронирование {space?.name} на {selectedDate && format(selectedDate, 'dd.MM.yyyy')}
        </DialogTitle>
        <DialogContent>
          {bookingError && <Alert severity="error" sx={{ mb: 2 }}>{bookingError}</Alert>}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Занятое время:</Typography>
            {bookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                На этот день нет броней
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {bookings.map((booking) => {
                  const startTimeStr = format(parseISO(booking.start_time), 'HH:mm');
                  const endTimeStr = format(parseISO(calculateEndTime(booking.start_time, `${Math.floor(booking.duration / 60)}:${(booking.duration % 60).toString().padStart(2, '0')}`)), 'HH:mm');
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
                          '&:hover': isMyBookingItem ? { bgcolor: 'primary.main' } : {}
                        }}
                        onClick={() => isMyBookingItem && handleDeleteBooking(booking.id)}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {startTimeStr} - {endTimeStr}
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
            onClick={handleBookingDialogClose}
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
      {/* Диалог для просмотра броней по дате */}
      <Dialog open={adminBookingsOpen} onClose={() => setAdminBookingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Брони на дату</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <DateCalendar value={adminBookingsDate} onChange={handleAdminBookingsDateSelect} />
          </LocalizationProvider>
          {adminBookingsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px"><CircularProgress /></Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {adminBookings.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ m: 2 }}>Нет броней на выбранную дату</Typography>
              ) : (
                adminBookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <Paper sx={{ p: 2, position: 'relative' }}>
                      <Typography variant="subtitle2">{format(parseISO(booking.start_time), 'HH:mm')} - {format(parseISO(calculateEndTime(booking.start_time, `${Math.floor(booking.duration / 60)}:${(booking.duration % 60).toString().padStart(2, '0')}`)), 'HH:mm')}</Typography>
                      <Typography variant="body2" color="text.secondary">{booking.description}</Typography>
                      {isSuperuser && (
                        <IconButton size="small" color="error" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleAdminDeleteBooking(booking.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminBookingsOpen(false)}>Закрыть</Button>
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
      {/* Диалог подтверждения удаления брони админом */}
      <Dialog open={adminDeleteConfirmOpen} onClose={() => setAdminDeleteConfirmOpen(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту бронь?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={confirmAdminDeleteBooking} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpaceDetail; 