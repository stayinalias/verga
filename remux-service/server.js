const express = require('express');
const WebTorrent = require('webtorrent');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const client = new WebTorrent();

app.get('/download', (req, res) => {
    const magnetURI = req.query.magnet;
    if (!magnetURI) {
        return res.status(400).send('Missing magnet parameter');
    }

    client.add(magnetURI, (torrent) => {
        // Locate largest video file inside the torrent
        const file = torrent.files.reduce((a, b) => (a.length > b.length ? a : b));
        
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}.mp4"`);

        const stream = file.createReadStream();

        ffmpeg(stream)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .outputOptions(['-movflags frag_keyint+empty_moov+faststart'])
            .on('error', (err) => {
                console.error('FFmpeg remuxing error:', err.message);
                if (!res.headersSent) res.status(500).send('Remuxing error');
            })
            .on('end', () => {
                console.log('Remuxing finished successfully.');
            })
            .pipe(res, { end: true });

        req.on('close', () => {
            torrent.destroy();
        });
    });
});

app.listen(4000, () => {
    console.log('Remux-to-MP4 service active on port 4000');
});
