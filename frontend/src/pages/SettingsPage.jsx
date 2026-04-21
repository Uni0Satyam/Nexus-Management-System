import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Shield, Users, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { addUserSchema, validateForm } from '../lib/validation';

const SettingsPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [addUserErrors, setAddUserErrors] = useState({});

  const fetchData = async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        currentUser.role === 'admin' ? api.get('/user') : Promise.resolve({ data: { data: { users: [currentUser] } } }),
        api.get('/group')
      ]);
      setUsers(usersRes.data.data.users);
      setGroups(groupsRes.data.data.groups);
    } catch (error) {
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const fieldErrors = validateForm(addUserSchema, newUser);
    if (Object.keys(fieldErrors).length > 0) {
      setAddUserErrors(fieldErrors);
      return;
    }
    setAddUserErrors({});
    try {
      await api.post('/user', newUser);
      toast.success('User added successfully');
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAssignGroup = async (userId, groupId) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/user/${userId}/group`, { groupId });
      toast.success('Group assigned');
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      toast.error('Assignment failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFieldChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
    setAddUserErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setAddUserErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      <div className="py-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Organization Settings</h1>
      </div>

      <Card className="p-8 space-y-8">
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-700/50">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-300 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h2>
            <p className="text-gray-400">{currentUser.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                    <Shield size={12} />
                    <span>Role</span>
                </label>
                <div className="text-gray-200 font-medium">{currentUser.role}</div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center space-x-2">
                    <Users size={12} />
                    <span>Group</span>
                </label>
                <div className="text-gray-200 font-medium">{currentUser.group?.groupName || 'Unassigned'}</div>
            </div>
        </div>
      </Card>

      {currentUser.role === 'admin' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">All users</h2>
            <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                className="flex items-center space-x-2 px-4"
            >
              <Plus size={18} />
              <span>Add user</span>
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">USER</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">EMAIL</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">ROLE</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">GROUP</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-9 h-9 rounded-full bg-blue-400/20 text-blue-300 flex items-center justify-center text-xs font-bold ring-1 ring-white/5">
                            {u.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                          </div>
                          <span className="font-semibold text-white tracking-tight">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-400 text-sm">{u.email}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge variant={u.role === 'admin' ? 'blue' : 'green'}>{u.role}</Badge>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {u.group?.groupName || u.groupId?.groupName ? (
                            <Badge variant="purple">{u.group?.groupName || u.groupId?.groupName}</Badge>
                        ) : (
                            <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                            variant="outline"
                            className="bg-gray-800/20 border-white/10 hover:border-white/20 text-xs py-2 px-5 !rounded-lg"
                            onClick={() => { setSelectedUser(u); setShowAssignModal(true); }}
                        >
                          Assign group
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">Add New User</h2>
              <button onClick={handleCloseAddModal} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-6" noValidate>
              <Input
                label="Full Name"
                id="newUser-name"
                placeholder="Jane Smith"
                value={newUser.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={addUserErrors.name}
              />
              <Input
                label="Email Address"
                id="newUser-email"
                type="email"
                placeholder="jane@organization.com"
                value={newUser.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={addUserErrors.email}
              />
              <Input
                label="Password"
                id="newUser-password"
                type="password"
                placeholder="••••••••"
                value={newUser.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                error={addUserErrors.password}
              />
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-gray-400">Role</label>
                <select
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    value={newUser.role}
                    onChange={(e) => handleFieldChange('role', e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                {addUserErrors.role && (
                  <span className="text-xs text-rose-500 mt-1">{addUserErrors.role}</span>
                )}
              </div>
              <div className="flex space-x-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={handleCloseAddModal}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-700">Create User</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-8 space-y-8 shadow-2xl text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Assign Group</h2>
                <p className="text-gray-400">Assigning group for <span className="text-white font-medium">{selectedUser.name}</span></p>
            </div>
            <div className="space-y-4">
                <select
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleAssignGroup(selectedUser._id, e.target.value)}
                    value={selectedUser.group?._id || ''}
                >
                    <option value="">No Group</option>
                    {groups.map(g => <option key={g._id} value={g._id}>{g.groupName}</option>)}
                </select>
                <Button variant="ghost" className="w-full" onClick={() => setShowAssignModal(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
