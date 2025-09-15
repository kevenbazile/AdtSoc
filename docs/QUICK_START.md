# Quick Start Guide

## Installation Options

### Option 1: Docker (Recommended)
```bash
git clone https://github.com/yourusername/business-jarvis
cd business-jarvis
docker-compose up -d
```

### Option 2: Manual Installation
```bash
# Backend setup
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend  
npm install
npm run dev
```

### Option 3: One-Click Deploy
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template/business-jarvis)

## First Steps

1. **Access Dashboard**: http://localhost:3000
2. **Create Organization**: Register your company
3. **Configure Monitoring**: Add systems to monitor
4. **Test Incident Response**: Simulate security incident
5. **Review Cost Savings**: Check dashboard metrics

## Demo Environment

Try Business Jarvis with sample pharmaceutical company data:
```bash
npm run demo:pharma
```

This creates a demo environment showing how Business Jarvis would monitor a pharmaceutical manufacturing company.
