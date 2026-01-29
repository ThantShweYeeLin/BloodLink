# Deploy BloodLink to GitHub Pages

## Setup (One-time)

1. **Initialize git repository** (if not already done):
```bash
cd /Users/thantshweyeelin/Desktop/BloodLink/BloodLink
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub repository**:
- Go to https://github.com/new
- Repository name: `BloodLink`
- Make it public
- Don't initialize with README (we already have files)

3. **Connect and push**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/BloodLink.git
git branch -M main
git push -u origin main
```

## Deploy

Every time you want to deploy updates:

```bash
pnpm run deploy
```

This will:
- Build your project
- Push the built files to the `gh-pages` branch
- Make your site live at: `https://YOUR_USERNAME.github.io/BloodLink/`

## Enable GitHub Pages

After first deploy:
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` → `/ (root)` → Save

Your site will be live at: `https://YOUR_USERNAME.github.io/BloodLink/`

## Note

The backend API won't work on GitHub Pages (static hosting only). For full functionality:
- Frontend: GitHub Pages
- Backend: Deploy to Render, Railway, or Heroku (free tiers available)
