// src/pages/ForwardMail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forwardMail } from '../api/forwardapi';

const ForwardMail = () => {
    const { id: messageId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        to: '',
        comment: '',
        attachment: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === 'attachment') {
            setForm({ ...form, attachment: files ? files[0] : null });
        } else {
            setForm({ ...form, [name]: value });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let attachmentData;
            if (form.attachment) {
                const file = form.attachment;
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64String = (reader.result as string).split(',')[1]; // Remove data:*/*;base64, prefix

                    attachmentData = {
                        name: file.name,
                        contentBytes: base64String,
                        contentType: file.type,
                    };

                    await forwardMail({
                        messageId: messageId!,
                        to: form.to.split(',').map((email) => email.trim()),
                        comment: form.comment,
                        attachment: attachmentData,
                    });

                    navigate('/messages');
                };

                reader.readAsDataURL(file);
            } else {
                await forwardMail({
                    messageId: messageId!,
                    to: form.to.split(',').map((email) => email.trim()),
                    comment: form.comment,
                });
                navigate('/messages');
            }
        } catch (err) {
            const error = err as { response?: { data?: { error?: string } } };
            console.error('Forward failed:', error);
            setError(error?.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 rounded-2xl bg-white shadow-lg border border-border">
            <h1 className="text-3xl font-display font-bold text-primary mb-6">Forward Email</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium font-display">To (comma-separated):</label>
                    <input
                        name="to"
                        value={form.to}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg font-body"
                        placeholder="someone@example.com, another@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium font-display">Comment:</label>
                    <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg font-body"
                        placeholder="Add a note..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium font-display">Attachment:</label>
                    <input type="file" name="attachment" onChange={handleChange} className="font-body" />
                </div>
                {error && <div className="text-red-500 text-sm font-body">{error}</div>}
                <button
                    type="submit"
                    className="bg-primary text-black px-6 py-2 rounded-pill hover:bg-accent transition duration-200 disabled:opacity-50 font-display border border-border"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Forward'}
                </button>
            </form>
        </div>
    );
};

export default ForwardMail;
