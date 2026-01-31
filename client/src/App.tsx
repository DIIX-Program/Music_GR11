import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ArtistDashboard from './pages/ArtistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

function App() {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/app" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="artist" element={<ArtistDashboard />} />
                    <Route path="admin" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
