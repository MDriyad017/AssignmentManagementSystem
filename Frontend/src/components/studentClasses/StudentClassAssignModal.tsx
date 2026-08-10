"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { studentClassAssignService } from "@/services/studentClassAssign.service";
import { StudentClassDetail } from "@/types/studentClassAssign";
import React from "react";

interface StudentClassAssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string | null;
    studentName: string;
}

export default function StudentClassAssignModal({ isOpen, onClose, studentId, studentName }: StudentClassAssignModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detail, setDetail] = useState<StudentClassDetail | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!isOpen || !studentId) return;
            try {
                setLoading(true);
                setError(null);
                const data = await studentClassAssignService.getStudentClassDetail(studentId);
                if (isMounted) setDetail(data);
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load data";
                    setError(errorMessage);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [isOpen, studentId]);

    if (!isOpen) return null;

    return (
        <>
            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }} onClick={onClose} />
            <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg" style={{ width: "700px", maxWidth: "95vw", maxHeight: "90vh", zIndex: 1070, display: "flex", flexDirection: "column" }}>
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-0">👨‍🎓 {studentName}</h5>
                        {detail && <small className="text-muted">{detail.studentEmail}</small>}
                    </div>
                    <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow-1 overflow-auto p-4">
                    {loading && (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    {detail && (
                        <>
                            <div className="mb-3">
                                <h6 className="fw-semibold">Class: {detail.className}</h6>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                                    <thead style={{ backgroundColor: "var(--light-color)" }}>
                                        <tr>
                                            <th style={{ width: "10%" }}>#</th>
                                            <th style={{ width: "30%" }}>Teacher</th>
                                            <th style={{ width: "60%" }}>Subjects</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detail.teachers.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-3">No teachers assigned for this class.</td>
                                            </tr>
                                        ) : (
                                            detail.teachers.map((teacher, index) => (
                                                <tr key={teacher.teacherId}>
                                                    <td>{index + 1}</td>
                                                    <td>{teacher.teacherName}</td>
                                                    <td>
                                                        {teacher.subjects.map((sub, idx) => (
                                                            <React.Fragment key={sub.subjectId}>
                                                                {sub.subjectName}
                                                                {idx < teacher.subjects.length - 1 && <br />}
                                                            </React.Fragment>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 text-muted small">
                                Total Teachers: {detail.teachers.length} | 
                                Total Subjects: {detail.teachers.reduce((acc, t) => acc + t.subjects.length, 0)}
                            </div>
                        </>
                    )}
                </div>
                <div className="p-3 border-top d-flex justify-content-end">
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
}