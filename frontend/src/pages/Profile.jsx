import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      if (user.photoURL && user.photoURL.includes('dicebear.com')) {
        const seedMatch = user.photoURL.match(/seed=([^&]+)/);
        setAvatarSeed(seedMatch ? seedMatch[1] : user.uid);
      } else {
        setAvatarSeed(user.uid);
      }
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your profile</div>
      </div>
    );
  }

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const handleRerollAvatar = () => {
    const newSeed = `${user.uid}-${Date.now()}`;
    setAvatarSeed(newSeed);
    setSuccessMsg("Avatar updated! Don't forget to save changes.");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    
    try {
      const updates = [];
      const newPhotoURL = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;
      
      if (displayName !== user.displayName || newPhotoURL !== user.photoURL) {
        updates.push(updateProfile(user, { displayName, photoURL: newPhotoURL }));
      }

      if (email && email !== user.email) {
        updates.push(updateEmail(user, email));
      }

      if (newPassword.trim()) {
        updates.push(updatePassword(user, newPassword));
      }

      if (updates.length === 0) {
        setError("No changes to save");
        setSaving(false);
        return;
      }

      await Promise.all(updates);
      setSuccessMsg("Profile updated successfully!");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      let errorMessage = err.message;
      if (err.code === 'auth/requires-recent-login') {
        errorMessage = "Please log out and log back in to change email/password";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use";
      }
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-700 py-10 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-white relative">
        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 p-3 rounded-full transition shadow-lg"
          title="Settings"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center space-x-6 mb-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRerollAvatar}
              className="absolute bottom-0 right-0 bg-cyan-600 p-2 rounded-full cursor-pointer hover:bg-cyan-700 transition shadow-lg"
              title="Randomize avatar"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{displayName || "Your Name"}</h1>
            <p className="text-sm text-cyan-200">{email}</p>
            {user.emailVerified && (
              <span className="inline-block mt-2 text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Editable Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white/20 border border-cyan-300 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/20 border border-cyan-300 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="w-full bg-white/20 border border-cyan-300 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              placeholder="Tell the world about yourself..."
            ></textarea>
            <p className="text-xs text-cyan-200 mt-1">Note: Bio is stored locally in this session</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/20 border border-cyan-300 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Leave blank to keep current password"
            />
            <p className="text-xs text-cyan-200 mt-1">Minimum 6 characters</p>
          </div>
        </div>

        {/* Messages and Buttons */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 text-green-200 text-sm">
              {successMsg}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-3">Account Information</h3>
          <div className="space-y-2 text-sm text-cyan-200">
            <p><span className="font-medium">User ID:</span> {user.uid}</p>
            <p><span className="font-medium">Account Created:</span> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
            <p><span className="font-medium">Last Sign In:</span> {new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
