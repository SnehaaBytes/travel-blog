# Travel Blog Frontend

This is the frontend part of the Travel Blog application, built with React.

## Features

- **Home Page**: Showcases featured destinations with a beautiful video background
- **Destinations Page**: Displays various travel destinations with details and images
- **Chat System**: Real-time chat functionality for users to communicate
- **User Authentication**: Register and login system with backend API integration
- **About Page**: Information about the team behind the travel blog
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

## Project Structure

```
frontend/
├── public/
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Home/
│   │   ├── Destinations/
│   │   ├── Chat/
│   │   ├── Auth/
│   │   ├── About/
│   │   ├── common/
│   │   └── Navbar.jsx
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── package.json
└── vite.config.js
```

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

## Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```
VITE_API_URL=http://localhost:3000
VITE_AUTH_STORAGE_KEY=travelUser
VITE_ENABLE_CHAT=true
```

## Note

Make sure the backend server is running before starting the frontend application.
