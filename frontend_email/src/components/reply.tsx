// src/components/ReplyWithAttachment.tsx
import React, { useState } from 'react';
import { replyToMail } from '../api/replyapi';
import { useNavigate } from 'react-router-dom';

interface Props {
    messageId: string;
}

interface Attachment {
    name: string;
    contentBytes: string;
    contentType: string;
}

const ReplyWithAttachment: React.FC<Props> = ({ messageId }) => {
    const [comment, setComment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const Navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let attachment = undefined;

        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];

                attachment = {
                    name: file.name,
                    contentBytes: base64,
                    contentType: file.type,
                };

                await sendReply(attachment);
            };
            reader.readAsDataURL(file);
        } else {
            await sendReply();
        }
    };

    const sendReply = async (attachment?: Attachment) => {
        try {
            const res = await replyToMail({
                messageId,
                comment,
                attachment,
            });

            const data = await res;

            if (data.success) {
                setMessage('Reply sent successfully!');
                setComment('');
                setFile(null);
                Navigate('/messages');
            } else {
                setMessage('Failed to send reply.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error occurred while sending reply.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto mt-10 space-y-6 border border-border"
        >
            <h2 className="text-2xl font-display font-bold text-primary mb-4">Reply to Email</h2>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Write your reply..."
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                required
            />

            <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 font-body
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-accent/10 file:text-primary
          hover:file:bg-accent/20"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-primary text-black px-8 py-2 rounded-pill hover:bg-accent transition duration-200 disabled:opacity-50 font-display border border-border"
            >
                {loading ? 'Sending...' : 'Send Reply'}
            </button>

            {message && (
                <p className={`text-sm mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'} font-body`}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default ReplyWithAttachment;
