import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import logo from '../assets/logo-profile.png';
import illustration from '../assets/illustration.png';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, [name]: phoneValue });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError('');
  };

  const handleGoogleLogin = () => {
    try {
      authAPI.googleLogin();
    } catch {
      setError('Google login failed. Please try again.');
    }
  };

  const handleLinkedInLogin = () => {
    setError('LinkedIn login not available yet.');
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, phone } = form;
    if (!name || !email || !password || !confirmPassword || !phone) {
      setError('Please fill in all fields.');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return false;
    }
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be 6+ chars with upper, lower, and digit.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone must be exactly 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        username: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: parseInt(form.phone),
        role: 'admin',
      };
      await authAPI.register(userData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || 'Registration failed.');
      } else {
        setError('Network or server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f172a] text-white font-sans">
      {/* Left Section */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="absolute top-0 left-0 pl-6 pt-6 z-20 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-white text-2xl font-bold">VLink CRM</h1>
        </div>
        <img src={illustration} alt="Signup Illustration" className="w-96 h-80 object-contain" />
        <div className="text-center mt-4 text-[#94a3b8] text-base">
          <p className="italic">"Smart workflows. Smarter decisions."</p>
          <p>Empower your supply chain from the very first login.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <PasswordInput label="Password" name="password" value={form.password} onChange={handleChange} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
            <PasswordInput label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
            <Input label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} />

            {error && <div className="text-red-400 text-sm mt-1">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="flex items-center my-4 text-[#94a3b8]">
            <hr className="flex-grow border-[#334155]" />
            <span className="px-3 text-sm">or sign up with</span>
            <hr className="flex-grow border-[#334155]" />
          </div>

          <div className="flex gap-4">
            <SocialButton text="Google" onClick={handleGoogleLogin} />
            <SocialButton text="LinkedIn" onClick={handleLinkedInLogin} />
          </div>

          <p className="text-center text-sm mt-4 text-[#94a3b8]">
            Already have an account?
            <Link to="/login" className="text-blue-500 hover:underline ml-1">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function Input({ label, name, type = 'text', value, onChange, prefix }) {
  return (
    <div className="flex flex-col relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#cbd5e1] text-sm">{prefix}</div>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 pl-${prefix ? '12' : '4'} bg-[#0f172a] border border-[#334155] rounded-lg outline-none focus:border-blue-500`}
        placeholder={label}
        autoComplete="off"
      />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, toggle }) {
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-[#0f172a] border border-[#334155] rounded-lg outline-none focus:border-blue-500 pr-10"
        placeholder={label}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#94a3b8] hover:text-blue-400"
        aria-label="Toggle password visibility"
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}

function SocialButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex justify-center items-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
    >
      {text}
    </button>
  );
}
