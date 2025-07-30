import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import {
    Inbox,
    Send,
    Trash2,
    FileText,
    AlertOctagon,
    Archive,
    FilePlus,
    History as HistoryIcon,
    Upload,
    Reply,
    Forward,
} from 'lucide-react';
import type { MailItem, GraphRecipient, MailFolder } from '../types/mail';
import { fetchFolderMessages, fetchFolders, deleteMail } from '../api/folderapi';
import { useNavigate } from 'react-router-dom';

const MailClient: React.FC = () => {
    const [selectedMail, setSelectedMail] = useState<MailItem | undefined>();
    const [selectedFolderId, setSelectedFolderId] = useState('Inbox');
    const [selectedFolder, setSelectedFolder] = useState('Inbox');
    const [folders, setFolders] = useState<MailFolder[]>([]);
    const [threads, setThreads] = useState<{ [conversationId: string]: MailItem[] }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFolders();
                setFolders(data.value || []);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFolderMessages(selectedFolderId);
                // console.log("Fetched messages for folder:", selectedFolderId, data);

                const messages: MailItem[] = data.value || [];

                // Group messages by conversationId
                const grouped = messages.reduce((acc, msg) => {
                    const key = msg.conversationId || msg.id;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(msg);
                    return acc;
                }, {} as { [conversationId: string]: MailItem[] });

                setThreads(grouped);
            } catch (error) {
                console.error("Error fetching folder messages:", error);
            }
        };
        fetchData();
    }, [selectedFolderId]);

    const getFolderIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'inbox':
                return <Inbox className="w-4 h-4 text-gray-500" />;
            case 'sent items':
            case 'sent':
            case 'sent item':
                return <Send className="w-4 h-4 text-gray-500" />;
            case 'deleted items':
                return <Trash2 className="w-4 h-4 text-gray-500" />;
            case 'drafts':
                return <FilePlus className="w-4 h-4 text-gray-500" />;
            case 'junk email':
                return <AlertOctagon className="w-4 h-4 text-yellow-500" />;
            case 'archive':
                return <Archive className="w-4 h-4 text-gray-500" />;
            case 'conversation history':
                return <HistoryIcon className="w-4 h-4 text-gray-500" />;
            case 'outbox':
                return <Upload className="w-4 h-4 text-gray-500" />;
            default:
                return <FileText className="w-4 h-4 text-gray-400" />;
        }
    };

    const handleDelete = async (msg: MailItem) => {
        if (!window.confirm('Are you sure you want to delete this email?')) return;
        try {
            await deleteMail(selectedFolderId, msg.id);
            // Remove the deleted message from UI
            setThreads(prev => {
                const newThreads = { ...prev };
                Object.keys(newThreads).forEach(cid => {
                    newThreads[cid] = newThreads[cid].filter(m => m.id !== msg.id);
                    if (newThreads[cid].length === 0) delete newThreads[cid];
                });
                return newThreads;
            });
            if (selectedMail?.id === msg.id) setSelectedMail(undefined);
        } catch {
            alert('Failed to delete email.');
        }
    };

    return (
        <div className="h-screen w-full flex flex-col font-body bg-background text-[#2B2B2B] transition-colors duration-300">
            {/* Top bar */}
            <div className="h-16 flex items-center justify-between px-10 border-b bg-primary text-white shadow rounded-b-2xl">
                <div className="text-2xl font-display tracking-wider flex items-center gap-2">
                    <span className="inline-block w-8 h-8 bg-accent rounded-circle border border-border mr-2"></span>
                    <span className='text-black'>EmailClient</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="px-5 py-2 bg-accent text-black font-semibold rounded-pill shadow hover:bg-primary hover:text-accent transition-all duration-200 border border-border"
                        onClick={() => navigate('/compose')}
                    >
                        New Message
                    </button>
                </div>
            </div>
            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 border-r bg-white px-8 py-8 overflow-y-auto rounded-tr-2xl shadow-lg border border-border">
                    <section>
                        <h2 className="text-xs text-primary font-bold mb-6 uppercase tracking-widest font-display">Folders</h2>
                        <div className="flex flex-col gap-3">
                            {folders.map(folder => (
                                <div
                                    key={folder.id}
                                    onClick={() => {
                                        setSelectedFolderId(folder.id);
                                        setSelectedFolder(folder.displayName);
                                        setSelectedMail(undefined);
                                    }}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base cursor-pointer font-semibold transition-all shadow-sm border border-transparent hover:border-accent hover:bg-accent/10 ${selectedFolderId === folder.id ? 'bg-primary/10 text-primary border-primary' : 'text-[#2B2B2B]'}`}
                                >
                                    {getFolderIcon(folder.displayName)}
                                    <span className="truncate font-display">{folder.displayName}</span>
                                    {folder.unreadItemCount > 0 && (
                                        <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                            {folder.unreadItemCount}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
                {/* Email list */}
                <section className="w-[28rem] border-r overflow-y-auto bg-white rounded-tr-2xl shadow-lg border border-border">
                    <div className="px-8 py-6 border-b text-xl font-bold sticky top-0 z-10 bg-white font-display text-primary">
                        {selectedFolder}
                    </div>
                    {Object.keys(threads).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-3 pt-24">
                            <Trash2 className="w-10 h-10 text-gray-300" />
                            <div className="font-medium">Nothing in {selectedFolder}</div>
                            <div className="text-xs">Looks empty over here.</div>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-accent/20">
                            {Object.entries(threads).map(([conversationId, thread]) => {
                                const latest = thread.sort((a, b) => new Date(b.sentDateTime).getTime() - new Date(a.sentDateTime).getTime())[0];
                                return (
                                    <div
                                        key={conversationId}
                                        onClick={() => setSelectedMail(latest)}
                                        className={`px-8 py-6 cursor-pointer transition-all rounded-lg mb-2 shadow-sm hover:bg-primary/10 ${selectedMail?.conversationId === conversationId ? 'bg-accent/10 border-l-4 border-accent' : 'bg-white'}`}
                                    >
                                        <div className="font-bold text-lg font-display truncate text-primary">
                                            {latest.subject || '(No Subject)'}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            From: {latest.from?.emailAddress?.name || latest.from?.emailAddress?.address || 'Unknown'}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(latest.sentDateTime).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
                {/* Mail viewer (thread view) */}
                <main className="flex-1 overflow-y-auto bg-background p-12">
                    {!selectedMail ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Inbox className="w-10 h-10 mb-3" />
                            <div className="text-lg font-medium">Select an email to view</div>
                        </div>
                    ) : (
                        <div className="space-y-10 max-w-4xl mx-auto">
                            {(threads[selectedMail.conversationId] || [selectedMail])
                                .sort((a, b) => new Date(a.sentDateTime).getTime() - new Date(b.sentDateTime).getTime())
                                .map(msg => (
                                    <div key={msg.id} className="bg-white p-8 rounded-2xl shadow-lg border border-accent/20">
                                        <div className="flex justify-end gap-4 mb-2">
                                            <Reply onClick={() => navigate(`/reply/${msg.id}`)} className="cursor-pointer text-primary hover:text-accent" />
                                            <Forward onClick={() => navigate(`/forward/${msg.id}`)} className="cursor-pointer text-primary hover:text-accent" />
                                            <Trash2 onClick={() => handleDelete(msg)} className="cursor-pointer text-accent hover:text-red-500" aria-label="Delete" />
                                        </div>
                                        <h2 className="text-2xl font-display font-bold text-primary mb-4">
                                            {msg.subject || '(No Subject)'}
                                        </h2>
                                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                                            <p><span className="font-semibold">From:</span> {msg.from?.emailAddress?.name}</p>
                                            <p><span className="font-semibold">To:</span> {msg.toRecipients?.map((r: GraphRecipient) => r.emailAddress?.address).join(', ')}</p>
                                            <p><span className="font-semibold">Sent:</span> {new Date(msg.sentDateTime).toLocaleString()}</p>
                                        </div>
                                        <hr className="my-4 border-accent/20" />
                                        <div className="text-base leading-relaxed text-[#2B2B2B] font-body">
                                            {msg.body?.contentType === 'html' ? (
                                                <div dangerouslySetInnerHTML={{ __html: msg.body.content }} />
                                            ) : (
                                                <p>{msg.bodyPreview}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MailClient;
