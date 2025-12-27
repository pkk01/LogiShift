import axios from 'axios'
import { Mail, MapPin, Package, Phone, Settings, Shield, TrendingUp, Truck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const role = localStorage.getItem('role')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    axios.get('/api/profile/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
  }, [])

  // Admin Dashboard
  if (role === 'admin') {
    return (
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">System Overview</h1>
              <p className="text-slate-300 text-base">Monitor and manage your logistics platform</p>
            </div>
          </div>
        </div>

        {/* Admin Welcome Card */}
        {profile && (
          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-slate-500 text-sm font-medium mb-2">Welcome back,</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{profile.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.contact_number && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-amber-500" />
                      <span>{profile.contact_number}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex-shrink-0 border border-amber-200">
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href="/admin/users" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-amber-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Users</h3>
                <p className="text-sm text-slate-500">125 Active</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">Manage user accounts</div>
          </a>
          <a href="/admin/deliveries" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-amber-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Deliveries</h3>
                <p className="text-sm text-slate-500">All Shipments</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">Track all orders</div>
          </a>
          <a href="/profile" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-amber-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Settings</h3>
                <p className="text-sm text-slate-500">Preferences</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">System configuration</div>
          </a>
        </div>
      </div>
    )
  }

  // Driver Dashboard
  if (role === 'driver') {
    return (
      <div className="space-y-6">
        {/* Driver Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <Truck className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">Today's Routes</h1>
              <p className="text-emerald-100 text-base">Your delivery schedule and assignments</p>
            </div>
          </div>
        </div>

        {/* Driver Welcome Card */}
        {profile && (
          <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-slate-500 text-sm font-medium mb-2">Welcome back,</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{profile.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.contact_number && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span>{profile.contact_number}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl flex-shrink-0 border border-emerald-200">
                <Truck className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
          </div>
        )}

        {/* Driver Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href="/driver/dashboard" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-emerald-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Deliveries</h3>
                <p className="text-sm text-slate-500">8 Pending</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">View assigned orders</div>
          </a>
          <a href="/track" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-emerald-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Navigation</h3>
                <p className="text-sm text-slate-500">Track Route</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">GPS tracking</div>
          </a>
          <a href="/profile" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-emerald-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Profile</h3>
                <p className="text-sm text-slate-500">My Account</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">Update details</div>
          </a>
        </div>
      </div>
    )
  }

  // User Dashboard
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
            <Package className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">My Shipments</h1>
            <p className="text-blue-100 text-base">Track and manage your delivery orders</p>
          </div>
        </div>
      </div>

      {/* User Welcome Card */}
      {profile && (
        <div className="bg-white rounded-2xl p-7 shadow-lg border border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-2">Welcome back,</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{profile.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{profile.email}</span>
                </div>
                {profile.contact_number && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>{profile.contact_number}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex-shrink-0 border border-blue-200">
              <Package className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* User Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <a href="/new-delivery" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-blue-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">New Order</h3>
              <p className="text-sm text-slate-500">Create Shipment</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Ship your package</div>
        </a>
        <a href="/deliveries" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-blue-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">My Orders</h3>
              <p className="text-sm text-slate-500">Active Shipments</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">View all deliveries</div>
        </a>
        <a href="/track" className="group bg-white hover:bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-200 transition-all hover:shadow-xl hover:border-blue-300">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Track</h3>
              <p className="text-sm text-slate-500">Live Tracking</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Real-time updates</div>
        </a>
      </div>
    </div>
  )
}
