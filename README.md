# 🧩 PatternIQ - AI-Powered Behavioral Intelligence Platform

**✨ Transform your productivity data into actionable insights with AI-driven behavioral analysis** 🤖

PatternIQ is a production-ready full-stack web application that helps users understand **WHY** their productivity changes instead of simply tracking productivity. It combines planned tasks, completed tasks, daily reflections, and screen time into structured behavioral evidence that is processed through **Groq AI** and transformed into explainable, personalized insights. 🎯

---

# 📖 Overview

PatternIQ is an intelligent productivity platform that goes beyond simple task tracking by analyzing behavioral patterns to provide deep insights into your productivity drivers. The application collects comprehensive data through tasks, daily reflections, and screen time tracking, then uses AI to identify patterns, correlations, and personalized recommendations.

## 🎯 What It Solves

- 🔍 **Productivity Mystery**: Understands WHY your productivity fluctuates instead of just tracking WHAT you do
- 🧠 **Pattern Recognition**: Identifies recurring behavioral patterns that affect your performance
- 📊 **Data-Driven Insights**: Transforms raw data into actionable, personalized recommendations
- 🎯 **Holistic Tracking**: Combines tasks, mood, energy, motivation, and screen time for complete analysis

## 👥 Target Users

- 💼 Professionals seeking to optimize their productivity
- 🎓 Students wanting to understand their study patterns
- 🌱 Anyone interested in behavioral self-improvement
- 👥 Teams looking to analyze collective productivity patterns

## 🔄 Overall Workflow

1. 📝 **Data Collection**: Users log tasks, daily reflections, and screen time
2. 🤖 **AI Processing**: System aggregates data and generates behavioral evidence
3. 🔍 **Pattern Analysis**: AI identifies patterns, correlations, and trends
4. 💡 **Insight Generation**: Personalized recommendations and insights are created
5. 📊 **Visualization**: Beautiful charts and dashboards display trends and patterns
6. 🚀 **Continuous Improvement**: Fortnightly insights update automatically with new data

---

# ✨ Features

## 🔐 Authentication
- ✅ **User Registration**: Secure account creation with email validation
- ✅ **JWT Authentication**: Token-based authentication with refresh tokens
- ✅ **Protected Routes**: All API endpoints protected with authentication middleware
- ✅ **Profile Management**: Users can view and update their profile information
- ✅ **Account Deletion**: Users can permanently delete their accounts

## 🎯 Core Features
- ✅ **Task Management**: Create, edit, delete, and complete tasks with timestamps
- ✅ **Daily Reflections**: 24-hour restricted reflections with mood, energy, and motivation tracking
- ✅ **Screen Time Tracking**: Manual entry for total, productive, and entertainment screen time
- ✅ **Productive vs Entertainment**: Separate tracking for productive and entertainment screen time
- ✅ **Daily Limits**: One reflection per day to ensure consistent data quality

## 📊 Dashboard
- ✅ **Real-time Metrics**: Live productivity scores and statistics
- ✅ **Weekly Summary**: Quick overview of weekly performance
- ✅ **Task Overview**: Today's tasks with completion status
- ✅ **Screen Time Display**: Current day's screen time breakdown
- ✅ **Quick Actions**: Fast access to create tasks and reflections

## 📈 Analytics
- ✅ **Efficiency Trends**: Line charts showing professional efficiency and wellbeing scores over time
- ✅ **Task Completion**: Bar charts comparing planned vs completed tasks
- ✅ **Screen Time Analysis**: Line charts showing total, productive, and entertainment screen time
- ✅ **Weekly Comparison**: Compare this week's performance with last week
- ✅ **Monthly Comparison**: Compare this month's performance with last month
- ✅ **Fortnightly AI Insights**: AI-generated insights updated every 14 days based on accumulated data

## 🤖 AI & Analysis
- ✅ **Groq AI Integration**: Uses Groq SDK with Llama 3.3 70B model for analysis
- ✅ **Daily Growth Analysis**: AI-powered analysis of daily productivity patterns
- ✅ **Root Cause Detection**: Identifies main factors influencing productivity
- ✅ **Behavioral Patterns**: Detects recurring patterns in user behavior
- ✅ **Confidence Scores**: Provides confidence scores for AI-generated insights
- ✅ **Personalized Recommendations**: Actionable recommendations based on user data
- ✅ **Fortnightly Insights**: Aggregated insights generated every 14 days from historical data

