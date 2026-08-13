"use client";
import { StudentAssignment } from "@/types/studentAssignment";
import { Eye, FileText, Send } from "lucide-react";

interface StudentAssignmentTableProps {
    assignments: StudentAssignment[];
    loading: boolean;
    onView: (assignment: StudentAssignment) => void;
    onSubmit: (assignment: StudentAssignment) => void;
    submittedAssignments: Set<string>;
}

export default function StudentAssignmentTable({
    assignments,
    loading,
    onView,
    onSubmit,
    submittedAssignments,
}: StudentAssignmentTableProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No assignments found for your class.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>#</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Title</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Subject</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Teacher</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Due Date</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment, index) => {
                        const isSubmitted = submittedAssignments.has(assignment.id);
                        const isOverdue = assignment.dueDate ? new Date(assignment.dueDate) < new Date() : false;

                        return (
                            <tr key={assignment.id}>
                                <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                                <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                    {assignment.title}
                                    {assignment.attachmentUrl && (
                                        <span className="ms-1">
                                            <FileText size={14} style={{ color: "var(--primary-color)" }} />
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.subjectName}</td>
                                <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.teacherName}</td>
                                <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
                                    {isOverdue && !isSubmitted && (
                                        <span className="badge ms-1" style={{ backgroundColor: "var(--danger-color)", fontSize: "9px" }}>Overdue</span>
                                    )}
                                </td>
                                <td style={{ padding: "10px 16px" }}>
                                    {isSubmitted ? (
                                        <span className="badge" style={{ backgroundColor: "var(--success-color)", fontSize: "11px", padding: "5px 12px" }}>Submitted</span>
                                    ) : isOverdue ? (
                                        <span className="badge" style={{ backgroundColor: "var(--danger-color)", fontSize: "11px", padding: "5px 12px" }}>Late</span>
                                    ) : (
                                        <span className="badge" style={{ backgroundColor: "var(--warning-color)", fontSize: "11px", padding: "5px 12px" }}>Pending</span>
                                    )}
                                </td>
                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                    <div className="d-flex justify-content-center gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => onView(assignment)}
                                            style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => onSubmit(assignment)}
                                            disabled={isSubmitted}
                                            style={{
                                                backgroundColor: isSubmitted ? "var(--text-muted)" : "rgba(0,79,79,0.1)",
                                                color: isSubmitted ? "#fff" : "var(--primary-color)",
                                                border: "none",
                                                borderRadius: "var(--border-radius)",
                                                padding: "5px 8px",
                                                transition: "var(--transition)",
                                                cursor: isSubmitted ? "not-allowed" : "pointer",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSubmitted) e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)";
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSubmitted) e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)";
                                            }}
                                        >
                                            <Send size={14} />
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