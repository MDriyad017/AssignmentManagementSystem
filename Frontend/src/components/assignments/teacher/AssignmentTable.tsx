"use client";
import { Assignment } from "@/types/teacherAssignment";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import Swal from "sweetalert2";

interface AssignmentTableProps {
   assignments: Assignment[];
   loading: boolean;
   onView: (assignment: Assignment) => void;
   onEdit: (assignment: Assignment) => void;
   onDelete: (id: string) => void;
}

export default function AssignmentTable({ assignments, loading, onView, onEdit, onDelete }: AssignmentTableProps) {
   if (loading) {
      return (
         <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Loading...</span>
            </div>
         </div>
      );
   }

   if (!assignments || assignments.length === 0) {
      return (
         <div className="text-center py-5">
            <p className="text-muted">No assignments found. Click &quot;Create Assignment&quot; to create one.</p>
         </div>
      );
   }

   const getStatusBadgeColor = (status: string) => {
      switch (status) {
         case "Published": return "var(--success-color)";
         case "Draft": return "var(--warning-color)";
         case "Closed": return "var(--danger-color)";
         default: return "var(--text-muted)";
      }
   };

   const handleDeleteClick = (id: string, title: string) => {
      Swal.fire({
         title: 'Are you sure?',
         html: `You are about to delete <strong>${title}</strong>.`,
         text: "This action cannot be undone!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#6c757d',
         confirmButtonText: 'Yes, delete!',
         cancelButtonText: 'Cancel',
         reverseButtons: true,
      }).then((result) => {
         if (result.isConfirmed) {
            onDelete(id);
         }
      });
   };

   return (
      <div className="table-responsive">
         <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
            <thead style={{ backgroundColor: "var(--light-color)", borderBottom: "2px solid var(--border-color)" }}>
               <tr>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>#</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Title</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Class</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Subject</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Due Date</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px" }}>Status</th>
                  <th style={{ fontWeight: "600", color: "var(--text-color)", padding: "12px 16px", textAlign: "center" }}>Actions</th>
               </tr>
            </thead>
            <tbody>
               {assignments.map((assignment, index) => (
                  <tr key={assignment.id}>
                     <td style={{ padding: "10px 16px", color: "var(--text-muted)" }}>{index + 1}</td>
                     <td style={{ padding: "10px 16px", fontWeight: "500", color: "var(--text-color)" }}>
                        {assignment.title}
                        {assignment.attachmentUrl && (
                           <span className="ms-1">
                              <FileText size={14} style={{ color: "var(--primary-color)" }} />
                           </span>
                        )}
                     </td>
                     <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.className}</td>
                     <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>{assignment.subjectName}</td>
                     <td style={{ padding: "10px 16px", color: "var(--text-color)" }}>
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
                        {assignment.isOverdue && (
                           <span className="badge ms-1" style={{ backgroundColor: "var(--danger-color)", fontSize: "9px" }}>Overdue</span>
                        )}
                     </td>
                     <td style={{ padding: "10px 16px" }}>
                        <span className="badge" style={{ backgroundColor: getStatusBadgeColor(assignment.status || "Draft"), fontSize: "11px", padding: "5px 12px" }}>
                           {assignment.status || "Draft"}
                        </span>
                     </td>
                     <td style={{ padding: "10px 16px", textAlign: "center" }}>
                        <div className="d-flex justify-content-center gap-2">
                           <button type="button" className="btn btn-sm" onClick={() => onView(assignment)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                              <Eye size={14} />
                           </button>
                           <button type="button" className="btn btn-sm" onClick={() => onEdit(assignment)} style={{ backgroundColor: "rgba(0,79,79,0.1)", color: "var(--primary-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,79,79,0.1)")}>
                              <Pencil size={14} />
                           </button>
                           <button type="button" className="btn btn-sm" onClick={() => handleDeleteClick(assignment.id, assignment.title)} style={{ backgroundColor: "rgba(220,53,69,0.1)", color: "var(--danger-color)", border: "none", borderRadius: "var(--border-radius)", padding: "5px 8px", transition: "var(--transition)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.2)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(220,53,69,0.1)")}>
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}