## 🔒 Security
- ✅ **Password Hashing**: Secure password storage using bcrypt
- ✅ **JWT Tokens**: Secure token-based authentication
- ✅ **Rate Limiting**: API rate limiting to prevent abuse
- ✅ **CORS Configuration**: Cross-origin resource sharing protection
- ✅ **Helmet Security**: Security headers for Express.js
- ✅ **Input Validation**: Request validation using express-validator

## ⚡ Performance
- ✅ **Database Indexing**: Optimized queries with proper indexing
- ✅ **Efficient Aggregation**: Optimized data aggregation for analytics
- ✅ **Caching Strategy**: Smart caching for frequently accessed data
- ✅ **Lazy Loading**: Frontend components load data on demand

## 🎨 User Experience
- ✅ **Modern SaaS Design**: Beautiful glassmorphism UI with gradients
- ✅ **Dark Mode**: Full dark mode support throughout the application
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Smooth Animations**: Framer Motion animations for better UX
- ✅ **Loading States**: Skeleton loaders and spinners for better perceived performance
- ✅ **Toast Notifications**: Sonner toast notifications for user feedback
- ✅ **Empty States**: Beautiful empty state designs when no data exists
- ✅ **Interactive Charts**: Recharts for beautiful, interactive data visualization

## 🛠️ Developer Features
- ✅ **TypeScript**: Full TypeScript support for type safety
- ✅ **Hot Reload**: Development servers with hot module replacement
- ✅ **Docker Support**: Containerized deployment with Docker and Docker Compose
- ✅ **Environment Configuration**: Easy environment variable management
- ✅ **RESTful API**: Well-structured REST API design
- ✅ **Modular Architecture**: Clean separation of concerns

---

# 🏗️ Project Architecture

PatternIQ follows a modern full-stack architecture with clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────────────────┐
│                     🎨 Frontend (Next.js)                   │
│  ⚛️  React Components with TypeScript                       │
│  🗃️  State Management with Zustand                          │
│  🎨  Beautiful UI with TailwindCSS & shadcn/ui              │
│  📊  Data Visualization with Recharts                       │
└────────────────────┬────────────────────────────────────────┘
                     │ 🔗 HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   ⚙️  Backend (Express.js)                  │
│  🔌 REST API with TypeScript                                │
│  🔐 JWT Authentication Middleware                           │
│  ✅ Request Validation & Error Handling                     │
│  🛡️  Rate Limiting & Security Headers                       │
└────────────────────┬────────────────────────────────────────┘
                     │ 🗄️  Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    🗄️  MongoDB Database                     │
