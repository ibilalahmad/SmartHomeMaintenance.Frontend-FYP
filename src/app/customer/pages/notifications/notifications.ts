import { Component } from '@angular/core';

@Component({
  selector: 'app-cust-notifications',
  standalone: true,
  templateUrl: './notifications.html'
})
export class Notifications {
  readonly notifs = [
    { id: 1, title: 'Booking Confirmed', message: 'Your booking with Volt Masters has been confirmed.', time: '2 hours ago', icon: 'bi-calendar-check', color: 'var(--green)' },
    { id: 2, title: 'Provider Arrived', message: 'Imran Plumbing Co. is now In Progress at your location.', time: '1 day ago', icon: 'bi-truck', color: 'var(--purple)' },
    { id: 3, title: 'Payment Pending', message: 'Please complete your payment for booking BK-9002.', time: '3 days ago', icon: 'bi-cash-stack', color: 'var(--amber)' },
    { id: 4, title: 'Welcome to SHMS', message: 'Thanks for joining! Find the best service providers today.', time: '1 week ago', icon: 'bi-party-popper', color: 'var(--primary)' }
  ];
}
