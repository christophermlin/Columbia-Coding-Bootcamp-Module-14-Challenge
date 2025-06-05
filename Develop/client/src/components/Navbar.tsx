import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [ loginCheck, setLoginCheck ] = useState(false);

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck])

  // Helper to get username from JWT profile
  const getUsername = () => {
    const profile = auth.getProfile();
    if (profile && typeof profile === 'object' && 'username' in profile) {
      return (profile as any).username;
    }
    return '';
  };

  return (
    <div className='nav'>
      <div className='nav-title' style={{ color: '#5a3a1b' }}>
        <Link to='/'>Krazy Kanban Board</Link>
      </div>
      <ul style={{ display: 'flex', gap: '16px' }}>
        <li className='nav-item'>
          <button type='button'>
            <Link to='/create'>New Ticket</Link>
          </button>
        </li>
        {loginCheck && (
          <li className='nav-item'>
            <button type='button' style={{ background: '#5aac44', color: '#fff', borderRadius: 8, border: '1px solid transparent', fontWeight: 500, fontSize: '1em', fontFamily: 'inherit', padding: '0.6em 1.2em', cursor: 'pointer', transition: 'background 0.2s, border-color 0.25s' }}>
              {`Welcome, ${getUsername()}!`}
            </button>
          </li>
        )}
        {
          !loginCheck ? (
            <li className='nav-item'>
              <button type='button'>
                <Link to='/login'>Login</Link>
              </button>
            </li>
          ) : (
            <li className='nav-item'>
              <button type='button' onClick={() => {
                auth.logout();
              }}>Logout</button>
            </li>
          )
        }
      </ul>
    </div>
  )
}

export default Navbar;
