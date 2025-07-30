// backend/controllers/forwardController.js
import axios from 'axios';

export const forwardWithAttachment = async (req, res) => {
    try {
        const accessToken = req.cookies.ms_token;
        const { messageId, to, comment, attachment } = req.body;

        if (!messageId || !to || to.length === 0 || !accessToken) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // STEP 1: Create forward draft
        const forwardDraft = await axios.post(
            `https://graph.microsoft.com/v1.0/me/messages/${messageId}/createForward`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const draftId = forwardDraft.data.id;

        // STEP 2: Get existing body from draft
        const draftData = await axios.get(
            `https://graph.microsoft.com/v1.0/me/messages/${draftId}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const existingBody = draftData.data.body?.content || '';
        const fullBody = `
      <p>${comment || ''}</p><br/>
      <hr/>
      ${existingBody}
    `;

        // STEP 3: Update draft with appended body and recipients
        await axios.patch(
            `https://graph.microsoft.com/v1.0/me/messages/${draftId}`,
            {
                body: {
                    contentType: 'HTML',
                    content: fullBody,
                },
                toRecipients: to.map(email => ({
                    emailAddress: { address: email },
                })),
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // STEP 4: (Optional) Add attachment
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

        // STEP 5: Send message
        await axios.post(
            `https://graph.microsoft.com/v1.0/me/messages/${draftId}/send`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        return res.status(200).json({ success: true, message: 'Forward sent' });
    } catch (error) {
        console.error('Error forwarding message:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to forward message' });
    }
};
