import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { destinationService } from '../../services/api';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { fixImagePath, truncateString } from '../../utils/helpers';
import '../Destinations/Destinations.css'; // Import the same CSS file

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
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

  // Theme switcher state and logic
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
        { title: 'Leh-Ladakh', description: 'High altitude desert with stunning landscapes...', imgSrc: '/images/leh_ladakh.jpg' },
        { title: 'Mysore', description: 'Known for palaces, gardens, and cultural festivals...', imgSrc: '/images/mysore.jpg' },
        { title: 'Darjeeling', description: 'Famous for tea gardens, mountains, and the toy train...', imgSrc: '/images/darjeeling.jpg' },
        { title: 'Udaipur', description: 'City of lakes, palaces, and romantic vibes...', imgSrc: '/images/udaipur.jpg' },
        { title: 'Shimla', description: 'Popular hill station with scenic views...', imgSrc: '/images/shimla.jpg' },
        { title: 'Ranthambore', description: 'Famous for national park and tiger safari...', imgSrc: '/images/ranthambore.jpg' },
        { title: 'Hampi', description: 'UNESCO World Heritage site with ruins and history...', imgSrc: '/images/hampi.jpg' },
        { title: 'Andaman', description: 'Island paradise with beaches and water sports...', imgSrc: '/images/andaman.jpg' },
        { title: 'Sikkim', description: 'Himalayan state with monasteries and nature...', imgSrc: '/images/sikkim.jpg' },
        { title: 'Darjeeling Tea Gardens', description: 'Famous tea plantations and scenic views...', imgSrc: '/images/darjeeling_tea.jpg' },
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

  const openModal = (title, description, imgSrc) => {
    setModalContent({ title, description, imgSrc });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFilteredDestinations = () => {
    if (activeTab === 'popular') {
      return destinations.slice(0, 4);
    } else if (activeTab === 'trending') {
      return [...destinations].sort(() => 0.5 - Math.random()).slice(0, 4);
    } else if (activeTab === 'new') {
      return [...destinations].reverse().slice(0, 4);
    }
    return destinations.slice(0, 4);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      ></i>
    ));
  };

  return (
    <>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="destinations-container">
        {/* Hero Section */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            muted
            loop
            className="absolute w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/2146396/2146396-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-3xl md:text-3xl font-bold text-white mb-6 tracking-wider">
              STOP PLANNING, START TRAVELING...
            </h1>
            <p className="text-lg md:text-lg font-bold text-white mb-10">
              Let's Explore the Vibrancy of INDIA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/destinations" className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg">
                Explore Destinations
              </Link>
              <button
                onClick={scrollToTestimonials}
                className="bg-transparent hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full border-2 border-white transition-colors duration-300 text-lg"
              >
                Read Testimonials
              </button>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="text-white text-4xl focus:outline-none"
              aria-label="Scroll down"
            >
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </header>

        {/* Destinations Section */}
        <section className="py-20 bg-gray-100 text-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Amazing Places</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Explore the most beautiful and culturally rich destinations across India</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'trending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveTab('trending')}
                >
                  Trending
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveTab('new')}
                >
                  New
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loading message="Loading destinations..." />
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto">
                <ErrorMessage message={error} onRetry={fetchDestinations} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {getFilteredDestinations().map((destination, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={fixImagePath(destination.imgSrc)}
                        className="w-full h-full object-cover"
                        alt={destination.title}
                      />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{destination.title}</h3>
                      <p className="text-gray-500 mb-4">{truncateString(destination.description, 100)}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => openModal(destination.title, destination.description, fixImagePath(destination.imgSrc))}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Explore
                        </button>
                        <i className="fas fa-arrow-right text-blue-600"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/destinations" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
                View All Destinations
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Read about the experiences of travelers who have explored India with us</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-800 rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-gray-400">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-8">Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox.</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-5 rounded-full text-gray-700 focus:outline-none flex-grow max-w-md"
                />
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-5 rounded-full transition-colors duration-400">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
                <p className="text-gray-300 mb-8 text-lg">We are a passionate team of travel enthusiasts dedicated to bringing you the best travel experiences and insights from across India. Our mission is to inspire and guide travelers to discover the incredible diversity and beauty of this amazing country.</p>
                <Link to="/about" className="inline-block bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300">
                  Learn More About Us
                </Link>
              </div>
              <div className="md:w-1/2 md:pl-10">
                <img
                  src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Travel Team"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={!!modalContent}
        onClose={closeModal}
        title={modalContent?.title}
        description={modalContent?.description}
        imgSrc={modalContent?.imgSrc}
      />
    </>
  );
};

export default Home;