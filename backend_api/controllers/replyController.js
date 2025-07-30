import axios from 'axios';

/**
 * Reply to a message with optional attachment
 */
export const replyWithAttachment = async (req, res) => {
    const accessToken = req.cookies.ms_token;
    const { messageId, comment, attachment } = req.body;

    if (!messageId || !comment || !accessToken) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // STEP 1: Create a reply draft
        const replyDraft = await axios.post(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}/createReply`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const draftId = replyDraft.data.id;

        // STEP 2: Update draft with comment (body)
        await axios.patch(
            `https://graph.microsoft.com/v1.0/me/messages/${draftId}`,
            {
                body: {
                    contentType: 'HTML',
                    content: comment,
                },
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // STEP 3: (Optional) Add attachment
        if (attachment) {
            const { name, contentBytes, contentType } = attachment;

            await axios.post(
                `https://graph.microsoft.com/v1.0/me/messages/${draftId}/attachments`,
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name,
                    contentBytes,
                    contentType,
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
        }

        // STEP 4: Send the reply
        await axios.post(
            `https://graph.microsoft.com/v1.0/me/messages/${draftId}/send`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        res.status(200).json({ success: true, message: 'Reply sent' });
    } catch (error) {
        console.error('Reply error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send reply' });
    }
};
