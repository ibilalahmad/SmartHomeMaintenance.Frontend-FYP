import { Component, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { Rating } from '../../../core/models/review.model';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [StatCardComponent, StarRatingComponent, AvatarInitialsComponent],
  templateUrl: './reports.html',
})
export class ReportsComponent implements OnInit {
  topProviders = signal<Rating[]>([]);

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getRatings().subscribe(data =>
      this.topProviders.set(data.slice(0, 4))
    );
  }
}
