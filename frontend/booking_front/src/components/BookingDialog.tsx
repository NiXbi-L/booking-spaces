import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { format, addMinutes, isWithinInterval } from 'date-fns';
import { Space, Booking } from '../types';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedSpace: Space | null;
  bookings: Booking[];
  onBookingCreate: (bookingData: Omit<Booking, 'id' | 'user'>) => Promise<void>;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  selectedDate,
  selectedSpace,
  bookings,
  onBookingCreate,
}) => {
  const [duration, setDuration] = useState('01:00');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const isTimeSlotAvailable = (time: string) => {
    if (!selectedDate) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hours, minutes, 0, 0);
    const [durationHours, durationMinutes] = duration.split(':').map(Number);
    const totalDurationMinutes = durationHours * 60 + durationMinutes;
    const slotEnd = addMinutes(slotStart, totalDurationMinutes);

    return !bookings.some((booking) => {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = addMinutes(bookingStart, booking.duration);
      return (
        isWithinInterval(slotStart, { start: bookingStart, end: bookingEnd }) ||
        isWithinInterval(slotEnd, { start: bookingStart, end: bookingEnd })
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSpace) return;

    const [hours, minutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    const [durationHours, durationMinutes] = duration.split(':').map(Number);
    const totalDurationMinutes = durationHours * 60 + durationMinutes;

    await onBookingCreate({
      space: selectedSpace.id,
      start_time: startDateTime.toISOString(),
      duration: totalDurationMinutes,
      description,
    });

    onClose();
  };

  const calculateEndTime = () => {
    if (!selectedDate || !startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    const [durationHours, durationMinutes] = duration.split(':').map(Number);
    const totalDurationMinutes = durationHours * 60 + durationMinutes;
    const endDateTime = addMinutes(startDateTime, totalDurationMinutes);
    
    return format(endDateTime, 'HH:mm');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создание бронирования</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Дата: {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : 'Дата не выбрана'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Пространство: {selectedSpace?.name || 'Пространство не выбрано'}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Время начала</InputLabel>
            <Select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              label="Время начала"
            >
              {generateTimeSlots().map((time) => (
                <MenuItem
                  key={time}
                  value={time}
                  disabled={!isTimeSlotAvailable(time)}
                >
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Продолжительность"
            type="time"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            sx={{ mt: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Время окончания: {calculateEndTime()}
          </Typography>

          <TextField
            fullWidth
            label="Описание (необязательно)"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedDate || !selectedSpace}
        >
          Создать бронирование
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog; 