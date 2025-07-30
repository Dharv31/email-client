import axios from 'axios';

export const getFolders = async (req, res) => {
    const accessToken = req.cookies.ms_token;



    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    try {
        const response = await axios.get(
            'https://graph.microsoft.com/v1.0/me/mailFolders',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error('Graph API error:', err?.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch folders' });
    }
}
