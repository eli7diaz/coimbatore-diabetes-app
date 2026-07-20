"use client";

import { useState } from "react";
import { X, Users, UserPlus, Shield, MoreVertical, Smartphone, Trash2, Check, Plus } from "lucide-react";

interface StaffModalProps {
    onClose: () => void;
}

export default function StaffModal({ onClose }: StaffModalProps) {
    const [staff, setStaff] = useState([
        { id: 1, name: "Ananya Iyer", role: "Head Nurse", status: "On Duty", patients: 14 },
        { id: 2, name: "Suresh Mani", role: "Junior Assistant", status: "On Duty", patients: 8 },
        { id: 3, name: "Priya Das", role: "Dietitian", status: "Break", patients: 0 },
        { id: 4, name: "Rahul Nair", role: "Lab Technician", status: "Offline", patients: 0 },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("Nurse");

    const handleAddStaff = () => {
        if (!newName.trim()) return;

        const newMember = {
            id: Date.now(),
            name: newName,
            role: newRole,
            status: "On Duty",
            patients: 0
        };

        setStaff([...staff, newMember]);
        setNewName("");
        setIsAdding(false);
    };

    const handleRemoveStaff = (id: number) => {
        setStaff(staff.filter(member => member.id !== id));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Clinical Team</h3>
                            <p className="text-sm text-muted-foreground font-medium">{staff.length} team members synchronized</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Personnel</h4>
                        {!isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                            >
                                <UserPlus size={14} />
                                Add Staff
                            </button>
                        )}
                    </div>

                    {isAdding && (
                        <div className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase pl-1">Role</label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                    >
                                        <option>Nurse</option>
                                        <option>Assistant</option>
                                        <option>Dietitian</option>
                                        <option>Technician</option>
                                        <option>Doctor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddStaff}
                                    className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Add Member
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {staff.length === 0 ? (
                            <div className="py-12 text-center">
                                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-sm font-medium text-muted-foreground">No staff members found.</p>
                            </div>
                        ) : (
                            staff.map((member) => (
                                <div key={member.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{member.name}</h4>
                                            <p className="text-xs font-medium text-muted-foreground">{member.role} • {member.patients} active patients</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${member.status === "On Duty" ? "bg-green-100 text-green-700" :
                                            member.status === "Break" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {member.status}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStaff(member.id)}
                                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Staff"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="p-1.5 text-muted-foreground hover:text-gray-900 rounded-lg">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-2xl bg-gray-900 text-white flex items-center gap-4">
                            <Shield className="text-primary" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Access Control</p>
                                <p className="text-sm font-bold">HIPAA Compliant</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border flex items-center gap-4">
                            <Smartphone className="text-primary" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sync Status</p>
                                <p className="text-sm font-bold">Cloud Real-time</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex-shrink-0">
                    <button className="w-full py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        View Shift Analytics & Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
