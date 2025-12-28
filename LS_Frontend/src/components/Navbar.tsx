import { BadgeCheck, History, LogOut, Moon, Settings, Sun, Truck, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('access_token')
  const role = localStorage.getItem('role')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    // keep state in sync if theme changes elsewhere
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }
  const isHome = location.pathname === '/' || location.pathname === '/dashboard'
  return (
    <nav className="bg-surface shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className={`${isHome ? 'max-w-6xl' : 'max-w-7xl'} mx-auto px-4`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              LogiShift
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-1">
            {token && role === 'user' && (
              <>
                <Link
                  to="/deliveries"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  My Deliveries
                </Link>
                <Link
                  to="/order-history"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center gap-1"
                >
                  <History className="w-4 h-4" /> History
                </Link>
                <Link
                  to="/new-delivery"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-all shadow-md shadow-primary/20"
                >
                  New Delivery
                </Link>
              </>
            )}
            {token && role === 'driver' && (
              <>
                <Link
                  to="/driver/dashboard"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-md shadow-green-600/20 flex items-center gap-1"
                >
                  <Truck className="w-4 h-4" /> My Deliveries
                </Link>
              </>
            )}
            {token && role === 'admin' && (
              <>
                <Link
                  to="/admin/deliveries"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Manage Deliveries
                </Link>
                <Link
                  to="/admin/users"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Manage Users
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link
              to="/track"
              className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-alert hover:bg-alert/5 rounded-lg transition-all flex items-center gap-1"
            >
              <BadgeCheck className="w-4 h-4" /> Track
            </Link>
            {/* Theme toggle - always visible */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border-2 border-gray-200 hover:bg-primary/5 transition-all"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-textSecondary" />}
            </button>
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-all shadow-md shadow-primary/20"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border-2 border-gray-100 z-50 overflow-hidden">
                    {role === 'admin' ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-textPrimary hover:bg-primary/5 transition-colors border-b border-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          className="flex items-center gap-3 px-4 py-3 text-textPrimary hover:bg-primary/5 transition-colors border-b border-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-primary" />
                          <span className="font-medium">Manage Users</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setShowProfileMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-textPrimary hover:bg-primary/5 transition-colors border-b border-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setShowProfileMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
