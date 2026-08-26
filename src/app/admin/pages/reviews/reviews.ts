import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { Rating, Review } from '../../../core/models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating';
import { AvatarInitialsComponent } from '../../../shared/components/avatar-initials/avatar-initials';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [StarRatingComponent, AvatarInitialsComponent, FormsModule, DatePipe],
  templateUrl: './reviews.html',
})
export class ReviewsComponent implements OnInit {
  ratings = signal<Rating[]>([]);
  allReviews = signal<Review[]>([]);
  reviews = signal<Review[]>([]);
  activeFilter = signal<string>('All');

  constructor(
    private reviewService: ReviewService,
    private confirmationModalService: ConfirmationModalService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reviewService.getRatings().subscribe(data => this.ratings.set(data));
    this.reviewService.getReviews().subscribe(data => {
      this.allReviews.set(data);
      this.applyFilter();
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  applyFilter(): void {
    const filter = this.activeFilter();
    let result = this.allReviews();
    
    if (filter === '5 Stars') result = result.filter(r => r.stars === 5 && r.status !== 'Removed');
    if (filter === '1-4 Stars') result = result.filter(r => r.stars < 5 && r.status !== 'Removed');
    if (filter === 'Hidden') result = result.filter(r => r.status === 'Hidden');
    if (filter === 'Audit Log (Removed)') result = result.filter(r => r.status === 'Removed');
    if (filter === 'All') result = result.filter(r => r.status !== 'Removed');
    
    this.reviews.set(result);
  }

  toggleReviewStatus(review: Review): void {
    const newStatus = review.status === 'Published' ? 'Hidden' : 'Published';
    this.reviewService.updateReview({ ...review, status: newStatus }).subscribe(() => {
      this.toastService.show(`Review is now ${newStatus.toLowerCase()}.`, 'success');
      this.loadData();
    });
  }

  async deleteReview(review: Review): Promise<void> {
    const confirmed = await this.confirmationModalService.confirm({
      title: 'Remove Review',
      message: `Are you sure you want to remove the review by <strong>${review.customer}</strong>? This will log it for audit.`,
      confirmText: 'Remove Review',
      confirmColor: 'danger'
    });

    if (confirmed) {
      this.reviewService.updateReview({ 
        ...review, 
        status: 'Removed', 
        removedAt: new Date().toLocaleString() 
      }).subscribe(() => {
        this.toastService.show('Review removed and logged for audit.', 'success');
        this.loadData();
      });
    }
  }
}
