
import { renderHome } from './pages/Home';
import { renderLogin } from './pages/Login';
import { renderDashboard } from './pages/Dashboard';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase";

const routes = {
    '/': renderHome,
    '/login': renderLogin,
    '/dashboard': renderDashboard
};

const auth = getAuth(app);

export function initRouter(container) {
    function handleRoute() {
        let hash = window.location.hash.slice(1) || '/';

        // Auth Guard for Dashboard
        if (hash.startsWith('/dashboard')) {
            // Check if user is authenticated
            if (!auth.currentUser) {
                // Wait for auth to initialize?
                // onAuthStateChanged will trigger below, but for direct navigation we might need to wait or redirect.
                // For simplicity, we redirect to login if not authenticated immediately, 
                // but persistent auth might take a moment.
                // Better: Dashboard renders a "Loading..." then content or redirect.
                // We'll let renderDashboard handle the check or wrap it.
                // For now, simple redirect if we are SURE.
                // Actually, onAuthStateChanged is the source of truth.
            }
        }

        const renderer = routes[hash] || routes['/'];
        container.innerHTML = '';
        renderer(container);
    }

    window.addEventListener('hashchange', handleRoute);

    // Listen for auth state to redirect or refresh UI
    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? user.email : "Logged out");
        // If on login page and logged in, go to dashboard
        const hash = window.location.hash.slice(1) || '/';
        if (user && hash === '/login') {
            window.location.hash = '#/dashboard';
        }
        // If on dashboard and logged out, go to login
        if (!user && hash.startsWith('/dashboard')) {
            // Allow dashboard to handle it or redirect?
            // Let's redirect to be safe
            window.location.hash = '#/login';
        }
    });

    handleRoute();
}
