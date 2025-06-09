import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeClosed,
  Edit,
  X,
} from 'lucide-react';

import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../api/profileApi"; // Ensure this path is correct

// --- Modal Component ---
const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4 font-inter">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- Input Field Component ---
const InputField = ({ icon, label, type, value, onChange, required, readOnly }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center gap-2">{icon}<span>{label}</span></div>
      </label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [originalProfile, setOriginalProfile] = useState({ name: '', email: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const { data } = await fetchUserProfile();
        setProfile(data);
        setOriginalProfile(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || 'Failed to fetch profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUserProfile(profile);
      toast.success(data.message || 'Profile updated successfully!');
      setOriginalProfile(profile);
      setShowEditProfileModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      setChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      setChangingPassword(false);
      return;
    }

    try {
      const { data } = await changeUserPassword(currentPassword, newPassword);
      toast.success(data.message || 'Password changed!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowChangePasswordModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCloseEditProfileModal = () => {
    setProfile(originalProfile);
    setShowEditProfileModal(false);
  };

  const handleCloseChangePasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowChangePasswordModal(false);
  };

  return (
    <div className="bg-[#F3F6FF] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-inter">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center">
          My Profile
        </h1>

        <section className="mb-10 p-6 bg-[#F3F6FF] rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="text-blue-600" /> Profile Information
            </h2>
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
            >
              <Edit size={16} className="mr-2" /> Edit Profile
            </button>
          </div>

          {loadingProfile ? (
            <p className="text-blue-600 text-center">Loading profile...</p>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="text-sm font-medium text-gray-700">Name:</span>{' '}
                <span className="text-lg font-semibold text-gray-900">{profile.name}</span>
              </p>
              <p>
                <span className="text-sm font-medium text-gray-700">Email:</span>{' '}
                <span className="text-lg font-semibold text-gray-900">{profile.email}</span>
              </p>
            </div>
          )}
        </section>

        <div className="flex justify-center">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* --- Edit Profile Modal --- */}
      <Modal
        show={showEditProfileModal}
        onClose={handleCloseEditProfileModal}
        title="Edit Profile Information"
      >
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <InputField
            icon={<User />}
            label="Name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />
          <InputField
            icon={<Mail />}
            label="Email"
            type="email"
            value={profile.email}
            readOnly
          />
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseEditProfileModal}
              className="inline-flex justify-center py-2 px-6 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-[#F3F6FF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* --- Change Password Modal --- */}
      <Modal
        show={showChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
        title="Change Your Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-6">
          <InputField
            icon={<KeyRound />}
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <InputField
            icon={<Lock />}
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <InputField
            icon={<Lock />}
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseChangePasswordModal}
              className="inline-flex justify-center py-2 px-6 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-[#F3F6FF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
