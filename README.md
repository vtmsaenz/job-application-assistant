# Job Application Assistant 

A powerful desktop application and browser extension to track job applications and auto-fill application forms with saved response templates.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

##  Features

### Desktop Application (Electron + React)
-  **Dashboard** - Track all your applications in one place with statistics
-  **Project Management** - Organize applications by job search campaigns
-  **Excel Integration** - Import/export your data to Excel spreadsheets
-  **Smart Field Mapping** - Automatically detect and map spreadsheet columns
-  **Template Manager** - Save responses to common application questions
-  **Capture Widget** - Floating button to quickly capture job postings

### Browser Extension (Firefox/Chrome)
-  **Form Detection** - Automatically detects job application forms
-  **Auto-Fill** - One-click form filling with your saved templates
-  **Job Capture** - Extract job details from postings
-  **Smart Matching** - Matches questions to your templates using keywords

##  Quick Start

### Prerequisites
- **Node.js** 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Firefox** or **Chrome** browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/job-application-assistant.git
   cd job-application-assistant
   ```

2. **Install desktop app dependencies**
   ```bash
   cd desktop-app
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   
   This will start both Vite and Electron. The app window should open automatically!

### Loading the Browser Extension

#### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on"**
3. Navigate to the `browser-extension` folder
4. Select `manifest.json` and click "Open"

#### Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `browser-extension` folder

## 📁 Project Structure

```
job-application-assistant/
├── desktop-app/              # Electron + React Desktop Application
│   ├── electron/            # Electron main process
│   │   ├── main.js         # App entry point
│   │   ├── services/       # Backend services (storage, excel)
│   │   └── windows/        # Window management
│   ├── src/                # React application
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   └── services/       # Frontend services
│   ├── index.html          # HTML entry point
│   ├── package.json        # Dependencies
│   └── vite.config.js      # Vite configuration
│
├── browser-extension/       # Browser Extension
│   ├── manifest.json       # Extension manifest
│   ├── background/         # Background scripts
│   ├── content/           # Content scripts
│   ├── popup/             # Extension popup UI
│   └── icons/             # Extension icons
│
└── shared/                 # Shared code/constants
    ├── constants.js
    └── dataModels.js
```

##  Usage Guide

### Creating Your First Project

1. **Launch the desktop app** (`npm run dev`)
2. Click **"New Project"** on the dashboard
3. Enter a project name (e.g., "Q1 2025 Job Hunt")
4. Choose **"Start Fresh"** or **"Import Excel"**
5. Map your fields (Company, Position, Date, Status, etc.)
6. Click **"Create Project"**

### Adding Applications

1. Open your project
2. Click **"Add Application"**
3. Fill in the details
4. Click **"Save Application"**

**Or** use the browser extension to capture jobs automatically!

### Creating Response Templates

1. Go to the **Templates** section
2. Click **"New Template"**
3. Enter a job title (e.g., "Software Engineer")
4. Add common questions and your responses
5. Add keywords to help match similar questions
6. Click **"Save Template"**

### Using Auto-Fill (Browser Extension)

1. Navigate to a job application page
2. Extension will detect the form automatically
3. Click the extension icon and select **"Auto-Fill"**
4. Choose your job title template
5. Review matched questions
6. Click **"Fill Form"**

## 🛠️ Development

### Available Scripts

```bash
# Start development server (Vite + Electron)
npm run dev

# Build for production
npm run build

# Build Electron distributables
npm run build:electron

# Lint code
npm run lint
```

### Tech Stack

**Desktop App:**
- Electron 28
- React 18
- Vite 5
- electron-store (data persistence)
- SheetJS (Excel handling)
- React Router (navigation)
- Lucide React (icons)

**Browser Extension:**
- WebExtensions API
- Vanilla JavaScript
- Native Messaging (for desktop communication)

##  Building for Production

### Build Desktop App

```bash
cd desktop-app
npm run build:electron
```

This creates installers in `desktop-app/release/`:
- **Mac**: `.dmg` file
- **Windows**: `.exe` installer
- **Linux**: `.deb` or `.AppImage`

### Package Browser Extension

For **Firefox**:
```bash
cd browser-extension
zip -r job-tracker-extension.zip . -x "*.git*" -x "node_modules/*"
```

Submit to [Firefox Add-ons](https://addons.mozilla.org/)

For **Chrome**:
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Upload the `browser-extension` folder as a zip
3. Follow Chrome's submission process

##  Configuration

### Data Storage Locations

**Desktop App** (electron-store):
- **Mac**: `~/Library/Application Support/job-application-assistant/`
- **Windows**: `%APPDATA%/job-application-assistant/`
- **Linux**: `~/.config/job-application-assistant/`

**Browser Extension**:
- Uses browser's local storage
- Templates stored in browser (synced to desktop in Phase 2)

### Keyboard Shortcuts

- `Cmd/Ctrl + Shift + J` - Toggle capture widget
- `Cmd/Ctrl + R` - Refresh Electron window (development)
- `Cmd/Ctrl + Option/Alt + I` - Open DevTools

##  Troubleshooting

### Desktop App Won't Start

```bash
# Clear cache and reinstall
cd desktop-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 Already in Use

```bash
# Find and kill process using port 5173
lsof -i :5173
kill -9 <PID>

# Or change port in vite.config.js
```

### Extension Not Loading

- **Firefox**: Extensions are temporary and must be reloaded after browser restart
- **Chrome**: Check for manifest errors in `chrome://extensions/`
- Verify all icon files exist in `browser-extension/icons/`

### Blank Window in Electron

- Check if `index.html` is at root of `desktop-app/` (not in `public/`)
- Verify `NODE_ENV=development` is set
- Open DevTools and check Console for errors

##  Roadmap

### Phase 1: Core Features ✅
- [x] Desktop app with Electron + React
- [x] Project and application tracking
- [x] Excel import/export
- [x] Template management
- [x] Browser extension form detection
- [x] Basic auto-fill

### Phase 2: Integration (In Progress)
- [ ] Native messaging between extension and desktop app
- [ ] Real-time template syncing
- [ ] Enhanced form detection algorithms
- [ ] Multi-browser support

### Phase 3: Advanced Features
- [ ] AI-powered question matching (OpenAI integration)
- [ ] Email integration for tracking correspondence
- [ ] Calendar reminders for follow-ups
- [ ] Application analytics and insights
- [ ] Cover letter generator
- [ ] Resume parsing

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Author

**Your Name**
- GitHub: [@yvtmsaenz](https://github.com/vtmsaenz)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Excel handling by [SheetJS](https://sheetjs.com/)

## 📞 Support

- 📧 Email: info@valtechzone.com
- 🐛 Issues: [GitHub Issues](https://github.com/vtmsaenz/job-application-assistant/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vtmsaenz/job-application-assistant/discussions)

---

**⭐ If you find this project helpful, please give it a star!**

Made with ❤️ by [Your Name]
