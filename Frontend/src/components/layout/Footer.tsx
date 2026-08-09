export default function Footer() {
    return (
        <footer className="border-top py-3 mt-auto" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color) !important" }}>
            <div className="container-fluid px-4 text-center">
                <small className="text-muted" style={{ fontSize: "12px" }}>&copy; {new Date().getFullYear()} Assignment Management System. All rights reserved.</small>
            </div>
        </footer>
    );
}