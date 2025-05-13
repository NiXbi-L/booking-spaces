export interface User {
  username: string;
  password: string;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Booking {
  id: number;
  space: number;
  start_time: string;
  duration: number;
  description: string;
  user: number;
}

export interface AuthResponse {
  token: string;
} 