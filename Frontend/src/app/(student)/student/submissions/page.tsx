"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { submissionService } from "@/services/submission.service";
import { Submission } from "@/types/submission";
import StudentSubmissionTable from "@/components/submissions/student/StudentSubmissionTable";
import SubmissionViewModal from "@/components/submissions/SubmissionViewModal";

export default function StudentSubmissionsPage() {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await submissionService.getByStudentId(user.id);
                if (isMounted) setSubmissions(data);
            } catch (error) {
                if (isMounted) console.error("Failed to load submissions:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [user?.id]);

    const handleView = (submission: Submission) => {
        setSelectedSubmission(submission);
        setIsViewModalOpen(true);
    };

    const filteredSubmissions = submissions.filter((s) =>
        s.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <h4 className="fw-bold mb-4" style={{ color: "var(--dark-color)" }}>📋 My Submissions</h4>

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
                    <StudentSubmissionTable
                        submissions={filteredSubmissions}
                        loading={loading}
                        onView={handleView}
                    />
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