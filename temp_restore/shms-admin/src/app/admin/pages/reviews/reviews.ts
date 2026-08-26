import { Component, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { Rating, Review } from '../../../core/models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [StarRatingComponent, AvatarInitialsComponent],
  templateUrl: './reviews.html',
})
export class ReviewsComponent implements OnInit {
  ratings = signal<Rating[]>([]);
  reviews = signal<Review[]>([]);

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getRatings().subscribe(data => this.ratings.set(data));
    this.reviewService.getReviews().subscribe(data => this.reviews.set(data));
  }
}
