import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import novaLogo from '../assets/Nova Logo VP.png';
import { API_ENDPOINTS } from '../config/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      navigate(`/${user.role.toLowerCase()}`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.userType) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Submitting registration request:', { email: formData.email, role: formData.userType });
      
      const response = await fetch(API_ENDPOINTS.AUTH.REQUEST_REGISTRATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
          department: '',
          position: ''
        })
      });
      
      const data = await response.json();
      console.log('Registration request response:', data);
      
      if (data.status === 'success') {
        setSuccess('Registration request submitted successfully! Please wait for admin approval. You will be contacted once your account is approved.');
        setError('');
        
        console.log('📋 Registration request submitted:', data);
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          userType: ''
        });
        
        // Redirect to login page after successful request submission
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Registration request failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    alert('Forgot password functionality will be implemented soon!');
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
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/70 md:bg-white/80 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center m-4 md:m-8 border border-gray-200">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-3">
              <img src={novaLogo} alt="Nova Logo" className="w-28 h-16 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1a2a33] mb-1 text-center w-full">CRIAR CONTA</h2>
            <div className="text-[13px] mt-1 mb-1" style={{ color: '#D6A647', fontFamily: 'Rajdhani, Orbitron, Titillium Web, Exo 2, Inter, sans-serif', textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
              Junte-se à nossa equipe de excelência técnica
            </div>
          </div>
          
          {error && (
            <div className="mb-4 text-red-500 text-sm w-full text-center bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 text-green-600 text-sm w-full text-center bg-green-50 p-2 rounded-lg border border-green-200">
              {success}
            </div>
          )}
          
          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="name">Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="Digite seu email"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Digite sua senha (mín. 6 caracteres)"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Confirme sua senha"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="userType">Tipo de Usuário</label>
            <select
              id="userType"
              name="userType"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Selecione o tipo de usuário</option>
              <option value="admin">Administrador</option>
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
            disabled={loading}
            className="w-full bg-[#1a2a33] text-white py-2.5 rounded-lg font-semibold shadow-md transition-all text-lg mb-4 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-[#D6A647] py-2 text-sm font-medium hover:underline transition-all mb-3"
          >
            Esqueceu sua senha?
          </button>

          <div className="text-center text-sm text-[#1a2a33]">
            Já tem uma conta?{' '}
            <Link 
              to="/" 
              className="text-[#D6A647] font-semibold hover:underline transition-all"
            >
              Faça login
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
    </div>
  );
};

export default Signup; 