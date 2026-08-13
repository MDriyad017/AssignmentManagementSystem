"use client";
import { X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { studentClassAssignService } from "@/services/studentClassAssign.service";
import { classService } from "@/services/class.service";
import { userService } from "@/services/user.service";
import { Class } from "@/types/class";
import { User } from "@/types/user";
import { StudentGroup } from "@/types/studentClassAssign";

interface AssignStudentClassDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editStudent?: StudentGroup | null; 
}

export default function AssignStudentClassDrawer({ isOpen, onClose, onSuccess, editStudent }: AssignStudentClassDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [students, setStudents] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!isOpen) return;
            try {
                const [studentsData, classesData] = await Promise.all([
                    userService.getAll(),
                    classService.getAll(),
                ]);
                if (isMounted) {
                    setStudents(studentsData.filter((u) => u.role === "Student"));
                    setClasses(classesData);
                }
            } catch (err) {
                if (isMounted) console.error("Failed to load data:", err);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [isOpen]);

    useEffect(() => {
        if (editStudent && isOpen) {
            setSelectedStudentId(editStudent.studentId);
            setSelectedClassId(editStudent.class?.classId || "");
            setEditId(editStudent.class?.id || null);
        } else {
            setSelectedStudentId("");
            setSelectedClassId("");
            setEditId(null);
        }
    }, [editStudent, isOpen]);

    const handleSubmit = async () => {
        if (!selectedStudentId) {
            setError("Please select a student.");
            return;
        }
        if (!selectedClassId) {
            setError("Please select a class.");
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);

            if (editId) {
                await studentClassAssignService.update({
                    id: editId,
                    studentId: selectedStudentId,
                    classId: selectedClassId,
                });
            } else {
                await studentClassAssignService.assign({
                    studentId: selectedStudentId,
                    classId: selectedClassId,
                });
            }

            setSelectedStudentId("");
            setSelectedClassId("");
            setEditId(null);
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage =
                error && typeof error === 'object' && 'response' in error && error.response &&
                typeof error.response === 'object' && 'data' in error.response && error.response.data &&
                typeof error.response.data === 'object' && 'message' in error.response.data
                    ? String(error.response.data.message)
                    : error instanceof Error ? error.message : "Failed to assign class.";
            setError(errorMessage);
            console.error("Assign Class Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }} onClick={onClose} />
            <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "500px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">{editId ? "Edit Class Assignment" : "Assign Class to Student"}</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Select Student</label>
                        <select className="form-select" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                            <option value="">-- Select Student --</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>{student.firstName} {student.lastName} ({student.email})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Select Class</label>
                        <select className="form-select" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                            <option value="">-- Select Class --</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2">
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)" }}>Cancel</button>
                    <button type="button" className="btn d-flex align-items-center gap-2" onClick={handleSubmit} disabled={isSubmitting || !selectedStudentId || !selectedClassId} style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>
                        <Save size={16} />
                        {isSubmitting ? (editId ? "Updating..." : "Assigning...") : (editId ? "Update Class" : "Assign Class")}
                    </button>
                </div>
            </div>
        </>
    );
}