"use client";
import { Class } from "@/types/class";
import { Pencil, Trash2 } from "lucide-react";

interface ClassTableProps {
    classes: Class[];
    loading: boolean;
    onEdit: (cls: Class) => void;
    onDelete: (cls: Class) => void;
}

export default function ClassTable({ classes, loading, onEdit, onDelete }: ClassTableProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No classes found. Click &quot;Add Class&quot; to create one.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Name</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Code</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls, index) => (
                        <tr key={cls.id}>
                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>{cls.name}</td>
                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                <span className="badge" style={{ backgroundColor: "var(--primary-color)", fontSize: "11px", padding: "5px 12px" }}>{cls.code}</span>
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                <div className="d-flex justify-content-center gap-2">
                                    <button type="button" className="btn btn-sm" onClick={() => onEdit(cls)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)"}>
                                        <Pencil size={16} />
                                    </button>
                                    <button type="button" className="btn btn-sm" onClick={() => onDelete(cls)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)"}>
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