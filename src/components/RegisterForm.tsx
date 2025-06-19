'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface RegisterFormProps {
  onLogin: (user: User, token: string) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onLogin, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Validate username in real-time
  useEffect(() => {
    if (username.trim() === '') {
      setUsernameError('');
      return;
    }

    if (username.includes(' ')) {
      setUsernameError('Username cannot contain spaces');
      return;
    }

    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return;
    }

    if (username.length > 20) {
      setUsernameError('Username must be less than 20 characters');
      return;
    }

    // Check for valid characters (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setUsernameError('');
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to lowercase and remove spaces
    const value = e.target.value.toLowerCase().replace(/\s/g, '');
    setUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username
    if (usernameError) {
      setError('Please fix username errors');
      return;
    }

    if (username.trim() === '') {
      setError('Username is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.toLowerCase(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
              usernameError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter username (lowercase, no spaces)"
            required
          />
          {usernameError && (
            <div className="text-red-500 text-xs mt-1">{usernameError}</div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            placeholder="Confirm password"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading || !!usernameError}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
} 