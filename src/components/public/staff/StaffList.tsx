"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/navigation/Button";
import Modal from "@/components/ui/feedback/Modal";

import { TeamMember } from "@/types/api";

interface StaffListProps {
    initialStaff: TeamMember[];
}

export function StaffList({ initialStaff }: StaffListProps) {
    const [staffMembers] = useState<TeamMember[]>(initialStaff);
    const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(initialStaff);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        department: "all",
        search: "",
    });

    useEffect(() => {
        let filtered = [...staffMembers];
        if (filters.department !== "all") {
            filtered = filtered.filter(member => member.department === filters.department);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchLower) ||
                member.position.toLowerCase().includes(searchLower) ||
                member.bio.toLowerCase().includes(searchLower) ||
                member.expertise?.toLowerCase().includes(searchLower)
            );
        }
        setFilteredMembers(filtered);
    }, [staffMembers, filters]);

    const openMemberModal = (member: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const departments = Array.from(new Set(staffMembers.map(member => member.department || "Khác")));

    return (
        <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Tìm kiếm nhân viên..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                            Phòng ban
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">Tất cả</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy nhân viên nào phù hợp với bộ lọc.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <div className="h-64 bg-gray-200 overflow-hidden">
                                <Image
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                    alt={member.name}
                                    width={400}
                                    height={500}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-primary font-medium mb-2">{member.position}</p>
                                <p className="text-sm text-gray-500 mb-4">{member.department}</p>
                                <p className="text-gray-600 mb-4 line-clamp-3">{member.bio}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {member.expertise && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {member.expertise}
                                        </span>
                                    )}
                                    {member.experience && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {member.experience} năm kinh nghiệm
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => openMemberModal(member)}
                                    className="w-full"
                                >
                                    Xem hồ sơ
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Member Detail Modal */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedMember?.name}
                size="lg"
            >
                {selectedMember && (
                    <div>
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="md:w-1/3">
                                <Image
                                    src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}`}
                                    alt={selectedMember.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                            <div className="md:w-2/3">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                                <p className="text-primary font-medium mb-1">{selectedMember.position}</p>
                                <p className="text-sm text-gray-500 mb-4">{selectedMember.department}</p>
                                <p className="text-gray-600 mb-4">{selectedMember.bio}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-sm">{selectedMember.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Điện thoại</p>
                                        <p className="text-sm">{selectedMember.phone}</p>
                                    </div>
                                    {selectedMember.experience && (
                                        <div>
                                            <p className="text-sm text-gray-500">Kinh nghiệm</p>
                                            <p className="text-sm">{selectedMember.experience} năm</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">Chuyên môn</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember.expertise?.split(',').map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
