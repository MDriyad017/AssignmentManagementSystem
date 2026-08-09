"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { userService } from "@/services/user.service";
import { User } from "@/types/user";
import UsersTable from "@/components/users/UsersTable";
import CreateUserDrawer from "@/components/users/CreateUserDrawer";
import EditUserDrawer from "@/components/users/EditUserDrawer";
import DeleteUserDrawer from "@/components/users/DeleteUserDrawer";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const data = await userService.getAll();
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleOpenCreate = () => setIsCreateDrawerOpen(true);
    const handleCloseCreate = () => setIsCreateDrawerOpen(false);
    const handleOpenEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditDrawerOpen(true);
    };
    const handleCloseEdit = () => {
        setIsEditDrawerOpen(false);
        setSelectedUser(null);
    };
    const handleOpenDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDrawerOpen(true);
    };
    const handleCloseDelete = () => {
        setIsDeleteDrawerOpen(false);
        setSelectedUser(null);
    };
    const handleSuccess = () => {
        loadUsers();
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold" style={{ color: "var(--dark-color)" }}>Users</h4>
                <button type="button" className="btn d-flex align-items-center gap-2" onClick={handleOpenCreate} style={{ backgroundColor: "var(--primary-color)", color: "#fff", borderRadius: "var(--border-radius)", padding: "8px 20px", border: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-hover)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}>
                    <Plus size={18} />
                    Add User
                </button>
            </div>
            <div className="card border-0 shadow-sm" style={{ borderRadius: "var(--border-radius)" }}>
                <div className="card-body p-0">
                    <UsersTable users={users} loading={loading} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
                </div>
            </div>
            <CreateUserDrawer isOpen={isCreateDrawerOpen} onClose={handleCloseCreate} onSuccess={handleSuccess} />
            <EditUserDrawer isOpen={isEditDrawerOpen} onClose={handleCloseEdit} onSuccess={handleSuccess} userId={selectedUser?.id || null} />
            <DeleteUserDrawer isOpen={isDeleteDrawerOpen} onClose={handleCloseDelete} onSuccess={handleSuccess} userId={selectedUser?.id || null} userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""} />
        </div>
    );
}