const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

app.use(express.json());
app.use(express.static(__dirname));

function readScores() {
    try {
        return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeScores(scores) {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

// GET /api/leaderboard - top 10 scores
app.get('/api/leaderboard', (req, res) => {
    const scores = readScores();
    res.json(scores.slice(0, 10));
});

// POST /api/scores - submit a new score
app.post('/api/scores', (req, res) => {
    const { name, score, level } = req.body;
    if (!name || typeof score !== 'number' || typeof level !== 'number') {
        return res.status(400).json({ error: 'נתונים לא תקינים' });
    }
    const scores = readScores();
    scores.push({
        name: String(name).slice(0, 20),
        score: Math.max(0, Math.floor(score)),
        level: Math.max(1, Math.floor(level)),
        date: new Date().toISOString()
    });
    scores.sort((a, b) => b.score - a.score);
    writeScores(scores.slice(0, 100));
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`🦎 משחק הלשון רץ על http://localhost:${PORT}`);
});
