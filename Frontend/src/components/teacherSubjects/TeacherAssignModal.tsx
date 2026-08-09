"use client";
import { X, Pencil, Trash2, Save, X as XIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { teacherSubjectAssignService } from "@/services/teacherSubjectAssign.service";
import { classService } from "@/services/class.service";
import { subjectService } from "@/services/subject.service";
import { TeacherGroup, TeacherSubjectAssignUpdateData } from "@/types/teacherSubjectAssign";
import { Class } from "@/types/class";
import { Subject } from "@/types/subject";
import Swal from "sweetalert2";

interface TeacherAssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    teacher: TeacherGroup | null;
}

export default function TeacherAssignModal({ isOpen, onClose, onSuccess, teacher }: TeacherAssignModalProps) {
    const [editId, setEditId] = useState<string | null>(null);
    const [tempClassId, setTempClassId] = useState("");
    const [tempSubjectId, setTempSubjectId] = useState("");
    const [classes, setClasses] = useState<Class[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!isOpen) return;
            try {
                const [classesData, subjectsData] = await Promise.all([
                    classService.getAll(),
                    subjectService.getAll(),
                ]);
                if (isMounted) {
                    setClasses(classesData);
                    setAllSubjects(subjectsData);
                }
            } catch (err) {
                if (isMounted) console.error("Failed to load data:", err);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [isOpen]);

    const availableSubjects = useMemo(() => {
        if (tempClassId && allSubjects.length > 0) {
            return allSubjects.filter((s) => s.classId === tempClassId);
        }
        return [];
    }, [tempClassId, allSubjects]);

    const isSubjectAlreadyAssigned = (subjectId: string) => {
        if (!teacher) return false;
        return teacher.assigns.some(
            (a) => a.subjectId === subjectId && a.id !== editId
        );
    };

    const handleClassChange = (classId: string) => {
        setTempClassId(classId);
        if (tempSubjectId) {
            const subjectExists = allSubjects.some(
                (s) => s.id === tempSubjectId && s.classId === classId
            );
            if (!subjectExists) {
                setTempSubjectId("");
            }
        }
    };

    const handleEdit = (assignId: string) => {
        const assign = teacher?.assigns.find((a) => a.id === assignId);
        if (assign) {
            setEditId(assignId);
            setTempClassId(assign.classId);
            setTempSubjectId(assign.subjectId);
        }
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setTempClassId("");
        setTempSubjectId("");
    };

    const handleSaveEdit = async () => {
        if (!editId || !teacher) return;
        if (isSubjectAlreadyAssigned(tempSubjectId)) {
            setError("This subject is already assigned to the teacher.");
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            const data: TeacherSubjectAssignUpdateData = {
                id: editId,
                teacherId: teacher.teacherId,
                classId: tempClassId,
                subjectId: tempSubjectId,
            };
            await teacherSubjectAssignService.update(data);
            setEditId(null);
            setTempClassId("");
            setTempSubjectId("");
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update assignment";
            setError(errorMessage);
            console.error("Update Error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, subjectName: string) => {
        onClose();

        setTimeout(() => {
            Swal.fire({
                title: 'Are you sure?',
                html: `You are about to delete <strong>${subjectName}</strong> from this teacher.`,
                text: "This action cannot be undone!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, delete!',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                allowOutsideClick: false,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await teacherSubjectAssignService.delete(id);
                        onSuccess();
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Assignment has been deleted.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    } catch (err) {
                        console.error("Delete Error:", err);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete assignment.',
                            icon: 'error',
                            confirmButtonColor: '#d33',
                        });
                    }
                } else {
                    onSuccess(); 
                }
            });
        }, 100);
    };

    if (!isOpen || !teacher) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }} onClick={onClose} />
            <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg" style={{ width: "700px", maxWidth: "95vw", maxHeight: "90vh", zIndex: 1070, display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-0">👨‍🏫 {teacher.teacherName}</h5>
                        <small className="text-muted">{teacher.teacherEmail}</small>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                            <thead style={{ backgroundColor: "var(--light-color)" }}>
                                <tr>
                                    <th>#</th>
                                    <th>Class</th>
                                    <th>Subject</th>
                                    <th>Assigned At</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacher.assigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-3">No assignments found.</td>
                                    </tr>
                                ) : (
                                    teacher.assigns.map((assign, index) => (
                                        <tr key={assign.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {editId === assign.id ? (
                                                    <select className="form-select form-select-sm" value={tempClassId} onChange={(e) => handleClassChange(e.target.value)}>
                                                        {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>)}
                                                    </select>
                                                ) : (
                                                    assign.className
                                                )}
                                            </td>
                                            <td>
                                                {editId === assign.id ? (
                                                    <select className="form-select form-select-sm" value={tempSubjectId} onChange={(e) => setTempSubjectId(e.target.value)}>
                                                        <option value="">Select Subject</option>
                                                        {availableSubjects.map((sub) => {
                                                            const isAssigned = isSubjectAlreadyAssigned(sub.id);
                                                            return (
                                                                <option key={sub.id} value={sub.id} disabled={isAssigned}>
                                                                    {sub.name} {sub.code ? `(${sub.code})` : ""}
                                                                    {isAssigned ? " (Already Assigned)" : ""}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                ) : (
                                                    assign.subjectName
                                                )}
                                            </td>
                                            <td>{new Date(assign.assignedAt).toLocaleDateString()}</td>
                                            <td style={{ textAlign: "center" }}>
                                                {editId === assign.id ? (
                                                    <div className="d-flex justify-content-center gap-1">
                                                        <button type="button" className="btn btn-sm btn-success" onClick={handleSaveEdit} disabled={isSubmitting}><Save size={14} /></button>
                                                        <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancelEdit}><XIcon size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center gap-1">
                                                        <button type="button" className="btn btn-sm" onClick={() => handleEdit(assign.id)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px" }}><Pencil size={14} /></button>
                                                        <button type="button" className="btn btn-sm" onClick={() => handleDelete(assign.id, assign.subjectName)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px" }}><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 text-muted small">Total Assignments: {teacher.assigns.length}</div>
                </div>
                <div className="p-3 border-top d-flex justify-content-end">
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
}