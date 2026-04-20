import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import Button from '../common/Button';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const NavLink = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
            ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-900/50'
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <img src="/favicon.png" alt="Nexus_logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white hidden xs:inline">Nexus</span>
        </div>

        {user?.role === 'admin' && (
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="Dashboard" />
            <NavLink to="/library" label="Content" />
            <NavLink to="/groups" label="Groups" />
            <NavLink to="/settings" label="Users" />
          </div>
        )}
        {user?.role === 'user' && (
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="Dashboard" />
            <NavLink to="/library" label="Content" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-4 pl-4 border-slate-200 dark:border-slate-800">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <User size={16} />
              <span>{user.name}</span>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] uppercase font-bold tracking-wider">
                {user.role}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="!p-3 flex items-center">
              <LogOut size={14} />
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
