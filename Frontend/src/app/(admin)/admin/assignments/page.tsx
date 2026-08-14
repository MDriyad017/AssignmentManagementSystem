"use client";
import { useState, useEffect } from "react";
import { Eye, Search } from "lucide-react";
import { assignmentService } from "@/services/assignment.service";
import { Assignment } from "@/types/teacherAssignment";
import AssignmentViewModal from "@/components/assignments/teacher/AssignmentViewModal";

export default function AdminAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await assignmentService.getAll();
                if (isMounted) setAssignments(data);
            } catch (error) {
                if (isMounted) console.error("Failed to load assignments:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, []);

    const handleView = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsViewModalOpen(true);
    };

    const filteredAssignments = assignments.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Published": return "var(--success-color)";
            case "Draft": return "var(--warning-color)";
            case "Closed": return "var(--danger-color)";
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
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>📋 All Assignments</h4>
            </div>

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
                    {filteredAssignments.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No assignments found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                                <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
                                    <tr>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>#</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Title</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Teacher</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Class</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Subject</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Due Date</th>
                                        <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-color)" }}>Status</th>
                                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "var(--text-color)" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssignments.map((assignment, index) => (
                                        <tr key={assignment.id}>
                                            <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                                            <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                                                {assignment.title}
                                            </td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.teacherName}</td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.className}</td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.subjectName}</td>
                                            <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                                                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
                                            </td>
                                            <td style={{ padding: "10px 16px" }}>
                                                <span className="badge" style={{ backgroundColor: getStatusBadgeColor(assignment.status || "Draft"), fontSize: "11px", padding: "5px 12px" }}>
                                                    {assignment.status || "Draft"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm"
                                                    onClick={() => handleView(assignment)}
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

            <AssignmentViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedAssignment(null); }}
                assignment={selectedAssignment}
            />
        </div>
    );
}