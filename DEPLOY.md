# Nexus Card - Deploy to Vercel

## Quick Deploy (2 minutes)

### Option 1: Deploy via Git (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository: `brian-md-12/DBC`
   - Click "Deploy"
   - Done! You'll get a live URL like: `https://dbc-xyz.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "c:\Users\Iggy\Desktop\DBC"
vercel

# For production deployment
vercel --prod
```

---

## What's Included

✅ **Frontend**: All HTML, CSS, JS files  
✅ **Backend**: Serverless API at `/api/create-pass`  
✅ **Auto-scaling**: Handles any traffic  
✅ **HTTPS**: Free SSL certificate  
✅ **No sleep time**: Instant responses (unlike Render)

---

## Test Your Deployment

After deploying, test these URLs:
- `https://your-app.vercel.app` - Frontend
- `https://your-app.vercel.app/api/create-pass` - API endpoint

---

## Apple Wallet Setup (Optional)

The app works without this, but if you want Apple Wallet passes:

1. Get Apple Developer Account ($99/year)
2. Create Pass Type ID Certificate
3. Add certificates to your project:
   ```
   /keys
     ├── wwdr.pem
     ├── signer.pem
     └── key.pem
   ```
4. Uncomment code in `/api/create-pass.js`
5. Redeploy: `vercel --prod`

---

## Environment Variables (If needed)

If you add API keys later, add them in Vercel:
- Dashboard → Project → Settings → Environment Variables

---

## Custom Domain (Optional & Free)

In Vercel dashboard:
- Settings → Domains
- Add your custom domain
- Vercel provides free SSL

---

## Local Development

```bash
# Install dependencies
npm install

# Run locally with serverless functions
npm run dev

# Opens at http://localhost:3000
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Your project dashboard: https://vercel.com/dashboard
