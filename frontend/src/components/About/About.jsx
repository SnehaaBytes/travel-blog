import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-32 pb-24 px-6 md:px-12 font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="inline-block px-5 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
            Our Journey
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">Us</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light">
            Passionate about travel, dedicated to sharing experiences
          </p>
        </div>

        {/* STORY & MISSION CONTENT */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-28">
          
          <div className="lg:w-1/2 relative w-full group">
            <div className="absolute -inset-4 bg-blue-200 dark:bg-slate-800 rounded-[2.5rem] transform rotate-3 transition-transform group-hover:rotate-6 duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop"
              alt="Travel Team"
              className="relative rounded-[2rem] shadow-2xl w-full h-auto lg:h-[550px] object-cover border-4 border-white dark:border-slate-700 transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 dark:text-white flex items-center gap-4">
              <i className="fas fa-book-open text-blue-500 text-3xl"></i> Our Story
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Welcome to our Travel Blog! We are a passionate team of travel enthusiasts dedicated to bringing you the best travel experiences and insights from around India. Our journey began with a simple desire to explore the diverse landscapes, cultures, and traditions that make India a unique travel destination.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
              Through our blog, we aim to inspire fellow travelers to discover the hidden gems of India, from the snow-capped mountains of Kashmir to the spiritual banks of Varanasi, the adventure-filled valleys of Manali, and the divine atmosphere of Vrindavan.
            </p>
            
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 dark:text-white flex items-center gap-4">
              <i className="fas fa-bullseye text-indigo-500 text-3xl"></i> Our Mission
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Our mission is to provide authentic travel information, personal experiences, and practical tips to help you plan your perfect Indian adventure. We believe that travel is not just about visiting places but about immersing yourself in the culture, connecting with locals, and creating memories that last a lifetime.
            </p>
          </div>
        </div>

        {/* NEW TEAM SECTION */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Grid layout for 3 members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Team Member 1: Oggy */}
            <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] p-8 text-center border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-100 dark:border-slate-700 shadow-lg relative bg-blue-100">
                <img 
                  src="https://ui-avatars.com/api/?name=SnehaSingh&background=3b82f6&color=fff&size=150&bold=true" 
                  alt="Sneha Singh" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sneha Singh</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4 uppercase tracking-wider text-sm">Lead Explorer</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Always chasing the next great adventure, capturing peaceful moments and beautiful sights for the blog.
              </p>
            </div>

            {/* Team Member 2: Jack */}
            <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] p-8 text-center border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-green-100 dark:border-slate-700 shadow-lg relative bg-green-100">
                <img 
                  src="https://ui-avatars.com/api/?name=PrithviSinghChauhan&background=22c55e&color=fff&size=150&bold=true" 
                  alt="Prithvi Singh Chauhan" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Prithvi Singh Chauhan</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold mb-4 uppercase tracking-wider text-sm">Adventure Specialist</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The muscle of the team, fearlessly ready to tackle extreme sports, tough treks, and rugged terrains!
              </p>
            </div>

            {/* Team Member 3: Bob */}
            <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] p-8 text-center border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-100 dark:border-slate-700 shadow-lg relative bg-purple-100">
                <img 
                  src="https://ui-avatars.com/api/?name=NehaUpadhyay&background=a855f7&color=fff&size=150&bold=true" 
                  alt="Neha Upadhyay" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Neha Upadhyay</h3>
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-4 uppercase tracking-wider text-sm">Culture & Food Guide</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our resident expert on all things culinary, making sure we stay out of trouble and always find the best local eats.
              </p>
            </div>

          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light">
              Have questions or suggestions? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 text-2xl shadow-inner">
                <i className="fas fa-envelope"></i>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold text-lg text-center break-all">info@travelblog.com</p>
            </div>

            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 text-2xl shadow-inner">
                <i className="fas fa-phone"></i>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold text-lg text-center">+91 9876543210</p>
            </div>

            <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 text-2xl shadow-inner">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <p className="text-slate-900 dark:text-white font-semibold text-lg text-center">New Delhi, India</p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
