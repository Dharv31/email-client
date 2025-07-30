import api from "./api";

export async function replyToMail({
    messageId,
    comment,
    attachment,
}: {
    messageId: string;
    comment: string;
    attachment?: {
        name: string;
        contentBytes: string; // Base64 string
        contentType: string;
    };
}) {
    const response = await api.post(
        '/api/reply',
        {
            messageId,
            comment,
            attachment,
        }
    );
    return response.data;
}
