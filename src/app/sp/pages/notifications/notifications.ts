import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'booking' | 'cancellation' | 'rating' | 'admin';
  read: boolean;
}

@Component({
  selector: 'app-sp-notifications',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notifications.html'
})
export class Notifications {
  notifications = signal<Notification[]>([
    {
       id: '1',
       title: 'New Booking Request',
       message: 'You have a new plumbing booking from Ali Khan.',
       date: new Date(Date.now() - 3600000),
       type: 'booking',
       read: false
    },
    {
       id: '2',
       title: 'Booking Cancelled',
       message: 'Booking #B-1002 has been cancelled by the customer.',
       date: new Date(Date.now() - 86400000),
       type: 'cancellation',
       read: true
    },
    {
       id: '3',
       title: 'New Rating Received',
       message: 'Ayesha Tariq left a 5-star rating and a review.',
       date: new Date(Date.now() - 172800000),
       type: 'rating',
       read: true
    },
    {
       id: '4',
       title: 'Admin Message',
       message: 'Your profile has been approved. You are now visible to customers.',
       date: new Date(Date.now() - 259200000),
       type: 'admin',
       read: true
    }
  ]);

  getIcon(type: string): string {
    switch (type) {
      case 'booking': return 'bi-calendar-plus text-primary';
      case 'cancellation': return 'bi-calendar-x text-danger';
      case 'rating': return 'bi-star-fill text-warning';
      case 'admin': return 'bi-info-circle text-info';
      default: return 'bi-bell text-secondary';
    }
  }

  markAllRead(): void {
    const updated = this.notifications().map(n => ({...n, read: true}));
    this.notifications.set(updated);
  }
}
