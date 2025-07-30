import axios from 'axios';

export const getFoldersMessage = async (req, res) => {
    const accessToken = req.cookies.ms_token;

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }


    try {
        const response = await axios.get(
            `https://graph.microsoft.com/v1.0/me/mailFolders/${req.params.folderId}/messages?$top=100`,
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

export const deleteMessage = async (req, res) => {
    const accessToken = req.cookies.ms_token;
    const { messageId } = req.params;

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    try {
        await axios.delete(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        res.status(204).send();
    } catch (err) {
        console.error('Graph API delete error:', err?.response?.data || err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};