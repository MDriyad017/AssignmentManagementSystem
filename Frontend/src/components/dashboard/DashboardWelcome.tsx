"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardWelcome() {
   const { user } = useAuth();

   return (
      <div className="container-fluid">
         <h2 className="fw-bold">
            This Is &quot;{user?.role}&quot; Dashboard
         </h2>

         <p className="text-muted">
            Welcome to Assignment Management System.
         </p>
      </div>
   );
}