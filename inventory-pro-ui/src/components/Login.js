import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  // Switch between panels: 'login', 'register', 'forgot', 'reset'
  const [viewState, setViewState] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '', email: '', otp: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log(`🚀 [FRONTEND TRACE] Initializing sub-system request for state: ${viewState}`);

    try {
      if (viewState === 'login') {
        console.log("🔑 Authenticating token credentials for:", formData.username);
        const response = await axios.post('http://localhost:8089/auth/token', {
          username: formData.username,
          password: formData.password
        });

        console.log("🎯 Login Success Token Collected:", response.data);
        localStorage.setItem('token', response.data);
        localStorage.setItem('username', formData.username);
        onLoginSuccess();

      } else if (viewState === 'register') {
        console.log("🔐 Provisioning database profile for:", formData.username);
        const response = await axios.post('http://localhost:8089/auth/register', {
          username: formData.username,
          password: formData.password,
          email: formData.email
        });

        console.log("🎯 Registration response metadata:", response.data);
        setMessage('✅ Account node provisioned successfully! Switch to login.');
        setViewState('login');

      } else if (viewState === 'forgot') {
        console.log("📨 Dispatching forgot-password recovery event to email:", formData.email);

        const response = await axios.post(`http://localhost:8089/auth/forgot-password?email=${formData.email}`);

        console.log("🎯 Kafka Stream Event Creation Reply:", response.data);
        setMessage(`📩 ${response.data.message || 'OTP Link dispatched to network.'}`);
        setViewState('reset');

      } else if (viewState === 'reset') {
        console.log("🛠️ Attempting password overwrite confirmation token check for:", formData.email);

        // 🔒 THE FIX: SAFELY ENCODE THE URL PARAMETERS
        const safeEmail = encodeURIComponent(formData.email);
        const safeOtp = encodeURIComponent(formData.otp);
        const safePassword = encodeURIComponent(formData.newPassword);

        // Send the safely encoded strings across the Gateway
        const response = await axios.post(`http://localhost:8089/auth/reset-password?email=${safeEmail}&otp=${safeOtp}&newPassword=${safePassword}`);

        console.log("🎯 Credentials Update Complete:", response.data);
        setMessage(`✅ ${response.data.message || 'Security vector re-aligned.'}`);
        setViewState('login');
      }
    } catch (err) {
      console.error("❌ Gateway Pipeline Exception Caught: ", err);
      setMessage(err.response?.data?.message || '❌ Authentication Gateway connection refused.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#121212', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '420px', border: '1px solid #2c2c2e', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>

        <h2 style={{ textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {viewState === 'login' && 'Enterprise Node Sign-In'}
          {viewState === 'register' && 'Provision Cluster Profile'}
          {viewState === 'forgot' && 'Initialize Password Reset'}
          {viewState === 'reset' && 'Re-align Security Vectors'}
        </h2>
        <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '13px', marginTop: 0, marginBottom: '25px' }}>
          {viewState === 'login' && 'Establish authorized session link over Port 8089.'}
          {viewState === 'register' && 'Inject raw user metadata schema blocks.'}
          {viewState === 'forgot' && 'Triggers an automated security verification OTP.'}
          {viewState === 'reset' && 'Input dispatched transactional OTP hash verification token.'}
        </p>

        <form onSubmit={handleAuthAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* USERNAME FIELD */}
          {(viewState === 'login' || viewState === 'register') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '500' }}>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} required style={{ padding: '12px', background: '#2c2c2e', border: '1px solid #3a3a3c', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
            </div>
          )}

          {/* EMAIL FIELD */}
          {viewState !== 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '500' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ padding: '12px', background: '#2c2c2e', border: '1px solid #3a3a3c', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
            </div>
          )}

          {/* OTP PIN VERIFICATION FIELD */}
          {viewState === 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#ff9f0a', fontSize: '12px', fontWeight: 'bold' }}>6-Digit OTP Verification Hash</label>
              <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleInputChange} required style={{ padding: '12px', background: '#2c2c2e', border: '1px solid #ff9f0a55', borderRadius: '8px', color: '#fff', fontSize: '14px', letterSpacing: '2px', textAlign: 'center', fontWeight: 'bold' }} />
            </div>
          )}

          {/* PASSWORD FIELD */}
          {(viewState === 'login' || viewState === 'register') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '500' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={{ padding: '12px', background: '#2c2c2e', border: '1px solid #3a3a3c', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
            </div>
          )}

          {/* NEW PASSWORD FIELD */}
          {viewState === 'reset' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '500' }}>Define New Encrypted Password</label>
              <input type="password" name="newPassword" placeholder="Minimum 6 characters" value={formData.newPassword} onChange={handleInputChange} required style={{ padding: '12px', background: '#2c2c2e', border: '1px solid #3a3a3c', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
            </div>
          )}

          {/* ACTION FORWARD SUBMIT BUTTON */}
          <button type="submit" disabled={loading} style={{ padding: '14px', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginTop: '10px', transition: 'background 0.2s' }}>
            {loading ? 'Executing Network Handshake...' :
             viewState === 'login' ? 'Authenticate Session' :
             viewState === 'register' ? 'Register Account Profile' :
             viewState === 'forgot' ? 'Request Recovery Link' : 'Commit New Credentials'}
          </button>
        </form>

        {/* MESSAGING FEEDBACK TOAST MODAL LOG */}
        {message && (
          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', background: message.includes('✅') || message.includes('📩') ? '#30d15811' : '#ff453a11', color: message.includes('✅') || message.includes('📩') ? '#30d158' : '#ff453a', border: `1px solid ${message.includes('✅') || message.includes('📩') ? '#30d15833' : '#ff453a33'}` }}>
            {message}
          </div>
        )}

        {/* LOWER ROUTING TOGGLE NAVIGATION MARGINS */}
        <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', fontSize: '13px', color: '#8e8e93', borderTop: '1px solid #2c2c2e', paddingTop: '20px' }}>

          {viewState === 'login' && (
            <>
              <span onClick={() => { setViewState('register'); setMessage(''); }} style={{ color: '#0a84ff', cursor: 'pointer', textDecoration: 'underline' }}>
                Need an account? Register cluster node here
              </span>
              <span onClick={() => { setViewState('forgot'); setMessage(''); }} style={{ color: '#ff9f0a', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot Password or Security Token?
              </span>
            </>
          )}

          {viewState !== 'login' && (
            <span onClick={() => { setViewState('login'); setMessage(''); }} style={{ color: '#0a84ff', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}>
              ⬅️ Return to Sign-In Control Deck
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;