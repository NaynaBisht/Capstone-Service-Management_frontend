export interface BookingApiResponse {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  scheduledDate: string; // ISO string
  timeSlot: string;      // SLOT_9_11
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}