// src/pages/reply.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ReplyWithAttachment from '../components/reply';

const ReplyToMail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // console.log(`ReplyToMail component rendered with messageId: ${id}`);

    if (!id) return <div>Error: No message ID provided.</div>;

    return <ReplyWithAttachment messageId={id} />;
};

export default ReplyToMail;
