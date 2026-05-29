# 🔧 DEPLOYMENT TROUBLESHOOTING GUIDE

**जब deployment के बाद कुछ काम न कर रहा हो तो यहाँ से solution खोजें**

---

## 🔴 COMMON ISSUES & SOLUTIONS

---

### Issue 1: "Cannot GET /" - Frontend Page नहीं खुल रहा

#### ❌ Problem:
```
Netlify URL खोलते हैं तो:
404 Not Found
या
Cannot GET /
```

#### ✅ Solution:

**Step 1:** Netlify dashboard में Deploy status check करें
- Site overview → Deploys
- Latest deploy का status "Published" है?
- नहीं है → Deploy logs देखें

**Step 2:** Build settings verify करें
- Site settings → Build & deploy
- Check करें:
  ```
  Base directory:     frontend ✓
  Build command:      npm run build ✓
  Publish directory:  frontend/dist ✓
  ```

**Step 3:** Locally build करके test करें
```bash
cd frontend
npm install
npm run build
npm run preview
```

यह चलना चाहिए: `http://localhost:4173`

**Step 4:** GitHub push करें
```bash
git add .
git commit -m "Fix build settings"
git push origin main
# Netlify automatically redeploy करेगा
```

**Step 5:** अगर अभी भी issue है - Netlify support contact करें

---

### Issue 2: "API is not responding" या "Failed to fetch"

#### ❌ Problem:
```
Frontend loaded लेकिन:
- Products दिख नहीं रहे
- Login काम नहीं कर रहा
- Browser console में error:
  "Failed to fetch from API"
  "NetworkError"
```

#### ✅ Solution:

**Step 1:** Backend accessible है check करें
```bash
# Browser में खोलें:
https://your-railway-url.up.railway.app/api

# या command में:
curl https://your-railway-url.up.railway.app/api
```

अगर error आ रहा है → Backend problem है (Issue 3 देखें)

**Step 2:** Environment variable सही है check करें
```
Netlify Site settings → Build & deploy → Environment

REACT_APP_API_URL = https://your-railway-url.up.railway.app/api ✓
```

**Step 3:** Frontend में API URL check करें

**src/config/api.js** या similar file में:
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

**Step 4:** Browser console में check करें
```
F12 → Console tab खोलें
API URL: https://... (correct होना चाहिए)
```

**Step 5:** CORS issue check करें

Backend logs देखें:
```
Railway → Logs tab → देखें "CORS" या "Origin"
```

अगर CORS error है →Issue 4 देखें

**Step 6:** Redeploy करें
```bash
# Netlify में
Site overview → Trigger deploy → Deploy site

# या Git से:
git add .
git commit -m "Redeploy"
git push origin main
```

---

### Issue 3: Backend नहीं खुल रहा (Railway में 500 error)

#### ❌ Problem:
```
Backend URL खोलते हैं:
- 500 Internal Server Error
- या कुछ नहीं खुलता
- Railway logs में error दिख रहा है
```

#### ✅ Solution:

**Step 1:** Railway logs check करें
```
Railway Dashboard → Project → Logs tab

देखें क्या error message है:
- Database connection error?
- Key generation error?
- Syntax error?
```

**Step 2:** Database connected है check करें
```
Railway Dashboard → Plugins
MySQL service visible है?
```

अगर नहीं है:
```
Railway Dashboard → + New → Database → MySQL
```

**Step 3:** Environment variables सभी add किए हैं check करें
```
Railway Dashboard → Variables

ये होने चाहिए:
✓ APP_KEY (base64:...)
✓ APP_NAME (FireShop)
✓ APP_ENV (production)
✓ APP_DEBUG (false)
✓ DB_CONNECTION (mysql)
✓ DB_HOST (automatically filled)
✓ DB_USERNAME (railway)
✓ DB_PASSWORD (Railway से)
✓ DB_DATABASE (railway)
```

अगर कोई missing है → अभी add करें

**Step 4:** APP_KEY generate करें

अगर APP_KEY नहीं है:
```bash
cd Backend2
php artisan key:generate --show

# Output: base64:xxxxxxxxxxxx
```

यह value Railway में APP_KEY variable में paste करें

**Step 5:** Procfile check करें

**Backend2/Procfile** exist करता है?
```
web: vendor/bin/heroku-php-nginx public/
```

