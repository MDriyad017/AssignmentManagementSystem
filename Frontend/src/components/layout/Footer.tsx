export default function Footer() {
    return (
        <footer className="bg-white border-top text-center py-3">
            <small className="text-muted">
                © {new Date().getFullYear()} Assignment Management System
            </small>
        </footer>
    );
}