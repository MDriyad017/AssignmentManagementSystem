"use client";
import { SubmissionGroup, Submission } from "@/types/submission";
import { ChevronDown, ChevronRight, Eye, CheckCircle } from "lucide-react";
import React, { useState } from "react";

interface TeacherSubmissionTableProps {
    groups: SubmissionGroup[];
    loading: boolean;
    onGrade: (group: SubmissionGroup, submission: Submission) => void;
    onView: (submission: Submission) => void;
}

export default function TeacherSubmissionTable({ groups, loading, onGrade, onView }: TeacherSubmissionTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
                <p className="text-muted">No submissions found.</p>
            </div>
        );
    }

    const toggleRow = (assignmentId: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(assignmentId)) {
            newSet.delete(assignmentId);
        } else {
            newSet.add(assignmentId);
        }
        setExpandedRows(newSet);
    };

    const isExpanded = (assignmentId: string) => expandedRows.has(assignmentId);

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
                        <th style={{ width: "30px", padding: "12px 8px" }}></th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Assignment</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Total Mark</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Class</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Subject</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Due Date</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Submitted</th>
                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => {
                        const expanded = isExpanded(group.assignmentId);
                        const submissions = group.submissions || [];
                        const submittedCount = submissions.filter(s => s.status !== "Graded" && s.status !== "Rejected").length;
                        const totalCount = submissions.length;

                        return (
                            <React.Fragment key={group.assignmentId}>
                                <tr style={{ backgroundColor: expanded ? "var(--light-color)" : "transparent" }}>
                                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                                        <button type="button" className="btn btn-sm" onClick={() => toggleRow(group.assignmentId)} style={{ background: "none", border: "none", padding: "4px" }}>
                                            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                    </td>
                                    <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                        {group.assignmentTitle}
                                        {submissions.some(s => s.status === "Late") && (
                                            <span className="badge ms-2" style={{ backgroundColor: "var(--danger-color)", fontSize: "9px" }}>Late</span>
                                        )}
                                    </td>
                                    {/* ✅ Total Mark Display */}
                                    <td style={{ padding: "10px 16px", fontWeight: "600", color: "var(--text-color)" }}>
                                        {group.totalMarks ?? "-"}
                                    </td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{group.className}</td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{group.subjectName}</td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                        {group.dueDate ? new Date(group.dueDate).toLocaleDateString() : "-"}
                                    </td>
                                    <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                        {submittedCount} / {totalCount}
                                    </td>
                                    <td style={{ padding: "10px 16px" }}>
                                        <span className="badge" style={{ backgroundColor: submittedCount === totalCount && totalCount > 0 ? "var(--success-color)" : "var(--warning-color)", fontSize: "11px", padding: "5px 12px" }}>
                                            {totalCount === 0 ? "No Submissions" : submittedCount === totalCount ? "All Submitted" : `${submittedCount} Pending`}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                        <button type="button" className="btn btn-sm" onClick={() => toggleRow(group.assignmentId)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>

                                {expanded && (
                                    <tr>
                                        <td colSpan={9} style={{ paddingLeft: 50 }}>
                                            <div className="table-responsive" style={{ backgroundColor: "#f8f9fa" }}>
                                                <table className="table table-sm table-bordered mb-0" style={{ fontSize: "13px" }}>
                                                    <thead style={{ backgroundColor: "#e9ecef" }}>
                                                        <tr>
                                                            <th style={{ padding: "8px 12px", fontWeight: "600", color: "var(--text-color)" }}>#</th>
                                                            <th style={{ padding: "8px 12px", fontWeight: "600", color: "var(--text-color)" }}>Student Name</th>
                                                            <th style={{ padding: "8px 12px", fontWeight: "600", color: "var(--text-color)" }}>Submitted At</th>
                                                            <th style={{ padding: "8px 12px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                                                            <th style={{ padding: "8px 12px", fontWeight: "600", color: "var(--text-color)" }}>Marks Obtained</th>
                                                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {submissions.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={6} className="text-center text-muted py-3">No submissions yet.</td>
                                                            </tr>
                                                        ) : (
                                                            submissions.map((submission, idx) => (
                                                                <tr key={submission.id}>
                                                                    <td style={{ padding: "6px 12px", color: "var(--text-muted)" }}>{idx + 1}</td>
                                                                    <td style={{ padding: "6px 12px", fontWeight: "500", color: "var(--text-color)" }}>{submission.studentName}</td>
                                                                    <td style={{ padding: "6px 12px", color: "var(--text-color)" }}>
                                                                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "-"}
                                                                    </td>
                                                                    <td style={{ padding: "6px 12px" }}>
                                                                        <span className="badge" style={{ backgroundColor: getStatusBadgeColor(submission.status), fontSize: "10px", padding: "4px 10px" }}>
                                                                            {submission.status}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ padding: "6px 12px", fontWeight: "500", color: "var(--text-color)" }}>
                                                                        {submission.marksObtained !== undefined && submission.marksObtained !== null
                                                                            ? `${submission.marksObtained}`
                                                                            : "-"}
                                                                    </td>
                                                                    <td style={{ padding: "6px 12px", textAlign: "center" }}>
                                                                        <div className="d-flex justify-content-center gap-2">
                                                                            <button type="button" className="btn btn-sm" onClick={() => onView(submission)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "4px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                                                                <Eye size={14} />
                                                                            </button>
                                                                            {(submission.status === "Submitted" || submission.status === "Late") && (
                                                                                <button type="button" className="btn btn-sm" onClick={() => onGrade(group, submission)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "4px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                                                                                    <CheckCircle size={14} /> Grade
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}