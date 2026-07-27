# 🚀 PatternIQ Deployment Guide

This guide provides detailed step-by-step instructions for deploying PatternIQ in various environments.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Deployment](#local-development-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## 🔑 Prerequisites

Before deploying PatternIQ, ensure you have the following:

### Required Accounts & Services
- **Groq API Key** - Free tier available at [console.groq.com](https://console.groq.com)
- **MongoDB Database** - Choose one:
  - MongoDB Atlas (recommended for production)
  - Local MongoDB instance
  - Docker MongoDB container

### Required Software
- **Node.js** 18+ and npm
- **Git** for cloning the repository
- **Docker** and Docker Compose (for Docker deployment)
- **Code editor** (VS Code recommended)

### Optional Cloud Accounts
- **Vercel** account (for frontend deployment)
- **AWS/GCP/Azure** account (for infrastructure deployment)
- **GitHub** account (for CI/CD)

---

## 💻 Local Development Deployment

### Step 1: Clone the Repository

```bash
git clone https://github.com/RahulBansal-24/PatternIQ.git
cd PatternIQ
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File
```bash
# Create .env file in backend directory
touch .env
```

#### 2.4 Configure Backend Environment Variables
Add the following to `backend/.env`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/patterniq

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# AI Configuration
GROQ_API_KEY=your_groq_api_key_here
```

**Important Notes:**
- Replace `your_secure_jwt_secret_key_here` with a strong random string (min 32 characters)
- Replace `your_groq_api_key_here` with your actual Groq API key
- For production, use MongoDB Atlas connection string

#### 2.5 Start MongoDB (if using local instance)
```bash
# Option 1: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Option 2: Using local MongoDB installation
# Ensure MongoDB service is running
```

#### 2.6 Build and Start Backend
```bash
# Build TypeScript
npm run build

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment File
```bash
# Create .env.local file in frontend directory
touch .env.local
```

#### 3.4 Configure Frontend Environment Variables
Add the following to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### 3.5 Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Verify Deployment

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Login and explore the dashboard
4. Create tasks and reflections to test functionality

---

## 🐳 Docker Deployment

### Option 1: Using Docker Compose (Recommended)

#### Step 1: Create Environment File
Create `.env` file in project root:

```env
JWT_SECRET=your_secure_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

#### Step 2: Build and Start Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

#### Step 3: Access the Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

#### Step 4: Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

### Option 2: Individual Docker Builds

#### Backend Docker Deployment

```bash
cd backend

# Build Docker image
docker build -t patterniq-backend .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name patterniq-backend \
  patterniq-backend
```

#### Frontend Docker Deployment

```bash
cd frontend

# Build Docker image
docker build -t patterniq-frontend .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --name patterniq-frontend \
  patterniq-frontend
```

#### MongoDB Docker Deployment

```bash
# Run MongoDB container
docker run -d \
  -p 27017:27017 \
  --name mongodb \
  -v mongodb_data:/data/db \
  mongo:7.0
```

---

## ☁️ Cloud Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend)

#### Frontend Deployment on Vercel

1. **Prepare for Vercel Deployment**
   ```bash
   # In frontend directory
   npm run build
   ```

2. **Deploy via Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   cd frontend
   vercel
   ```

3. **Configure Environment Variables in Vercel**
   - Go to Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `your_backend_url/api`

4. **Custom Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update DNS settings

#### Backend Deployment on Render

1. **Prepare Repository**
   - Push code to GitHub
   - Ensure backend `.env` variables are set in Render

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory as root
   - Configure build settings:
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **Set Environment Variables in Render**
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/patterniq
   JWT_SECRET=your_secure_jwt_secret
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Deploy**
   - Render will auto-deploy on push
   - Get backend URL from Render dashboard

### Option 2: AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Push Docker Images to ECR**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

   # Create repositories
   aws ecr create-repository --repository-name patterniq-backend
   aws ecr create-repository --repository-name patterniq-frontend

   # Build and push images
   docker build -t patterniq-backend ./backend
   docker tag patterniq-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/patterniq-backend:latest
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/patterniq-backend:latest
   ```

2. **Set up MongoDB on AWS**
   - Use AWS DocumentDB (MongoDB-compatible)
   - Or use MongoDB Atlas

3. **Create ECS Task Definition**
   - Define containers for backend, frontend
   - Configure environment variables
   - Set up networking

4. **Create ECS Service**
   - Launch task definition
   - Configure load balancer
   - Set up auto-scaling

5. **Configure Domain**
   - Use Route 53 for DNS
   - Set up SSL certificates with ACM

#### Using AWS Amplify (Simpler Option)

1. **Backend on Amplify**
   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli

   # Initialize Amplify
   cd backend
   amplify init
   amplify add api
   amplify add function
   amplify push
   ```

2. **Frontend on Amplify**
   ```bash
   cd frontend
   amplify init
   amplify add hosting
   amplify publish
   ```

### Option 3: Google Cloud Platform

#### Using Google Cloud Run

1. **Build and Push Images**
   ```bash
   # Configure gcloud
   gcloud auth configure-docker

   # Build backend
   cd backend
   docker build -t gcr.io/PROJECT_ID/patterniq-backend .
   docker push gcr.io/PROJECT_ID/patterniq-backend

   # Build frontend
   cd ../frontend
   docker build -t gcr.io/PROJECT_ID/patterniq-frontend .
   docker push gcr.io/PROJECT_ID/patterniq-frontend
   ```

2. **Deploy to Cloud Run**
   ```bash
   # Deploy backend
   gcloud run deploy patterniq-backend \
     --image gcr.io/PROJECT_ID/patterniq-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated

   # Deploy frontend
   gcloud run deploy patterniq-frontend \
     --image gcr.io/PROJECT_ID/patterniq-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set up MongoDB**
   - Use Google Cloud Memorystore
   - Or MongoDB Atlas

### Option 4: DigitalOcean

#### Using DigitalOcean App Platform

1. **Push Code to GitHub**
   - Ensure repository is public or connected to DigitalOcean

2. **Create App**
   - Go to DigitalOcean dashboard
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Configure components:
     - Backend: Node.js component
     - Frontend: Static Site/Next.js component

3. **Configure Environment Variables**
   - Add all required environment variables
   - Set up MongoDB (DigitalOcean Managed MongoDB)

4. **Deploy**
   - DigitalOcean will auto-deploy on push

---

## ⚙️ Environment Configuration

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/patterniq` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your_32_char_random_secret_key_here` |
| `PORT` | Backend server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `https://yourdomain.com` |
| `GROQ_API_KEY` | Groq API key for AI analysis | Yes | `gsk_...` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `https://api.yourdomain.com/api` |

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Rotate API keys regularly**
4. **Use different keys for development and production**
5. **Enable MongoDB Atlas IP whitelisting**
6. **Use HTTPS in production**

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Problem:** Backend cannot connect to MongoDB

**Solutions:**
- Verify MongoDB is running: `docker ps` or check MongoDB Atlas status
- Check connection string in `.env`
- Ensure IP whitelist includes your server IP (for MongoDB Atlas)
- Check firewall settings

#### 2. CORS Errors

**Problem:** Frontend cannot connect to backend

**Solutions:**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/src/server.ts`
- Ensure both services are running

#### 3. Groq API Errors

**Problem:** AI analysis not working

**Solutions:**
- Verify `GROQ_API_KEY` is valid
- Check Groq API status and quota
- Ensure API key has required permissions

#### 4. Docker Build Failures

**Problem:** Docker build fails

**Solutions:**
- Clear Docker cache: `docker system prune -a`
- Check Dockerfile syntax
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### 5. Port Already in Use

**Problem:** Services fail to start due to port conflicts

**Solutions:**
```bash
# Find process using port
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Kill process
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Mac/Linux

# Or use different ports in .env files
```

#### 6. Next.js Build Errors

**Problem:** Frontend build fails

**Solutions:**
- Clear Next.js cache: `rm -rf .next`
- Check Node.js version (requires 18+)
- Verify all environment variables are set
- Check for TypeScript errors

### Debug Mode

#### Enable Debug Logging

**Backend:**
```env
NODE_ENV=development
DEBUG=patterniq:*
```

**Frontend:**
```bash
npm run dev
# Check browser console for errors
```

#### Check Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Cloud Platforms:**
- Vercel: Check dashboard logs
- Render: Check logs tab
- AWS: CloudWatch logs
- GCP: Cloud Logging

---

## 📊 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set in production
- [ ] MongoDB Atlas is configured with IP whitelist
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain is configured
- [ ] JWT secret is strong and secure
- [ ] Groq API key is valid and has sufficient quota
- [ ] Database backups are configured
- [ ] Monitoring and logging are set up
- [ ] Error tracking (e.g., Sentry) is configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Security headers are enabled
- [ ] Database indexes are created
- [ ] Frontend build is optimized
- [ ] CDN is configured for static assets

---

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy PatternIQ

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          # Add render deployment script
          curl https://api.render.com/v1/...

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

For deployment issues:
- Check GitHub Issues: [github.com/RahulBansal-24/PatternIQ/issues](https://github.com/RahulBansal-24/PatternIQ/issues)
- Review logs in your deployment platform
- Verify all environment variables are correctly set

---

## 🎯 Quick Start Summary

**For Local Development:**
```bash
git clone https://github.com/RahulBansal-24/PatternIQ.git
cd PatternIQ/backend && npm install && npm run dev
cd ../frontend && npm install && npm run dev
```

**For Docker:**
```bash
git clone https://github.com/RahulBansal-24/PatternIQ.git
cd PatternIQ
echo "JWT_SECRET=your_secret" > .env
echo "GROQ_API_KEY=your_key" >> .env
docker-compose up -d
```

**For Production (Vercel + Render):**
1. Deploy backend to Render with environment variables
2. Deploy frontend to Vercel with `NEXT_PUBLIC_API_URL`
3. Configure custom domains
4. Enable HTTPS

---

**Happy Deploying! 🚀**
