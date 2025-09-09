# MedSpa Suite

A comprehensive CRM and analytics platform for medical spas, featuring lead management, campaign tracking, and revenue reporting.

## 🏗️ Architecture

**Monorepo Structure:**
- `/api` - NestJS backend with Prisma ORM and PostgreSQL
- `/frontend` - Next.js 14 App Router with TypeScript and Tailwind CSS
- `/docs` - Project documentation

## 🚀 Local Setup

### Prerequisites

- **Node.js 20.x** - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://www.docker.com/get-started)
- **Git** - [Download here](https://git-scm.com/)

### Quick Start

1. **Clone and navigate to project:**
   ```bash
   git clone <repository-url>
   cd medspa-suite
   ```

2. **Start the database:**
   ```bash
   docker compose up -d
   ```
   This starts PostgreSQL on port 5432 and pgweb (DB browser) on port 8081.

3. **Setup and start the API:**
   ```bash
   cd api
   cp .env.example .env
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```
   API will be available at http://localhost:3001

4. **Setup and start the frontend:**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```
   Frontend will be available at http://localhost:3000

5. **Verify everything works:**
   ```bash
   # Test API endpoints
   curl "http://localhost:3001/reports/revenue?from=2025-08-30&to=2025-09-06"
   
   # PowerShell alternative (Windows)
   Invoke-WebRequest "http://localhost:3001/reports/revenue?from=2025-08-30&to=2025-09-06"
   
   # View database in browser
   # http://localhost:8081
   ```

## 🛠️ Database Workflow

### Daily Development
```bash
# Start database
npm run db:up            # or: docker compose up -d

# Apply new migrations
npm run db:migrate       # or: npx prisma migrate dev

# Reset database with fresh seed data
npm run db:reset         # or: npx prisma migrate reset -f && npm run db:seed

# Seed database only
npm run db:seed          # or: npx prisma db seed

# Stop database (removes all data)
npm run db:down          # or: docker compose down -v
```

### Database Inspection
- **pgweb UI**: http://localhost:8081
- **Prisma Studio**: `cd api && npm run prisma:studio`

### Creating Migrations
```bash
cd api

# Make changes to schema.prisma, then:
npx prisma migrate dev --name "describe_your_changes"

# For production deployments:
npx prisma migrate deploy
```

## 📊 API Testing

### Sample API Calls

**Revenue Report:**
```bash
curl "http://localhost:3001/reports/revenue?from=2025-09-01&to=2025-09-07"
```

**Dashboard KPI Events:**
```bash
curl "http://localhost:3001/dashboard/kpi/events"
```

**Leads List:**
```bash
curl "http://localhost:3001/leads"
```

### Report Logic
- Revenue reports use **end-exclusive** date ranges (from <= date < to)
- KPI events use `TIMESTAMPTZ(6)` for precise timezone handling
- Seed data spans 7 days for comprehensive testing

## 🧪 Testing

### API Tests
```bash
cd api
npm run test:api        # Run Jest test suite
npm run test:watch      # Watch mode for development
npm run test:cov        # Generate coverage report
```

### Linting & Type Checking
```bash
cd api
npm run lint           # ESLint
npx tsc --noEmit      # TypeScript check

cd ../frontend
npm run lint          # Next.js linting
npx tsc --noEmit      # TypeScript check
```

## 🔄 CI/CD

### GitHub Actions
- **Lint**: Code quality checks for both API and frontend
- **Typecheck**: TypeScript validation
- **Test**: API Jest test suite
- **Integration**: End-to-end smoke tests with real database

### Production Deployment
See commented section in `.github/workflows/ci.yml` for production deployment examples.
**Never commit real secrets** - use GitHub Secrets and Environment protection rules.

## 🗄️ Data Models

### Core Entities
- **Campaigns** - Marketing campaigns with spend tracking
- **Leads** - Customer prospects with source attribution
- **KpiEvents** - Timestamped events (clicks, bookings, payments)
- **Opportunities** - Sales pipeline with value predictions
- **PipelineStages** - Lead progression tracking

### Database Features
- **Timestamped events** with timezone support
- **Indexed queries** for fast reporting
- **Referential integrity** with cascading deletes
- **JSON metadata** for flexible event data

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Ensure Docker is running
docker compose ps

# Restart database
docker compose restart postgres

# Check logs
docker compose logs postgres
```

**Windows File Lock Errors (EPERM):**
```bash
# Stop all Node processes
taskkill /f /im node.exe

# Clear Prisma cache
rm -rf api/node_modules/.prisma
cd api && npm run prisma:generate
```

**Port Conflicts:**
- API (3001), Frontend (3000), PostgreSQL (5432), pgweb (8081)
- Change ports in docker-compose.yml and .env files if needed

### Environment Files
- Keep **all .env files** in .gitignore
- **Never commit real secrets** - use .env.example templates
- Copy .env.example → .env and customize locally

## 📝 Development Notes

### Code Conventions
- **API**: NestJS with Prisma, ESLint + Prettier
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with timestamped events
- **Testing**: Jest for API, integration smoke tests

### Seed Data
- 4 campaigns across different platforms
- 12 leads with realistic conversion funnel
- KPI events with multi-day timestamps for report testing
- High-value opportunities and pipeline tracking

---

## 🆘 Support

For questions or issues:
1. Check this README first
2. Review the `/docs` directory
3. Check GitHub Issues
4. Review the API tests in `/api/src/**/*.spec.ts`

**Happy coding! 🚀**