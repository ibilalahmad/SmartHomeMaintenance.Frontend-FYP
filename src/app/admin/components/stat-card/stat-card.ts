import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
})
export class StatCardComponent {
  readonly icon       = input.required<string>();  // Bootstrap icon class e.g. "bi-person-badge"
  readonly label      = input.required<string>();  // Card label
  readonly value      = input.required<string>();  // Displayed value
  readonly trend      = input<string>('');         // Trend text
  readonly trendClass = input<string>('');         // "stat-trend--up" | "stat-trend--down" | ""
  readonly iconClass  = input.required<string>();  // "stat-icon--blue" | "stat-icon--teal" etc.
}
