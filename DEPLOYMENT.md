# MedSpa Growth Hub - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon, Railway, or Render)
- Redis instance (Upstash or local)
- Git repository access

## Quick Start

### 1. Database Setup

#### Option A: Neon (Recommended)
1. Go to [Neon](https://neon.tech) and create a new project
2. Copy the connection string
3. Update `api/.env` with your `DATABASE_URL`

#### Option B: Railway
1. Go to [Railway](https://railway.app) and create a new PostgreSQL service
2. Copy the connection string
3. Update `api/.env` with your `DATABASE_URL`

#### Option C: Render
1. Go to [Render](https://render.com) and create a new PostgreSQL database
2. Copy the connection string
3. Update `api/.env` with your `DATABASE_URL`

### 2. Redis Setup

#### Option A: Upstash (Recommended)
1. Go to [Upstash](https://upstash.com) and create a new Redis database
2. Copy the connection string
3. Update `api/.env` with your `REDIS_URL`

#### Option B: Local Redis
```bash
# Install Redis locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server

# Update api/.env with:
REDIS_URL=redis://localhost:6379
```

### 3. Backend Setup

```bash
cd api

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database and Redis URLs
# Generate a secure API key for BACKEND_API_KEY
# Add your GHL API key if you have one

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start development server
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.local.example .env.local

# Edit .env.local with your API base URL and API key
# NEXT_PUBLIC_API_BASE=http://localhost:3001
# NEXT_PUBLIC_FRONT_API_KEY=your-secure-backend-api-key

# Start development server
npm run dev
```

## Production Deployment

### Backend Deployment (Render/Railway)

#### Option A: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd api && npm install && npm run build`
4. Set start command: `cd api && npm run start`
5. Add environment variables:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `BACKEND_API_KEY`
   - `GHL_API_KEY`
   - `NODE_ENV=production`

#### Option B: Railway
1. Connect your GitHub repository to Railway
2. Create a new service from your repository
3. Set the root directory to `api`
4. Add environment variables in Railway dashboard
5. Deploy

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_BASE` (your backend URL)
   - `NEXT_PUBLIC_FRONT_API_KEY` (same as backend API key)
4. Deploy

### Database Migration in Production

```bash
# Connect to your production database
npx prisma migrate deploy

# Seed production data (optional)
npx prisma db seed
```

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Redis
REDIS_URL="redis://username:password@host:port"

# API Keys
BACKEND_API_KEY="your-secure-backend-api-key"
GHL_API_KEY="your-ghl-api-key"

# Application
NODE_ENV="production"
PORT=3001

# External Services (optional)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
EMAIL_PROVIDER_API_KEY=""
EMAIL_FROM_ADDRESS="noreply@medspa.com"
```

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_BASE=https://your-api-domain.com
NEXT_PUBLIC_FRONT_API_KEY=your-secure-backend-api-key
```

## Security Checklist

### API Keys
- [ ] Generate strong, unique API keys
- [ ] Rotate API keys regularly
- [ ] Never commit API keys to version control
- [ ] Use environment variables for all secrets

### Database
- [ ] Use strong database passwords
- [ ] Enable SSL connections
- [ ] Restrict database access by IP
- [ ] Regular database backups

### Application
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting
- [ ] Regular security updates

## Monitoring and Maintenance

### Health Checks
- Backend: `GET /health` (to be implemented)
- Database: Check connection status
- Redis: Check connection status

### Logging
- Application logs
- Error tracking
- Performance monitoring
- Security event logging

### Backups
- Daily database backups
- Regular Redis snapshots
- Code repository backups
- Configuration backups

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database URL format
# Ensure database is accessible
# Verify credentials
```

#### Redis Connection Errors
```bash
# Check Redis URL format
# Ensure Redis is running
# Verify network connectivity
```

#### API Key Issues
```bash
# Verify API key is set correctly
# Check key format and length
# Ensure key matches between frontend and backend
```

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (18+ required)
node --version
```

### Support
- Check logs for error messages
- Verify environment variables
- Test API endpoints manually
- Check database connectivity

## Scaling Considerations

### Database
- Monitor query performance
- Add indexes as needed
- Consider read replicas for high traffic
- Implement connection pooling

### Redis
- Monitor memory usage
- Set up Redis clustering for high availability
- Implement cache eviction policies

### Application
- Use load balancers for multiple instances
- Implement horizontal scaling
- Monitor resource usage
- Set up auto-scaling policies

## Cost Optimization

### Database
- Use appropriate instance sizes
- Monitor storage usage
- Implement data archiving
- Use read replicas efficiently

### Redis
- Monitor memory usage
- Use appropriate instance sizes
- Implement cache expiration
- Consider Redis alternatives for simple use cases

### Hosting
- Use appropriate instance sizes
- Monitor resource usage
- Implement auto-scaling
- Consider reserved instances for predictable workloads
