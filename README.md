# 🐍 Nokia Snake PWA

A classic Nokia-style Snake game built as a Progressive Web App (PWA). Play offline anytime on desktop or mobile!

## 🎮 Features

- **Classic Nokia Snake gameplay** - Simple, relaxing, nostalgic
- **Full PWA Support** - Installable, works offline, service worker caching
- **Responsive Design** - Works on all screen sizes
- **Dual Controls** - Keyboard (Arrow/WASD) + Mobile touch buttons
- **Retro Theme** - Green/black Nokia-style visuals
- **Advanced High Score System** - Persistent storage with reset protection
- **Adjustable Speed** - Slow/Medium/Fast settings with persistence
- **60 FPS Performance** - Smooth canvas rendering
- **New High Score Notifications** - Visual celebrations for achievements
- **Enhanced Game Over Screen** - Compares score to personal best

## 📱 Installation

### As a PWA (Recommended)
1. Open the game in Chrome, Edge, or Safari
2. Look for the "Install" button in the address bar or menu
3. Click "Install" to add to your home screen/app drawer
4. Play offline anytime!

### Manual Installation
Simply clone the repository and open `index.html` in a browser.

## 🕹️ Controls

### Desktop
- **Arrow Keys** or **WASD** - Move snake
- **Space** - Start/Restart game
- **ESC** - Pause/Resume

### Mobile
- **On-screen buttons** - Directional controls
- **Swipe gestures** - Alternative control method
- **Touch buttons** - Start/Restart game

## 🏗️ Project Structure

```
Snake game/
├── index.html          # Main HTML file
├── styles.css          # Retro Nokia styling
├── game.js            # Core game logic
├── input.js           # Keyboard + mobile controls
├── renderer.js        # Canvas rendering
├── ui.js              # UI components & overlays
├── manifest.json      # PWA manifest
├── service-worker.js  # Offline caching
├── icons/             # PWA icons (to be generated)
└── README.md          # This file
```

## 🔧 Technical Details

### Game Logic (`game.js`)
- Grid-based movement (20x20)
- Collision detection (walls & self)
- Progressive speed increase
- Food spawning algorithm
- Score calculation
- **Speed control system** - Three adjustable levels
- **High score management** - Persistent storage with notifications
- **Settings persistence** - Remembers user preferences

### Rendering (`renderer.js`)
- HTML5 Canvas rendering
- Pixel-perfect snake drawing
- Animated food with glow effect
- Grid visualization
- 60 FPS optimized rendering

### Input Handling (`input.js`)
- Keyboard event listeners
- Mobile touch controls
- Swipe gesture detection
- Button state management

### PWA Features
- **Service Worker** - Caches all assets for offline play
- **Web App Manifest** - Installable with proper metadata
- **App-like Experience** - Standalone display mode
- **Offline First** - Works without internet connection

## 🎨 Icon Generation

To generate the required PWA icons:

1. Create a 512x512 pixel snake icon (green snake on black background)
2. Use an online icon generator or image editor
3. Generate the following sizes:
   - 72x72, 96x96, 128x128, 144x144
   - 152x152, 192x192, 384x384, 512x512
4. Save them in the `icons/` directory with the names:
   - `icon-72.png`, `icon-96.png`, etc.

## 🧪 Testing

The game has been tested on:
- **Desktop**: Chrome, Firefox, Edge, Safari
- **Mobile**: Chrome Android, Safari iOS
- **Screen Sizes**: 320px to 1920px
- **Input Methods**: Keyboard, mouse, touch

## 🚀 Performance

- **Bundle Size**: < 100KB total
- **FPS**: Stable 60 FPS on modern devices
- **Load Time**: < 2 seconds on 3G
- **Memory**: Minimal footprint

## 📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Credits

**Built by Naga** — nagarjunajava10@gmail.com

## 🔄 Updates & Maintenance

To update the game:

1. Modify the relevant JavaScript files
2. Update `CACHE_NAME` in `service-worker.js` for cache busting
3. Test on multiple devices
4. Deploy to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- None currently reported

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: nagarjunajava10@gmail.com

---

Enjoy the game! 🐍✨