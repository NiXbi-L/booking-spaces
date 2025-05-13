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
  const [duration, setDuration] = useState(60);
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
    const slotEnd = addMinutes(slotStart, duration);

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

    await onBookingCreate({
      space: selectedSpace.id,
      start_time: startDateTime.toISOString(),
      duration,
      description,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Booking</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Date: {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Space: {selectedSpace?.name || 'No space selected'}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Start Time</InputLabel>
            <Select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              label="Start Time"
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Duration (minutes)</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              label="Duration (minutes)"
            >
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={90}>1.5 hours</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedDate || !selectedSpace}
        >
          Create Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog; 