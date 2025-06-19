# Production Deployment Guide

This guide provides comprehensive instructions for deploying the Tic Tac Toe application to production environments.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### 3. Render
- Visit [render.com](https://render.com)
- Connect your GitHub repository
- Use the `render.yaml` configuration

### 4. Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t tic-tac-toe .
docker run -p 3000:3000 --env-file .env.local tic-tac-toe
```

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# JWT Secret (Generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Database URL (PostgreSQL connection string)
DATABASE_URL="postgresql://username:password@host:port/database"

# Node Environment
NODE_ENV="production"
```

### Generating Secure JWT Secret

```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

## 🗄️ Database Setup

### PostgreSQL Providers

1. **Vercel Postgres** (Recommended for Vercel)
   - Built into Vercel dashboard
   - Automatic connection string setup

2. **Neon** (Free tier available)
   - Visit [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

3. **Supabase** (Free tier available)
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Use connection string from settings

4. **Railway** (Free tier available)
   - Built into Railway dashboard
   - Automatic connection string setup

### Database Migration

After setting up your database, run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

## 🔒 Security Considerations

### 1. JWT Secret
- Use a strong, random secret (64+ characters)
- Never commit secrets to version control
- Rotate secrets regularly in production

### 2. Database Security
- Use SSL connections for production databases
- Restrict database access to your application only
- Regularly backup your database

### 3. Application Security
- The app includes security headers (X-Frame-Options, etc.)
- JWT tokens are used for authentication
- Passwords are hashed with bcrypt

### 4. Environment Variables
- Never expose sensitive data in client-side code
- Use environment variables for all secrets
- Validate environment variables on startup

## 📊 Monitoring & Health Checks

### Health Check Endpoint
The application includes a health check endpoint:
```
GET /api/health
```

### Monitoring Setup
1. **Vercel**: Built-in analytics and monitoring
2. **Railway**: Built-in logs and metrics
3. **Render**: Built-in monitoring dashboard
4. **Custom**: Use services like Sentry, LogRocket, etc.

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Generate secure JWT secret
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Test application locally
- [ ] Run database migrations
- [ ] Seed database (if needed)

### Deployment
- [ ] Choose deployment platform
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Run database migrations
- [ ] Test all functionality

### Post-Deployment
- [ ] Verify health check endpoint
- [ ] Test user registration/login
- [ ] Test game creation and joining
- [ ] Test game play functionality
- [ ] Monitor application logs
- [ ] Set up monitoring alerts

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database accessibility
   - Ensure SSL is configured correctly

3. **JWT Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Restart application after changes

### Debug Commands

```bash
# Check application health
npm run health

# View logs (platform specific)
vercel logs
railway logs
docker logs <container-id>

# Database operations
npm run db:studio  # Open Prisma Studio
npm run db:reset   # Reset database (development only)
```

## 📈 Performance Optimization

### Built-in Optimizations
- Next.js automatic optimization
- Prisma connection pooling
- Efficient database queries
- Client-side caching

### Additional Optimizations
- Enable CDN for static assets
- Implement Redis for session storage
- Use database connection pooling
- Optimize images and assets

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run db:migrate
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check application logs
4. Verify environment configuration

## 🎯 Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Plan for scaling
5. Regular security updates 