│  👤 Users, 📋 Tasks, 💭 Reflections, ⏱️  ScreenTime        │
│  🤖 AIAnalysis, 📈 FortnightlyInsights, 📊 DailyMetrics    │
│  ⚡ Indexed for optimal query performance                   │
└────────────────────┬────────────────────────────────────────┘
                     │ 🤖 Groq SDK
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   🧠 Groq AI Service                        │
│  🦙 Llama 3.3 70B Model                                     │
│  🔍 Behavioral Pattern Analysis                             │
│  💡 Personalized Recommendations                            │
└─────────────────────────────────────────────────────────────┘
```

---

# 📂 Project Structure

<details>
<summary>📁 Click to expand full project structure</summary>

```
PatternIQ/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection configuration
│   │   │   └── index.ts             # Environment variables configuration
│   │   ├── controllers/
│   │   │   ├── analysisController.ts    # AI analysis endpoints
│   │   │   ├── authController.ts        # Authentication logic
│   │   │   ├── chartsController.ts      # Analytics charts data
│   │   │   ├── dashboardController.ts   # Dashboard data aggregation
│   │   │   ├── reflectionController.ts  # Daily reflections
│   │   │   ├── screenTimeController.ts  # Screen time tracking
│   │   │   ├── settingsController.ts    # User settings
│   │   │   └── taskController.ts        # Task management
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT authentication middleware
│   │   │   └── errorHandler.ts      # Global error handling
│   │   ├── models/
│   │   │   ├── AIAnalysis.ts        # AI analysis data model
│   │   │   ├── BehaviorPattern.ts   # Behavioral patterns model
│   │   │   ├── DailyMetrics.ts      # Daily efficiency scores
│   │   │   ├── FortnightlyInsights.ts # Fortnightly aggregated insights
│   │   │   ├── Reflection.ts        # Daily reflections model
│   │   │   ├── ScreenTime.ts        # Screen time tracking model
│   │   │   ├── Settings.ts          # User preferences model
│   │   │   ├── Task.ts              # Task management model
│   │   │   ├── User.ts              # User authentication model
│   │   │   └── WeeklyReport.ts      # Weekly summary model
│   │   ├── routes/
│   │   │   ├── analysis.ts          # Analysis API routes
│   │   │   ├── auth.ts              # Authentication routes
│   │   │   ├── charts.ts            # Analytics charts routes
│   │   │   ├── dashboard.ts         # Dashboard routes
│   │   │   ├── reflections.ts       # Reflection routes
│   │   │   ├── screenTime.ts        # Screen time routes
│   │   │   ├── settings.ts          # Settings routes
│   │   │   └── tasks.ts             # Task routes
│   │   ├── services/
│   │   │   ├── aiService.ts         # Groq AI integration service
│   │   │   └── fortnightlyInsightsService.ts # Fortnightly insights generation
│   │   ├── utils/
│   │   │   ├── passwordUtils.ts     # Password hashing utilities
│   │   │   └── scoring.ts           # Productivity scoring algorithms
│   │   └── server.ts                # Express server entry point
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   └── Dockerfile                   # Backend Docker configuration
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/               # Login page
│   │   │   └── register/            # Registration page
│   │   ├── dashboard/
│   │   │   ├── analytics/           # Analytics page with charts
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── reflection/          # Daily reflection form
│   │   │   ├── screen-time/         # Screen time tracking
│   │   │   ├── settings/            # User settings
│   │   │   └── tasks/               # Task management
│   │   ├── landing/                 # Landing page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Skeleton.tsx
│   │   └── Navbar.tsx               # Navigation component
│   ├── lib/
│   │   ├── axios.ts                 # Axios HTTP client configuration
│   │   └── utils.ts                 # Utility functions
│   ├── store/
│   │   └── authStore.ts             # Zustand authentication store
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── utils/
│   │   └── cn.ts                    # Class name utility
│   ├── package.json                 # Frontend dependencies
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # TailwindCSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── Dockerfile                   # Frontend Docker configuration
├── docker-compose.yml               # Docker Compose configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

</details>

## 📁 Folder Purposes

