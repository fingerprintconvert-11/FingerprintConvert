# FingerprintConvert

A modern, responsive, all-in-one file conversion platform built with Node.js, Express, and FFmpeg.

## Features
- **Modern UI**: Black and blue dark theme with responsive design.
- **Audio Converter**: Convert between MP3, WAV, AAC, and OGG.
- **Video Converter**: Convert between MP4, MKV, AVI, and WEBM.
- **Image Converter**: Convert between PNG, JPG, WEBP, and GIF.
- **Drag & Drop**: Easy file uploads with progress visualization.
- **SEO Optimized**: Includes meta tags, robots.txt, and sitemap.xml.
- **AdSense Ready**: Pre-defined ad slots for monetization.
- **Production Ready**: Configured for deployment on Railway.

## Tech Stack
- **Backend**: Node.js, Express
- **File Processing**: FFmpeg (via fluent-ffmpeg), Sharp (for images)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Railway (Procfile included)

## Local Setup

1. **Install FFmpeg**:
   Ensure FFmpeg is installed on your system.
   - Ubuntu/Debian: `sudo apt update && sudo apt install ffmpeg`
   - macOS: `brew install ffmpeg`
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/)

2. **Clone and Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Server**:
   ```bash
   npm start
   ```
   The site will be available at `http://localhost:3000`.

## Railway Deployment
1. Create a new project on [Railway](https://railway.app/).
2. Connect your GitHub repository.
3. Add the **FFmpeg Nixpack** or ensure the environment has FFmpeg installed (Railway's default Nixpacks usually include it if requested in dependencies).
4. Deploy!

## Folder Structure
- `/public`: Static assets (CSS, JS, robots.txt, sitemap).
- `/views`: HTML pages.
- `/uploads`: Temporary storage for uploaded files.
- `/converted`: Storage for processed files.
- `server.js`: Main Express server and conversion logic.
