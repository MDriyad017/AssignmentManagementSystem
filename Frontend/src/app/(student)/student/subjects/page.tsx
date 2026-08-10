"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { studentClassAssignService } from "@/services/studentClassAssign.service";
import { StudentClassDetail } from "@/types/studentClassAssign";

export default function StudentSubjectsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [detail, setDetail] = useState<StudentClassDetail | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await studentClassAssignService.getStudentClassDetail(user.id);
                if (isMounted) {
                    setDetail(data);
                }
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
    }, [user?.id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger py-2" role="alert">
                {error}
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">You are not assigned to any class yet.</p>
                <small className="text-muted d-block mt-2">
                    Please contact admin to assign you to a class.
                </small>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h4 className="fw-bold mb-4" style={{ color: "var(--dark-color)" }}>
                📚 My Subjects
            </h4>

            <div className="mb-3">
                <span className="badge" style={{ backgroundColor: "var(--primary-color)", fontSize: "14px", padding: "6px 14px" }}>
                    You Are In&nbsp;&nbsp;:&nbsp;&nbsp;{detail.className}
                </span>
            </div>

            <div className="row">
                {detail.teachers.map((teacher) => (
                    <div key={teacher.teacherId} className="col-md-6 col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "var(--border-radius)" }}>
                            <div className="card-header" style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius) var(--border-radius) 0 0" }}>
                                <h5 className="fw-bold mb-0">👨🏻‍🎓 {teacher.teacherName}</h5>
                            </div>
                            <div className="card-body">
                                <h6 className="fw-semibold text-muted mb-3">Subjects:</h6>
                                <ul className="list-unstyled">
                                    {teacher.subjects.map((sub) => (
                                        <li key={sub.subjectId} className="py-1">
                                            <span className="badge" style={{ backgroundColor: "var(--light-color)", color: "var(--text-color)", padding: "6px 12px", fontSize: "13px" }}>
                                                📒&nbsp;{sub.subjectName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <small className="text-muted">Total Subjects: {teacher.subjects.length}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-muted small">
                Total Teachers: {detail.teachers.length} | 
                Total Subjects: {detail.teachers.reduce((acc, t) => acc + t.subjects.length, 0)}
            </div>
        </div>
    );
}