import { useState, FormEvent, ChangeEvent } from "react";

import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const token = await login(loginData);
      Auth.login(token); // This will redirect
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px #0001', borderRadius: 8 }}>
        <h1 style={{ color: '#5a3a1b' }}>Login</h1>
        <label style={{ color: '#5a3a1b' }}>Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username || ''}
          onChange={handleChange}
          style={{ color: '#222', background: '#f4f5f7', border: '1px solid #ccc' }}
        />
        <label style={{ color: '#5a3a1b' }}>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password || ''}
          onChange={handleChange}
          style={{ color: '#222', background: '#f4f5f7', border: '1px solid #ccc' }}
        />
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type='submit' style={{ background: '#5aac44', color: '#fff', marginTop: 16, borderRadius: 8, border: '1px solid transparent', fontWeight: 500, fontSize: '1em', fontFamily: 'inherit', padding: '0.6em 1.2em', cursor: 'pointer', transition: 'background 0.2s, border-color 0.25s' }}>Submit Form</button>
      </form>
    </div>
  )
};

export default Login;
