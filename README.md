# 🎵 Deezer Music Explorer

A simple web app that lets you search for music, preview 30-second clips, and save favorites — powered by the [Deezer API](https://rapidapi.com/deezerdevs/api/deezer-1).

## 🚀 Features
- 🔍 Search for songs by artist, track, or album.  
- 🎶 Play 30-second previews directly in the browser.  
- ⭐ Mark/unmark songs as favorites (saved in localStorage).  
- 🎨 Responsive card-based UI.  
- 🌐 Deployable on GitHub Pages.

---

## 📂 Project Structure
music-app/
│── index.html # Main HTML file
│── style.css # Styles
│── script.js # App logic (API calls, rendering, favorites)
│── README.md # Project documentation

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/USERNAME/music-app.git
cd music-app
2. Run locally

Just open index.html in your browser.

🔑 Deezer API Setup (RapidAPI)

By default the app uses a free proxy (may fail sometimes due to CORS).
For reliability, use RapidAPI Deezer
:

Sign up at RapidAPI
.

Subscribe to the Deezer API (free tier is enough).

Copy your API key.

In script.js:

const useRapidApi = true;
const RAPIDAPI_KEY = "YOUR_RAPIDAPI_KEY_HERE";


Save and refresh.
🛠️ Tech Stack

HTML5

CSS3 (custom responsive styles)

JavaScript (ES6)

Deezer API (via RapidAPI)

📜 License

MIT License — free to use and modify.
