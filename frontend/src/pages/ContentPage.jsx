import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { FileText, Plus, X, Calendar, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ContentPage = () => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', type: 'text', groupId: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [contentRes, groupsRes] = await Promise.all([
        api.get('/content'),
        api.get('/group')
      ]);
      setContent(contentRes.data.data.content);
      setGroups(groupsRes.data.data.groups);
    } catch (error) {
      toast.error('Failed to sync library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      return toast.error('Title and Body are required');
    }

    const payload = { ...formData, groupId: formData.groupId || null };
    const promise = editingId 
      ? api.put(`/content/${editingId}`, payload) 
      : api.post('/content', payload);

    toast.promise(promise, {
      loading: editingId ? 'Updating content...' : 'Creating content...',
      success: () => {
        setShowModal(false);
        setFormData({ title: '', body: '', type: 'text', groupId: '' });
        setEditingId(null);
        fetchData();
        return editingId ? 'Content updated' : 'Content added to library';
      },
      error: 'Failed to save content',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await toast.promise(api.delete(`/content/${id}`), {
          loading: 'Deleting...',
          success: 'Content removed from library',
          error: 'Delete failed',
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
            {user?.role === 'admin' ? 'Content library' : 'My Content'}
        </h1>
        {user?.role === 'admin' && (
          <Button onClick={() => setShowModal(true)} variant="outline" className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Add content</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-800/30 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : content.length > 0 ? (
        <div className="space-y-4">
          {content.map((item) => (
            <Card key={item._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" hover={true}>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {item.type === 'link' ? (
                    <a href={item.body} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center space-x-1">
                      <span>{item.body}</span>
                    </a>
                  ) : (
                    item.body
                  )}
                </p>
                <div className="flex items-center space-x-4 pt-1">
                  <Badge variant="blue">{item.type}</Badge>
                  <Badge variant="purple">{item.group?.groupName || 'Global'}</Badge>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
                    <Calendar size={14} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <Button variant="danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-24 border-dashed">
          <p className="text-gray-500 font-medium">Your library is empty. Click "Add content" to get started.</p>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <Card className="w-full max-w-lg p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {editingId ? 'Edit Content' : 'New Library Item'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Title"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Employee Handbook"
                required
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Content Body / Link</label>
                <textarea
                  className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] text-sm"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Paste text or a URL here..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Type</label>
                    <select
                        className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="text">Text</option>
                        <option value="link">Link</option>
                        <option value="announcement">Announcement</option>
                    </select>
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Group</label>
                    <select
                        className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={formData.groupId}
                        onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                    >
                        <option value="">Public</option>
                        {groups.map(g => <option key={g._id} value={g._id}>{g.groupName}</option>)}
                    </select>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingId ? 'Save Changes' : 'Add to Library'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
