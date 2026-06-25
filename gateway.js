const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Request Logger
app.use((req, res, next) => {
    console.log(`[Unity Request]: ${req.method} ${req.path}`);
    next();
});

// 🌐 1. लैंग्वेज चेक
app.all(['/CHECK_AND_ADJUST_LANGUAGE', '*/CHECK_AND_ADJUST_LANGUAGE'], (req, res) => {
    res.status(200).json({
        success: true,
        status: "SUCCESS",
        data: { language: "en", server_version: "1.0.0", maintenance: false }
    });
});

// 👤 2. फेसबुक लॉगिन रूट (With Auto-Redirect)
app.all(['*/facebook*', '*/fb_login*', '/api/auth/facebook'], (req, res) => {
    const mockFbId = Math.floor(100000000 + Math.random() * 900000000);
    const token = crypto.randomBytes(32).toString('hex');
    
    if (req.headers['user-agent'] && !req.headers['user-agent'].includes('Mozilla')) {
        return res.status(200).json({
            success: true,
            status: "AUTHENTICATED",
            token: token,
            player_info: { user_id: mockFbId, username: `Guest_${mockFbId}`, role: "Player" }
        });
    }

    res.status(200).send(getRedirectHTML(token, mockFbId));
});

// 🛡️ 3. कैच-ऑल जादुई फॉलबैक (बाकी सभी बटनों के लिए ऑटो-रीडायरेक्ट)
app.use((req, res) => {
    console.log(`[🪤 Caught Missing Route]: ${req.path}`);
    
    if (req.headers['user-agent'] && !req.headers['user-agent'].includes('Mozilla')) {
        return res.status(200).json({
            success: true,
            status: "SUCCESS",
            authenticated: true,
            user_status: "ACTIVE",
            data: { action: "CONTINUE" }
        });
    }

    const mockToken = crypto.randomBytes(32).toString('hex');
    const mockId = Math.floor(100000 + Math.random() * 900000);
    res.status(200).send(getRedirectHTML(mockToken, mockId));
});

// 🌐 गेम को वापस खोलने वाला HTML टेम्पलेट
function getRedirectHTML(token, id) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nexus Auto-Bypass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { background: #121212; color: #fff; font-family: sans-serif; text-align: center; padding-top: 50px; }
            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #a855f7; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .btn { background: #a855f7; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 20px; }
        </style>
    </head>
    <body>
        <h2>✓ Bypass Authorized</h2>
        <p>Returning to Game...</p>
        <div class="loader"></div>
        <script>
            const gameUri = "sigmax://auth?token=${token}&user_id=${id}";
            const fallbackUri = "intent://auth?token=${token}#Intent;scheme=sigmax;package=com.nexus.sigma;end";
            setTimeout(() => {
                window.location.href = gameUri;
                setTimeout(() => { window.location.href = fallbackUri; }, 500);
            }, 1000);
        </script>
        <a class="btn" href="sigmax://auth?token=${token}">Resume Game</a>
    </body>
    </html>`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Gateway Live on Port ${PORT}`));

