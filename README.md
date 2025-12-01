# NoteFlow

A beautiful, full-stack note-taking application built with React and Express.

![NoteFlow](https://img.shields.io/badge/NoteFlow-Note%20Taking%20App-6366f1)

## Features

- **Rich Text Editor** - TipTap-powered editor with formatting, code blocks, and more
- **Folders & Tags** - Organize notes with custom folders and tags
- **Favorites & Pinning** - Quick access to important notes
- **Dark Mode** - Full dark mode support
- **Search** - Full-text search across all notes
- **Trash & Restore** - Soft delete with recovery option
- **Responsive Design** - Works on desktop and mobile
- **Secure Authentication** - JWT-based auth with refresh tokens

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS v4
- TipTap Editor
- Zustand (state management)
- React Router v7

**Backend:**
- Express 5
- MongoDB + Mongoose
- JWT Authentication
- Zod validation

## Prerequisites

- Node.js 20.19+ or 22.12+
- MongoDB (local or cloud)
- npm or yarn

## Quick Start

### Using the setup script (recommended)

```bash
# Clone the repository
git clone https://github.com/champi-dev/notesapp.git
cd notesapp

# Run the setup script
./setup.sh
```

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/champi-dev/notesapp.git
   cd notesapp
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create server .env file
   cd ../server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secrets
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   # Or use MongoDB Atlas cloud
   ```

5. **Run the application**
   ```bash
   # Terminal 1: Start the server
   cd server
   npm run dev

   # Terminal 2: Start the client
   cd client
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/noteflow
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Project Structure

```
notesapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── styles/        # CSS files
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── validators/    # Zod schemas
│   │   └── utils/         # Utilities
│   └── package.json
├── setup.sh               # Setup script
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note permanently
- `PUT /api/notes/:id/trash` - Move to trash
- `PUT /api/notes/:id/restore` - Restore from trash

### Folders
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

### Tags
- `GET /api/tags` - Get all tags with counts

## Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

## License

MIT
