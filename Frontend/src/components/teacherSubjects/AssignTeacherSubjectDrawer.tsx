"use client";
import { X, Plus, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { teacherSubjectAssignService } from "@/services/teacherSubjectAssign.service";
import { classService } from "@/services/class.service";
import { subjectService } from "@/services/subject.service";
import { userService } from "@/services/user.service";
import { Class } from "@/types/class";
import { Subject } from "@/types/subject";
import { User } from "@/types/user";

interface AssignRow {
    id: string;
    classId: string;
    subjectId: string;
    className?: string;
    subjectName?: string;
    availableSubjects: Subject[];
}

interface AssignTeacherSubjectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignTeacherSubjectDrawer({ isOpen, onClose, onSuccess }: AssignTeacherSubjectDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
    const [assigns, setAssigns] = useState<AssignRow[]>([]);
    const [existingAssigns, setExistingAssigns] = useState<{ subjectId: string; classId: string }[]>([]);
    const [allAssigns, setAllAssigns] = useState<{ subjectId: string; classId: string }[]>([]);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!isOpen) return;
            try {
                const [teachersData, classesData, subjectsData] = await Promise.all([
                    userService.getAll(),
                    classService.getAll(),
                    subjectService.getAll(),
                ]);
                if (isMounted) {
                    setTeachers(teachersData.filter((u) => u.role === "Teacher"));
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

    useEffect(() => {
        let isMounted = true;
        const loadAllAssigns = async () => {
            try {
                const data = await teacherSubjectAssignService.getAllGrouped();
                if (isMounted && data) {
                    const all = data.flatMap((group) =>
                        group.assigns.map((a) => ({
                            subjectId: a.subjectId,
                            classId: a.classId,
                        }))
                    );
                    setAllAssigns(all);
                }
            } catch (err) {
                if (isMounted) console.error("Failed to load all assigns:", err);
            }
        };
        if (isOpen) {
            loadAllAssigns();
        }
        return () => { isMounted = false; };
    }, [isOpen]);

    useEffect(() => {
        let isMounted = true;
        const loadExistingAssigns = async () => {
            if (!selectedTeacherId) {
                setExistingAssigns([]);
                return;
            }
            try {
                const data = await teacherSubjectAssignService.getByTeacherId(selectedTeacherId);
                if (isMounted && data) {
                    const existing = data.assigns.map((a) => ({
                        subjectId: a.subjectId,
                        classId: a.classId,
                    }));
                    setExistingAssigns(existing);
                }
            } catch (err) {
                if (isMounted) console.error("Failed to load existing assigns:", err);
            }
        };
        loadExistingAssigns();
        return () => { isMounted = false; };
    }, [selectedTeacherId]);

    const addRow = () => {
        setAssigns([...assigns, {
            id: `temp-${Date.now()}`,
            classId: "",
            subjectId: "",
            availableSubjects: []
        }]);
    };

    const removeRow = (id: string) => {
        setAssigns(assigns.filter((row) => row.id !== id));
    };

    const isSubjectAlreadyAssignedToAnyTeacher = (classId: string, subjectId: string, currentRowId: string) => {
        const assignedToOther = allAssigns.some(
            (a) => a.subjectId === subjectId && a.classId === classId
        );
        if (assignedToOther) return true;

        const inBatch = assigns.some(
            (row) => row.id !== currentRowId && row.classId === classId && row.subjectId === subjectId
        );
        return inBatch;
    };

    const updateRow = (id: string, field: "classId" | "subjectId", value: string) => {
        setAssigns(assigns.map((row) => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field === "classId") {
                    const cls = classes.find((c) => c.id === value);
                    updatedRow.className = cls?.name;
                    updatedRow.availableSubjects = allSubjects.filter((s) => s.classId === value);
                    updatedRow.subjectId = "";
                    updatedRow.subjectName = "";
                }
                if (field === "subjectId") {
                    const sub = allSubjects.find((s) => s.id === value);
                    updatedRow.subjectName = sub?.name;
                }
                return updatedRow;
            }
            return row;
        }));
    };

    const handleSubmit = async () => {
        if (!selectedTeacherId) {
            setError("Please select a teacher.");
            return;
        }
        const validAssigns = assigns.filter((row) => row.classId && row.subjectId);
        if (validAssigns.length === 0) {
            setError("Please add at least one assign.");
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            const payload = {
                teacherId: selectedTeacherId,
                teacherSubjectAssigns: validAssigns.map((row) => ({
                    classId: row.classId,
                    subjectId: row.subjectId
                })),
            };
            console.log("📤 Sending Payload:", payload);
            const response = await teacherSubjectAssignService.createBulk(payload);
            console.log("✅ Response:", response);
            setAssigns([]);
            setSelectedTeacherId("");
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage =
                error && typeof error === 'object' && 'response' in error && error.response &&
                typeof error.response === 'object' && 'data' in error.response && error.response.data &&
                typeof error.response.data === 'object' && 'message' in error.response.data
                    ? String(error.response.data.message)
                    : error instanceof Error ? error.message : "Failed to assign subjects.";
            setError(errorMessage);
            console.error("❌ Assign Subjects Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1040 }} onClick={onClose} />
            <div className="position-fixed top-0 end-0 h-100 bg-white shadow-lg" style={{ width: "600px", maxWidth: "90vw", zIndex: 1050, transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "var(--transition)", display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Assign Subjects to Teacher</h5>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Select Teacher</label>
                        <select className="form-select" value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
                            <option value="">-- Select Teacher --</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName} ({teacher.email})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label fw-semibold mb-0">Assigns</label>
                            <button type="button" className="btn btn-sm btn-primary" onClick={addRow}>
                                <Plus size={16} /> Add Row
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead style={{ backgroundColor: "var(--light-color)" }}>
                                    <tr>
                                        <th style={{ width: "30%" }}>Class</th>
                                        <th style={{ width: "40%" }}>Subject</th>
                                        <th style={{ width: "10%", textAlign: "center" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assigns.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted py-3">No assigns added. Click &quot;Add Row&quot; to start.</td>
                                        </tr>
                                    ) : (
                                        assigns.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <select className="form-select form-select-sm" value={row.classId} onChange={(e) => updateRow(row.id, "classId", e.target.value)}>
                                                        <option value="">Select Class</option>
                                                        {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>)}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select className="form-select form-select-sm" value={row.subjectId} onChange={(e) => updateRow(row.id, "subjectId", e.target.value)}>
                                                        <option value="">Select Subject</option>
                                                        {row.availableSubjects.map((sub) => {
                                                            const isAssigned = isSubjectAlreadyAssignedToAnyTeacher(row.classId, sub.id, row.id);
                                                            return (
                                                                <option key={sub.id} value={sub.id} disabled={isAssigned}>
                                                                    {sub.name} {sub.code ? `(${sub.code})` : ""}
                                                                    {isAssigned ? " (Already Assigned)" : ""}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </td>
                                                <td className="text-center">
                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRow(row.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-top d-flex justify-content-end gap-2">
                    <button type="button" className="btn" onClick={onClose} style={{ border: "1px solid var(--border-color)" }}>Cancel</button>
                    <button type="button" className="btn d-flex align-items-center gap-2" onClick={handleSubmit} disabled={isSubmitting || assigns.length === 0 || !selectedTeacherId} style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>
                        <Save size={16} />
                        {isSubmitting ? "Saving..." : "Save All Assigns"}
                    </button>
                </div>
            </div>
        </>
    );
}