अगर नहीं है → create करें और push करें:
```bash
git add Backend2/Procfile
git commit -m "Add Procfile"
git push origin main
```

**Step 6:** Railway re-deploy करें
```
Railway Dashboard → Deployment tab → Latest deployment
"Re-deploy" बटन क्लिक करें
```

**Step 7:** अगर अभी भी issue है - logs में ये check करें:

| Error | Solution |
|-------|----------|
| "Access denied for user" | DB_USERNAME/PASSWORD गलत है |
| "php: command not found" | PHP installed नहीं है |
| "Composer error" | Backend2/composer.json corrupt है |
| "Connection refused" | Database service running नहीं है |

---

### Issue 4: CORS Error

#### ❌ Problem:
```
Browser console में:
"Access to XMLHttpRequest at 'https://api....' from origin 'https://fireshop....'
has been blocked by CORS policy"
```

#### ✅ Solution:

**Step 1:** Backend CORS config update करें

**Backend2/config/cors.php** खोलें:

```php
return [
    'paths' => ['api/*'],
    
    'allowed_origins' => [
        'https://fireshop-xyz.netlify.app',  // अपना Netlify URL
        'https://fireshop.com',               // अपना custom domain
        'http://localhost:3000',              // local development
        'http://localhost:5173',              // Vite dev server
    ],
    
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**Step 2:** .env file भी update करें

**Backend2/.env:**

```
SANCTUM_STATEFUL_DOMAINS=fireshop-xyz.netlify.app,fireshop.com
SANCTUM_CORS_ALLOWED_ORIGINS=https://fireshop-xyz.netlify.app,https://fireshop.com
```

**Step 3:** Push करें और redeploy करें
```bash
git add Backend2/config/cors.php
git commit -m "Fix CORS configuration"
git push origin main

# Railway automatically redeploy करेगा
```

**Step 4:** Browser cache clear करें
```
Ctrl+Shift+Delete (Clear browsing data)
Hard refresh: Ctrl+Shift+R
```

---

### Issue 5: Database Migrations Failed

#### ❌ Problem:
```
Railway logs में:
"SQLSTATE[HY000]: General error: 2006 MySQL server has gone away"
या
"Unknown column in 'where clause'"
```

#### ✅ Solution:

**Step 1:** Railway में Rails console खोलें

Railway SSH access करें:
```bash
# Railway app tab में
"Shell" tab क्लिक करें
```

**Step 2:** Migrations reset करें
```bash
php artisan migrate:refresh --seed
```

**Step 3:** अगर error बता रहे हैं - logs check करें
```bash
# SSH में:
php artisan logs

# या सिर्फ errors देखें:
php artisan tinker
```

**Step 4:** Database tables manually check करें
```bash
php artisan tinker

# Database में से:
DB::table('users')->count();
```

---

### Issue 6: Login नहीं काम कर रहा

#### ❌ Problem:
```
- Login button काम नहीं कर रहा
- या credentials सही होने के बाद भी login fail
- "Invalid credentials" error आ रहा है
```

#### ✅ Solution:

**Step 1:** Database में users exist करते हैं check करें
```bash
# Railway SSH में:
php artisan tinker
User::all();
```

कोई user दिख रहे हैं?
- नहीं → **Step 2** पर जाएं
- हां → **Step 3** पर जाएं

**Step 2:** Seed करें
```bash
# Railway SSH में:
php artisan db:seed --class=UserSeeder

# या:
php artisan migrate:fresh --seed
```

**Step 3:** API endpoint test करें
```bash
curl -X POST https://your-railway-url.up.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Response check करें - क्या error message है?

**Step 4:** Frontend में API call check करें
```javascript
console.log('Login request:', {email, password});
// Password कुछ नहीं दिख सकता है, लेकिन check करें email सही है
```

**Step 5:** Sanctum token issue है?
```
Backend2/config/sanctum.php में check करें:
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
```

Railway में verify करें:
```
SANCTUM_STATEFUL_DOMAINS=fireshop-xyz.netlify.app
```

---

### Issue 7: Payment Processing नहीं काम कर रहा

#### ❌ Problem:
```
- Payment button काम नहीं कर रहा
- "Payment gateway error"
- Razorpay/payment service से data नहीं आ रहा
```

#### ✅ Solution:

**Step 1:** Payment credentials check करें

**Backend2/.env** में verify करें:
```
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
```

Railway में same environment variables हैं?

