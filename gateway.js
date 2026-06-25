const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // यूनिटी कभी-कभी Form-Data भेजता है

// 📝 लॉगर: गेम जो भी एंडपॉइंट ढूंढेगा, वह टर्मक्स/रेंडर लॉग्स में दिखाई देगा
app.use((req, res, next) => {
    console.log(`[Unity Request]: ${req.method} ${req.path} | Data:`, req.body || req.query);
    next();
});

// 🌐 1. यूनिटी रिमोट कॉन्फ़िगरेशन और लैंग्वेज चेक
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

// 👤 2. यूनिटी फेसबुक लॉगिन सिमुलेटर (Facebook Auth Link)
app.all(['*/facebook*', '*/fb_login*', '/api/auth/facebook'], (req, res) => {
    const mockFbId = Math.floor(100000000 + Math.random() * 900000000);
    res.status(200).json({
        success: true,
        status: "AUTHENTICATED",
        token: crypto.randomBytes(32).toString('hex'),
        player_info: {
            user_id: mockFbId,
            username: `Nexus_Player_${mockFbId}`,
            avatar: "https://sgma-api.onrender.com/cdn/default_avatar.png",
            role: "Master_Admin", // एडमिन प्रिविलेज
            level: 50,
            gold: 99999,
            diamonds: 9999
        },
        session: {
            session_key: crypto.randomBytes(16).toString('hex'),
            expires_at: new Date(Date.now() + 86400000).toISOString()
        }
    });
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
    console.log(`🚀 Full Unity Server Clone Running on Port ${PORT}`);
});

