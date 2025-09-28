// Music app using Deezer public API (with allorigins CORS proxy fallback).
// Replace proxyFetchWithRapidAPI = true and add your RapidAPI key for better reliability.

const searchEl = document.getElementById('search');
const btn = document.getElementById('btn-search');
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const limitSelect = document.getElementById('limit');

let currentAudio = null;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Helper: show status
function setStatus(msg) {
    status.textContent = msg || '';
}

// Play-only-one-audio helper
function playAudio(el) {
    if (currentAudio && currentAudio !== el) {
        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) { }
    }
    currentAudio = el;
}

// Render track cards
function renderTracks(tracks) {
    grid.innerHTML = '';
    if (!tracks || tracks.length === 0) {
        setStatus('No results.');
        return;
    }
    setStatus('');
    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <img class="cover" src="${track.album.cover_medium}" alt="${escapeHtml(track.title)} cover" />
      <div class="title">${escapeHtml(track.title)}</div>
      <div class="meta">${escapeHtml(track.artist.name)} • ${escapeHtml(track.album.title)}</div>
      <div class="actions">
        <button class="fav" data-id="${track.id}">${favorites.includes(track.id) ? '★ Favorite' : '☆ Favorite'}</button>
      </div>
      <audio class="audio" controls preload="none">
        <source src="${track.preview}" type="audio/mpeg" />
        Your browser does not support audio playback.
      </audio>
    `;
        // attach audio event so only one plays
        const audio = card.querySelector('audio');
        audio.addEventListener('play', () => playAudio(audio));
        audio.addEventListener('ended', () => { if (currentAudio === audio) currentAudio = null; });

        // favorite button
        const favBtn = card.querySelector('.fav');
        favBtn.addEventListener('click', () => toggleFavorite(track, favBtn));

        grid.appendChild(card);
    });
}

// Escape small text to prevent injection on dynamic HTML
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
    });
}

// Toggle favorite and persist
function toggleFavorite(track, btnEl) {
    const id = track.id;
    const idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
        btnEl.textContent = '★ Favorite';
    } else {
        favorites.splice(idx, 1);
        btnEl.textContent = '☆ Favorite';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Optional: save track details in localStorage favoritesDetails if you want to display list later
}

// Try fetching via a free CORS proxy (allorigins). If you prefer RapidAPI, see README/comments.
async function fetchDeezerViaProxy(query, limit = 20) {
    // Build deezer url
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(deezerUrl)}`;
    const res = await fetch(proxy);
    if (!res.ok) throw new Error('Network error from proxy');
    return res.json();
}

// Alternate: If you have a RapidAPI key, set this to true and fill RAPIDAPI_KEY
const useRapidApi = true;
const RAPIDAPI_KEY = ' 86927b756emsh4a939d0902bc2dap1ee4c6jsn75c16c673ac3';

// RapidAPI fetch (more reliable for cross-origin; requires key)
async function fetchDeezerViaRapidAPI(query, limit = 20) {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url, {
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    });
    if (!res.ok) throw new Error('RapidAPI fetch failed: ' + res.status);
    return res.json();
}

// Main search function
async function searchTracks() {
    const q = searchEl.value.trim();
    if (!q) { setStatus('Type something to search'); return; }
    setStatus('Searching...');
    grid.innerHTML = '';

    const limit = Number(limitSelect.value) || 20;
    try {
        const data = useRapidApi
            ? await fetchDeezerViaRapidAPI(q, limit)
            : await fetchDeezerViaProxy(q, limit);

        // Deezer response has `data` array
        const tracks = data && data.data ? data.data : data;
        renderTracks(tracks);
    } catch (err) {
        console.error(err);
        setStatus('Error fetching from Deezer. Try enabling RapidAPI or check your network (see README).');
    }
}

// UI wiring
btn.addEventListener('click', searchTracks);
searchEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchTracks(); });

// Small helper poly: Stop currently playing audio if user clicks anywhere else play
document.addEventListener('click', (e) => {
    // nothing heavy here — play handled by audio play event
});

// Init: show sample trending search prompt
setStatus('Ready — try searching for "Adele", "Drake", "Coldplay" or "Eminem".');
