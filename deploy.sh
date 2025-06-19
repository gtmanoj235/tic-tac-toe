#!/bin/bash

# Tic Tac Toe Deployment Script
# This script helps you deploy your application to various platforms

set -e

echo "🎮 Tic Tac Toe Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/tic-tac-toe.git"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
# Add your JWT secret here
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# For production, add your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@host:port/database"
EOF
    echo "✅ Created .env.local template"
    echo "📝 Please edit .env.local and add your JWT_SECRET"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
if [ ! -d "src/generated/prisma" ]; then
    echo "🔧 Generating Prisma client..."
    npx prisma generate
fi

# Build the application
echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ Build successful!"
echo ""
echo "🚀 Ready to deploy! Choose your platform:"
echo ""
echo "1. Vercel (Recommended for Next.js)"
echo "   - Visit: https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Add environment variables:"
echo "     JWT_SECRET=your-secret-key"
echo "     DATABASE_URL=your-postgresql-url"
echo ""
echo "2. Railway"
echo "   - Visit: https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Add JWT_SECRET environment variable"
echo ""
echo "3. Render"
echo "   - Visit: https://render.com"
echo "   - Create Web Service"
echo "   - Connect your GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Add environment variables"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔑 Generate a secure JWT secret:"
echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
echo ""
echo "🗄️  Free PostgreSQL providers:"
echo "   - Neon: https://neon.tech"
echo "   - Supabase: https://supabase.com"
echo "   - Railway: https://railway.app"
echo "   - Vercel Postgres: Built into Vercel" 