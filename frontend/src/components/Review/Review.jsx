import React, { useState, useEffect } from 'react';

// Hardcoded reviews acting as initial starter data
const starterReviews = [
  { name: "Priya Mehta", rating: 5, comment: "Loved how the site breaks down destinations with real budget details! It helped me plan my Manali trip perfectly." },
  { name: "Rohit Verma", rating: 4, comment: "Informative and beautifully written. I just wish there were more photos for smaller towns." },
  { name: "Sneha Patel", rating: 5, comment: "The activities section is so helpful! I didn’t know there were so many offbeat options in Goa until I read this." }, 
  { name: "Aman Khanna", rating: 5, comment: "Very neat layout and clear travel costs. Makes trip planning super easy even for beginners." }, 
  { name: "Kavita Singh", rating: 4, comment: "Nice content with practical details. Maybe add a section for local food suggestions too!" }, 
  { name: "Riya Sharma", rating: 5, comment: "The blog feels like talking to a friend who’s been everywhere! Totally loved the Rajasthan post." }, 
  { name: "Neeraj Joshi", rating: 4, comment: "Simple, useful, and easy to navigate. Perfect for backpackers looking for budget travel tips." }, 
  { name: "Divya Kapoor", rating: 5, comment: "Each article feels personalized and honest. I found great spots in Kerala I hadn’t seen on big travel sites." }, 
  { name: "Mohit Agarwal", rating: 5, comment: "Great balance of photos, facts, and personal experiences. A must-follow for travel enthusiasts." }, 
  { name: "Anjali Rana", rating: 4, comment: "I really liked the layout and the trip budgets. Just a small suggestion — add more weekend getaway options!" }, 
  { name: "Saurabh Mishra", rating: 5, comment: "Very genuine reviews and activity suggestions. Loved the trekking guide — well explained!" }, 
  { name: "Aishwarya Nair", rating: 5, comment: "The blog feels authentic, not commercial. I trust the recommendations here more than influencer pages." }, 
  { name: "Aditya Kumar", rating: 4, comment: "Good info, but sometimes the text loads slowly on mobile. Otherwise, it’s a solid 4.5-star blog!" }, 
  { name: "Tanya Chauhan", rating: 5, comment: "I’m amazed by how clearly the budgets are broken down. Great resource for students and solo travelers." }, 
  { name: "Harshita Dey", rating: 5, comment: "Brilliantly curated travel guide! Covers destinations, culture, and tips all in one place." }
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1 mb-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star text-lg ${i < rating ? "text-amber-500" : "text-slate-200 dark:text-slate-700"}`}
      ></i>
    ))}
  </div>
);

const Review = () => {
  // 1. Create a state to hold all reviews
  const [reviews, setReviews] = useState(starterReviews);

  // 2. Load any new user-submitted reviews when the page mounts
    useEffect(() => {
    // 1. Fetch only the Approved real reviews from MongoDB!
    const fetchApprovedReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        // 2. Put the real DB reviews above the starter examples!
        setReviews([...res.data, ...starterReviews]);
      } catch (err) {
        console.error("Couldn't fetch reviews from DB", err);
      }
    };
    
    fetchApprovedReviews();
    
    // (Notice we deleted the localStorage.getItem('userReviews') stuff completely!)
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-28 pb-24 px-6 md:px-12 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Area */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-md mb-4 text-sm font-bold tracking-wider text-blue-700 dark:text-blue-400 uppercase">
            Community Feedback
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Traveler <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Reviews</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover what our amazing community of travelers has to say about our curated itineraries and travel guides.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2rem] p-8 border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-2 relative"
            >
              {/* Giant background quote icon */}
              <i className="fas fa-quote-right absolute top-6 right-8 text-6xl text-slate-100 dark:text-slate-800 transition-colors duration-500"></i>
              
              <div className="relative z-10 flex flex-col h-full">
                <StarRating rating={review.rating} />
                
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic mb-8 flex-grow">
                  "{review.comment}"
                </p>
                
                {/* Author Section */}
                <div className="flex items-center pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'Anonymous')}&background=random&bold=true`} 
                    alt={review.name} 
                    className="w-12 h-12 rounded-full shadow-sm mr-4 border-2 border-white dark:border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {review.name} 
                      {/* Show 'Blog Link' if they submitted one */}
                      {review.blogUrl && (
                        <a href={review.blogUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-700 text-sm">
                           <i className="fas fa-external-link-alt"></i> Blog
                        </a>
                      )}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verified Traveler</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
