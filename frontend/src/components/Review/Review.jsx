import React from 'react';
import './Review.css';

const reviews = [
  { name: "Priya Mehta", rating: 5, stars: " ", comment: "Loved how the site breaks down destinations with real budget details! It helped me plan my Manali trip perfectly." },
  { name: "Rohit Verma", rating: 4, stars: " ", comment: "Informative and beautifully written. I just wish there were more photos for smaller towns." },
  { name: "Sneha Patel", rating: 5, stars: " ", comment: "The activities section is so helpful! I didn’t know there were so many offbeat options in Goa until I read this." }, { name: "Aman Khanna", rating: 5, stars: " ", comment: "Very neat layout and clear travel costs. Makes trip planning super easy even for beginners." }, { name: "Kavita Singh", rating: 4, stars: " ", comment: "Nice content with practical details. Maybe add a section for local food suggestions too!" }, { name: "Riya Sharma", rating: 5, stars: " ", comment: "The blog feels like talking to a friend who’s been everywhere! Totally loved the Rajasthan post." }, { name: "Neeraj Joshi", rating: 4, stars: " ", comment: "Simple, useful, and easy to navigate. Perfect for backpackers looking for budget travel tips." }, { name: "Divya Kapoor", rating: 5, stars: " ", comment: "Each article feels personalized and honest. I found great spots in Kerala I hadn’t seen on big travel sites." }, { name: "Mohit Agarwal", rating: 5, stars: " ", comment: "Great balance of photos, facts, and personal experiences. A must-follow for travel enthusiasts." }, { name: "Anjali Rana", rating: 4, stars: " ", comment: "I really liked the layout and the trip budgets. Just a small suggestion — add more weekend getaway options!" }, { name: "Saurabh Mishra", rating: 5, stars: " ", comment: "Very genuine reviews and activity suggestions. Loved the trekking guide — well explained!" }, { name: "Aishwarya Nair", rating: 5, stars: " ", comment: "The blog feels authentic, not commercial. I trust the recommendations here more than influencer pages." }, { name: "Aditya Kumar", rating: 4, stars: " ", comment: "Good info, but sometimes the text loads slowly on mobile. Otherwise, it’s a solid 4.5-star blog!" }, { name: "Tanya Chauhan", rating: 5, stars: " ", comment: "I’m amazed by how clearly the budgets are broken down. Great resource for students and solo travelers." }, { name: "Harshita Dey", rating: 5, stars: " ", comment: "Brilliantly curated travel guide! Covers destinations, culture, and tips all in one place." }];

const StarRating = ({ rating }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
    ))}
  </div>
);

const Review = () => {
  return (
    <div className="reviews-container">
      <h1 className="title">Travel Reviews</h1>
      <div className="reviews-grid">
        {reviews.map((review, idx) => (
          <div key={idx} className="review-card">
            <StarRating rating={review.rating} />
            <p className="review-text">“{review.comment}”</p>
            <p className="review-author">– {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
