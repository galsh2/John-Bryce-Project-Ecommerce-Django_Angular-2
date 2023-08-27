import { Component, OnInit } from '@angular/core';
import { Review, ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit{
  review: Partial<Review> = {}; // This is to hold the review data
  reviews: any[] = [];
  
  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewOrders().subscribe(data => {
      this.reviews = data;
      // console.log(data);
    });
  }

  addReview(review: any): void {
    this.reviewService.createReview(review).subscribe(() => {
      this.loadReviews();
    });
  }
  postReview(): void {
    if (this.review.product && this.review.rating && this.review.content) {
      this.reviewService.createReview(this.review).subscribe(
        response => {
          console.log('Review posted successfully!', response);
          console.log((response));
          
          // Handle success response, maybe show a success message
        },
        error => {
          console.log(this.review);
          
          console.error('Error posting review', error);
          // Handle error response, maybe show an error message
        }
      );
    } else {
      console.error('All fields are required!');
      // Maybe show a warning message
    }
  }

  editReview(id: number, review: any): void {
    this.reviewService.updateReview(id, review).subscribe(() => {
      this.loadReviews();
    });
  }

  deleteReview(id: number): void {
    this.reviewService.deleteReview(id).subscribe(() => {
      this.loadReviews();
    });
  }
}
