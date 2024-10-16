
```markdown
# CollabSync

**CollabSync** is a real-time collaborative code-sharing platform aimed at simplifying the way developers share, edit, and collaborate on code. This platform allows users to join sessions via shared URLs and collaboratively edit code in real time. Sessions are temporary, with automatic expiration and extension features built-in, providing users a seamless collaborative experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Optimization Techniques](#optimization-techniques)
- [Future Roadmap](#future-roadmap)
- [License](#license)

## Overview

**CollabSync** is built for developers who need to quickly share code and collaborate in real-time. This application emphasizes simplicity, flexibility, and the ability to create real-time collaborative sessions with minimal setup.

## Features

- **Real-time Collaboration**: Multiple users can join a session and collaboratively edit code with low-latency synchronization using WebSockets.
- **Session Management**: Sessions expire automatically after a set duration, but users can extend them if necessary.
- **Anonymous Sharing**: Users can join and participate in sessions without logging in or creating an account.
- **Code Autosaving**: Changes are autosaved after periods of inactivity to prevent data loss.
- **Session Expiry Alerts**: Users are notified when a session is about to expire and have the option to extend it.
- **Secure and Stateless**: The server only persists documents during active sessions, reducing resource usage.
- **WebSocket-driven updates**: Ensures real-time communication for collaborative editing with minimal delay.

## Tech Stack

### Backend
- **Node.js**: The runtime environment for the backend.
- **Express.js**: A lightweight framework for building APIs.
- **MongoDB**: A NoSQL database to store code documents with TTL (Time-to-Live) for automatic document expiration.
- **Socket.IO**: Used for real-time communication to synchronize code edits between clients.
- **Mongoose**: An ODM (Object Data Modeling) tool to model and manage MongoDB documents.

### Frontend
- **React**: The front-end JavaScript library for building the UI.
- **Apollo Client** (future integration): To handle GraphQL queries and state management.
- **Monaco Editor**: A powerful code editor for the browser, providing a rich code editing experience.
- **Redux**: To manage global application state efficiently.

### Deployment
- **Azure App Services**: Hosting for the Node.js server and React frontend.
- **Azure CosmosDB**: A cloud-based MongoDB-compatible database.
- **WebSockets over HTTPS**: Secure communication for real-time features.

## Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/yourusername/collabsync.git
cd collabsync
```

### Server Setup

1. Navigate to the `server` folder:

    ```bash
    cd server
    ```

2. Install server dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory:

    ```bash
    touch .env
    ```

    Add your MongoDB URI and other necessary environment variables:

    ```bash
    MONGO_URI=your_mongodb_uri
    PORT=4200
    ```

4. Run the server:

    ```bash
    npm start
    ```

### Client Setup

1. Navigate to the `client` folder:

    ```bash
    cd ../client
    ```

2. Install client dependencies:

    ```bash
    npm install
    ```

3. Start the React client:

    ```bash
    npm start
    ```

4. Access the app in your browser at `http://localhost:3000`.

## Usage

1. Open the web app and create a session by entering a new code or loading an existing one via URL.
2. Share the session URL with others to collaboratively edit code in real-time.
3. Use the **Extend Session** button to prolong your session time if needed.
4. The session will automatically expire after 1 hour (by default) unless extended. Upon session expiry, a notification will appear and the document will be deleted from the server.
5. Each change is synchronized across all participants in the session using WebSockets, allowing real-time collaboration.

## Folder Structure

```bash
client/
├── public/
├── src/
│   ├── assets/             # Static assets like images, fonts, etc.
│   ├── common/             # Common functions/modal/constants that are shared across features.
│   ├── hooks/              # Custom hooks to handle session timers, network requests, etc.
│   ├── components/         # UI components such as buttons, modals, headers, etc.
│   ├── features/           # Feature-specific components, such as the code editor, session handling
│   ├── redux/              # Redux store setup.
│   ├── utils/              # Utility functions for handling WebSocket connections, API requests, etc.
│   └── App.js              # Main entry point for the React app
├── .env                    # Environment variables
└── package.json            # Frontend dependencies
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
├── README.md
└── LICENSE
```

## API Endpoints

### **GET** `/api/documents/:documentId`
Fetches an existing document by its ID. If the document has expired or does not exist, it will create the Doument and return the response.

### **DELETE** `/api/documents/:documentId`
Deletes a document from the database. This is typically triggered after a session expires or on explicit request.

## WebSocket Events

- **joinRoom(roomId)**: Joins a user into a collaboration session based on the provided `roomId`.
- **codeChange(roomId, code)**: Broadcasts code changes to all participants in the same room.
- **extendSession(roomId)**: Triggers an extension of the session by one hour.
- **sessionExpired(roomId)**: Notifies users in a session that the time has expired and the session has ended.

## Optimization Techniques

### Backend Optimization
- **Debounced Database Writes**: To avoid excessive writes to the database during rapid code changes, a debounce mechanism is implemented, saving the document at regular intervals (e.g., every 5 seconds of inactivity).
- **MongoDB TTL Index**: Documents automatically expire from the database after a set period using MongoDB's TTL (Time-to-Live) index, cleaning up sessions after 2 hours.

### Frontend Optimization
- **Code Splitting**: React's lazy loading can be used to load only necessary components on-demand.
- **Memoization**: Use `React.memo` and `useMemo` to prevent unnecessary re-renders.(future)
- **WebSocket Connection Management**: Only connect to the WebSocket server when the user is editing, and close connections when the user navigates away from the editor.

## Future Roadmap

### Short-Term Improvements
1. **GraphQL Integration**:
   - Replace current REST API with GraphQL to offer more flexible queries and reduce over-fetching of data.
   - Implement Apollo Client for state management and better data fetching strategies.

2. **Advanced Session Management**:
   - Add persistent sessions that allow users to resume editing even after disconnecting or refreshing the page.
   - Implement token-based authentication for private, user-specific sessions.

3. **Collaborator Presence**:
   - Add visual indicators (e.g., cursors or highlights) to show where other collaborators are editing in real-time.

### Long-Term Ambitions
1. **Version Control and History**:
   - Introduce the ability to view and revert to previous versions of a document.
   - Implement Git-like branching for parallel collaboration efforts.

2. **Mobile and Tablet Support**:
   - Optimize the editor UI for use on smaller devices like tablets and smartphones.

3. **Real-Time Compiler Integration**:
   - Add support for running code directly within the platform, with real-time compilers for languages like Python, JavaScript, and more.

4. **Plugin Architecture**:
   - Allow third-party developers to build and integrate plugins for additional features (e.g., linters, formatters).

## License

This project is licensed under the MIT License.
```

### Key Adjustments:
- The project is clearly separated into server and client folders.
- The **Future Roadmap** provides both short-term and long-term development goals, giving a clear direction for expanding the platform.
- Optimization techniques cover backend and frontend practices to improve performance, scalability, and user experience.
- Detailed API and WebSocket event descriptions, tailored for development and future expansions.
