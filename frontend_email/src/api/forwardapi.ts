// src/api/forwardapi.ts
import api from "./api";

export const forwardMail = async ({
    messageId,
    to,
    comment,
    attachment,
}: {
    messageId: string;
    to: string[]; // Array of emails
    comment: string;
    attachment?: {
        name: string;
        contentBytes: string;
        contentType: string;
    };
}) => {
    const response = await api.post("/api/forward", {
        messageId,
        to,
        comment,
        attachment,
    });
    return response.data;
};
