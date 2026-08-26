import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'grey';

const STATUS_MAP: Record<string, BadgeTone> = {
  'Active':       'green',
  'Completed':    'green',
  'Resolved':     'green',
  'Available':    'green',
  'Pending':      'amber',
  'Confirmed':    'amber',
  'In Review':    'amber',
  'Blocked':      'red',
  'Cancelled':    'red',
  'Dismissed':    'grey',
  'In Progress':  'blue',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.html',
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  get tone(): BadgeTone {
    return STATUS_MAP[this.status()] ?? 'grey';
  }
}
