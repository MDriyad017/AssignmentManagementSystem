"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { teacherSubjectAssignService } from "@/services/teacherSubjectAssign.service";

interface TeacherClassDetail {
    classId: string;
    className: string;
    subjects: {
        subjectId: string;
        subjectName: string;
    }[];
}

export default function TeacherClassesAndSubjectsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [classDetails, setClassDetails] = useState<TeacherClassDetail[]>([]);

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
                
                const data = await teacherSubjectAssignService.getByTeacherId(user.id);

                if (isMounted && data) {
                    
                    if (!data.assigns || data.assigns.length === 0) {
                        setClassDetails([]);
                        setLoading(false);
                        return;
                    }

                    const grouped = data.assigns.reduce((acc: TeacherClassDetail[], assign) => {
                        const existing = acc.find((c) => c.classId === assign.classId);
                        if (existing) {
                            existing.subjects.push({
                                subjectId: assign.subjectId,
                                subjectName: assign.subjectName,
                            });
                        } else {
                            acc.push({
                                classId: assign.classId,
                                className: assign.className,
                                subjects: [{
                                    subjectId: assign.subjectId,
                                    subjectName: assign.subjectName,
                                }],
                            });
                        }
                        return acc;
                    }, []);
                    
                    setClassDetails(grouped);
                }
            } catch (err) {
                console.error("Error:", err);
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

    if (classDetails.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No classes assigned to you yet.</p>
                <small className="text-muted d-block mt-2">
                    Please contact admin to assign classes and subjects to you.
                </small>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h4 className="fw-bold mb-4" style={{ color: "var(--dark-color)" }}>
                📚👨🏻‍🏫 Classes & Subjects
            </h4>

            <div className="row">
                {classDetails.map((cls) => (
                    <div key={cls.classId} className="col-md-6 col-lg-4 mb-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "var(--border-radius)" }}>
                            <div className="card-header" style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius) var(--border-radius) 0 0" }}>
                                <h5 className="fw-bold mb-0">{cls.className}</h5>
                            </div>
                            <div className="card-body">
                                <h6 className="fw-semibold text-muted mb-3">Subjects:</h6>
                                <ul className="list-unstyled">
                                    {cls.subjects.map((sub) => (
                                        <li key={sub.subjectId} className="py-1">
                                            <span className="badge" style={{ backgroundColor: "var(--light-color)", color: "var(--text-color)", padding: "6px 12px", fontSize: "13px" }}>
                                                📒&nbsp;{sub.subjectName}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <small className="text-muted">Total Subjects: {cls.subjects.length}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-muted small">
                Total Classes: {classDetails.length} | Total Subjects: {classDetails.reduce((acc, c) => acc + c.subjects.length, 0)}
            </div>
        </div>
    );
}