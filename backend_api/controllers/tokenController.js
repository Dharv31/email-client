export const getToken = async (req, res) => {

    try {
        const accessToken = req.cookies.ms_token;
        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Here you can return the token or any other user info
        res.status(200).json({ token: accessToken });
    } catch (error) {
        console.error('Error retrieving token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}