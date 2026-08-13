"use client";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { assignmentService } from "@/services/assignment.service";
import { useAuth } from "@/hooks/useAuth";
import { Assignment } from "@/types/teacherAssignment";
import AssignmentTable from "@/components/assignments/teacher/AssignmentTable";
import CreateAssignmentDrawer from "@/components/assignments/teacher/CreateAssignmentDrawer";
import EditAssignmentDrawer from "@/components/assignments/teacher/EditAssignmentDrawer";
import AssignmentViewModal from "@/components/assignments/teacher/AssignmentViewModal";

export default function TeacherAssignmentsPage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await assignmentService.getByTeacherId(user.id);
                if (isMounted) setAssignments(data);
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
                const data = await assignmentService.getByTeacherId(user.id);
                setAssignments(data);
            } catch (error) {
                console.error("Failed to reload assignments:", error);
            } finally {
                setLoading(false);
            }
        };
        reload();
    };

    const handleView = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsViewModalOpen(true);
    };

    const handleEdit = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsEditDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        await assignmentService.delete(id);
        handleSuccess();
    };

    const filteredAssignments = assignments.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>📋 My Assignments</h4>
                <button type="button" className="btn d-flex align-items-center gap-2" onClick={() => setIsCreateDrawerOpen(true)} style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", padding: "8px 20px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-color)")}>
                    <Plus size={18} /> Create Assignment
                </button>
            </div>

            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color)" }}>
                        <Search size={18} style={{ color: "var(--text-muted)" }} />
                    </span>
                    <input type="text" className="form-control" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderColor: "var(--border-color)" }} />
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <AssignmentTable
                        assignments={filteredAssignments}
                        loading={loading}
                        onView={handleView}       
                        onEdit={handleEdit}     
                        onDelete={handleDelete} 
                    />
                </div>
            </div>

            <CreateAssignmentDrawer isOpen={isCreateDrawerOpen} onClose={() => setIsCreateDrawerOpen(false)} onSuccess={handleSuccess} />
            
            <EditAssignmentDrawer isOpen={isEditDrawerOpen} onClose={() => { setIsEditDrawerOpen(false); setSelectedAssignment(null); }} onSuccess={handleSuccess} assignment={selectedAssignment} />
            
            <AssignmentViewModal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedAssignment(null); }}
                assignment={selectedAssignment}
            />
        </div>
    );
}