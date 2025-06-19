# Deployment Guide

This guide will help you deploy your Tic Tac Toe application to various free hosting platforms.

## 🚀 Quick Start: Vercel (Recommended)

### Step 1: Prepare Your Code

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository**:
   - Go to [GitHub](https://github.com)
   - Create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/tic-tac-toe.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Visit Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     ```
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     DATABASE_URL=your-postgresql-connection-string
     ```

4. **Set up PostgreSQL Database**:
   - **Option A: Vercel Postgres** (Recommended)
     - In your Vercel project, go to "Storage"
     - Create a new Postgres database
     - Copy the connection string to `DATABASE_URL`
   
   - **Option B: External PostgreSQL**
     - Use [Neon](https://neon.tech) (free tier)
     - Use [Supabase](https://supabase.com) (free tier)
     - Use [Railway](https://railway.app) (free tier)

5. **Run Database Migrations**:
   - In Vercel project settings, go to "Functions"
   - Add a new function or use the CLI:
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

6. **Redeploy**:
   - Go to your Vercel dashboard
   - Click "Redeploy" to apply environment variables

### Step 3: Test Your Deployment

- Visit your Vercel URL
- Register a new account
- Create a game
- Test the functionality

## 🚂 Alternative: Railway

### Step 1: Deploy to Railway

1. **Visit Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure Environment Variables**:
   - Go to your service settings
   - Add environment variables:
     ```
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     ```

5. **Deploy**:
   - Railway will automatically deploy your app
   - Visit the provided URL

## 🌐 Alternative: Render

### Step 1: Deploy to Render

1. **Visit Render**:
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: tic-tac-toe
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

3. **Add PostgreSQL Database**:
   - Click "New" → "PostgreSQL"
   - Copy the connection string to environment variables

4. **Configure Environment Variables**:
   - Go to your service settings
   - Add environment variables:
     ```
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     DATABASE_URL=your-postgresql-connection-string
     ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `my-super-secret-key-123` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |

### Generating JWT Secret

Generate a secure JWT secret:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

## 🗄️ Database Setup

### PostgreSQL Connection Strings

**Vercel Postgres:**
```
postgresql://postgres:password@host:port/database
```

**Neon:**
```
postgresql://user:password@host/database?sslmode=require
```

**Supabase:**
```
postgresql://postgres:password@host:port/postgres
```

### Running Migrations

After setting up your database, run migrations:

```bash
# For Vercel
npx vercel env pull .env.local
npx prisma migrate deploy

# For Railway
npx prisma migrate deploy

# For Render
npx prisma migrate deploy
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check if all dependencies are in `package.json`
   - Ensure `postinstall` script is present
   - Check build logs for errors

2. **Database Connection Fails**:
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible
   - Ensure migrations are run

3. **Authentication Issues**:
   - Verify `JWT_SECRET` is set
   - Check if JWT secret is consistent across deployments

4. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Check variable names (case-sensitive)
   - Restart the application

### Debug Commands

```bash
# Check Prisma connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics in Vercel dashboard
- Function execution logs
- Performance metrics

### Railway Monitoring
- Real-time logs
- Resource usage
- Error tracking

### Render Monitoring
- Application logs
- Performance metrics
- Health checks

## 🔒 Security Best Practices

1. **Use Strong JWT Secrets**:
   - Generate cryptographically secure secrets
   - Use different secrets for different environments

2. **Environment Variables**:
   - Never commit secrets to Git
   - Use platform-specific secret management

3. **Database Security**:
   - Use SSL connections
   - Restrict database access
   - Regular backups

4. **HTTPS**:
   - All platforms provide automatic HTTPS
   - Ensure all connections use HTTPS

## 🎯 Next Steps

After successful deployment:

1. **Set up Custom Domain** (optional)
2. **Configure Analytics** (optional)
3. **Set up Monitoring** (optional)
4. **Create Backup Strategy** (recommended)
5. **Plan for Scaling** (future consideration)

## 📞 Support

If you encounter issues:

1. Check the platform's documentation
2. Review error logs
3. Test locally first
4. Check environment variables
5. Verify database connectivity

---

**Happy Deploying! 🚀** 