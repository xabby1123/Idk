# XG Private IPTV Web Player (Xtream + M3U, xgplayer)

A lightweight, private web IPTV player you can host yourself. Uses **xgplayer** (with hls.js plugin) and supports:
- **Xtream Codes API**: fetch live channels and play `.m3u8` streams.
- **M3U playlists**: paste a URL and it will parse channel names and links.

> ⚠️ **CORS NOTE**: Many IPTV servers do **not** enable CORS, so browsers block direct requests. Use the **CORS proxy** input field (e.g., `https://your-cors-proxy/`) or host behind your own reverse proxy that adds `Access-Control-Allow-Origin` headers.

## Quick Start
1. Host the folder on any static server (or open `index.html` directly—Xtream/M3U fetches may still need CORS).
2. Open the page:
   - **Xtream**: enter `host`, `username`, `password`, optional `CORS proxy`, click **Fetch Live List**.
   - **M3U**: paste playlist URL + optional `CORS proxy`, click **Load M3U**.
3. Click a channel from the left list to play.

## iOS Tips
- Safari supports native HLS; playback generally works well.
- Add to Home Screen for an app-like full-screen experience (PWA not configured here but can be added).

## Customize Branding
- Replace `assets/logo-xg.png` with your own square logo (512×512 recommended).
- Edit page title and header in `index.html` and colors in `css/styles.css`.

## Disclaimer
This project is for **legal, private use** with content you have rights to stream. You are responsible for compliance with local laws and provider terms.

## Tech
- xgplayer (CDN), xgplayer-hls.js (CDN)
- Vanilla JS, no build step required.
