import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.html',
})
export class StarRatingComponent {
  readonly rating = input.required<number>();

  /** Array of 5 booleans: true = filled star */
  readonly stars = computed<boolean[]>(() =>
    Array.from({ length: 5 }, (_, i) => i < Math.round(this.rating()))
  );
}