- ⚙️ **backend/src/config/** - Configuration files for database and environment variables
- 🎮 **backend/src/controllers/** - Business logic for handling API requests
- 🔐 **backend/src/middleware/** - Custom middleware for authentication and error handling
- 🗄️ **backend/src/models/** - Mongoose schemas for MongoDB collections
- 🛣️ **backend/src/routes/** - API route definitions
- 🤖 **backend/src/services/** - External service integrations (AI, insights generation)
- 🛠️ **backend/src/utils/** - Utility functions for passwords, scoring, etc.
- 📱 **frontend/app/** - Next.js app router pages and layouts
- 🧩 **frontend/components/** - Reusable React components
- 📚 **frontend/lib/** - Library configurations and utilities
- 🗃️ **frontend/store/** - State management with Zustand
- 📝 **frontend/types/** - TypeScript type definitions

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS |
| **UI Components** | shadcn/ui, Framer Motion, Lucide React |
| **State Management** | Zustand |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Notifications** | Sonner |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **AI/ML** | Groq SDK (Llama 3.3 70B) |
| **Security** | Helmet, CORS, express-rate-limit |
| **Validation** | express-validator |
| **Development** | nodemon, ts-node, ESLint |
| **Deployment** | Docker, Docker Compose |

---

# ⚙️ Installation

## 📋 Prerequisites

- 💻 **Node.js** 18+ 
- 🗄️ **MongoDB** (local instance or MongoDB Atlas)
- 🔑 **Groq API Key** (free tier available at [console.groq.com](https://console.groq.com))

## 🔧 Backend Setup

1. 📥 **Clone the repository**
```bash
git clone https://github.com/RahulBansal-24/PatternIQ.git
cd PatternIQ
```

2. 📁 **Navigate to backend directory**
```bash
cd backend
```

3. 📦 **Install dependencies**
```bash
npm install
```

4. 🔧 **Create environment file**
```bash
cp .env.example .env
```

5. ⚙️ **Configure environment variables**
```env
MONGODB_URI=mongodb://localhost:27017/patterniq
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key_here
```

6. 🚀 **Start the backend server**
```bash
npm run dev
```

The backend will start on `http://localhost:5000` 🎉

## 🎨 Frontend Setup

1. 📁 **Navigate to frontend directory**
```bash
cd frontend
```

2. 📦 **Install dependencies**
```bash
npm install
```

3. 🔧 **Create environment file**
```bash
cp .env.local.example .env.local
```

4. ⚙️ **Configure environment variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. 🚀 **Start the frontend development server**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000` 🎨

## 🐳 Docker Setup

### Using Docker Compose (Recommended) 🐋

1. 🏗️ **Build and start all services**
```bash
docker-compose up -d
```

2. 🌐 **Access the application**
- 🎨 Frontend: `http://localhost:3000`
- ⚙️ Backend: `http://localhost:5000`

3. 🛑 **Stop services**
```bash
docker-compose down
```

### Individual Docker Builds 🔧

**Backend:**
```bash
cd backend
docker build -t patterniq-backend .
docker run -p 5000:5000 --env-file .env patterniq-backend
```

**Frontend:**
```bash
cd frontend
docker build -t patterniq-frontend .
docker run -p 3000:3000 --env-file .env.local patterniq-frontend
```

---

# 🔑 Environment Variables

## Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/patterniq` |
| `JWT_SECRET` | Secret key for JWT token generation | Yes | (none) |
| `PORT` | Backend server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |
| `GROQ_API_KEY` | Groq API key for AI analysis | Yes | (none) |

## Frontend (.env.local)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:5000/api` |

---

# ▶️ Usage

## 🚀 Getting Started

1. 📝 **Register an account**: Navigate to `/auth/register` and create your account
2. 🔐 **Login**: Use your credentials to login at `/auth/login`
3. ✅ **Create tasks**: Add tasks to your dashboard to track your work
4. 💭 **Daily reflection**: Submit a daily reflection with mood, energy, and motivation
5. ⏱️ **Track screen time**: Log your productive and entertainment screen time
6. 📊 **View analytics**: Check the analytics page for insights and trends

## 📊 Daily Workflow

1. 🌅 **Morning**: Plan your tasks for the day
2. ⏰ **Throughout day**: Complete tasks and track screen time
3. 🌙 **Evening**: Submit your daily reflection with how you felt
4. 📈 **Weekly**: Review analytics to identify patterns and trends
5. 🤖 **Fortnightly**: Check AI insights for personalized recommendations

---

# 📡 API Documentation

<details>
<summary>📁 Click to expand full API documentation</summary>

## Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| DELETE | `/api/auth/delete-account` | Delete user account | Yes |

### Register Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

### Login Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

## Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/today` | Get today's tasks | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Create Task Request Body
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README for the project",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

## Reflections

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reflections` | Create reflection | Yes |
| GET | `/api/reflections` | Get all reflections | Yes |
| GET | `/api/reflections/today` | Get today's reflection | Yes |

### Create Reflection Request Body
```json
{
  "text": "Had a productive day today. Completed all planned tasks.",
  "mood": "positive",
  "energy": "high",
  "motivation": "high",
  "productiveMinutes": 120,
  "entertainmentMinutes": 30
}
```

## Screen Time

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/screen-time` | Create/update screen time | Yes |
| GET | `/api/screen-time` | Get screen time data | Yes |
| GET | `/api/screen-time/today` | Get today's screen time | Yes |
| GET | `/api/screen-time/today/status` | Get today's screen time status | Yes |
| GET | `/api/screen-time/weekly` | Get weekly screen time | Yes |

### Create Screen Time Request Body
```json
{
  "totalMinutes": 150,
  "productiveMinutes": 120,
  "entertainmentMinutes": 30
}
```

## Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard` | Get dashboard data | Yes |
| GET | `/api/dashboard/weekly-summary` | Get weekly summary | Yes |

## Charts & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/charts/efficiency` | Get efficiency trend | Yes |
| GET | `/api/charts/task-completion` | Get task completion trend | Yes |
| GET | `/api/charts/screen-time` | Get screen time trend | Yes |
| GET | `/api/charts/weekly-comparison` | Get weekly comparison | Yes |
| GET | `/api/charts/monthly-comparison` | Get monthly comparison | Yes |
| GET | `/api/charts/fortnightly-insights` | Get fortnightly AI insights | Yes |

## Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analysis` | Get all analysis | Yes |
| GET | `/api/analysis/latest` | Get latest analysis | Yes |
| POST | `/api/analysis/generate` | Generate new analysis | Yes |
| GET | `/api/analysis/patterns` | Get behavioral patterns | Yes |

## Settings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/settings` | Get user settings | Yes |
| PUT | `/api/settings` | Update user settings | Yes |

### Update Settings Request Body
```json
{
  "theme": "dark",
  "notifications": true,
  "dailyReminder": "09:00"
}
```

</details>

---

# 🔒 Security Features

PatternIQ implements multiple layers of security to protect user data: 🛡️

- 🔐 **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- 🔒 **Password Hashing**: All passwords are hashed using bcrypt before storage
- ⚡ **Rate Limiting**: API rate limiting (100 requests per 15 minutes) to prevent abuse
- 🌐 **CORS Configuration**: Cross-origin resource sharing properly configured
- 🪖 **Helmet Security Headers**: Security headers for Express.js including CSP, XSS protection
- ✅ **Input Validation**: All inputs validated using express-validator
- 🗄️ **MongoDB Sanitization**: NoSQL injection prevention through Mongoose
- 🔑 **Environment Variables**: Sensitive data stored in environment variables
- 🚧 **Protected Routes**: All API endpoints (except auth) require authentication

---

# 📈 Performance

PatternIQ is optimized for performance: ⚡

- 🗄️ **Database Indexing**: All frequently queried fields are indexed for fast lookups
- 🔄 **Efficient Aggregation**: Optimized MongoDB aggregation pipelines for analytics
- ⏳ **Lazy Loading**: Frontend components load data on demand
- 📦 **Code Splitting**: Next.js automatic code splitting for faster initial load
- 🖼️ **Image Optimization**: Next.js automatic image optimization
- 💾 **Caching Strategy**: Smart caching for frequently accessed data
- 🎯 **Minimized Bundle**: Tree shaking and dead code elimination

---

# 📸 Screenshots

📸 **Coming Soon!** Screenshots will be added soon to showcase the beautiful UI!

![Landing Page](docs/screenshots/landing.png)
![Dashboard](docs/screenshots/dashboard.png)
![Analytics](docs/screenshots/analytics.png)
![Task Management](docs/screenshots/tasks.png)
![Daily Reflection](docs/screenshots/reflection.png)

---

# 🧪 Testing

Currently, PatternIQ does not have automated tests. Testing is done manually through the application interface. 🧪

Future testing plans:
- ✅ Unit tests for backend controllers
- ✅ Integration tests for API endpoints
- ✅ E2E tests with Playwright
- ✅ Component tests for React components

---

# 🚀 Deployment

## 🌐 Production Deployment

### Backend Deployment ⚙️

1. ⚙️ **Set production environment variables**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/patterniq
JWT_SECRET=your_secure_jwt_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
GROQ_API_KEY=your_groq_api_key
```

2. 🔨 **Build the backend**
```bash
cd backend
npm run build
```

3. 🚀 **Start production server**
```bash
npm start
```

### Frontend Deployment 🎨

1. ⚙️ **Set production environment variables**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

2. 🔨 **Build the frontend**
```bash
cd frontend
npm run build
```

3. 🚀 **Start production server**
```bash
npm start
```

### Docker Deployment 🐳

1. 🏗️ **Build and deploy with Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. ☁️ **Or deploy individually to cloud platforms**
- ⚙️ Backend: Deploy to AWS ECS, Google Cloud Run, or Heroku
- 🎨 Frontend: Deploy to Vercel, Netlify, or AWS Amplify

---

# 📋 Scripts

## Backend Scripts ⚙️

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server with hot reload |
| `npm run build` | 🔨 Compile TypeScript to JavaScript |
| `npm start` | ▶️ Start production server |
| `npm run seed` | 🌱 Seed database with test data |

## Frontend Scripts 🎨

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start Next.js development server |
| `npm run build` | 🔨 Build for production |
| `npm start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint for code linting |

---

# 🤝 Contributing

We welcome contributions to PatternIQ! Here's how you can help: 🌟

1. 🍴 **Fork the repository**
2. 🌿 **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. 📤 **Push to the branch** (`git push origin feature/amazing-feature`)
5. 🔀 **Open a Pull Request**

## 📝 Contribution Guidelines

- ✍️ Write clean, readable code with comments
- 🎨 Follow the existing code style and structure
- 🧪 Add tests for new features
- 📚 Update documentation as needed
- ✅ Ensure all tests pass before submitting

---

# 🛣️ Roadmap

## ✅ Completed Features

- ✅ User authentication with JWT 🔐
- ✅ Task management system 📋
- ✅ Daily reflections with mood tracking 💭
- ✅ Screen time tracking (productive vs entertainment) ⏱️
- ✅ AI-powered behavioral analysis 🤖
- ✅ Analytics dashboard with charts 📊
- ✅ Fortnightly AI insights 📈
- ✅ Responsive design with dark mode 🌙
- ✅ Docker support 🐳

## ⏳ Future Features

- ⏳ Push notifications for reminders 🔔
- ⏳ Mobile app (React Native) 📱
- ⏳ Team/collaboration features 👥
- ⏳ Advanced AI predictions 🧠
- ⏳ Integration with calendar apps 📅
- ⏳ Export data to CSV/PDF 📄
- ⏳ Automated testing suite 🧪
- ⏳ Real-time collaboration ⚡
- ⏳ Gamification elements 🎮
- ⏳ Integration with productivity tools (Notion, Trello) 🔗

---

# 👥 Authors

## 👨‍💻 Rahul Bansal
- GitHub: [https://github.com/RahulBansal-24](https://github.com/RahulBansal-24)

## 👩‍💻 Jiya Manaktala
- GitHub: [https://github.com/jiyamanaktala](https://github.com/jiyamanaktala)

---

# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Rahul Bansal, Jiya Manaktala

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

# 🙏 Acknowledgements

We would like to thank the following open-source projects and tools: 🙏

- 🤖 **Groq AI** - For providing the AI analysis capabilities with Llama 3.3 70B
- ⚛️ **Next.js** - For the amazing React framework
- 🎨 **shadcn/ui** - For the beautiful UI components
- 📊 **Recharts** - For the data visualization library
- 🎬 **Framer Motion** - For the smooth animations
- 🎨 **TailwindCSS** - For the utility-first CSS framework
- 🗄️ **MongoDB** - For the flexible NoSQL database
- ⚡ **Express.js** - For the robust backend framework
- 🎯 **Lucide** - For the beautiful icon set

---

# ⭐ Support

If you find PatternIQ helpful, please consider giving it a ⭐ on GitHub! 🌟

**Ways to support:**
- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report issues
- 💡 Suggest features
- 📖 Improve documentation
- 🤝 Contribute code

---

# 📬 Contact

Feel free to reach out to the authors: 📧

- 👨‍💻 **Rahul Bansal**: [https://github.com/RahulBansal-24](https://github.com/RahulBansal-24)
- 👩‍💻 **Jiya Manaktala**: [https://github.com/jiyamanaktala](https://github.com/jiyamanaktala)

---

**Made with ❤️ by Rahul Bansal and Jiya Manaktala**

<div align="center">

**⭐ If you like this project, please give it a star! ⭐**

</div>
