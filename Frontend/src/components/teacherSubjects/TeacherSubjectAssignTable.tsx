"use client";
import { TeacherGroup } from "@/types/teacherSubjectAssign";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface TeacherSubjectAssignTableProps {
    groups: TeacherGroup[];
    loading: boolean;
    onView: (teacher: TeacherGroup) => void;
    onDelete: (teacherId: string) => void;
}

export default function TeacherSubjectAssignTable({ groups, loading, onView, onDelete }: TeacherSubjectAssignTableProps) {
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
                <p className="text-muted">No assignments found. Click &quot;Assign New&quot; to create one.</p>
            </div>
        );
    }

    const handleDeleteClick = (teacherId: string, teacherName: string) => {
        Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete all assignments for <strong>${teacherName}</strong>.`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(teacherId);
            }
        });
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Teacher</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Classes</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Assigned At</th>
                        <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, index) => {
                        const assigns = group.assigns || [];
                        const uniqueClasses = assigns
                            .map((a) => a.className)
                            .filter((value, idx, self) => self.indexOf(value) === idx);

                        return (
                            <tr key={group.teacherId}>
                                <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                                <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                    {group.teacherName}
                                    <br />
                                    <small className="text-muted">{group.teacherEmail}</small>
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                    {uniqueClasses.join(", ")}
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                    {assigns.length > 0 ? new Date(assigns[0].assignedAt).toLocaleDateString() : "-"}
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <div className="d-flex justify-content-center gap-2">
                                        <button type="button" className="btn btn-sm" onClick={() => onView(group)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                            <Eye size={16} /> View
                                        </button>
                                        <button type="button" className="btn btn-sm" onClick={() => handleDeleteClick(group.teacherId, group.teacherName)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 10px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)")}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}