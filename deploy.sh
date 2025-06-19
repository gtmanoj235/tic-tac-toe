#!/bin/bash

# Tic Tac Toe Production Deployment Script
# This script helps you deploy your application to various platforms

set -e

echo "🎮 Tic Tac Toe Production Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "Git remote not set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/tic-tac-toe.git"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << EOF
# Production Environment Variables
# Generate a secure JWT secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# PostgreSQL connection string for production
DATABASE_URL="postgresql://username:password@host:port/database"

# Node Environment
NODE_ENV="production"
EOF
    print_success "Created .env.local template"
    print_warning "Please edit .env.local and add your JWT_SECRET and DATABASE_URL"
    echo ""
    echo "Generate a secure JWT secret:"
    echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
if [ ! -d "src/generated/prisma" ]; then
    print_status "Generating Prisma client..."
    npx prisma generate
fi

# Build the application
print_status "Building application..."
npm run build

print_success "Build successful!"

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_status "Docker is available. You can also deploy using Docker:"
    echo "   npm run docker:build"
    echo "   npm run docker:run"
    echo "   npm run docker:compose"
    echo ""
fi

echo ""
print_success "Ready to deploy! Choose your platform:"
echo ""
echo "🚀 1. Vercel (Recommended for Next.js)"
echo "   - Visit: https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Add environment variables:"
echo "     JWT_SECRET=your-secret-key"
echo "     DATABASE_URL=your-postgresql-url"
echo "   - Run: npm run deploy:vercel"
echo ""
echo "🚂 2. Railway"
echo "   - Visit: https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Add JWT_SECRET environment variable"
echo "   - Run: npm run deploy:railway"
echo ""
echo "🌐 3. Render"
echo "   - Visit: https://render.com"
echo "   - Create Web Service"
echo "   - Connect your GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Add environment variables"
echo ""
echo "🐳 4. Docker"
echo "   - Build: npm run docker:build"
echo "   - Run: npm run docker:run"
echo "   - Or use Docker Compose: npm run docker:compose"
echo ""
echo "📚 For detailed instructions, see PRODUCTION.md"
echo ""
echo "🔑 Generate a secure JWT secret:"
echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo ""
echo "🗄️  Free PostgreSQL providers:"
echo "   - Neon: https://neon.tech"
echo "   - Supabase: https://supabase.com"
echo "   - Railway: https://railway.app"
echo "   - Vercel Postgres: Built into Vercel"
echo ""
echo "🔧 Database setup commands:"
echo "   npm run db:generate  # Generate Prisma client"
echo "   npm run db:migrate   # Run database migrations"
echo "   npm run db:seed      # Seed database with initial data"
echo ""
echo "🏥 Health check:"
echo "   npm run health       # Check application health" 