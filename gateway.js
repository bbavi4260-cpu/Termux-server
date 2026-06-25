const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Request Logger - गेम की हर चाल पर नज़र रखने के लिए
app.use((req, res, next) => {
    console.log(`[Unity Request]: ${req.method} ${req.path} | Data:`, req.body || req.query);
    next();
});

// 🌐 1. यूनिटी रिमोट कॉन्फ़िगरेशन और लैंग्वेज चेक (CHECK_AND_ADJUST_LANGUAGE)
app.all(['/CHECK_AND_ADJUST_LANGUAGE', '*/CHECK_AND_ADJUST_LANGUAGE', '/api/config'], (req, res) => {
    res.status(200).json({
        success: true,
        status: "SUCCESS",
        data: {
            language: "en",
            server_version: "1.0.0",
            client_status: "UPDATE_NOT_REQUIRED",
            maintenance: false,
            cdn_url: "https://sgma-api.onrender.com/cdn/"
        }
    });
});

// 👤 2. यूनिटी फेसबुक लॉगिन सिमुलेटर (With Auto-Redirect to Game)
app.all(['*/facebook*', '*/fb_login*', '/api/auth/facebook'], (req, res) => {
    const mockFbId = Math.floor(100000000 + Math.random() * 900000000);
    const token = crypto.randomBytes(32).toString('hex');
    
    // अगर रिक्वेस्ट गेम के अंदर से (API के रूप में) आई है, तो सीधा JSON दें
    if (req.headers['user-agent'] && !req.headers['user-agent'].includes('Mozilla')) {
        return res.status(200).json({
            success: true,
            status: "AUTHENTICATED",
            token: token,
            player_info: { user_id: mockFbId, username: `Guest_${mockFbId}`, role: "Player", gold: 500, diamonds: 10 }
        });
    }

    // 🌐 अगर ब्राउज़र में खुला है, तो यह सुंदर पेज गेम को वापस खोलेगा!
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nexus Authentication</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #121212; color: #fff; font-family: sans-serif; text-align: center; padding-top: 50px; }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #a855f7; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .btn { background: #a855f7; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h2>✓ Login Successful</h2>
            <p>Connecting back to Nexus Sigma...</p>
            <div class="loader"></div>
            
            <script>
                const token = "${token}";
                const userId = "${mockFbId}";
                const gameUri = "sigmax://auth?token=" + token + "&user_id=" + userId;
                const fallbackUri = "intent://auth?token=" + token + "#Intent;scheme=sigmax;package=com.nexus.sigma;end";

                setTimeout(() => {
                    window.location.href = gameUri;
                    setTimeout(() => {
                        window.location.href = fallbackUri;
                    }, 500);
                }, 1500);
            </script>
            
            <p style="font-size: 12px; color: #666;">If game doesn't open automatically, click below:</p>
            <a class="btn" href="sigmax://auth?token=${token}">Return to Game</a>
        </body>
        </html>
    `);
});

// 🆔 3. गेस्ट लॉगिन और प्लेयर प्रोफाइल एंडपॉइंट
app.all(['*/guest*', '/api/auth/guest', '*/login*'], (req, res) => {
    const guestId = Math.floor(100000 + Math.random() * 900000);
    res.status(200).json({
        success: true,
        status: "AUTHENTICATED",
        player_info: {
            user_id: guestId,
            username: `Guest_${guestId}`,
            role: "Player",
            gold: 500,
            diamonds: 10
        },
        security: {
            token: crypto.randomBytes(24).toString('hex')
        }
    });
});

// 📡 4. यूनिटी मैचमेकिंग और लॉबी लोडिंग सिम्युलेटर
app.all(['*/matchmaking*', '*/lobby*', '/api/match'], (req, res) => {
    res.status(200).json({
        success: true,
        status: "MATCH_FOUND",
        server_ip: "127.0.0.1",
        server_port: 7777,
        room_token: crypto.randomBytes(12).toString('hex'),
        ping_interval: 5
    });
});

// 🛡️ 5. कैच-ऑल जादुई फॉलबैक (अगर गेम कोई दूसरा गुप्त एंडपॉइंट खोजे)
app.use((req, res) => {
    console.log(`[🪤 Caught Missing Unity Route]: ${req.method} ${req.path}`);
    res.status(200).json({
        success: true,
        status: "SUCCESS",
        authenticated: true,
        user_status: "ACTIVE",
        error: null,
        data: {
            action: "CONTINUE",
            message: "Nexus full clone bypass handle."
        }
    });
});

// पोर्ट लिसनर
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Gateway running on port ${PORT}`);
});

