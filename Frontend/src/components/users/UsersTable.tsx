"use client";
import { User } from "@/types/user";
import { Pencil, Trash2 } from "lucide-react";

interface UsersTableProps {
    users: User[];
    loading: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UsersTable({ users, loading, onEdit, onDelete }: UsersTableProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No users found. Click &quot;Add User&quot; to create one.</p>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "Admin": return "var(--danger-color)";
            case "Teacher": return "var(--primary-color)";
            case "Student": return "var(--info-color)";
            default: return "var(--text-muted)";
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Name</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Email</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Role</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Status</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                {user.firstName} {user.lastName}
                            </td>
                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{user.email}</td>
                            <td style={{ padding: "10px 16px" }}>
                                <span className="badge" style={{ backgroundColor: getRoleBadgeColor(user.role), fontSize: "11px", padding: "5px 12px" }}>
                                    {user.role}
                                </span>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                                <span className="badge" style={{ backgroundColor: user.isActive ? "var(--success-color)" : "var(--danger-color)", fontSize: "11px", padding: "5px 12px" }}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                <div className="d-flex justify-content-center gap-2">
                                    <button type="button" className="btn btn-sm" onClick={() => onEdit(user)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)"}>
                                        <Pencil size={16} />
                                    </button>
                                    <button type="button" className="btn btn-sm" onClick={() => onDelete(user)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)"}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}