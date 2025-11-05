import React, { useState } from 'react';
import { signIn, signUp } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setError: setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.displayName);
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}
    >
      <div className="max-w-sm w-full mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Student Quiz Helper</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Master your studies with interactive quizzes</p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-3xl shadow-2xl p-8 text-white"
          style={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Sign in to continue' : 'Create your account to get started'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)',
                    placeholderColor: 'var(--text-secondary)'
                  }}
                  className="w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                  placeholderColor: 'var(--text-secondary)'
                }}
                className="w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                  placeholderColor: 'var(--text-secondary)'
                }}
                className="w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div
                className="rounded-lg p-3 text-sm"
                style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)', color: 'var(--error-text)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'var(--primary-gradient)', color: 'var(--btn-text)' }}
              className="w-full rounded-xl font-semibold py-2.5 shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-5">
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: 'var(--accent)' }}
              className="font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
