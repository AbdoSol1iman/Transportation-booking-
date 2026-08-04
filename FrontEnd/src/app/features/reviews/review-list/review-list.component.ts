import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ReviewService, Review } from '../../../core/services/review.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
})
export class ReviewListComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private cdr = inject(ChangeDetectorRef);

  reviews: Review[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reviewService.getReviews().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.reviews = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'تعذر تحميل التقييمات من السيرفر.';
        this.cdr.detectChanges();
      },
    });
  }

  getUserName(review: Review): string {
    if (typeof review.userId === 'object' && review.userId?.fullName) {
      return review.userId.fullName;
    }
    return 'مسافر مسجل';
  }

  getTripTitle(review: Review): string {
    if (typeof review.tripId === 'object' && review.tripId?.routeId) {
      const route = review.tripId.routeId;
      if (typeof route === 'object') {
        const start = route.startStationId?.name || route.startStationId?.city || 'محطة القيام';
        const end = route.endStationId?.name || route.endStationId?.city || 'محطة الوصول';
        return `رحلة ${start} ← ${end}`;
      }
    }
    return 'رحلة مؤكدة';
  }
}
