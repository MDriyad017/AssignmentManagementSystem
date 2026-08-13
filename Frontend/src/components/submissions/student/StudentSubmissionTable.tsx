"use client";
import { Submission } from "@/types/submission";
import { Eye, FileText } from "lucide-react";

interface StudentSubmissionTableProps {
    submissions: Submission[];
    loading: boolean;
    onView: (submission: Submission) => void;
}

export default function StudentSubmissionTable({ submissions, loading, onView }: StudentSubmissionTableProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No submissions found.</p>
            </div>
        );
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Graded": return "var(--success-color)";
            case "Submitted": return "var(--warning-color)";
            case "Late": return "var(--danger-color)";
            case "Rejected": return "var(--danger-color)";
            default: return "var(--text-muted)";
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                    <tr>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>#</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Assignment</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Submitted At</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Marks</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={submission.id}>
                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                {submission.assignmentTitle}
                                {submission.submissionFileUrl && (
                                    <span className="ms-1"><FileText size={14} style={{ color: "var(--primary-color)" }} /></span>
                                )}
                            </td>
                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                {new Date(submission.submittedAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                                <span className="badge" style={{ backgroundColor: getStatusBadgeColor(submission.status), fontSize: "11px", padding: "5px 12px" }}>
                                    {submission.status}
                                </span>
                            </td>
                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                {submission.marksObtained !== undefined && submission.marksObtained !== null ? submission.marksObtained : "-"}
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                <button type="button" className="btn btn-sm" onClick={() => onView(submission)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                    <Eye size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}