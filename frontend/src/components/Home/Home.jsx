import { useAuth } from '../../services/AuthContext';
import AiTripPlanner from "../AiTripPlanner";
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { destinationService } from '../../services/api';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { fixImagePath, truncateString } from '../../utils/helpers';
import '../Destinations/Destinations.css'; 

const Home = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');
  const { user } = useAuth();
  
  // State for "Share Experience" Form
  const [reviewForm, setReviewForm] = useState({
    name: '',
    destination: '',
    rating: 5,
    review: '',
    blogUrl: ''
  });

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      location: 'Delhi',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'My trip to Kashmir was absolutely breathtaking. The mountains, the lakes, and the hospitality of the locals made it an unforgettable experience.',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Patel',
      location: 'Mumbai',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Varanasi was a spiritual journey like no other. The evening aarti at the ghats is something everyone should experience at least once in their lifetime.',
      rating: 4
    },
    {
      id: 3,
      name: 'Amit Kumar',
      location: 'Bangalore',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: 'Manali exceeded all my expectations. The adventure sports, the scenic beauty, and the food were all amazing!',
      rating: 5
    }
  ]);

  const testimonialsRef = useRef(null);

  /* === FETCH DESTINATIONS FROM REAL BACKEND === */
  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/destinations`);
      setDestinations(res.data);
    } catch (err) {
      setError('Failed to load destinations. Please try again later.');
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

    const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.destination || !reviewForm.review) return; // We no longer check reviewForm.name
    
    // --- SEND TO DATABASE ---
    const newGlobalReview = {
      name: user.username, // 👉 Instantly takes their logged-in username!
      destination: reviewForm.destination,
      rating: parseInt(reviewForm.rating) || 5,
      comment: reviewForm.review, 
      blogUrl: reviewForm.blogUrl 
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newGlobalReview);
      
      // Update Home Page Testimonials visually below the hero
      const newTestimonial = {
        id: Date.now(),
        name: user.username, // 👉 Uses the username for the UI
        location: reviewForm.destination,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`,
        text: reviewForm.review,
        rating: parseInt(reviewForm.rating) || 5
      };
      setTestimonials([newTestimonial, ...testimonials.slice(0, 2)]);
      
      // Clear the inputs (except name)
      setReviewForm({ name: '', destination: '', rating: 5, review: '', blogUrl: '' });
      
      alert("Success! Your review has been saved to the Database and sent to the Admin Panel!");
    } catch (err) {
      console.error(err);
      alert("Uh oh! Failed to save review to the database.");
    }
  };


  const filteredDestinations = useMemo(() => {
    if (activeTab === 'popular') return destinations.slice(0, 4);
    if (activeTab === 'trending') return [...destinations].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (activeTab === 'new') return [...destinations].reverse().slice(0, 4);
    return destinations.slice(0, 4);
  }, [activeTab, destinations]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? 'text-amber-500' : 'text-gray-300 dark:text-slate-600'}`}></i>
    ));
  };

  return (
    <div className="destinations-container font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src="https://videos.pexels.com/video-files/2146396/2146396-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900/90 dark:to-slate-950"></div>
        
        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-10">
          <span className="text-blue-400 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base animate-fade-in-up">
            Stop Planning, Start Traveling
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Explore the Vibrancy <br className="hidden sm:block"/> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">INDIA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
            Uncover ancient mysteries, breathtaking landscapes, and unforgettable cultural experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full">
            <Link 
              to="/destinations" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg flex items-center justify-center w-full sm:w-auto"
            >
              Explore Destinations
            </Link>

            <button
              onClick={scrollToTestimonials}
              className="relative overflow-hidden group bg-transparent hover:bg-white text-white hover:text-blue-900 border-2 border-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-xl text-lg flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span className="relative z-10">Read Testimonials</span>
              <i className="fas fa-arrow-down text-sm relative z-10 animate-bounce group-hover:animate-none"></i>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </header>

      {/* --- DESTINATIONS SECTION --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 dark:text-white tracking-tight">
              Discover Amazing Places
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Explore the most beautiful, culturally rich, and breathtaking destinations hand-picked just for you.
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-slate-200/80 dark:bg-slate-800 p-1.5 rounded-full shadow-inner" role="group">
              {['popular', 'trending', 'new'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-8 py-3 text-sm font-bold rounded-full capitalize transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-md transform scale-105' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loading message="Loading destinations..." /></div>
          ) : error ? (
            <div className="max-w-2xl mx-auto"><ErrorMessage message={error} onRetry={fetchDestinations} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredDestinations.map((destination) => (
                <div key={destination._id || destination.title} className="group flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-2 h-full">
                  
                  <div className="relative h-60 overflow-hidden m-2 rounded-[1.5rem]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <img src={`/images/${destination.imgSrc}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={destination.title} />

                    <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-blue-700 dark:text-blue-400 text-xs font-extrabold px-3 py-1.5 rounded-full capitalize shadow-sm">
                      {activeTab} 
                    </div>

                    <h3 className="absolute bottom-4 left-5 z-20 text-2xl font-bold text-white tracking-wide">{destination.title}</h3>
                  </div>

                  <div className="px-6 py-5 flex flex-col flex-grow">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-grow">
                      {truncateString(destination.description, 110)}
                    </p>
                    
                    <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto">
                      <button 
                        onClick={() => navigate('/destinations', { state: { destinationTitle: destination.title, from: 'home' } })} 
                        className="w-full bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold py-3.5 px-4 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
                      >
                        Explore Now 
                        <i className="fas fa-arrow-right text-sm transform group-hover/btn:translate-x-1 transition-transform duration-300"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <Link to="/destinations" className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-slate-900 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              View All Destinations <i className="fas fa-compass"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section ref={testimonialsRef} className="py-24 bg-slate-100 dark:bg-slate-900 transition-colors duration-500 relative overflow-hidden">
        <div className="hidden dark:block absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="hidden dark:block absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-3 block">Real Experiences</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">What Our Travelers Say</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Don't just take our word for it. Read the experiences of adventurers who have explored India with us.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/50 rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 relative">
                <i className="fas fa-quote-right absolute top-6 right-6 text-4xl text-slate-200 dark:text-slate-700"></i>
                
                <div className="mb-6">{renderStars(testimonial.rating)}</div>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic mb-8">"{testimonial.text}"</p>
                
                <div className="flex items-center pt-6 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-slate-200 dark:border-slate-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/review" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
              View All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* --- SHARE YOUR EXPERIENCE FORM --- */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
            
            <div className="text-center mb-10 relative z-10">
              <i className="fas fa-heart text-5xl mb-6 text-blue-500 animate-pulse"></i>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">Share Your Experience</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Loved your trip? Share your story, blog, or pictures with other travelers by submitting a review below!
              </p>
            </div>
            
            {/* 🛑 CONDITIONAL RENDERING: CHECK IF USER EXISTS 🛑 */}
            {user ? (
              
              <form onSubmit={handleReviewSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Posting as</label>
                  <input
                    type="text"
                    readOnly
                    value={user.username}
                    className="w-full px-5 py-3.5 bg-gray-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none transition-colors shadow-inner font-bold"
                  />
                </div>


                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Destination</label>
                  <select
                    required
                    value={reviewForm.destination}
                    onChange={(e) => setReviewForm({...reviewForm, destination: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled>Where did you go?</option>
                    {destinations && destinations.map((dest) => (
                      <option key={dest._id || dest.title} value={dest.title}>{dest.title}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Rate Your Experience</label>
                  <div className="flex gap-2 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`focus:outline-none transition-colors ${reviewForm.rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Write Your Review or Short Story</label>
                  <textarea
                    required
                    rows="4"
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                    placeholder="Tell us what you loved about this place..."
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Link your Travel Blog (Optional)</label>
                  <input
                    type="url"
                    value={reviewForm.blogUrl || ''}
                    onChange={(e) => setReviewForm({...reviewForm, blogUrl: e.target.value})}
                    placeholder="https://yourblog.com/my-trip"
                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 text-center">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-1"
                  >
                    Submit Review
                  </button>
                </div>
              </form>

            ) : (

              // 🛑 WHAT THEY SEE IF THEY ARE NOT LOGGED IN 🛑
              <div className="relative z-10 text-center bg-blue-50/50 dark:bg-slate-800/50 p-6 md:p-10 rounded-3xl border border-blue-100 dark:border-slate-700 max-w-2xl mx-auto shadow-inner">
                <i className="fas fa-lock text-5xl text-blue-400 dark:text-slate-500 mb-6 drop-shadow-sm"></i>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3 tracking-tight">Login Required</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-base md:text-lg leading-relaxed">
                  You must create an account or log in to share your amazing experiences and photos with the travel community!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                    Log In Now
                  </Link>
                  <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                    Create Account
                  </Link>
                </div>
              </div>

            )}

          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section className="py-28 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop"
                alt="Travel Team"
                className="relative rounded-[2rem] shadow-2xl w-full h-[500px] object-cover border-4 border-white dark:border-slate-800"
              />
              <div className="absolute -bottom-8 -right-8 sm:-right-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full text-blue-600 dark:text-blue-400"><i className="fas fa-suitcase-rolling text-2xl"></i></div>
                  <div>
                    <h4 className="font-extrabold text-2xl text-slate-900 dark:text-white">50k+</h4>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Happy Travelers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 pt-12 lg:pt-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900 dark:text-white leading-tight">We Are Passionate About <span className="text-blue-600 dark:text-blue-400">Travel</span></h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                We are a dedicated team of travel experts devoted to uncovering the absolute best experiences across the diverse landscapes of India. From the snow-capped Himalayan peaks to the sun-kissed beaches of the south, we craft journeys that are truly unforgettable.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-slate-700 dark:text-slate-300 font-medium">
                <li><i className="fas fa-check-circle text-blue-600 dark:text-blue-400 mr-2"></i> Handpicked Destinations</li>
                <li><i className="fas fa-check-circle text-blue-600 dark:text-blue-400 mr-2"></i> 24/7 Premium Support</li>
                <li><i className="fas fa-check-circle text-blue-600 dark:text-blue-400 mr-2"></i> Lowest Price Guarantee</li>
                <li><i className="fas fa-check-circle text-blue-600 dark:text-blue-400 mr-2"></i> Verified Local Guides</li>
              </ul>

              <Link to="/about" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-colors duration-300 shadow-lg">
                Learn More About Us <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* ✅ AI TRIP PLANNER WIDGET — floating bottom-right corner */}
      <AiTripPlanner />

    </div>
  );
};

export default Home;
