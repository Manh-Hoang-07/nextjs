"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    avatar: string;
    createdAt: string;
}

export default function UserProfileClient() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Mock data - in real app, this would be fetched from API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProfile({
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                phone: "+1234567890",
                address: "123 Main St, Anytown, USA",
                bio: "I am a software developer with a passion for creating amazing web applications.",
                avatar: "/images/user1.jpg",
                createdAt: "2023-01-15",
            });
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleUpdateProfile = () => {
        if (!profile) return;

        // In real app, this would call API
        console.log("Updating profile:", { ...profile, ...formData });

        // Update local state
        setProfile({ ...profile, ...formData });

        // Close modal
        setIsEditModalOpen(false);

        // Show success message (in real app, this would be a toast)
        alert("Profile updated successfully!");
    };

    const handleChangePassword = () => {
        // In real app, this would call API
        console.log("Changing password:", passwordData);

        // Reset form
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        // Close modal
        setIsPasswordModalOpen(false);

        // Show success message (in real app, this would be a toast)
        alert("Password changed successfully!");
    };

    const openEditModal = () => {
        if (!profile) return;

        setFormData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            bio: profile.bio,
        });
        setIsEditModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="ml-2 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Profile not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white shadow rounded-lg">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                        <div className="flex space-x-2">
                            <Button variant="secondary" onClick={() => setIsPasswordModalOpen(true)}>
                                Change Password
                            </Button>
                            <Button onClick={openEditModal}>
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                            {profile.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-medium text-gray-700">
                                    {profile.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="ml-6">
                            <h3 className="text-xl font-medium text-gray-900">{profile.name}</h3>
                            <p className="text-sm text-gray-500">Member since {profile.createdAt}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                            <p className="text-sm text-gray-900">{profile.name}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                            <p className="text-sm text-gray-900">{profile.email}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                            <p className="text-sm text-gray-900">{profile.phone || "Not provided"}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                            <p className="text-sm text-gray-900">{profile.address || "Not provided"}</p>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                            <p className="text-sm text-gray-900">{profile.bio || "Not provided"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
                size="lg"
            >
                <div className="space-y-4">
                    <FormField
                        id="name"
                        name="name"
                        type="text"
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <FormField
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <FormField
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <FormField
                        id="address"
                        name="address"
                        type="text"
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />

                    <FormField
                        id="bio"
                        name="bio"
                        type="textarea"
                        label="Bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>
                        Update Profile
                    </Button>
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                show={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Change Password"
                size="md"
            >
                <div className="space-y-4">
                    <FormField
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        label="Current Password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                    />

                    <FormField
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        label="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />

                    <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => setIsPasswordModalOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleChangePassword}>
                        Change Password
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
