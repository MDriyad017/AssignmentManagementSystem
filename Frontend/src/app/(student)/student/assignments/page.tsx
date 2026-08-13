"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { studentAssignmentService } from "@/services/studentAssignment.service";
import { StudentAssignment } from "@/types/studentAssignment";
import StudentAssignmentTable from "@/components/assignments/student/StudentAssignmentTable";
import StudentAssignmentViewModal from "@/components/assignments/student/StudentAssignmentViewModal";
import StudentSubmissionDrawer from "@/components/assignments/student/StudentSubmissionDrawer";

export default function StudentAssignmentsPage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
    const [submittedAssignments, setSubmittedAssignments] = useState<Set<string>>(new Set());

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await studentAssignmentService.getByStudentId(user.id);
                if (isMounted) {
                    setAssignments(data);
                    const submitted = new Set<string>();
                    for (const assignment of data) {
                        const submission = await studentAssignmentService.getSubmissionByAssignment(assignment.id, user.id);
                        if (submission) {
                            submitted.add(assignment.id);
                        }
                    }
                    setSubmittedAssignments(submitted);
                }
            } catch (error) {
                if (isMounted) console.error("Failed to load assignments:", error);
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
                const data = await studentAssignmentService.getByStudentId(user.id);
                setAssignments(data);
                const submitted = new Set<string>();
                for (const assignment of data) {
                    const submission = await studentAssignmentService.getSubmissionByAssignment(assignment.id, user.id);
                    if (submission) {
                        submitted.add(assignment.id);
                    }
                }
                setSubmittedAssignments(submitted);
            } catch (error) {
                console.error("Failed to reload:", error);
            } finally {
                setLoading(false);
            }
        };
        reload();
    };

    const handleView = (assignment: StudentAssignment) => {
        setSelectedAssignment(assignment);
        setIsViewModalOpen(true);
    };

    const handleSubmit = (assignment: StudentAssignment) => {
        setSelectedAssignment(assignment);
        setIsSubmitDrawerOpen(true);
    };

    const filteredAssignments = assignments.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h4 className="fw-bold mb-4" style={{ color: "var(--dark-color)" }}>📋 My Assignments</h4>

            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color)" }}>
                        <Search size={18} style={{ color: "var(--text-muted)" }} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderColor: "var(--border-color)" }}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <StudentAssignmentTable
                        assignments={filteredAssignments}
                        loading={loading}
                        onView={handleView}
                        onSubmit={handleSubmit}
                        submittedAssignments={submittedAssignments}
                    />
                </div>
            </div>

            <StudentAssignmentViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedAssignment(null); }}
                assignment={selectedAssignment}
            />

            <StudentSubmissionDrawer
                isOpen={isSubmitDrawerOpen}
                onClose={() => { setIsSubmitDrawerOpen(false); setSelectedAssignment(null); }}
                onSuccess={handleSuccess}
                assignment={selectedAssignment}
            />
        </div>
    );
}