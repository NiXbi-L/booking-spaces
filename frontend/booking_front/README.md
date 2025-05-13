# Booking System Frontend

A React-based frontend for a space booking system. This application allows users to book spaces, view available time slots, and manage their bookings.

## Features

- User authentication (login/register)
- Calendar view for booking management
- Space listing and details
- Responsive design for mobile and desktop
- Real-time availability checking
- Booking creation with duration selection

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:8000

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

```
src/
  ├── components/         # React components
  ├── contexts/          # React contexts
  ├── services/          # API services
  ├── types/             # TypeScript types
  ├── App.tsx           # Main App component
  └── index.tsx         # Entry point
```

## API Integration

The application expects the following API endpoints:

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/spaces/` - Get all spaces
- `GET /api/spaces/{id}/bookings/` - Get bookings for a space
- `POST /api/bookings/` - Create a booking
- `DELETE /api/bookings/{id}/` - Delete a booking

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Axios
- date-fns 