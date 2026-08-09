"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { classService } from "@/services/class.service";
import { Class } from "@/types/class";
import ClassTable from "@/components/classes/ClassTable";
import CreateClassDrawer from "@/components/classes/CreateClassDrawer";
import EditClassDrawer from "@/components/classes/EditClassDrawer";
import DeleteClassDrawer from "@/components/classes/DeleteClassDrawer";

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    useEffect(() => {
        const loadClasses = async () => {
            try {
                setLoading(true);
                const data = await classService.getAll();
                setClasses(data);
            } catch (error) {
                console.error("Failed to load classes:", error);
            } finally {
                setLoading(false);
            }
        };
        loadClasses();
    }, []);

    const handleOpenCreate = () => setIsCreateDrawerOpen(true);
    const handleCloseCreate = () => setIsCreateDrawerOpen(false);

    const handleOpenEdit = (cls: Class) => {
        setSelectedClass(cls);
        setIsEditDrawerOpen(true);
    };
    const handleCloseEdit = () => {
        setIsEditDrawerOpen(false);
        setSelectedClass(null);
    };

    const handleOpenDelete = (cls: Class) => {
        setSelectedClass(cls);
        setIsDeleteDrawerOpen(true);
    };
    const handleCloseDelete = () => {
        setIsDeleteDrawerOpen(false);
        setSelectedClass(null);
    };

    const handleSuccess = () => {
        const reload = async () => {
            try {
                setLoading(true);
                const data = await classService.getAll();
                setClasses(data);
            } catch (error) {
                console.error("Failed to reload classes:", error);
            } finally {
                setLoading(false);
            }
        };
        reload();
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>Classes</h4>
                <button type="button" className="btn d-flex align-items-center gap-2" onClick={handleOpenCreate} style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", padding: "8px 20px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                    <Plus size={18} />
                    Add Class
                </button>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <ClassTable classes={classes} loading={loading} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
                </div>
            </div>

            <CreateClassDrawer isOpen={isCreateDrawerOpen} onClose={handleCloseCreate} onSuccess={handleSuccess} />
            <EditClassDrawer isOpen={isEditDrawerOpen} onClose={handleCloseEdit} onSuccess={handleSuccess} classId={selectedClass?.id || null} />
            <DeleteClassDrawer isOpen={isDeleteDrawerOpen} onClose={handleCloseDelete} onSuccess={handleSuccess} classId={selectedClass?.id || null} className={selectedClass?.name || ""} />
        </div>
    );
}