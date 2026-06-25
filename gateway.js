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

// 🔄 1. विशिष्ट एंडपॉइंट जो गेम की बाइनरी ढूंढ रही है
// (जैसे स्क्रीनशॉट के अनुसार CHECK_AND_ADJUST_LANGUAGE)
app.use(['/CHECK_AND_ADJUST_LANGUAGE', '/api/CHECK_AND_ADJUST_LANGUAGE'], (req, res) => {
    console.log(`[Nexus] Game requested language configuration check.`);
    res.status(200).json({
        success: true,
        status: "SUCCESS",
        language: "en",
        allow_proceed: true,
        message: "Language verified successfully"
    });
});

// 🌐 2. द जादुई 'Catch-All' (Wildcard) रूट!
// अगर गेम कोई भी ऐसा रास्ता ढूंढेगा जो सर्वर में नहीं बना है, तो यह रूट उसे संभाल लेगा।
app.use((req, res) => {
    console.log(`[⚠️ Unknown Route Trapped]: ${req.method} ${req.path}`);
    
    // गेम को शांत रखने के लिए एक सुरक्षित, जनरल JSON रिस्पॉन्स भेजें
    res.status(200).json({
        success: true,
        status: "ONLINE",
        authenticated: true,
        user_status: "ACTIVE",
        error: null,
        data: {
            message: "Nexus gateway handled this request safely.",
            action: "CONTINUE"
        }
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


