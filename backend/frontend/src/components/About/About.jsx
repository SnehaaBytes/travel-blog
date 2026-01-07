import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p className="tagline">Passionate about travel, dedicated to sharing experiences</p>
      </div>

      <div className="about-content">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Travel Team" />
        </div>
        
        <div className="about-text">
          <h2>Our Story</h2>
          <p>Welcome to our Travel Blog! We are a passionate team of travel enthusiasts dedicated to bringing you the best travel experiences and insights from around India. Our journey began with a simple desire to explore the diverse landscapes, cultures, and traditions that make India a unique travel destination.</p>
          
          <p>Through our blog, we aim to inspire fellow travelers to discover the hidden gems of India, from the snow-capped mountains of Kashmir to the spiritual banks of Varanasi, the adventure-filled valleys of Manali, and the divine atmosphere of Vrindavan.</p>
          
          <h2>Our Mission</h2>
          <p>Our mission is to provide authentic travel information, personal experiences, and practical tips to help you plan your perfect Indian adventure. We believe that travel is not just about visiting places but about immersing yourself in the culture, connecting with locals, and creating memories that last a lifetime.</p>
        </div>
      </div>

      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          
          <div className="team-member">
            <h3>Prithvi Singh Chauhan</h3>
            <p className="role">Photography Expert</p>
            <p>Our talented photographer who captures the essence of each destination through her lens.</p>
          </div>
        </div>
      </div>

      <div className="contact-section">
        <h2>Get In Touch</h2>
        <p>Have questions or suggestions? We'd love to hear from you!</p>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>info@travelblog.com</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <p>+91 9876543210</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>New Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
