# 🎮 Tic Tac Toe - Multiplayer Game

A real-time multiplayer Tic Tac Toe game built with Next.js, TypeScript, Prisma, and PostgreSQL.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 🎯 **Real-time Gameplay** - Live game updates with polling
- 👥 **Multiplayer Support** - Create and join games with other players
- 📊 **Game History** - Track your past games and results
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔒 **Security** - Password hashing, JWT tokens, and security headers
- 📱 **Mobile Friendly** - Responsive design for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed  # Optional: adds test users
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Test Users (if seeded)
- **Admin**: username: `admin`, password: `admin123`
- **Test User**: username: `testuser`, password: `test123`

## 🚀 Production Deployment

### Quick Deploy Options

1. **Vercel (Recommended)**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Railway**
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

3. **Docker**
   ```bash
   npm run docker:compose
   ```

4. **Manual Deployment**
   ```bash
   ./deploy.sh
   ```

### Environment Variables

Create a `.env.local` file with:

```bash
# JWT Secret (Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET="your-super-secret-jwt-key"

# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@host:port/database"

# Node Environment
NODE_ENV="production"
```

### Database Setup

1. **Choose a PostgreSQL provider:**
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech) (Free tier)
   - [Supabase](https://supabase.com) (Free tier)
   - [Railway](https://railway.app) (Free tier)

2. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

3. **Seed database (optional):**
   ```bash
   npm run db:seed
   ```

## 📚 Documentation

- **[Production Guide](PRODUCTION.md)** - Comprehensive deployment instructions
- **[Deployment Guide](DEPLOYMENT.md)** - Platform-specific deployment guides
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (dev only)

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:compose   # Start with Docker Compose

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:railway   # Deploy to Railway
npm run health          # Check application health
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Vercel, Railway, Render, Docker

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── games/      # Game management endpoints
│   │   └── health/     # Health check endpoint
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── GameBoard.tsx   # Game board component
│   ├── GameControls.tsx # Game controls
│   ├── GameStatus.tsx  # Game status display
│   ├── LoginForm.tsx   # Login form
│   └── RegisterForm.tsx # Registration form
├── lib/               # Utility libraries
│   └── auth.ts        # Authentication utilities
├── types/             # TypeScript type definitions
│   └── game.ts        # Game-related types
└── generated/         # Generated Prisma client
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Prisma ORM prevents SQL injection
- **CORS Protection** - Configured for production use

## 🧪 Testing

### Health Check

Test your deployment:
```bash
npm run health
# or visit: https://your-domain.com/api/health
```

### Manual Testing

1. **Register/Login** - Create an account and log in
2. **Create Game** - Start a new game
3. **Join Game** - Join an existing game from another browser/device
4. **Play Game** - Make moves and verify turn logic
5. **Game History** - Check completed games in history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [PRODUCTION.md](PRODUCTION.md) for deployment help
- **Issues**: Create an issue on GitHub
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🎯 Roadmap

- [ ] Real-time WebSocket support
- [ ] Game rooms and lobbies
- [ ] User profiles and statistics
- [ ] Tournament mode
- [ ] Mobile app
- [ ] AI opponent
- [ ] Custom game themes

---

**Happy Gaming! 🎮**
