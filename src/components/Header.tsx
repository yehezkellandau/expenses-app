import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, logout } from '@/services/auth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-gray-500 relative z-50 w-full">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center p-4 h-16">
        {/* Logo */}
        <h1>
          <NavLink className="inline-block text-white text-xl font-bold" to="/">
            Expenses App
          </NavLink>
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {!token ? (
              <>
                <li>
                  <NavLink className="text-sm text-white hover:text-blue-400" to="/login">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-sm text-white hover:text-blue-400" to="/signup">
                    Sign up
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink className="text-sm text-white hover:text-blue-400" to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className="text-sm text-white hover:text-blue-400" to="/list">
                    List
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-300 hover:text-red-500"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>


        {/* Menu Button (mobile, only when closed) */}
        {!menuOpen && (
          <button
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`fixed top-0 right-0 w-64 h-full bg-gray-600 transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        {/* Close Button inside Menu */}
        <div className="flex justify-end p-4">
          <button
            className="text-white p-2 focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col items-center text-center p-4 space-y-2">
          {!token ? (
            <>
              <li>
                <NavLink
                  className="block text-sm text-white hover:text-blue-400 py-2"
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block text-sm text-white hover:text-blue-400 py-2"
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  className="block text-sm text-white hover:text-blue-400 py-2"
                  to="/"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block text-sm text-white hover:text-blue-400 py-2"
                  to="/list"
                  onClick={() => setMenuOpen(false)}
                >
                  List
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-300 hover:text-red-500 py-2"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
