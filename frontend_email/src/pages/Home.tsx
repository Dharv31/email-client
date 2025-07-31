
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { isAuthenticated, isLoading, login, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-primary font-display">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f7fafd] to-background">
            <div className="container mx-auto px-4 py-24">
                <div className="text-center">
                    <h1 className="text-6xl font-display font-bold text-primary mb-6 drop-shadow-xl">
                        <span className="inline-block w-12 h-12 bg-accent rounded-circle border border-border mr-3 align-middle"></span>
                        Email Client
                    </h1>
                    <p className="text-2xl text-[#2B2B2B] mb-12 max-w-2xl mx-auto font-body">
                        A classic, secure email client with Microsoft Graph integration
                    </p>

                    {!isAuthenticated ? (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md mx-auto border border-border">
                                <h2 className="text-3xl font-display font-bold text-primary mb-4">
                                    Welcome!
                                </h2>
                                <p className="text-[#2B2B2B] mb-6 font-body">
                                    Sign in with your Microsoft account to access your emails
                                </p>
                                <button 
                                    onClick={login}
                                    className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-pill transition duration-200 flex items-center justify-center space-x-2 shadow text-lg font-display border border-border"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.4c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-8.9z"/>
                                        <path d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3.1c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.9-2.1-6.9-5H1.2v3.2C3.3 21.3 7.4 24 12 24z"/>
                                        <path d="M5.1 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l3.9-3.2z"/>
                                        <path d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5C18 1.1 15.2 0 12 0 7.4 0 3.3 2.7 1.2 6.6l3.9 3.2c1-2.9 3.7-5 6.9-5z"/>
                                    </svg>
                                    <span>Login with Microsoft</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-2xl mx-auto border border-border">
                                <h2 className="text-3xl font-display font-bold text-primary mb-6">
                                    Welcome back!
                                </h2>
                                <p className="text-[#2B2B2B] mb-8 font-body">
                                    You're successfully authenticated. Access your email features below.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <Link 
                                        to="/messages" 
                                        className="bg-primary hover:bg-accent text-white font-semibold py-4 px-6 rounded-pill transition duration-200 text-center block shadow text-lg font-display border border-border"
                                    >
                                        📧 View Messages
                                    </Link>
                                    <Link 
                                        to="/compose" 
                                        className="bg-accent hover:bg-primary text-white font-semibold py-4 px-6 rounded-pill transition duration-200 text-center block shadow text-lg font-display border border-border"
                                    >
                                        ✍️ Compose Email
                                    </Link>
                                </div>

                                <button 
                                    onClick={logout}
                                    className="bg-[#2B3A67] hover:bg-accent text-white font-semibold py-2 px-4 rounded-pill transition duration-200 font-display shadow border border-border"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
