import { getAuthUrl, getTokenFromCode } from '../services/msalService.js';

export const login = async (req, res) => {
    const authUrl = await getAuthUrl();
    res.redirect(authUrl);
};

export const handleRedirect = async (req, res) => {
    try {
        const token = await getTokenFromCode(req.query.code);

        // ✅ Store token securely in a cookie
        res.cookie('ms_token', token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'Lax',
            maxAge: 3600 * 1000, // 1 hour
        });

        // ✅ Redirect without token in URL
        res.redirect('http://localhost:3000/messages');
    } catch (err) {
        console.error('Token exchange failed:', err);
        res.status(500).send('Login failed');
    }
};