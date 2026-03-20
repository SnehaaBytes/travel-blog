import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../../services/api'; // Make sure this path is correct for you
import Modal from '../common/Modal';
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

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = [
        {
          title: 'Manali',
          description: 'A beautiful hill station in Himachal Pradesh. Known for its scenic beauty, adventure sports, and vibrant culture, Manali is a popular destination for both nature lovers and thrill-seekers.',
          imgSrc: '/images/manali.jpg',
        },
        {
          title: 'Kashmir',
          description: 'Known as "Paradise on Earth", located in northern India. Kashmir offers breathtaking landscapes, serene lakes, and snow-capped mountains, making it a dream destination for travelers.',
          imgSrc: '/images/kashmir.jpg',
        },
        {
          title: 'Varanasi',
          description: 'A spiritual city on the banks of the Ganges River. Varanasi is one of the oldest cities in the world, known for its ghats, temples, and vibrant cultural heritage.',
          imgSrc: '/images/varanasi.jpg',
        },
        {
          title: 'Vrindavan',
          description: 'A holy city associated with Lord Krishna. Vrindavan is a spiritual hub filled with temples, ashrams, and stories of divine love, attracting pilgrims from all over the world.',
          imgSrc: '/images/mero_vrindavan.jpg',
        },
        { title: 'Goa', description: 'Famous for its beaches, nightlife, and Portuguese heritage...', imgSrc: '/images/goa.jpg' },
        { title: 'Jaipur', description: 'The Pink City with forts, palaces, and rich culture...', imgSrc: '/images/jaipur.jpg' },
        { title: 'Agra', description: 'Home of the Taj Mahal, a symbol of eternal love...', imgSrc: '/images/agra.jpg' },
        { title: 'Rishikesh', description: 'Spiritual and adventure hub on the Ganges River...', imgSrc: '/images/rishikesh.jpg' },
        { title: 'Leh-Ladakh', description: 'High altitude desert with stunning landscapes...', imgSrc: '/images/leh.jpg' },
        { title: 'Mysore', description: 'Known for palaces, gardens, and cultural festivals...', imgSrc: '/images/mysore.jpg' },
        { title: 'Darjeeling', description: 'Famous for tea gardens, mountains, and the toy train...', imgSrc: '/images/darjeeling.jpg' },
        { title: 'Udaipur', description: 'City of lakes, palaces, and romantic vibes...', imgSrc: '/images/udaipur.jpg' },
        { title: 'Shimla', description: 'Popular hill station with scenic views...', imgSrc: '/images/shimla.jpg' },
        { title: 'Ranthambore', description: 'Famous for national park and tiger safari...', imgSrc: '/images/ranthambore.jpg' },
        { title: 'Hampi', description: 'UNESCO World Heritage site with ruins and history...', imgSrc: '/images/hampi.jpg' },
        { title: 'Andaman', description: 'Island paradise with beaches and water sports...', imgSrc: '/images/AndamanIslands.jpg' },
        { title: 'Sikkim', description: 'Himalayan state with monasteries and nature...', imgSrc: '/images/sikkim.jpg' },
        { title: 'Coorg', description: 'Coffee plantations and lush greenery...', imgSrc: '/images/coorg.jpg' },
      ];

      setDestinations(data);
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

  const filteredDestinations = useMemo(() => {
    if (activeTab === 'popular') return destinations.slice(0, 4);
    if (activeTab === 'trending') return [...destinations].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (activeTab === 'new') return [...destinations].reverse().slice(0, 4);
    return destinations.slice(0, 4);
  }, [activeTab, destinations]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? 'text-amber-500' : 'text-gray-300'}`}></i>
    ));
  };

  return (
    <div className="destinations-container font-sans bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src="https://videos.pexels.com/video-files/2146396/2146396-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        
               {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        
        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center mt-10">
          <span className="text-blue-400 font-semibold tracking-widest uppercase mb-4 text-sm md:text-base animate-fade-in-up">
            Stop Planning, Start Traveling
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Explore the Vibrancy <br/> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400">INDIA</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
            Uncover ancient mysteries, breathtaking landscapes, and unforgettable cultural experiences.
          </p>
          
          {/* Button Wrapper fixed for precise alignment */}
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full">
            
            {/* Primary Action Button */}
            <Link 
              to="/destinations" 
              className="bg-blue-600 hover:bg-blue-100 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg flex items-center justify-center w-full sm:w-auto"
            >
              Explore Destinations
            </Link>

            {/* Premium 'Read Testimonials' Button */}
            <button
              onClick={scrollToTestimonials}
              className="relative overflow-hidden group bg-transparent hover:bg-white text-white hover:text-blue-900 border-2 border-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-xl text-lg flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span className="relative z-10">Read Testimonials</span>
              <i className="fas fa-arrow-down text-sm relative z-10 animate-bounce group-hover:animate-none"></i>
            </button>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center p-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </header>

      {/* --- DESTINATIONS SECTION --- */}
      <section className="py-24 bg-gray-50 text-gray-900">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900 tracking-tight">Discover Amazing Places</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore the most beautiful, culturally rich, and breathtaking destinations hand-picked just for you.</p>
          </div>


          {/* Premium Pill Tabs */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-gray-200/80 p-1.5 rounded-full shadow-inner" role="group">
              {['popular', 'trending', 'new'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-8 py-3 text-sm font-bold rounded-full capitalize transition-all duration-300 ${activeTab === tab ? 'bg-white text-blue-700 shadow-md transform scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300/50'}`}
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
              {filteredDestinations.map((destination, index) => (
                <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
                  
                  {/* Image Container with Gradient Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <img src={fixImagePath(destination.imgSrc)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={destination.title} />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-blue-700 text-xs font-extrabold px-3 py-1.5 rounded-full capitalize shadow-sm">
                      {activeTab} 
                    </div>

                    {/* Title inside image for modern look */}
                    <h3 className="absolute bottom-4 left-5 z-20 text-2xl font-bold text-white tracking-wide">{destination.title}</h3>
                  </div>

                 {/* Card Body */}
<div className="p-6 flex flex-col flex-grow bg-white">
  <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">
    {truncateString(destination.description, 110)}
  </p>
  
  <div className="pt-5 border-t border-gray-100 flex justify-between items-center mt-auto">
    
    {/* --- UPDATED EXPLORE BUTTON --- */}
    <button 
      onClick={() => navigate('/destinations', { state: { destinationTitle: destination.title, from: 'home' } })} 
      className="w-full bg-blue-50 text-blue-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-800 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
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
            <Link to="/destinations" className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              View All Destinations <i className="fas fa-compass"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section ref={testimonialsRef} className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-3 block">Real Experiences</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">What Our Travelers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Don't just take our word for it. Read the experiences of adventurers who have explored India with us.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 relative">
                {/* Huge Quote Icon */}
                <i className="fas fa-quote-right absolute top-6 right-6 text-4xl text-gray-700/30"></i>
                
                <div className="mb-6">{renderStars(testimonial.rating)}</div>
                <p className="text-gray-300 text-lg leading-relaxed italic mb-8">"{testimonial.text}"</p>
                
                <div className="flex items-center pt-6 border-t border-gray-700/50 mt-auto">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-blue-500" />
                  <div>
                    <h3 className="font-bold text-white">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm font-medium">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/review" className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/20 font-bold py-3 px-8 rounded-full transition-all duration-300">
              View All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
            <i className="fas fa-paper-plane text-5xl mb-6 text-blue-300 animate-pulse"></i>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Join Our Travel Club</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">Get exclusive destination guides, hidden gem recommendations, and premium travel offers delivered straight to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400/50 flex-grow font-medium w-full"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-colors duration-300 shadow-lg whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section className="py-28 bg-white text-gray-900">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Image Side directly overlapping for a modern look */}
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop"
                alt="Travel Team"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Floating Stat Box */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><i className="fas fa-suitcase-rolling text-2xl"></i></div>
                  <div>
                    <h4 className="font-extrabold text-2xl text-gray-900">50k+</h4>
                    <p className="text-sm font-semibold text-gray-500 uppercase">Happy Travelers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2 pt-12 lg:pt-0">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 leading-tight">We Are Passionate About <span className="text-blue-600">Travel</span></h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                We are a dedicated team of travel experts devoted to uncovering the absolute best experiences across the diverse landscapes of India. From the snow-capped Himalayan peaks to the sun-kissed beaches of the south, we craft journeys that are truly unforgettable.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-gray-700 font-medium">
                <li><i className="fas fa-check-circle text-blue-600 mr-2"></i> Handpicked Destinations</li>
                <li><i className="fas fa-check-circle text-blue-600 mr-2"></i> 24/7 Premium Support</li>
                <li><i className="fas fa-check-circle text-blue-600 mr-2"></i> Lowest Price Guarantee</li>
                <li><i className="fas fa-check-circle text-blue-600 mr-2"></i> Verified Local Guides</li>
              </ul>

              <Link to="/about" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-colors duration-300 shadow-lg">
                Learn More About Us <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
