"use client";
import { useState, useEffect } from "react";
import { Eye, Search } from "lucide-react";
import { submissionService } from "@/services/submission.service";
import { Submission } from "@/types/submission";
import SubmissionViewModal from "@/components/submissions/SubmissionViewModal";

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await submissionService.getAll();
                if (isMounted) setSubmissions(data);
            } catch (error) {
                if (isMounted) console.error("Failed to load submissions:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, []);

    const handleView = (submission: Submission) => {
        setSelectedSubmission(submission);
        setIsViewModalOpen(true);
    };

    const filteredSubmissions = submissions.filter((s) =>
        s.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Graded": return "var(--success-color)";
            case "Submitted": return "var(--warning-color)";
            case "Late": return "var(--danger-color)";
            case "Rejected": return "var(--danger-color)";
            default: return "var(--text-muted)";
        }
    };

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
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>📤 All Submissions</h4>
            </div>

            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color)" }}>
                        <Search size={18} style={{ color: "var(--text-muted)" }} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by assignment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: "var(--border-color)" }}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    {filteredSubmissions.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No submissions found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                                    <tr>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>#</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Assignment</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Student</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Submitted At</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Marks</th>
                                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubmissions.map((submission, index) => (
                                        <tr key={submission.id}>
                                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                                {submission.assignmentTitle}
                                            </td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{submission.studentName}</td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: "10px 16px" }}>
                                                <span className="badge" style={{ backgroundColor: getStatusBadgeColor(submission.status), fontSize: "11px", padding: "5px 12px" }}>
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                                {submission.marksObtained !== undefined && submission.marksObtained !== null
                                                    ? submission.marksObtained
                                                    : "-"}
                                            </td>
                                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm"
                                                    onClick={() => handleView(submission)}
                                                    style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <SubmissionViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedSubmission(null); }}
                submission={selectedSubmission}
            />
        </div>
    );
}