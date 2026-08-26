import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rating, Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {

  private ratings: Rating[] = [
    { name: 'Imran Plumbing Co.',    rating: 4.8, count: 212 },
    { name: 'Volt Masters',          rating: 4.7, count:  98 },
    { name: 'Bright Spark Electric', rating: 4.6, count: 154 },
    { name: 'CleanPro Sanitary',     rating: 4.3, count:  76 },
    { name: 'QuickFix Repairs',      rating: 3.1, count:  41 },
  ];

  private reviews: Review[] = [
    { id: '1', customer: 'Ayesha Noor',   provider: 'Imran Plumbing Co.',    stars: 5, text: 'Fixed the leakage quickly and left everything clean. Very professional.', status: 'Published', date: 'Jul 10, 2026'     },
    { id: '2', customer: 'Sara Khan',     provider: 'CleanPro Sanitary',     stars: 4, text: 'Good work overall, arrived a little later than the scheduled time.', status: 'Published', date: 'Jul 8, 2026'           },
    { id: '3', customer: 'Fatima Malik',  provider: 'Volt Masters',          stars: 5, text: 'Excellent AC installation, explained the whole process clearly.', status: 'Published', date: 'Jul 5, 2026'               },
    { id: '4', customer: 'Waqas Hussain', provider: 'QuickFix Repairs',      stars: 2, text: 'Job was incomplete, had to call another provider to finish it.', status: 'Published', date: 'Jul 1, 2026'                },
  ];

  getRatings(): Observable<Rating[]> { return of(this.ratings); }
  getReviews(): Observable<Review[]> { return of(this.reviews); }

  updateReview(updatedReview: Review): Observable<Review> {
    const index = this.reviews.findIndex(r => r.id === updatedReview.id);
    if (index !== -1) {
      this.reviews[index] = { ...updatedReview };
    }
    return of(updatedReview);
  }

  deleteReview(id: string): Observable<boolean> {
    this.reviews = this.reviews.filter(r => r.id !== id);
    return of(true);
  }
}
