"use client";
import { StudentGroup } from "@/types/studentClassAssign";
import { Eye, Trash2, Pencil } from "lucide-react";
import Swal from "sweetalert2";

interface StudentClassAssignTableProps {
    groups: StudentGroup[];
    loading: boolean;
    onView: (studentId: string, studentName: string) => void;
    onEdit: (student: StudentGroup) => void;
    onDelete: (studentId: string) => void;
}

export default function StudentClassAssignTable({ groups, loading, onView, onEdit, onDelete }: StudentClassAssignTableProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!groups || groups.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No class assignments found. Click &quot;Assign New&quot; to create one.</p>
            </div>
        );
    }

    const handleDeleteClick = (studentId: string, studentName: string) => {
        Swal.fire({
            title: 'Are you sure?',
            html: `You are about to remove class assignment for <strong>${studentName}</strong>.`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, remove!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(studentId);
            }
        });
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Student</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Class</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Enrolled At</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, index) => (
                        <tr key={group.studentId}>
                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                {group.studentName}
                                <br />
                                <small className="text-muted">{group.studentEmail}</small>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                                {group.class ? group.class.className : <span className="text-muted">Not Assigned</span>}
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                                {group.class ? new Date(group.class.enrolledAt).toLocaleDateString() : "-"}
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                <div className="d-flex justify-content-center gap-2">
                                    <button type="button" className="btn btn-sm" onClick={() => onView(group.studentId, group.studentName)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                        <Eye size={16} /> View
                                    </button>
                                    <button type="button" className="btn btn-sm" onClick={() => onEdit(group)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button type="button" className="btn btn-sm" onClick={() => handleDeleteClick(group.studentId, group.studentName)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)")}>
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