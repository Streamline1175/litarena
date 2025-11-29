# Lit Arena Bots Showcase 🤖

A modern, interactive showcase for Discord bots built with React, Vite, and Tailwind CSS. Features a beautiful glassmorphism design, smooth animations, and a powerful admin panel for managing your bot collection.

## ✨ Features

### Public Showcase
- **Modern Design**: Glassmorphism effects, gradients, and smooth animations
- **Interactive Cards**: Hover effects, status badges, and feature pills
- **Advanced Search**: Real-time search across bot names, descriptions, and features
- **Smart Filtering**: Filter by status (active, beta, maintenance)
- **Detailed Modals**: Tabbed interface with overview, features, media, changelog, and legal info
- **Media Gallery**: Screenshot galleries with lightbox and video player support
- **Responsive**: Works perfectly on mobile, tablet, and desktop
- **Dark Mode**: Built-in dark theme (light mode toggle ready)

### Admin Panel
- **Password Protected**: Secure access to management features
- **Drag & Drop Reordering**: Easily reorganize your bot list
- **Add/Edit/Delete**: Full CRUD operations for bots
- **Bulk Operations**: Export/import bot data as JSON
- **Live Preview**: Changes reflect immediately
- **Data Persistence**: Uses localStorage with JSON backup
- **Intuitive Interface**: Beautiful forms with validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git repository connected to GitHub

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Development
1. Run `npm run dev`
2. Open http://localhost:5173/litarena/
3. Make changes to components in `src/components/`
4. Changes hot-reload automatically

### Admin Panel
1. Navigate to `/admin`
2. Default password: `litarena2025`
3. Manage your bots:
   - **Add**: Click "Add Bot" button
   - **Edit**: Click pencil icon on any bot
   - **Delete**: Click trash icon (with confirmation)
   - **Reorder**: Drag bots using the grip icon
   - **Export**: Download bot data as JSON
   - **Import**: Upload JSON to restore/update data

### Changing Admin Password
The admin password is stored in localStorage. To change it:
```javascript
localStorage.setItem('adminPassword', 'your-new-password');
```

## 📁 Project Structure

```
litarena/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── SearchBar.jsx       # Search functionality
│   │   ├── FilterBar.jsx       # Status filters
│   │   ├── BotGrid.jsx         # Grid layout
│   │   ├── BotCard.jsx         # Individual bot cards
│   │   └── BotModal.jsx        # Detailed bot view
│   ├── data/
│   │   └── bots.json           # Bot database
│   ├── App.jsx                 # Main application
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── dist/                       # Build output (generated)
├── package.json
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── postcss.config.js           # PostCSS config
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: { ... },   // Main blue colors
  accent: { ... },    // Purple accent colors
}
```

### Animations
Animations are configured in `tailwind.config.js` and can be adjusted:
- `fade-in`: Opacity transition
- `slide-up`: Slide up with fade
- `scale-in`: Scale with fade
- `glow`: Pulsing glow effect

### Bot Data Structure
Each bot in `src/data/bots.json` has the following structure:
```json
{
  "id": "unique-id",
  "name": "Bot Name",
  "icon": "https://url-to-icon.png",
  "description": "Bot description",
  "status": "active|beta|maintenance",
  "features": ["Feature 1", "Feature 2"],
  "screenshots": ["https://url1.jpg"],
  "videos": ["https://url-to-video.mp4"],
  "pricing": null,
  "changelog": [...],
  "tos": {...},
  "privacy": {...}
}
```

## 🚀 Deployment

### GitHub Pages (Recommended)

This project is pre-configured for GitHub Pages deployment:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages"
   - Source: GitHub Actions

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Automatic Deployment**:
   - GitHub Actions will automatically build and deploy
   - Check the "Actions" tab for deployment status
   - Site will be live at: `https://yourusername.github.io/litarena/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🛠️ Technologies

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS 3**: Utility-first CSS
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **@hello-pangea/dnd**: Drag and drop
- **Lucide React**: Icon library

## 📝 Adding New Bots

### Via Admin Panel (Recommended)
1. Go to `/admin`
2. Click "Add Bot"
3. Fill in the form
4. Click "Save Bot"

### Via JSON File
1. Edit `src/data/bots.json`
2. Add a new bot object
3. Save the file
4. Rebuild: `npm run build`

### Via Import
1. Create a JSON file with your bots
2. Go to admin panel
3. Click import icon
4. Select your JSON file

## 🎥 Adding Videos

To add demo videos to a bot:

1. **Edit bot in admin panel**
2. **Add video URLs** (one per line):
   - Direct MP4 links: `https://example.com/demo.mp4`
   - YouTube embeds: `https://www.youtube.com/embed/VIDEO_ID`
   - Other embeddable videos

The modal will automatically display videos in a responsive player.

## 💾 Data Persistence

- **Primary**: Data stored in `src/data/bots.json`
- **Runtime**: Admin changes saved to localStorage
- **Backup**: Export JSON regularly from admin panel
- **Recovery**: Import JSON to restore previous state

## 🔒 Security Notes

- Admin password stored in localStorage (client-side only)
- No backend authentication
- Suitable for trusted environments
- For production, consider implementing proper auth

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Changes Not Showing
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### GitHub Pages 404
- Ensure `base: '/litarena/'` in `vite.config.js` matches your repo name
- Check GitHub Pages settings in repository

## 📄 License

All rights reserved © 2025 Lit Arena Bots

## 🤝 Support

For support, email support@litarena.com

---

Built with ❤️ using React and Vite
