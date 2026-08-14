"use client";
import { X, FileText, Download, Eye } from "lucide-react";
import { useState } from "react";
import { Submission } from "@/types/submission";
import { getDisplayFileName } from "@/utils/fileUtils";

interface SubmissionViewModalProps {
   isOpen: boolean;
   onClose: () => void;
   submission: Submission | null;
}

export default function SubmissionViewModal({ isOpen, onClose, submission }: SubmissionViewModalProps) {
   const [previewOpen, setPreviewOpen] = useState(false);
   if (!isOpen || !submission) return null;

   const getFullFileUrl = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, '') || '';
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      const cleanUrl = url.startsWith('/') ? url : `/${url}`;
      return `${cleanBaseUrl}${cleanUrl}`;
   };

   const getFileExtension = (url: string) => url.split('.').pop()?.toLowerCase() || '';
   const isPreviewable = (url: string) => {
      const ext = getFileExtension(url);
      return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'md'].includes(ext);
   };
   const getFileType = (url: string) => {
      const ext = getFileExtension(url);
      const types: Record<string, string> = {
         pdf: 'PDF Document', docx: 'Word Document', doc: 'Word Document',
         zip: 'ZIP Archive', rar: 'RAR Archive',
         png: 'PNG Image', jpg: 'JPG Image', jpeg: 'JPEG Image',
         gif: 'GIF Image', webp: 'WebP Image', txt: 'Text File', md: 'Markdown File'
      };
      return types[ext] || 'File';
   };

   const fileUrl = submission.submissionFileUrl ? getFullFileUrl(submission.submissionFileUrl) : '';

   return (
      <>
         <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }} onClick={onClose} />
         <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg" style={{ width: "650px", maxWidth: "95vw", maxHeight: "90vh", zIndex: 1070, display: "flex", flexDirection: "column" }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
               <h5 className="fw-bold mb-0">📄 Submission Details</h5>
               <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", padding: "4px" }}>
                  <X size={20} />
               </button>
            </div>
            <div className="flex-grow-1 overflow-auto p-4">
               <div className="table-responsive">
                  <table className="table table-bordered" style={{ fontSize: "14px" }}>
                     <thead style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}>
                        <tr>
                           <th style={{ padding: "10px 16px", fontWeight: "600", textAlign: "center" }}>Assignment</th>
                           <th style={{ padding: "10px 16px", fontWeight: "600", textAlign: "center" }}>Student</th>
                           <th style={{ padding: "10px 16px", fontWeight: "600", textAlign: "center" }}>Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td style={{ padding: "10px 16px", textAlign: "center" }}>{submission.assignmentTitle}</td>
                           <td style={{ padding: "10px 16px", textAlign: "center" }}>{submission.studentName}</td>
                           <td style={{ padding: "10px 16px", textAlign: "center" }}>
                              <span className="badge" style={{ backgroundColor: submission.status === "Graded" ? "var(--success-color)" : submission.status === "Submitted" ? "var(--warning-color)" : "var(--danger-color)" }}>
                                 {submission.status}
                              </span>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               {submission.submissionText && (
                  <div className="mb-3">
                     <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Submission Text</label>
                     <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{submission.submissionText}</p>
                  </div>
               )}
               <div className="mt-3">
                  {submission.feedback && (
                     <div className="mb-2">
                        <label className="fw-semibold text-muted" style={{ fontSize: "13px" }}>Feedback</label>
                        <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>{submission.feedback}</p>
                     </div>
                  )}
               </div>

               {submission.submissionFileUrl && (
                  <div className="mt-3">
                     <label className="fw-semibold text-muted d-block mb-2" style={{ fontSize: "13px" }}>Attachment</label>
                     <div className="d-flex align-items-center gap-2 flex-wrap">
                        <FileText size={18} style={{ color: "var(--primary-color)" }} />
                        <span className="text-muted small">{getFileType(submission.submissionFileUrl)}</span>
                        <div className="d-flex gap-2 ms-auto">
                           {/* {isPreviewable(submission.submissionFileUrl) && (
                                        <button type="button" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => setPreviewOpen(true)}>
                                            <Eye size={14} /> Preview
                                        </button>
                                    )} */}
                           <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" download>
                              <Download size={14} /> Preview
                           </a>
                        </div>
                     </div>
                  </div>
               )}
            </div>
            <div className="p-3 border-top d-flex justify-content-end">
               <button type="button" className="btn" onClick={onClose}>Close</button>
            </div>
         </div>
         {previewOpen && submission.submissionFileUrl && fileUrl && (
            <>
               <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1080 }} onClick={() => setPreviewOpen(false)} />
               <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg" style={{ width: "80%", maxWidth: "900px", maxHeight: "90vh", zIndex: 1090, display: "flex", flexDirection: "column" }}>
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                     <h6 className="fw-bold mb-0">File Preview</h6>
                     <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPreviewOpen(false)}>
                        <X size={18} /> Close
                     </button>
                  </div>
                  <div className="flex-grow-1 overflow-auto p-3" style={{ minHeight: "400px" }}>
                     {getFileExtension(submission.submissionFileUrl) === 'pdf' ? (
                        <iframe src={fileUrl} className="w-100 h-100" style={{ minHeight: "500px", border: "none" }} title="PDF Preview" />
                     ) : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExtension(submission.submissionFileUrl)) ? (
                        <img src={fileUrl} alt="File Preview" className="img-fluid w-100" style={{ maxHeight: "70vh", objectFit: "contain" }} />
                     ) : ['txt', 'md'].includes(getFileExtension(submission.submissionFileUrl)) ? (
                        <iframe src={fileUrl} className="w-100 h-100" style={{ minHeight: "500px", border: "none" }} title="Text Preview" />
                     ) : (
                        <div className="text-center py-5">
                           <FileText size={64} style={{ color: "var(--text-muted)" }} />
                           <p className="text-muted mt-3">Preview not available for this file type.</p>
                           <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" download>
                              <Download size={16} className="me-1" /> Download File
                           </a>
                        </div>
                     )}
                  </div>
               </div>
            </>
         )}
      </>
   );
}