**Step 2:** Payment API key test करें
```bash
curl https://your-railway-url.up.railway.app/api/payments/verify
```

**Step 3:** Frontend में payment URL check करें

**src/config/payment.js** या similar में:
```javascript
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;
console.log('Razorpay Key exists?', !!RAZORPAY_KEY);
```

**Step 4:** Browser console में देखें - Razorpay script loaded हुआ?
```
F12 → Console
Razorpay object visible है?
```

अगर नहीं दिख रहा - `public/index.html` में Razorpay script tag है?

---

### Issue 8: Images/Static Files नहीं दिख रहे

#### ❌ Problem:
```
- Products की images नहीं दिख रहे
- 404 error आ रहा है images के लिए
- "Failed to load image from..."
```

#### ✅ Solution:

**Step 1:** Image storage location check करें

Backend में जहाँ images store हैं वह public folder में है?

**Backend2/public/uploads/** या similar?

**Step 2:** Image URL construction check करें

Frontend में image URL कैसे बना रहे हैं:
```javascript
// सही तरीका:
const imageUrl = `${API_URL}/storage/${imagePath}`;
// या:
const imageUrl = `${API_URL}/../storage/${imagePath}`;
```

**Step 3:** Storage symlink check करें

Railway में:
```bash
# SSH में यह run करें:
php artisan storage:link
```

**Step 4:** कोई error दिख रहा है? Check करें:

```bash
# SSH में:
ls -la storage/app/public/
```

Files are there?

---

### Issue 9: Memory Limit Error

#### ❌ Problem:
```
"Allowed memory size of 134217728 bytes exhausted"
या
"PHP Fatal error: Allowed memory size"
```

#### ✅ Solution:

**Step 1:** Memory limit increase करें

**Backend2/config/php.ini** (अगर exist करता है) या 
Railway `.railway.toml` में:

```toml
[build]
nixPacks.nixPackages = ["php82-fpm", "php82-cli"]

[env]
PHP_MEMORY_LIMIT = "256M"
```

**Step 2:** Push करें
```bash
git add Backend2/.railway.toml
git commit -m "Increase PHP memory limit"
git push origin main
```

**Step 3:** Railway redeploy करें

---

### Issue 10: SSL Certificate Error

#### ❌ Problem:
```
"SSL certificate problem"
या browser में:
"This site is not secure"
```

#### ✅ Solution:

**Netlify:**
- Automatic HTTPS है ✓ कुछ करने की जरूरत नहीं

**Railway:**
- Automatic HTTPS है ✓ कुछ करने की जरूरत नहीं

**Custom Domain के लिए:**
- Netlify में जाएं → Domain management
- Let's Encrypt free certificate use करें

---

---

## 📋 DEBUGGING CHECKLIST

अगर कोई issue है और ऊपर solution नहीं मिला:

```
Frontend Issues के लिए:
□ Netlify deploy logs check किए?
□ npm run build locally run किया?
□ Environment variables सभी add किए?
□ Browser console में errors check किए? (F12)
□ Network tab में API calls check किए?
□ Cache clear किया? (Ctrl+Shift+Delete)

Backend Issues के लिए:
□ Railway logs check किए?
□ All environment variables add किए?
□ Database service running है?
□ Procfile exist करता है?
□ PHP version compatible है?
□ Migrations run किए? (php artisan migrate)

CORS Issues के लिए:
□ config/cors.php updated किया?
□ .env में SANCTUM_* variables हैं?
□ Frontend URL match कर रहा है?
□ Request method सही है? (GET/POST)
```

---

## 🆘 अगर अभी भी solution नहीं मिला

### Contact करने से पहले तैयारी करें:

1. **Error message का screenshot लें**
   ```
   F12 → Console tab → Error copy करें
   ```

2. **Relevant logs export करें**
   ```
   - Netlify: Deploy logs
   - Railway: Application logs
   ```

3. **Environment मुश्किल से reproduce करें**
   ```
   Local पर same setup करके test करें
   ```

4. **ये information साथ भेजें:**
   - Error screenshot
   - Full error message
   - कब यह issue आया
   - क्या काम कर रहे थे जब issue आया

---

**Happy Deploying! 🚀**

कोई सवाल हो तो DEPLOYMENT_GUIDE.md या QUICK_DEPLOY.md check करें।

---

Created: May 29, 2026
Last Updated: May 29, 2026
