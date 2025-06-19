# Multi-Player Tic Tac Toe

A real-time multi-player Tic Tac Toe game built with Next.js, TypeScript, and Prisma.

## Features

- 🔐 User authentication with JWT
- 🎮 Real-time multi-player gameplay
- 📱 Responsive design
- 🔄 Auto-refresh game state
- 📊 Game history tracking
- 🏆 Win/draw detection
- ⚡ Real-time synchronization

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite (development), PostgreSQL (production)
- **Authentication:** JWT with bcrypt
- **ORM:** Prisma

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your JWT secret:
   ```
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Option 1: Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your repository
   - Configure environment variables:
     - `JWT_SECRET`: Your JWT secret key
     - `DATABASE_URL`: Your PostgreSQL connection string
   - Deploy!

3. **Set up PostgreSQL database**
   - Use Vercel Postgres or any PostgreSQL provider
   - Update `DATABASE_URL` in Vercel environment variables
   - Run migrations: `npx prisma migrate deploy`

### Option 2: Railway

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy!

### Option 3: Render

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `DATABASE_URL` | Database connection string | Yes (production) |

## Database Setup

### Development (SQLite)
The app uses SQLite by default for development. No additional setup required.

### Production (PostgreSQL)
1. Create a PostgreSQL database
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma migrate deploy`

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/games/create` - Create new game
- `POST /api/games/join` - Join existing game
- `POST /api/games/move` - Make game move
- `GET /api/games/available` - List available games
- `GET /api/games/history` - Get game history
- `GET /api/games/[id]` - Get game state

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
