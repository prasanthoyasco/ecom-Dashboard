import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const validateEmail = (value) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValid ? '' : 'Enter a valid email address');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url('/login-side.png')` }}
      ></div>
  {/* "email": "admin@gmail.com",
  "password": "Admin@1234" */}
      {/* Right side form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[#42427D]">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-5 px-5">
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#42427d94] focus:border-[#42427D]"
                value={email}
                 onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                    setEmailTouched(true);
                    validateEmail(email);  
                }}
                required
              />
              {emailTouched && emailError && <p className="text-sm text-red-400 mt-2">{emailError}</p>}
            </div>

            <div className="relative">
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#42427d94] focus:border-[#42427D]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
              >
                {showPassword ?  <Eye size={18} /> : <EyeClosed size={18} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#42427D] hover:bg-[#42427D] text-white py-2 rounded-md transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600">
              Forgot your password? <a href="/reset" className="text-[#42427D] hover:underline">Reset here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
