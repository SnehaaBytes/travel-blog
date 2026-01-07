# Travel Blog Project

A full-stack web application for travel enthusiasts to explore destinations in India, chat with other travelers, and share experiences.

## Project Overview

This project has been migrated from a traditional HTML/CSS/JS application to a modern React application with a Node.js/Express/MongoDB backend.

The project is organized into two main directories:
- `frontend/`: Contains the React application
- `backend/`: Contains the Express server and MongoDB models

## Features

- **Home Page**: Showcases featured destinations with a beautiful video background
- **Destinations Page**: Displays various travel destinations with details and images
- **Chat System**: Real-time chat functionality for users to communicate
- **User Authentication**: Register and login system with backend API integration
- **About Page**: Information about the team behind the travel blog
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS for cross-origin requests

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

For more detailed instructions, refer to the README.md files in the respective directories.

## API Endpoints

- `GET /`: Root endpoint, returns a welcome message
- `GET /destination`: Returns a list of travel destinations
- `POST /api/register`: Register a new user
- `POST /api/login`: Authenticate a user
- `GET /api/messages`: Get all chat messages
- `POST /api/messages`: Add a new chat message

## Future Enhancements

- Add a booking system for travel packages
- Implement user profiles with travel history
- Add a review and rating system for destinations
- Integrate a weather API for destination weather information
- Add a blog section for travel stories and experiences

## Contributors

- Sneha Singh
- Neha
- Prithvi

## License

This project is licensed under the ISC License.
