# Troubleshooting Guide

This guide helps you diagnose and fix common issues with your Tic Tac Toe application.

## 🔍 **Diagnosing "Internal Server Error"**

### Step 1: Check the Health Endpoint

Visit your deployed app's health endpoint to diagnose issues:
```
https://your-app-url.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": {
    "nodeEnv": "production",
    "hasJwtSecret": true,
    "hasDatabaseUrl": true,
    "databaseUrlLength": 123
  },
  "database": {
    "connected": true,
    "error": null
  }
}
```

### Step 2: Common Issues and Solutions

#### ❌ **Database Connection Error**

**Symptoms:**
- `"database": { "connected": false }`
- `"error": "connection refused"` or similar

**Solutions:**

1. **Check DATABASE_URL environment variable:**
   - Go to your hosting platform (Vercel/Railway/Render)
   - Navigate to Environment Variables
   - Ensure `DATABASE_URL` is set correctly

2. **Verify PostgreSQL connection string format:**
   ```
   postgresql://username:password@host:port/database
   ```

3. **Check if database is accessible:**
   - Ensure your database service is running
   - Check firewall/network settings
   - Verify credentials are correct

4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

#### ❌ **Missing JWT_SECRET**

**Symptoms:**
- `"hasJwtSecret": false`
- Login/register returns "Server configuration error"

**Solutions:**

1. **Set JWT_SECRET environment variable:**
   - Generate a secure secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - Add to your hosting platform's environment variables

2. **Redeploy after setting environment variables**

#### ❌ **Database Tables Don't Exist**

**Symptoms:**
- `"error": "relation \"User\" does not exist"`

**Solutions:**

1. **Run Prisma migrations:**
   ```bash
   # For Vercel
   npx vercel env pull .env.local
   npx prisma migrate deploy
   
   # For Railway
   npx prisma migrate deploy
   
   # For Render
   npx prisma migrate deploy
   ```

2. **Check if migrations exist:**
   ```bash
   npx prisma migrate status
   ```

#### ❌ **Prisma Client Not Generated**

**Symptoms:**
- `"error": "Cannot find module"` related to Prisma

**Solutions:**

1. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Ensure postinstall script runs:**
   - Check `package.json` has: `"postinstall": "prisma generate"`

## 🚀 **Platform-Specific Solutions**

### Vercel

1. **Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `JWT_SECRET` and `DATABASE_URL`
   - Redeploy

2. **Database Setup:**
   - Use Vercel Postgres (recommended)
   - Or connect external PostgreSQL
   - Run migrations via Vercel CLI or Functions

3. **Run Migrations:**
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Railway

1. **Environment Variables:**
   - Go to your service → Variables
   - Add `JWT_SECRET`
   - `DATABASE_URL` is auto-set when you add PostgreSQL

2. **Database:**
   - Add PostgreSQL database from Railway dashboard
   - Migrations run automatically

### Render

1. **Environment Variables:**
   - Go to your service → Environment
   - Add `JWT_SECRET` and `DATABASE_URL`

2. **Database:**
   - Add PostgreSQL database
   - Run migrations manually or via build script

## 🔧 **Debugging Commands**

### Local Testing

```bash
# Test database connection
npx prisma db pull

# Check migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Production Debugging

```bash
# Check environment variables (Vercel)
npx vercel env ls

# Pull environment variables
npx vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

## 📋 **Checklist for Deployment**

- [ ] Environment variables set (`JWT_SECRET`, `DATABASE_URL`)
- [ ] Database is running and accessible
- [ ] Prisma migrations deployed
- [ ] Prisma client generated
- [ ] Application builds successfully
- [ ] Health endpoint returns `"status": "ok"`

## 🆘 **Getting Help**

If you're still experiencing issues:

1. **Check the health endpoint** first
2. **Review platform logs** (Vercel/Railway/Render)
3. **Test locally** with production environment variables
4. **Check this troubleshooting guide**
5. **Review the deployment documentation**

## 📞 **Common Error Messages**

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Database connection error" | Wrong DATABASE_URL or database down | Check connection string and database status |
| "Server configuration error" | Missing JWT_SECRET | Set JWT_SECRET environment variable |
| "relation does not exist" | Migrations not run | Run `npx prisma migrate deploy` |
| "Cannot find module" | Prisma client not generated | Run `npx prisma generate` |
| "Internal server error" | Generic error | Check health endpoint and logs |

---

**Remember:** Always check the health endpoint first - it will tell you exactly what's wrong! 

### **Common Causes & Quick Checks**

1. **If the error is about "Can't reach database server":**
   - Your `prisma/schema.prisma` is set to use PostgreSQL, but your local PostgreSQL server is not running or the `DATABASE_URL` is incorrect.
   - If you want to use SQLite locally, make sure your `prisma/schema.prisma` has:
     ```prisma
     datasource db {
       provider = "sqlite"
       url      = "file:./dev.db"
     }
     ```

2. **If the error is about "Migration history conflict":**
   - You may need to delete the `prisma/migrations` folder and try again.

3. **If the error is about "already exists" or "relation does not exist":**
   - Your database may be in an inconsistent state. You may need to reset it.

---

### **If You Want to Target Production (PostgreSQL) Directly**

- Make sure your `prisma/schema.prisma` is set to use PostgreSQL:
  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

### **Example Command**

```bash
npx prisma migrate dev --name init
``` 