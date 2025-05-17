import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(API_URL.replace('/api', ''));
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinEvent(eventId: string) {
    if (this.socket) {
      this.socket.emit('joinEvent', eventId);
    }
  }

  leaveEvent(eventId: string) {
    if (this.socket) {
      this.socket.emit('leaveEvent', eventId);
    }
  }

  onBookingUpdate(callback: (data: { eventId: string; bookedCount: number; capacity: number }) => void) {
    if (this.socket) {
      this.socket.on('bookingUpdate', callback);
    }
  }

  removeBookingUpdateListener() {
    if (this.socket) {
      this.socket.off('bookingUpdate');
    }
  }
}

export const socketService = new SocketService();
export default socketService;