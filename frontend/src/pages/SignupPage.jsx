import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Lock } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      navigate('/login');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join MiniMS today</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            icon={<User size={18} />}
          />
          <Input
            label="Email Address"
            type="email"
            id="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail size={18} />}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            min={8}
            icon={<Lock size={18} />}
          />

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm">
          <p className="text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
