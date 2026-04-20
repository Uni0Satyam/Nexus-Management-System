import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Users, Briefcase, FileText, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (user?.role === 'admin') {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/stats'),
          api.get('/user')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.users.slice(0, 5));
      }
    } catch (error) {
      toast.error('Failed to sync dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-800/50 rounded-2xl"></div>)}
        </div>
        <div className="h-64 bg-gray-800/50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {user?.role === 'admin' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col space-y-2" hover={true}>
                <span className="text-gray-400 text-sm font-medium">Total users</span>
                <span className="text-4xl font-semibold text-white tracking-tight">{stats?.totalUsers || 0}</span>
            </Card>
            <Card className="p-6 flex flex-col space-y-2" hover={true}>
                <span className="text-gray-400 text-sm font-medium">Groups</span>
                <span className="text-4xl font-semibold text-white tracking-tight">{stats?.totalGroups || 0}</span>
            </Card>
            <Card className="p-6 flex flex-col space-y-2" hover={true}>
                <span className="text-gray-400 text-sm font-medium">Content items</span>
                <span className="text-4xl font-semibold text-white tracking-tight">{stats?.totalContent || 0}</span>
            </Card>
          </div>
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-lg font-bold text-white tracking-tight">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-800/30 text-gray-500">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-800/40 transition-all duration-200 cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-400/20 text-blue-300 flex items-center justify-center text-xs font-bold">
                            {u.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-semibold text-white">{u.name}</span>
                            <span className="text-xs text-gray-500">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={u.role === 'admin' ? 'blue' : 'green'}>{u.role}</Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="purple">{u.group?.groupName || 'Unassigned'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-8 space-y-8">
            <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h1>
                    <p className="text-gray-400">{user?.email}</p>
                </div>
            </div>
            <div className="pt-8 border-t border-gray-700/50">
                <Badge variant="indigo">{user?.role}</Badge>
                <div className="mt-4 text-gray-400 text-sm">
                    Accessing {user?.group?.groupName || 'Global'} resources
                </div>
            </div>
        </Card>
      )}
    </div>
  );
};


export default Dashboard;
