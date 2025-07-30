export interface GraphEmailAddress {
    name: string;
    address: string;
}

export interface GraphRecipient {
    emailAddress: GraphEmailAddress;
}

// types/mail.ts (or wherever appropriate)
export interface MailFolder {
    id: string;
    displayName: string;
    unreadItemCount: number;
}


export interface MailItem {
    id: string;
    subject: string;
    from: GraphRecipient;
    sender?: GraphRecipient;
    toRecipients: GraphRecipient[];
    ccRecipients?: GraphRecipient[];
    bccRecipients?: GraphRecipient[];
    bodyPreview: string;
    body: {
        contentType: 'html' | 'text';
        content: string;
    };
    hasAttachments: boolean;
    importance: 'low' | 'normal' | 'high';
    isRead: boolean;
    sentDateTime: string;
    receivedDateTime: string;
    createdDateTime: string;
    conversationId: string;
    webLink?: string;
}
