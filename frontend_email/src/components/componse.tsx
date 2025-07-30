// src/pages/ComposeMail.tsx
import React, { useState } from 'react';
import { sendMail } from '../api/sendmailapi';
import { useNavigate } from 'react-router-dom';

const ComposeMail = () => {
    const [form, setForm] = useState<{
        to: string;
        cc: string;
        bcc: string;
        subject: string;
        body: string;
        attachmentName: string;
    }>({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        attachmentName: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
        setForm(prev => ({ ...prev, attachmentName: file?.name || '' }));
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
        let fileBase64: string | null = null;
        if (file) {
            fileBase64 = await convertFileToBase64(file);
        }

        await sendMail(form, fileBase64);
        alert('Mail sent successfully');
        setForm({
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            body: '',
            attachmentName: '',
        });
        setFile(null);
        navigate('/messages');
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#e3eafc] via-[#f7fafd] to-background flex justify-center items-center px-4 py-12">
            <div className="w-1/2 text-center max-w-3xl bg-white shadow-lg rounded-2xl p-10 space-y-8 border border-border">
                <h2 className="text-4xl font-bold text-center text-primary mb-6 font-display drop-shadow-md">📧 Compose Email</h2>

                {/* Email Inputs */}
                {[
                    { label: 'To', name: 'to', type: 'email' },
                    { label: 'CC', name: 'cc', type: 'email' },
                    { label: 'BCC', name: 'bcc', type: 'email' },
                    { label: 'Subject', name: 'subject', type: 'text' },
                ].map(({ label, name, type }) => (
                    <div key={name} className="flex m-10 flex-row md:flex-row items-start gap-5">
                        <label htmlFor={name} className="w-24 font-semibold text-sm text-gray-800 pt-2 font-display">{label}:</label>
                        <input
                            id={name}
                            type={type}
                            name={name}
                            value={form[name as keyof typeof form]}
                            onChange={handleChange}
                            placeholder={`Enter ${label}`}
                            className="w-1/3 ml-3 rounded-lg p-3 border border-border bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-accent font-body"
                        />
                    </div>
                ))}

                {/* Body Textarea */}
                <div className="flex flex-col md:flex-row items-start gap-3">
                    <label htmlFor="body" className="w-24 font-semibold text-sm text-gray-800 pt-2 font-display">Body:</label>
                    <textarea
                        id="body"
                        name="body"
                        value={form.body}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        className="w-full p-4 rounded-lg border border-border bg-white shadow-inner h-40 resize-none focus:outline-none focus:ring-2 focus:ring-accent font-body"
                    />
                </div>

                {/* File Upload */}
                <div className="flex flex-col md:flex-row items-start gap-3">
                    <label className="w-24 font-semibold text-sm text-gray-800 pt-2 font-display">Attachment:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded-lg border border-dashed border-border bg-white cursor-pointer font-body"
                    />
                </div>

                {/* Preview Filename */}
                {form.attachmentName && (
                    <div className="text-sm text-primary text-center italic font-body">
                        📎 Attached: {form.attachmentName}
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-accent text-black text-lg font-semibold px-10 py-3 rounded-pill shadow transition duration-300 ease-in-out font-display border border-border"
                    >
                        🚀 Send Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComposeMail;
