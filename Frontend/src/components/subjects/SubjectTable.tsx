"use client";
import { Subject } from "@/types/subject";
import { Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";

interface SubjectTableProps {
    subjects: Subject[];
    loading: boolean;
    onEdit: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
}

export default function SubjectTable({ subjects, loading, onEdit, onDelete }: SubjectTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSubjects = subjects.filter((subject) => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (!searchLower) return true;

        const nameMatch = subject.name?.toLowerCase().includes(searchLower) || false;
        const codeMatch = subject.code?.toLowerCase().includes(searchLower) || false;
        const classMatch = subject.className?.toLowerCase().includes(searchLower) || false;

        return nameMatch || codeMatch || classMatch;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="p-3 border-bottom" style={{ borderColor: "var(--border-color) !important" }}>
                <div className="input-group" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color)" }}>
                        <Search size={18} style={{ color: "var(--text-muted)" }} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, code or class..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: "var(--border-color)" }}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setSearchTerm("")}
                            style={{ borderColor: "var(--border-color)" }}
                        >
                            ×
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <small className="text-muted ms-2">
                        Found {filteredSubjects.length} result{filteredSubjects.length !== 1 ? "s" : ""}
                    </small>
                )}
            </div>

            <div className="table-responsive">
                {filteredSubjects.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">
                            {searchTerm ? "No subjects match your search." : "No subjects found. Click \"Add Subject\" to create one."}
                        </p>
                    </div>
                ) : (
                    <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                        <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                            <tr>
                                <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                                <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Name</th>
                                <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Code</th>
                                <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Class</th>
                                <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects.map((subject, index) => (
                                <tr key={subject.id}>
                                    <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                                    <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>{subject.name}</td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                        {subject.code ? (
                                            <span className="badge" style={{ backgroundColor: "var(--primary-color)", fontSize: "11px", padding: "5px 12px" }}>{subject.code}</span>
                                        ) : (
                                            <span className="text-muted" style={{ fontSize: "12px" }}>N/A</span>
                                        )}
                                    </td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{subject.className || subject.classId}</td>
                                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button type="button" className="btn btn-sm" onClick={() => onEdit(subject)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)"}>
                                                <Pencil size={16} />
                                            </button>
                                            <button type="button" className="btn btn-sm" onClick={() => onDelete(subject)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)"}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}