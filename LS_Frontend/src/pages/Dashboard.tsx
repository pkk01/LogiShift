import axios from 'axios'
import { Mail, MapPin, Package, Phone, Settings, Shield, TrendingUp, Truck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const role = localStorage.getItem('role')
  const cachedName = localStorage.getItem('user_name')
  const displayName = profile?.name || cachedName || 'LogiShift member'

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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-100 text-xs font-semibold uppercase tracking-wide mb-2">
                Admin workspace
              </div>
              <h1 className="text-4xl font-bold mb-1">Hello, {displayName}</h1>
              <p className="text-slate-300 text-base">Orchestrate users, drivers, and deliveries from one command center.</p>
            </div>
          </div>
          <div className="relative grid sm:grid-cols-3 gap-3 mt-6">
            {["Users", "Deliveries", "Assignments"].map((label, idx) => (
              <div key={label} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 shadow-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20' : idx === 1 ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`}>
                  {idx === 0 && <Users className="w-5 h-5 text-white" />}
                  {idx === 1 && <Package className="w-5 h-5 text-white" />}
                  {idx === 2 && <Truck className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-200">{label}</p>
                  <p className="text-sm text-white/80">Live overview</p>
                </div>
              </div>
            ))}
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
                <p className="text-sm text-slate-500">Directories, roles, access</p>
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
                <p className="text-sm text-slate-500">Pipeline, SLAs, triage</p>
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
                <p className="text-sm text-slate-500">Policy & configuration</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">System configuration</div>
          </a>
        </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Today&apos;s focus</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Review stuck deliveries and escalate assignments.</li>
                <li>• Approve new drivers and validate documents.</li>
                <li>• Monitor unread notifications from users.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50 to-orange-100 p-5 shadow-md">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Shortcuts</p>
              <div className="flex flex-wrap gap-2 text-sm font-semibold text-amber-800">
                <a className="px-3 py-2 rounded-lg bg-white/60 hover:bg-white" href="/admin/deliveries">View board</a>
                <a className="px-3 py-2 rounded-lg bg-white/60 hover:bg-white" href="/admin/users">Invite user</a>
                <a className="px-3 py-2 rounded-lg bg-white/60 hover:bg-white" href="/profile">Account</a>
              </div>
            </div>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-semibold uppercase tracking-wide mb-2">
                  Driver workspace
                </div>
                <h1 className="text-4xl font-bold mb-1">Hi, {displayName}</h1>
                <p className="text-emerald-100 text-base">Stay on top of routes, status updates, and proof of delivery.</p>
            </div>
          </div>
            <div className="relative grid sm:grid-cols-3 gap-3 mt-6">
              {["Assigned", "In-progress", "Delivered"].map((label, idx) => (
                <div key={label} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 shadow-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-emerald-500/20' : idx === 1 ? 'bg-teal-500/20' : 'bg-white/20'}`}>
                    {idx === 0 && <Package className="w-5 h-5 text-white" />}
                    {idx === 1 && <MapPin className="w-5 h-5 text-white" />}
                    {idx === 2 && <Truck className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-50">{label}</p>
                    <p className="text-sm text-white/80">Live board</p>
                  </div>
                </div>
              ))}
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
                <p className="text-sm text-slate-500">Assignments & proofs</p>
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
                <p className="text-sm text-slate-500">Best route view</p>
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
                <p className="text-sm text-slate-500">Docs & payout info</p>
              </div>
            </div>
            <div className="text-xs text-slate-400">Update details</div>
          </a>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Today&apos;s checklist</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Confirm pickups and mark status promptly.</li>
              <li>• Share delivery notes in the status update modal.</li>
              <li>• Keep contact details current for dispatch.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 to-green-100 p-5 shadow-md">
            <p className="text-xs font-semibold text-emerald-700 uppercase mb-2">Shortcuts</p>
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-emerald-800">
              <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/driver/dashboard">My board</a>
              <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/track">Track</a>
              <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/profile">Profile</a>
            </div>
          </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold uppercase tracking-wide mb-2">
              Customer workspace
            </div>
            <h1 className="text-4xl font-bold mb-1">Hi, {displayName}</h1>
            <p className="text-blue-100 text-base">Create, monitor, and track every shipment with clarity.</p>
          </div>
        </div>
        <div className="relative grid sm:grid-cols-3 gap-3 mt-6">
          {["New shipment", "Active", "Delivered"].map((label, idx) => (
            <div key={label} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 shadow-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-white/20' : idx === 1 ? 'bg-indigo-500/30' : 'bg-blue-500/30'}`}>
                {idx === 0 && <Package className="w-5 h-5 text-white" />}
                {idx === 1 && <TrendingUp className="w-5 h-5 text-white" />}
                {idx === 2 && <Truck className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-50">{label}</p>
                <p className="text-sm text-white/80">Quick access</p>
              </div>
            </div>
          ))}
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
                <p className="text-sm text-slate-500">Active & history</p>
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
                <p className="text-sm text-slate-500">Live & public links</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">Real-time updates</div>
        </a>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Helpful tips</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Use "New Order" to book in under a minute.</li>
            <li>• Check "My Orders" for live statuses and ETAs.</li>
            <li>• Share tracking links from the Track page with recipients.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-100 p-5 shadow-md">
          <p className="text-xs font-semibold text-indigo-700 uppercase mb-2">Shortcuts</p>
          <div className="flex flex-wrap gap-2 text-sm font-semibold text-indigo-800">
            <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/new-delivery">Create</a>
            <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/deliveries">Orders</a>
            <a className="px-3 py-2 rounded-lg bg-white/70 hover:bg-white" href="/track">Track</a>
          </div>
        </div>
      </div>
    </div>
  )
}
