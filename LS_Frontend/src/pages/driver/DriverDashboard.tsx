import axios from 'axios'
import { Calendar, CheckCircle, MapPin, Package, Phone, Truck, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import DeliveryStatusTimeline from '../../components/DeliveryStatusTimeline'
import { apiUrl } from '../../utils/apiBase'
import { formatDate } from '../../utils/dateFormat'

interface Delivery {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_contact?: string
  driver_id: string
  driver_name: string
  status: string
  pickup_address: string
  delivery_address: string
  weight: string
  package_type: string
  pickup_date: string
  delivery_date?: string
  tracking_number: string
  created_at: string
}

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  const isBrowser = typeof window !== 'undefined'
  const cachedName = isBrowser ? localStorage.getItem('user_name') : null
  const displayName = cachedName || 'Driver'

  const statusOptions = ['Out for Delivery', 'Delivered', 'Cancelled']

  useEffect(() => {
    fetchAssignedDeliveries()
  }, [])

  const fetchAssignedDeliveries = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get(apiUrl('/driver/deliveries/'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDeliveries(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch deliveries:', err)
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedDelivery || !newStatus) return

    setUpdatingStatus(true)
    try {
      const token = localStorage.getItem('access_token')
      await axios.put(
        apiUrl(`/driver/deliveries/${selectedDelivery.id}/status/`),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchAssignedDeliveries()
      setSelectedDelivery(null)
      setNewStatus('')
      alert('Delivery status updated successfully')
    } catch (err) {
      alert('Failed to update status')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const openStatusModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setNewStatus(statusOptions.includes(delivery.status) ? delivery.status : statusOptions[0])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'from-success to-secondary'
      case 'Out for Delivery':
      case 'In Transit':
        return 'from-primary to-blue-600'
      case 'Picked Up':
        return 'from-blue-500 to-cyan-600'
      case 'Scheduled':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const filteredDeliveries = filterStatus
    ? deliveries.filter(d => d.status === filterStatus)
    : deliveries

  const statsData = {
    total: deliveries.length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
    inProgress: deliveries.filter(d => ['In Transit', 'Out for Delivery', 'Picked Up'].includes(d.status)).length,
    pending: deliveries.filter(d => d.status === 'Scheduled').length,
  }

  if (loading) {
    return <div className="text-center text-textSecondary py-10">Loading driver dashboard...</div>
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-100 text-base">Welcome back,</p>
                <h1 className="text-4xl font-bold">Hi, {displayName}!</h1>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-1">Driver workspace · streamlined for speed</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-blue-100 text-sm">Status: signed in</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase">Total Assigned</p>
              <p className="text-4xl font-bold text-blue-900 mt-2">{statsData.total}</p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase">Delivered</p>
              <p className="text-4xl font-bold text-green-900 mt-2">{statsData.delivered}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-600 uppercase">In Progress</p>
              <p className="text-4xl font-bold text-orange-900 mt-2">{statsData.inProgress}</p>
            </div>
            <Truck className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-600 uppercase">Pending</p>
              <p className="text-4xl font-bold text-yellow-900 mt-2">{statsData.pending}</p>
            </div>
            <Calendar className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-surface rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-textPrimary mb-3">Filter by Status</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === ''
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-gradient-to-br from-surface to-gray-50 p-14 rounded-2xl text-center border-2 border-dashed border-gray-300 shadow-xl">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-5">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-textPrimary mb-3">No Deliveries</h3>
          <p className="text-textSecondary text-base">
            {filterStatus
              ? `No deliveries with status "${filterStatus}"`
              : 'No deliveries assigned to you yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredDeliveries.map((d, idx) => (
            <div
              key={d.id}
              className="group bg-surface rounded-2xl border-2 border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Status Banner */}
              <div className={`bg-gradient-to-r ${getStatusColor(d.status)} px-6 py-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {d.status}
                  </span>
                  <button
                    onClick={() => openStatusModal(d)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                    title="Update Status"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 space-y-5">
                {/* Tracking & Customer */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-textSecondary font-semibold uppercase">Tracking</p>
                    <p className="font-mono font-bold text-primary text-base">{d.tracking_number}</p>
                    <p className="text-xs text-textSecondary flex items-center gap-1 mt-1">
                      <User className="w-3.5 h-3.5" /> {d.user_name}
                    </p>
                  </div>
                </div>

                {/* Customer Contact */}
                <div className="space-y-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-textSecondary font-semibold uppercase">Customer Details</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-green-700">{d.user_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-green-700">{d.user_contact}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-textSecondary font-semibold uppercase">Pickup From</p>
                      <p className="text-base text-textPrimary font-semibold leading-snug">{d.pickup_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-textSecondary font-semibold uppercase">Deliver To</p>
                      <p className="text-base text-textPrimary font-semibold leading-snug">{d.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-textSecondary font-semibold uppercase">Weight</p>
                    <p className="text-base text-textPrimary font-semibold">{d.weight || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary font-semibold uppercase">Type</p>
                    <p className="text-base text-textPrimary font-semibold">{d.package_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary font-semibold uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Pickup
                    </p>
                    <p className="text-base text-textPrimary">{formatDate(d.pickup_date)}</p>
                  </div>
                  {d.delivery_date && (
                    <div>
                      <p className="text-xs text-textSecondary font-semibold uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Delivered
                      </p>
                      <p className="text-base text-textPrimary">{formatDate(d.delivery_date)}</p>
                    </div>
                  )}
                </div>

                {/* Update Status Button */}
                <button
                  onClick={() => openStatusModal(d)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" /> Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-textPrimary">Update Delivery Status</h2>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-2.5 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Delivery Timeline */}
            <div className="mb-6">
              <DeliveryStatusTimeline
                currentStatus={selectedDelivery.status}
                pickupDate={selectedDelivery.pickup_date}
                deliveryDate={selectedDelivery.delivery_date}
              />
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <label className="text-xs text-textSecondary uppercase font-semibold">Tracking</label>
                <p className="text-lg font-mono font-bold text-primary mt-1">{selectedDelivery.tracking_number}</p>
              </div>
              <div>
                <label className="text-xs text-textSecondary uppercase font-semibold">Customer</label>
                <p className="text-lg font-semibold text-textPrimary mt-1">{selectedDelivery.user_name}</p>
                <p className="text-sm text-textSecondary">{selectedDelivery.user_email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-textSecondary uppercase font-semibold">Pickup Location</label>
                <p className="text-base text-textPrimary mt-1">{selectedDelivery.pickup_address}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-textSecondary uppercase font-semibold">Delivery Location</label>
                <p className="text-base text-textPrimary mt-1">{selectedDelivery.delivery_address}</p>
              </div>
            </div>

            {/* Status Update Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-textPrimary mb-2">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === selectedDelivery.status}
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? 'Updating...' : 'Confirm Update'}
                </button>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="flex-1 bg-gray-200 text-textPrimary py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
