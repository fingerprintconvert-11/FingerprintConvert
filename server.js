const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/converted', express.static(path.join(__dirname, 'converted')));

// Ensure directories exist
const dirs = ['uploads', 'converted'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Routes for Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/audio-converter', (req, res) => res.sendFile(path.join(__dirname, 'views', 'audio.html')));
app.get('/video-converter', (req, res) => res.sendFile(path.join(__dirname, 'views', 'video.html')));
app.get('/image-converter', (req, res) => res.sendFile(path.join(__dirname, 'views', 'image.html')));
app.get('/pdf-converter', (req, res) => res.sendFile(path.join(__dirname, 'views', 'pdf.html')));
app.get('/video-downloader', (req, res) => res.sendFile(path.join(__dirname, 'views', 'downloader.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(__dirname, 'views', 'privacy.html')));
app.get('/terms-of-service', (req, res) => res.sendFile(path.join(__dirname, 'views', 'terms.html')));

// API: Audio Conversion
app.post('/api/convert/audio', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const targetFormat = req.body.format || 'mp3';
    const outputFilename = `${uuidv4()}.${targetFormat}`;
    const outputPath = path.join(__dirname, 'converted', outputFilename);

    ffmpeg(req.file.path)
        .toFormat(targetFormat)
        .on('end', () => {
            fs.unlinkSync(req.file.path); // Clean up original
            res.json({ downloadUrl: `/converted/${outputFilename}` });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Conversion failed' });
        })
        .save(outputPath);
});

// API: Video Conversion
app.post('/api/convert/video', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const targetFormat = req.body.format || 'mp4';
    const outputFilename = `${uuidv4()}.${targetFormat}`;
    const outputPath = path.join(__dirname, 'converted', outputFilename);

    ffmpeg(req.file.path)
        .toFormat(targetFormat)
        .on('end', () => {
            fs.unlinkSync(req.file.path);
            res.json({ downloadUrl: `/converted/${outputFilename}` });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Conversion failed' });
        })
        .save(outputPath);
});

// API: Image Conversion (using Sharp)
app.post('/api/convert/image', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const targetFormat = req.body.format || 'png';
    const outputFilename = `${uuidv4()}.${targetFormat}`;
    const outputPath = path.join(__dirname, 'converted', outputFilename);

    try {
        await sharp(req.file.path)
            .toFormat(targetFormat)
            .toFile(outputPath);
        
        fs.unlinkSync(req.file.path);
        res.json({ downloadUrl: `/converted/${outputFilename}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

// Placeholder for Video Downloader (requires external library like ytdl-core, which is often unstable)
app.post('/api/download/video', (req, res) => {
    res.status(501).json({ error: 'Video downloader requires specialized setup. Placeholder only.' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
