import api from "./api";

export const fetchFolders = async () => {
    try {
        const response = await api.get('/api/folders');
        // console.log('Fetched folders:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching folders:', error);
        throw error;
    }
};

export const fetchFolderMessages = async (folderName: string) => {
    try {
        const response = await api.get(`/api/folders/${folderName}/messages`);
        // console.log(`Fetched messages for folder ${folderName}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for folder ${folderName}:`, error);
        throw error;
    }
}

export const deleteMail = async (folderId: string, messageId: string) => {
    try {
        await api.delete(`/api/folders/${folderId}/messages/${messageId}`);
    } catch (error) {
        console.error(`Error deleting message ${messageId} in folder ${folderId}:`, error);
        throw error;
    }
};