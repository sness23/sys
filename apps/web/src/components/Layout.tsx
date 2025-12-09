import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Sell Yourself
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/skills" className="text-gray-600 hover:text-gray-900">
              Skills
            </Link>
            <Link to="/needs" className="text-gray-600 hover:text-gray-900">
              Needs
            </Link>

            {user ? (
              <>
                <Link to="/requests" className="text-gray-600 hover:text-gray-900">
                  Requests
                </Link>
                <Link to="/connections" className="text-gray-600 hover:text-gray-900">
                  Friends
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          Sell Yourself &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
