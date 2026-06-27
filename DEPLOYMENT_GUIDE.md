# Complete Deployment Guide - React Frontend + Laravel Backend
## FireShop Project Deployment (Professional Standard)

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
3. [Backend Deployment (Vercel/Railway/Render)](#backend-deployment)
4. [Database & Environment Setup](#database--environment-setup)
5. [Post-Deployment Steps](#post-deployment-steps)

---

## Project Overview

आपके पास एक full-stack application है:
- **Frontend**: React (Vite) - Netlify पर deploy करेंगे
- **Backend**: Laravel - Production server पर deploy करेंगे
- **Database**: MySQL/Database - Server के साथ

---

# 🎨 FRONTEND DEPLOYMENT (Netlify) - React/Vite

## Step 1: Frontend के लिए Build तैयार करें

### 1.1 - Local में production build test करें

```bash
cd frontend
npm install
npm run build
npm run preview
```

यह commands:
- सभी dependencies install करेंगे
- Production-ready build बनाएंगे
- Local में preview दिखाएंगे

### 1.2 - Build folder check करें

```
frontend/
├── dist/          ← यह folder Netlify पर upload होगा
├── src/
├── package.json
└── vite.config.js
```

**dist/ folder** में ये files होंगी:
- `index.html` (main entry point)
- `assets/` (JS, CSS bundles)

---

## Step 2: GitHub पर Push करें

### 2.1 - GitHub repo बनाएं (अगर नहीं है)

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fireshop.git
git push -u origin main
```

### 2.2 - GitHub में frontend folder को track करें

```bash
# अगर पूरा project एक repo है तो:
git add frontend/
git commit -m "Add frontend for deployment"
git push
```

---

## Step 3: Netlify पर Deploy करें

### 3.1 - Netlify Account बनाएं
1. https://app.netlify.com/signup/start पर जाएं
2. **Sign up with GitHub** चुनें
3. अपना GitHub account authorize करें

### 3.2 - New Site बनाएं

**Method 1: GitHub से Direct Deploy (Recommended)**

1. Netlify Dashboard में जाएं
2. **"Add new site"** → **"Import an existing project"** क्लिक करें
3. GitHub चुनें → अपना fireshop repo select करें
4. Deploy settings configure करें:

```
Build Settings:
├── Base directory: frontend/
├── Build command: npm run build
└── Publish directory: frontend/dist
```

5. **Deploy site** क्लिक करें ✅

**Method 2: Manual Upload (Alternative)**

```bash
# Local में build बनाएं
cd frontend
npm run build

# Netlify CLI install करें
npm install -g netlify-cli

# Deploy करें
netlify deploy --prod --dir=dist
```

---

## Step 4: Environment Variables Setup (Netlify)

### 4.1 - Netlify Dashboard में जाएं
1. Site settings → Build & deploy
2. **Environment** section में जाएं
3. नए variables add करें:

```
REACT_APP_API_URL = https://your-backend-domain.com/api
REACT_APP_API_BASE_URL = https://your-backend-domain.com
```

### 4.2 - React में use करें

**src/config/api.js** (या similar file में):

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default API_URL;
```

फिर अपने API calls में:

```javascript
import API_URL from '../config/api';

fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## Step 5: Domain Setup (Optional but Professional)

### 5.1 - Custom Domain जोड़ें
1. Netlify → Site settings → Domain management
2. **Add domain** क्लिक करें
3. अपना domain add करें (जैसे: fireshop.com)
4. DNS settings update करें

### 5.2 - SSL Certificate (Automatic)
Netlify automatically HTTPS setup करता है ✅

---

---

# 🔧 BACKEND DEPLOYMENT (Laravel)

## Step 1: Backend के लिए Prepare करें

### 1.1 - Local में test करें

```bash
cd Backend2
php artisan serve
```

### 1.2 - Environment file check करें

**Backend2/.env** file में सही settings हों:

```env
APP_NAME=FireShop
APP_ENV=production
APP_KEY=base64:... (generate करें)
APP_URL=https://your-backend-domain.com

DB_CONNECTION=mysql
DB_HOST=your-database-host
DB_PORT=3306
DB_DATABASE=fireshop_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SANCTUM_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 1.3 - Database migrations run करें

```bash
php artisan migrate
php artisan db:seed
```

---

## Step 2: Production Server को Select करें

### Option A: Vercel (Recommended for Laravel)
- Free tier available
- Easy deployment
- Fast and reliable

### Option B: Railway
- 5$ monthly free credits
- Simple setup
- Good for Indian users

### Option C: Render
- Free tier with limitations
- Good uptime
- Easy deployment

### Option D: Traditional Hosting (Bluehost, HostGator, etc.)
- More control
- Manual setup required
- Better for large projects

---

## Step 3: Deploy on Vercel (Laravel)

### 3.1 - Vercel Account बनाएं
https://vercel.com पर जाएं और sign up करें

### 3.2 - project को configure करें

**Backend2/ में ये file बनाएं: `vercel.json`**

```json
{
  "framework": "laravel",
  "buildCommand": "composer install && php artisan migrate",
  "env": {
    "APP_KEY": "@APP_KEY",
    "DB_CONNECTION": "mysql",
    "DB_HOST": "@DB_HOST",
    "DB_USERNAME": "@DB_USERNAME",
    "DB_PASSWORD": "@DB_PASSWORD",
    "DB_DATABASE": "@DB_DATABASE"
  }
}
```

### 3.3 - GitHub push करें

```bash
cd Backend2
git add .
git commit -m "Add Laravel backend for deployment"
git push
```

### 3.4 - Vercel में Deploy करें
1. Vercel dashboard पर जाएं
2. **New Project** → अपना GitHub repo select करें
3. Framework: **Laravel** select करें
4. Environment variables add करें (Step 3.2 से)
5. **Deploy** क्लिक करें

---

## Step 4: Deploy on Railway (Alternative)

### 4.1 - Railway Account बनाएं
https://railway.app पर जाएं

### 4.2 - New Project बनाएं
1. **New Project** क्लिक करें
2. **Deploy from GitHub repo** select करें
3. अपना fireshop repo select करें

### 4.3 - Environment Variables add करें
Dashboard में → Variables section:

```
APP_KEY = base64:...
DB_HOST = mysql_service_name
DB_USERNAME = railway
DB_PASSWORD = ...
DB_DATABASE = railway
```

### 4.4 - Procfile बनाएं (Backend2/)

```
web: vendor/bin/heroku-php-nginx public/
```

---

## Step 5: Database Setup

### 5.1 - Remote MySQL Database बनाएं

**Option 1: Railway integrated MySQL**
- Railway Dashboard में **Add a service** → MySQL चुनें
- Auto-connects to your app

**Option 2: External MySQL Service**
- Clever Cloud
- AWS RDS
- Google Cloud SQL

### 5.2 - Database migrate करें

```bash
php artisan migrate:fresh --seed
```

---

---

# 🗄️ DATABASE & ENVIRONMENT SETUP

## Complete .env Template (Backend)

**Backend2/.env**

```env
# App Configuration
APP_NAME=FireShop
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.fireshop.com

# Generate करें: php artisan key:generate
APP_KEY=base64:xxxxxxxxxxx

# Database
DB_CONNECTION=mysql
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_DATABASE=fireshop
DB_USERNAME=root
DB_PASSWORD=your_password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@fireshop.com

# API Configuration
API_PREFIX=api
API_VERSION=v1

# CORS Settings
SANCTUM_STATEFUL_DOMAINS=fireshop.com
SANCTUM_CORS_ALLOWED_ORIGINS=https://fireshop.com

# Payment Gateway (अगर use कर रहे हैं)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx

# AWS/File Storage (अगर use कर रहे हैं)
FILESYSTEM_DRIVER=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

---

# ✅ POST-DEPLOYMENT STEPS

## Step 1: Test करें

### Frontend को test करें
```
1. Netlify URL खोलें (जैसे: https://fireshop-123.netlify.app)
2. Homepage load हो रहा है?
3. Console में errors नहीं हैं?
```

### Backend को test करें
```
1. Backend URL खोलें (जैसे: https://api.railway.app)
2. /api status check करें
3. Database connected है?
```

### API Connection test करें
```bash
curl https://api.railway.app/api/products
```

---

## Step 2: CORS Settings ठीक करें

अगर frontend से API call fail हो रहा है:

**Backend2/config/cors.php** में:

```php
'allowed_origins' => [
    'https://fireshop.netlify.app',
    'https://fireshop.com',
    'http://localhost:5173',  // development
],

'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## Step 3: SSL Certificate verify करें

```bash
# Check करें certificate valid है
curl -I https://api.railway.app
```

Response में ये होना चाहिए:
```
HTTP/2 200
strict-transport-security: max-age=31536000
```

---

## Step 4: Monitoring Setup करें

### Netlify Analytics
- Dashboard → Analytics tab
- Automatically enabled

### Backend Monitoring
```bash
# Logs check करें
php artisan logs

# या Railway/Vercel dashboard में देखें
```

---

## Step 5: Automated Deployments Setup करें

### Option 1: Git Push से Auto-deploy
- दोनों Netlify और Railway/Vercel automatically deploy करते हैं जब आप `main` branch को push करते हो

### Option 2: GitHub Actions (Advanced)

**Backend2/.github/workflows/deploy.yml** बनाएं:

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Railway
      run: |
        npm i -g @railway/cli
        railway deploy
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

---

# 📊 DEPLOYMENT CHECKLIST

```
Frontend (React/Netlify):
✅ npm run build locally successful
✅ dist/ folder generated
✅ GitHub repo में push किया
✅ Netlify पर project connect किया
✅ Environment variables add किए
✅ Build command correct है: npm run build
✅ Publish directory correct है: frontend/dist
✅ Custom domain setup (optional)
✅ SSL certificate working

Backend (Laravel):
✅ .env file properly configured
✅ APP_KEY generated
✅ Database migrations ready
✅ Database service connected
✅ GitHub push किया
✅ Vercel/Railway account setup
✅ Environment variables add किए
✅ CORS properly configured
✅ API accessible from frontend

Final Testing:
✅ Frontend load हो रहा है
✅ API calls working हैं
✅ Database queries successful हैं
✅ Login/Authentication working
✅ Payment processing (अगर implement किया है)
✅ Email notifications (अगर implement किया है)
```

---

---

# 🚀 DEPLOYMENT COMMANDS SUMMARY

## Frontend Deploy करने के लिए:
```bash
cd frontend
npm install
npm run build
git add .
git commit -m "Deploy: Updated frontend"
git push origin main
# Netlify automatically deploys!
```

## Backend Deploy करने के लिए:
```bash
cd Backend2
composer install
php artisan migrate
git add .
git commit -m "Deploy: Updated backend"
git push origin main
# Railway/Vercel automatically deploys!
```

---

# 📞 TROUBLESHOOTING

## Frontend Issues

**Issue: "Cannot find module" error**
```bash
Solution: npm install && npm run build
```

**Issue: API calls failing**
```
Check: REACT_APP_API_URL सही है?
Check: Backend API accessible है?
Check: CORS configured है?
```

**Issue: Build failing on Netlify**
```
Check: Build command सही है?
Check: All environment variables added हैं?
Check: Node version compatible है?
```

---

## Backend Issues

**Issue: Database connection error**
```
Check: DB_HOST सही है?
Check: DB credentials correct हैं?
Check: Database service running है?
```

**Issue: CORS errors**
```
Check: SANCTUM_CORS_ALLOWED_ORIGINS में frontend URL है?
Check: API routes properly defined हैं?
```

**Issue: 500 Internal Server Error**
```bash
Check करें: php artisan log:tail
Railway/Vercel logs देखें
```

---

# 📚 PROFESSIONAL STANDARDS

## Security Best Practices:
1. ✅ Production में debug mode OFF रखें
2. ✅ सभी sensitive data .env में रखें
3. ✅ HTTPS use करें (Netlify/Railway automatic करता है)
4. ✅ Database credentials secure रखें
5. ✅ Regular backups लें

## Performance Optimization:
1. ✅ Frontend: Vite automatic optimization करता है
2. ✅ Backend: Redis caching setup करें
3. ✅ Database: Proper indexing करें
4. ✅ CDN use करें (Netlify automatic करता है)

## Monitoring & Logging:
1. ✅ Error tracking setup करें (Sentry)
2. ✅ Performance monitoring करें
3. ✅ Regular log review करें

---

**आपका project अब production-ready है! 🎉**

अगर कोई issue आए तो contact करें।

---

Created: May 29, 2026
Last Updated: May 29, 2026
