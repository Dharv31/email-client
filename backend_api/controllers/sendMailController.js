import axios from 'axios';

function toBase64(buffer) {
    return buffer.toString('base64');
}

export const sendMailController = async (req, res) => {
    const { to, cc, bcc, subject, body, file, filename } = req.body;
    const accessToken = req.cookies.ms_token; // from frontend or .env

    const message = {
        message: {
            subject,
            body: {
                contentType: 'HTML',
                content: body,
            },
            toRecipients: to ? [{ emailAddress: { address: to } }] : [],
            ccRecipients: cc ? [{ emailAddress: { address: cc } }] : [],
            bccRecipients: bcc ? [{ emailAddress: { address: bcc } }] : [],
            attachments: file
                ? [
                    {
                        '@odata.type': '#microsoft.graph.fileAttachment',
                        name: filename,
                        contentBytes: file,
                        isInline: false,
                    },
                ]
                : [],
        },
        saveToSentItems: true,
    };

    try {
        const response = await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', message, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || 'Failed to send email' });
    }
}

