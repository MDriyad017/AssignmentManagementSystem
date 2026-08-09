"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { subjectService } from "@/services/subject.service";
import { Subject } from "@/types/subject";
import SubjectTable from "@/components/subjects/SubjectTable";
import CreateSubjectDrawer from "@/components/subjects/CreateSubjectDrawer";
import EditSubjectDrawer from "@/components/subjects/EditSubjectDrawer";
import DeleteSubjectDrawer from "@/components/subjects/DeleteSubjectDrawer";

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                setLoading(true);
                const data = await subjectService.getAll();
                setSubjects(data);
            } catch (error) {
                console.error("Failed to load subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    const handleOpenCreate = () => setIsCreateDrawerOpen(true);
    const handleCloseCreate = () => setIsCreateDrawerOpen(false);

    const handleOpenEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsEditDrawerOpen(true);
    };
    const handleCloseEdit = () => {
        setIsEditDrawerOpen(false);
        setSelectedSubject(null);
    };

    const handleOpenDelete = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsDeleteDrawerOpen(true);
    };
    const handleCloseDelete = () => {
        setIsDeleteDrawerOpen(false);
        setSelectedSubject(null);
    };

    const handleSuccess = () => {
        const reload = async () => {
            try {
                setLoading(true);
                const data = await subjectService.getAll();
                setSubjects(data);
            } catch (error) {
                console.error("Failed to reload subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        reload();
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>Subjects</h4>
                <button type="button" className="btn d-flex align-items-center gap-2" onClick={handleOpenCreate} style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", padding: "8px 20px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                    <Plus size={18} />
                    Add Subject
                </button>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <SubjectTable subjects={subjects} loading={loading} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
                </div>
            </div>

            <CreateSubjectDrawer isOpen={isCreateDrawerOpen} onClose={handleCloseCreate} onSuccess={handleSuccess} />
            <EditSubjectDrawer isOpen={isEditDrawerOpen} onClose={handleCloseEdit} onSuccess={handleSuccess} subjectId={selectedSubject?.id || null} />
            <DeleteSubjectDrawer isOpen={isDeleteDrawerOpen} onClose={handleCloseDelete} onSuccess={handleSuccess} subjectId={selectedSubject?.id || null} subjectName={selectedSubject?.name || ""} />
        </div>
    );
}