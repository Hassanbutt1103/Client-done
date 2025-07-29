import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import novaLogo from '../assets/Nova Logo VP.png';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      console.log('User already logged in, redirecting to:', user.role.toLowerCase());
      navigate(`/${user.role.toLowerCase()}`);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password || !userType) {
      setError('Please enter email, password, and select a user type.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔗 Attempting login to:', API_ENDPOINTS.AUTH.LOGIN);
      console.log('📤 Login data:', { email: username, userType });
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: username, password, userType })
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (data.status === 'success') {
        // Check if selected userType matches backend role
        const backendRole = data.user.role ? data.user.role.toLowerCase() : '';
        
        if (userType.toLowerCase() !== backendRole) {
          setError('You are not allowed to log in as this user type.');
          setIsLoading(false);
          return;
        }
        
        console.log('Login successful, user role:', backendRole);
        console.log('🔑 Saving authentication data...');
        
        // Store authentication data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        console.log('✅ User data saved:', data.user);
        console.log('✅ Token saved:', data.token ? 'Present' : 'Missing');
        console.log('🔐 Authentication status now:', localStorage.getItem('token') && localStorage.getItem('user') ? 'Complete' : 'Incomplete');
        
        // Clear form
        setUsername('');
        setPassword('');
        setUserType('');
        setError('');
        
        // Redirect to dashboard after successful login
        navigate(`/${backendRole}`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any existing authentication
    localStorage.removeItem('user');
    setUsername('');
    setPassword('');
    setUserType('');
    setError('');
    navigate('/');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage('');
    
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage('Please enter your email address.');
      return;
    }

    setForgotPasswordLoading(true);
    
    try {
      console.log('🔗 Sending forgot password request to:', API_ENDPOINTS.AUTH.FORGOT_PASSWORD);
      console.log('📤 Email:', forgotPasswordEmail);
      
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });
      
      const data = await response.json();
      console.log('📥 Forgot password response:', data);
      
      if (data.status === 'success') {
        setForgotPasswordMessage('Password reset link has been sent to your email address. Please check your email and follow the instructions.');
        setForgotPasswordEmail('');
        // Auto close after 5 seconds
        setTimeout(() => {
          closeForgotPassword();
        }, 5000);
      } else {
        setForgotPasswordMessage(data.message || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setForgotPasswordMessage('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#1a2a33', fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile: Full background image, card overlay */}
      <div className="md:hidden fixed inset-0 z-0" style={{
        backgroundImage: `linear-gradient(rgba(26, 42, 51, 0.85), rgba(26, 42, 51, 0.85)), url('/372748-PC42NW-151.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
      }} />
      
      <div className="w-full md:w-1/2 flex items-center justify-center md:static fixed inset-0 z-10" style={{ backgroundColor: '#1a2a33' }}>
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/70 md:bg-white/80 p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center m-4 md:m-8 border border-gray-200">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3">
              <img src={novaLogo} alt="Nova Logo" className="w-28 h-16 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1a2a33] mb-1 text-center w-full">DASH VP ENGENHARIA</h2>
            <div className="text-[13px] mt-1 mb-1" style={{ color: '#D6A647', fontFamily: 'Rajdhani, Orbitron, Titillium Web, Exo 2, Inter, sans-serif', textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
              Excelência técnica e compromisso: construindo resultados sólidos para quem entende de posto.
            </div>
          </div>
          
          {error && (
            <div className="mb-4 text-red-500 text-sm w-full text-center bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="userType">User Type</label>
            <select
              id="userType"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select user type</option>
              <option value="admin">Admin</option>
              <option value="manager">Gerente</option>
              <option value="financial">Financeiro</option>
              <option value="engineering">Engenharia</option>
              <option value="hr">RH</option>
              <option value="commercial">Comercial</option>
              <option value="purchasing">Compras</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold shadow-md transition-all text-lg mb-4 transform focus:outline-none ${
              isLoading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#1a2a33] text-white hover:scale-105 hover:shadow-xl active:scale-95'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            className="w-full text-[#D6A647] py-2 text-sm font-medium hover:underline transition-all mb-3"
            onClick={() => setShowForgotPassword(true)}
            disabled={isLoading}
          >
            Esqueceu sua senha?
          </button>

          <div className="text-center text-sm text-[#1a2a33]">
            Não tem uma conta?{' '}
            <Link 
              to="/signup" 
              className="text-[#D6A647] font-semibold hover:underline transition-all"
            >
              Criar conta
            </Link>
          </div>
        </form>
      </div>
      
      {/* Border Line and Right Background for Desktop */}
      <div className="hidden md:block w-px bg-gray-300 h-screen" />
      <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 42, 51, 0.85), rgba(26, 42, 51, 0.85)), url('/372748-PC42NW-151.jpg')`,
            backgroundSize: '110%',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1a2a33]">Reset Password</h3>
              <button
                onClick={closeForgotPassword}
                className="text-gray-400 hover:text-gray-600 text-xl"
                disabled={forgotPasswordLoading}
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              Enter the email address associated with your admin account and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-[#1a2a33]" htmlFor="forgotEmail">
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  disabled={forgotPasswordLoading}
                  required
                />
              </div>
              
              {forgotPasswordMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  forgotPasswordMessage.includes('sent') || forgotPasswordMessage.includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  disabled={forgotPasswordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    forgotPasswordLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-[#1a2a33] text-white hover:bg-[#243640] hover:shadow-lg'
                  }`}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 