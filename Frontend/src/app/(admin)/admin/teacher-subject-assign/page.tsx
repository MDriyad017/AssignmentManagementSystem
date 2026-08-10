"use client";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { teacherSubjectAssignService } from "@/services/teacherSubjectAssign.service";
import { TeacherGroup } from "@/types/teacherSubjectAssign";
import TeacherSubjectAssignTable from "@/components/teacherSubjects/TeacherSubjectAssignTable";
import AssignTeacherSubjectDrawer from "@/components/teacherSubjects/AssignTeacherSubjectDrawer";
import TeacherAssignModal from "@/components/teacherSubjects/TeacherAssignModal";
import Swal from "sweetalert2";

export default function TeacherSubjectAssignPage() {
    const [groups, setGroups] = useState<TeacherGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherGroup | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await teacherSubjectAssignService.getAllGrouped();
                if (isMounted) setGroups(data);
            } catch (error) {
                if (isMounted) console.error("Failed to load data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, []);

    const handleSuccess = () => {
        let isMounted = true;
        const reload = async () => {
            try {
                setLoading(true);
                const data = await teacherSubjectAssignService.getAllGrouped();
                if (isMounted) setGroups(data);
            } catch (error) {
                if (isMounted) console.error("Failed to reload data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        reload();
        return () => { isMounted = false; };
    };

    const filteredGroups = groups.filter((group) =>
        group.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (teacher: TeacherGroup) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        try {
            await teacherSubjectAssignService.deleteByTeacherId(teacherId);
            handleSuccess();
            Swal.fire({
                title: 'Deleted!',
                text: 'All assignments for this teacher have been deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to delete:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete assignments.',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
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
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>📚 Teacher Subject Assign</h4>
                <button type="button" className="btn d-flex align-items-center gap-2" onClick={() => setIsDrawerOpen(true)} style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", padding: "8px 20px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-color)")}>
                    <Plus size={18} /> Assign New
                </button>
            </div>

            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text" style={{ backgroundColor: "var(--light-color)", borderColor: "var(--border-color)" }}>
                        <Search size={18} style={{ color: "var(--text-muted)" }} />
                    </span>
                    <input type="text" className="form-control" placeholder="Search by Teacher Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderColor: "var(--border-color)" }} />
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <TeacherSubjectAssignTable
                        groups={filteredGroups}
                        loading={loading}
                        onView={handleView}
                        onDelete={handleDeleteTeacher}
                    />
                </div>
            </div>

            <AssignTeacherSubjectDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSuccess={handleSuccess} />
            <TeacherAssignModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedTeacher(null); }} onSuccess={handleSuccess} teacher={selectedTeacher} />
        </div>
    );
}