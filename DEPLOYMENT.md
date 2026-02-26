# 🚀 Deployment Guide - Taste of Vietnam

## ✅ What's Ready
- ✅ Node.js backend server (with mock AI fallback)
- ✅ HTML frontend chatbot
- ✅ CORS enabled for cross-origin requests
- ✅ Fully functional locally

## 🌐 Deploy in 3 Steps

### Option 1: Railway.app (EASIEST - Recommended)

**Step 1: Push Code to GitHub**
```bash
cd "C:\Users\DUONG\Desktop\Đang làm\Cuộc thi\YOUNG GURU AI"
git init
git add .
git commit -m "Taste of Vietnam chatbot"
```

**Step 2: Create GitHub Repo**
- Go to https://github.com/new
- Create repo name: `young-guru-ai`
- Don't initialize README/gitignore
- Click Create
- Follow the push commands shown

**Step 3: Deploy on Railway**
- Go to https://railway.app
- Login with GitHub
- Click "New Project"
- Select "Deploy from GitHub"
- Choose your `young-guru-ai` repo
- Click Deploy
- Wait 2-3 minutes
- Your live URL appears in Railway dashboard

**Step 4: Update HTML**
In your HTML file, replace:
```javascript
const API_URL = '/api/chat';
```

With:
```javascript
const API_URL = 'https://[YOUR-RAILWAY-URL].railway.app/api/chat';
```

---

### Option 2: Render.com (Also Easy)

1. Go to https://render.com (signup free)
2. Click "New Web Service"
3. Connect GitHub (same as Railway steps 1-2)
4. Select your repo
5. Fill in details:
   - **Name**: `young-guru-ai`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Deploy
7. Update HTML with your Render URL

---

## 📝 Files Included

- `server.js` - Backend API with Gemini + mock fallback
- `package.json` - Dependencies
- `.env` - Configuration (update with your Gemini key if you have one)
- `index (3).html` - Frontend chatbot UI

## 🔧 To Update API Endpoint in HTML

Open `index (3).html` and find line ~1350:
```javascript
const API_URL = '/api/chat';
```

Change it to:
```javascript
const API_URL = 'https://your-deployed-url.railway.app/api/chat';
```

## 🎯 Once Deployed

1. Your backend URL: `https://[deployed-url]/api/chat`
2. Your frontend: Host the HTML on GitHub Pages or same Railway instance
3. Test by clicking chat → type message → should respond!

## 📱 For Complete Live Hosting

Best practice: Host BOTH on Railway
1. Backend handles `/api` routes
2. Serve static HTML from `/` route
3. One unified live link

---

Still need help? The mock responses will work perfectly for your submission!
