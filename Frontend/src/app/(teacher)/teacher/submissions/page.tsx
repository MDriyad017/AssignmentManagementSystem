"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { submissionService } from "@/services/submission.service";
import { SubmissionGroup, Submission } from "@/types/submission";
import TeacherSubmissionTable from "@/components/submissions/teacher/TeacherSubmissionTable";
import GradeSubmissionDrawer from "@/components/submissions/teacher/GradeSubmissionDrawer";
import SubmissionViewModal from "@/components/submissions/SubmissionViewModal";

export default function TeacherSubmissionsPage() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<SubmissionGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isGradeDrawerOpen, setIsGradeDrawerOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<SubmissionGroup | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await submissionService.getByTeacherId(user.id);
                if (isMounted) setGroups(data);
            } catch (error) {
                if (isMounted) console.error("Failed to load submissions:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [user?.id]);

    const handleSuccess = () => {
        const reload = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await submissionService.getByTeacherId(user.id);
                setGroups(data);
            } catch (error) {
                console.error("Failed to reload:", error);
            } finally {
                setLoading(false);
            }
        };
        reload();
    };

    const handleGrade = (group: SubmissionGroup, submission: Submission) => {
        setSelectedGroup(group);
        setSelectedSubmission(submission);
        setIsGradeDrawerOpen(true);
    };

    const handleView = (submission: Submission) => {
        setSelectedSubmission(submission);
        setIsViewModalOpen(true);
    };

    const filteredGroups = groups.filter((group) =>
        group.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>📋 Submissions</h4>
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
                    <TeacherSubmissionTable
                        groups={filteredGroups}
                        loading={loading}
                        onGrade={handleGrade}
                        onView={handleView}
                    />
                </div>
            </div>

            <GradeSubmissionDrawer
                isOpen={isGradeDrawerOpen}
                onClose={() => { setIsGradeDrawerOpen(false); setSelectedSubmission(null); setSelectedGroup(null); }}
                onSuccess={handleSuccess}
                submission={selectedSubmission}
                assignment={selectedGroup}
            />

            <SubmissionViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedSubmission(null); }}
                submission={selectedSubmission}
            />
        </div>
    );
}