import { ConfidentialClientApplication } from '@azure/msal-node';
import { msalConfig } from '../config/msalConfig.js';

const pca = new ConfidentialClientApplication(msalConfig);

export const getAuthUrl = () => {
    const authCodeUrlParameters = {
        scopes: ['user.read', 'mail.read', 'MailboxFolder.Read', 'offline_access', 'Mail.ReadWrite'],
        redirectUri: process.env.REDIRECT_URI,
    };
    return pca.getAuthCodeUrl(authCodeUrlParameters);
};

export const getTokenFromCode = async (code) => {
    const tokenRequest = {
        code,
        scopes: ['user.read', 'mail.read', 'MailboxFolder.Read', 'offline_access', 'Mail.ReadWrite'],
        redirectUri: process.env.REDIRECT_URI,
    };

    const response = await pca.acquireTokenByCode(tokenRequest);
    return response.accessToken;
};
