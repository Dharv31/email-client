import api from "./api";

export const sendMail = async (form: any, fileBase64: string | null) => {
    try {
        const response = await api.post("/api/sendMail", {
            ...form,
            file: fileBase64 ? fileBase64 : null,
            filename: fileBase64 ? form.attachmentName : null,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending mail:", error);
        throw error;
    }
};