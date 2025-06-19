#!/bin/bash

# Vercel Environment Setup Script
# This script helps you set up environment variables for Vercel deployment

set -e

echo "🚀 Vercel Environment Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << EOF
# Vercel Environment Variables
# Generate a secure JWT secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# PostgreSQL connection string (get from your database provider)
DATABASE_URL="postgresql://username:password@host:port/database"

# Node Environment
NODE_ENV="production"
EOF
    print_success "Created .env.local template"
    print_warning "Please edit .env.local and add your actual values before continuing"
    echo ""
    echo "Generate a secure JWT secret:"
    echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo ""
    echo "After editing .env.local, run this script again."
    exit 0
fi

# Check if JWT_SECRET is set to the default value
if grep -q "your-super-secret-jwt-key-change-this-in-production" .env.local; then
    print_error "Please update JWT_SECRET in .env.local with a secure value"
    echo "Generate a secure JWT secret:"
    echo "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    exit 1
fi

# Check if DATABASE_URL is set to the default value
if grep -q "postgresql://username:password@host:port/database" .env.local; then
    print_error "Please update DATABASE_URL in .env.local with your actual database connection string"
    exit 1
fi

print_status "Setting up Vercel environment variables..."

# Pull current environment variables
print_status "Pulling current environment variables..."
vercel env pull .env.vercel 2>/dev/null || true

# Set JWT_SECRET
print_status "Setting JWT_SECRET..."
JWT_SECRET=$(grep JWT_SECRET .env.local | cut -d '=' -f2 | tr -d '"')
vercel env add JWT_SECRET production <<< "$JWT_SECRET"

# Set DATABASE_URL
print_status "Setting DATABASE_URL..."
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2 | tr -d '"')
vercel env add DATABASE_URL production <<< "$DATABASE_URL"

# Set NODE_ENV
print_status "Setting NODE_ENV..."
vercel env add NODE_ENV production <<< "production"

print_success "Environment variables set successfully!"
echo ""
print_status "Next steps:"
echo "1. Deploy your application:"
echo "   vercel --prod"
echo ""
echo "2. Run database migrations:"
echo "   vercel env pull .env.local"
echo "   npx prisma migrate deploy"
echo ""
echo "3. Seed database (optional):"
echo "   npx prisma db seed"
echo ""
print_success "Your Vercel deployment is ready! 🎉" 