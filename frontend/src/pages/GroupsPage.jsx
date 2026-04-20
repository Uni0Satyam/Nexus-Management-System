import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Users, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ groupName: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/group');
      setGroups(response.data.data.groups);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.groupName.trim()) return toast.error('Group name is required');

    const promise = editingId 
      ? api.put(`/group/${editingId}`, formData) 
      : api.post('/group', formData);

    toast.promise(promise, {
      loading: editingId ? 'Updating...' : 'Creating...',
      success: () => {
        setShowModal(false);
        setFormData({ groupName: '', description: '' });
        setEditingId(null);
        fetchGroups();
        return editingId ? 'Group updated' : 'Group created';
      },
      error: 'Failed to save',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this group? Members will be unassigned.')) {
      try {
        await toast.promise(api.delete(`/group/${id}`), {
          loading: 'Deleting...',
          success: 'Group deleted',
          error: 'Delete failed',
        });
        fetchGroups();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleEdit = (group) => {
    setFormData({ groupName: group.groupName, description: group.description });
    setEditingId(group._id);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Groups & Batches</h1>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setShowModal(true)} variant="outline" className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Create Group</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-800/30 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" hover={true}>
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest">{group.groupName}</h3>
                    <p className="text-gray-400 text-sm line-clamp-1">{group.description || 'Access cohort for organization resources'}</p>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Members</span>
                    <span className="text-white font-bold">{group.members?.length || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Content items</span>
                    <span className="text-white font-bold">{group.contents?.length || 0}</span>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden">
                    {group.members?.slice(0, 4).map((m, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#111827] bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300">
                        {m.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    ))}
                    {group.members?.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-[#111827] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                            +{group.members.length - 4}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => handleEdit(group)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(group._id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-24 border-dashed">
          <p className="text-gray-500 font-medium">No groups found. Create one to get started.</p>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <Card className="w-full max-w-lg p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {editingId ? 'Edit Group' : 'New Group'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Group Name"
                id="groupName"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                placeholder="e.g. Batch Alpha"
                required
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea
                  className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Organization or project details..."
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Save Changes' : 'Create Group'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
