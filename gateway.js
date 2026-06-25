const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: "ONLINE",
        server: config.serverName,
        version: config.version,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/guest', (req, res) => {
    const newPlayerId = Math.floor(100000 + Math.random() * 900000);
    res.status(200).json({
        success: true,
        player_info: { user_id: newPlayerId, username: `Guest_${newPlayerId}` }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Gateway running on port ${PORT}`));

