# 🚀 Spendly Deployment Guide

## 📋 Prerequisites

Before deploying Spendly, ensure you have the following:

### 1. **Firebase Project Setup**
- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Generate web app configuration

### 2. **Development Environment**
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### 3. **Hosting Platform** (Choose one)
- Vercel account (Recommended)
- Netlify account
- Firebase Hosting

---

## 🔧 Environment Configuration

### 1. **Firebase Configuration**

Create `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_NAME=Spendly
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Sentry for Error Monitoring
SENTRY_AUTH_TOKEN=your_sentry_token_here
```

### 2. **Firebase Security Rules**

Deploy the included `firestore.rules` to your Firebase project:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

---

## 🔐 Firebase Security Setup

### 1. **Firestore Security Rules**

The provided `firestore.rules` file includes:
- User authentication requirements
- Data validation
- Read/write permissions per collection
- Input sanitization rules

### 2. **Authentication Configuration**

In Firebase Console:
1. Go to Authentication → Settings
2. Enable Email/Password provider
3. Configure authorized domains for production
4. Set up email templates (optional)

### 3. **Database Structure**

The app will automatically create these collections:
```
users/{userId}/
├── expenses/{expenseId}
├── categories/{categoryId}
└── budgets/{budgetId}

globalCategories/{categoryId}
appSettings/{settingId}
```

---

## 🌐 Vercel Deployment (Recommended)

### 1. **Quick Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/spendly)

### 2. **Manual Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3. **Environment Variables**

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all variables from `.env.local`
4. Redeploy the application

---

## 🔥 Firebase Hosting Deployment

### 1. **Setup Firebase Hosting**

```bash
# Initialize hosting
firebase init hosting

# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### 2. **Configuration**

Update `firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 📱 Netlify Deployment

### 1. **Build Settings**

Create `netlify.toml`:
```toml
[build]
  publish = "out"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 2. **Deploy**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy
netlify deploy --prod
```

---

## 🔍 Post-Deployment Checklist

### 1. **Functionality Testing**
- [ ] User registration works
- [ ] User login works
- [ ] Add expense functionality
- [ ] Categories load from database
- [ ] Dashboard displays data
- [ ] Analytics show correct charts
- [ ] Error boundaries catch errors
- [ ] Mobile responsiveness

### 2. **Performance Testing**
- [ ] Page load times < 3 seconds
- [ ] Database queries are optimized
- [ ] Images are properly optimized
- [ ] Lighthouse score > 90

### 3. **Security Testing**
- [ ] Firestore rules prevent unauthorized access
- [ ] Authentication works correctly
- [ ] Input validation prevents injection
- [ ] HTTPS is enforced

### 4. **SEO & Accessibility**
- [ ] Meta tags are proper
- [ ] Open Graph tags work
- [ ] Accessibility score > 95
- [ ] Semantic HTML structure

---

## 🚨 Troubleshooting

### Common Issues

**1. Firebase Not Initialized**
```
Error: Firebase is not properly configured
```
**Solution**: Check environment variables and Firebase config

**2. Firestore Permission Denied**
```
Error: Missing or insufficient permissions
```
**Solution**: Deploy security rules and check user authentication

**3. Build Failures**
```
Error: Module not found
```
**Solution**: Clear node_modules and reinstall dependencies

**4. Category Loading Issues**
```
Error: Categories not loading
```
**Solution**: Seed default categories or check Firestore connection

---

## 📊 Monitoring & Analytics

### 1. **Error Monitoring**

Configure Sentry for production error tracking:
```javascript
// Uncomment Sentry configuration in components/ErrorBoundary.tsx
// Add Sentry DSN to environment variables
```

### 2. **Performance Monitoring**

Use Firebase Performance Monitoring:
```bash
firebase init performance
firebase deploy --only performance
```

### 3. **Analytics**

Add Google Analytics or Firebase Analytics:
```javascript
// Add analytics configuration to layout.tsx
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # Add other environment variables
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Production Optimizations

### 1. **Performance**
- Enable Next.js Image Optimization
- Configure CDN for static assets
- Implement service worker for caching
- Use compression for API responses

### 2. **Security**
- Configure CORS properly
- Add security headers
- Implement rate limiting
- Regular security audits

### 3. **Scalability**
- Database indexing for queries
- Connection pooling
- Caching strategies
- Load balancing (if needed)

---

## 📞 Support

If you encounter issues during deployment:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Firebase console for errors
3. Check deployment platform logs
4. Verify environment variables
5. Test in development environment first

---

**🎉 Congratulations! Your Spendly app should now be deployed and running in production!** 