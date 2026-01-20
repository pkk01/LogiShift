import axios from 'axios'
import { Calendar, Edit2, MapPin, Package, Truck, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import DeliveryStatusTimeline from '../../components/DeliveryStatusTimeline'
import { apiUrl } from '../../utils/apiBase'
import { formatDate } from '../../utils/dateFormat'

interface Driver {
  id: string
  name: string
  email: string
  contact_number: string
  role: string
}

interface Delivery {
  id: string
  user_id: string
  user_name: string
  user_email: string
  driver_id?: string
  driver_name?: string
  driver_contact?: string
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

export default function AdminDeliveries() {
  const [items, setItems] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(false)
  const [assigningDriver, setAssigningDriver] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [modalMode, setModalMode] = useState<'status' | 'driver'>('status')

  const statusOptions = ['Pending', 'Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled']

  const fetchDeliveries = () => {
    const token = localStorage.getItem('access_token')
    axios.get(apiUrl('/admin/deliveries/'), { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
  }

  const fetchDrivers = () => {
    const token = localStorage.getItem('access_token')
    axios.get(apiUrl('/admin/users/'), { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const driverList = res.data.filter((u: any) => u.role === 'driver')
        setDrivers(driverList)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchDeliveries()
    fetchDrivers()
  }, [])

  const handleUpdateStatus = async () => {
    if (!selectedDelivery || !newStatus) return

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      await axios.put(
        apiUrl(`/admin/delivery/${selectedDelivery.id}/`),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchDeliveries()
      setSelectedDelivery(null)
      setNewStatus('')
      alert('Delivery status updated successfully')
    } catch (err) {
      alert('Failed to update status')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignDriver = async () => {
    if (!selectedDelivery || !selectedDriver) return

    setAssigningDriver(true)
    try {
      const token = localStorage.getItem('access_token')
      await axios.post(
        apiUrl(`/admin/delivery/${selectedDelivery.id}/assign-driver/`),
        { driver_id: selectedDriver },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchDeliveries()
      setSelectedDelivery(null)
      setSelectedDriver('')
      alert('Driver assigned successfully')
    } catch (err) {
      alert('Failed to assign driver')
      console.error(err)
    } finally {
      setAssigningDriver(false)
    }
  }

  const openStatusModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setNewStatus(delivery.status)
    setModalMode('status')
  }

  const openDriverModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setSelectedDriver(delivery.driver_id || '')
    setModalMode('driver')
  }

  const filteredItems = filterStatus 
    ? items.filter(d => d.status === filterStatus)
    : items

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Package className="w-8 h-8" /> Manage Deliveries
        </h1>
        <div className="text-sm text-textSecondary">
          Total: {filteredItems.length} deliveries
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-surface rounded-lg p-4 border border-gray-200">
        <label className="block text-sm font-medium text-textPrimary mb-2">Filter by Status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Deliveries List */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="bg-surface rounded-xl p-10 text-center border border-gray-200 shadow">
            <p className="text-textSecondary">No deliveries found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((d) => (
              <div
                key={d.id}
                className="group bg-surface rounded-2xl border-2 border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
              >
                {/* Status Banner */}
                <div
                  className={`px-5 py-3 flex items-center justify-between ${
                    d.status === 'Delivered' ? 'bg-gradient-to-r from-success to-secondary' :
                    d.status === 'Cancelled' ? 'bg-gradient-to-r from-error to-red-600' :
                    d.status === 'In Transit' || d.status === 'Out for Delivery' ? 'bg-gradient-to-r from-primary to-blue-600' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}
                >
                  <span className="text-white font-bold text-sm flex items-center gap-2 uppercase tracking-wide">
                    <Package className="w-4 h-4" /> {d.status}
                  </span>
                  <button
                    onClick={() => openStatusModal(d)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                    title="Update Status"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Tracking & User */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-textSecondary font-semibold uppercase tracking-wide">Tracking</p>
                      <p className="font-mono font-bold text-primary text-sm truncate">{d.tracking_number}</p>
                      <p className="text-xs text-textSecondary flex items-center gap-1 mt-1"><User className="w-3.5 h-3.5" /> {d.user_name}</p>
                    </div>
                  </div>

                  {/* Driver Info */}
                  {d.driver_name ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-textSecondary font-semibold uppercase">Assigned Driver</p>
                        <p className="font-semibold text-green-700 text-sm">{d.driver_name}</p>
                        <p className="text-xs text-textSecondary">{d.driver_contact || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary font-semibold uppercase">No Driver Assigned</p>
                        <p className="text-xs text-yellow-700">Click assign to add a driver</p>
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-success mt-0.5" />
                      <div>
                        <p className="text-xs text-textSecondary font-semibold uppercase">From</p>
                        <p className="text-sm text-textPrimary leading-snug">{d.pickup_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-error mt-0.5" />
                      <div>
                        <p className="text-xs text-textSecondary font-semibold uppercase">To</p>
                        <p className="text-sm text-textPrimary leading-snug">{d.delivery_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-textSecondary font-semibold uppercase">Weight</p>
                      <p className="text-sm text-textPrimary font-semibold">{d.weight || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-textSecondary font-semibold uppercase">Type</p>
                      <p className="text-sm text-textPrimary font-semibold">{d.package_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-textSecondary uppercase font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" /> Pickup</p>
                      <p className="text-sm text-textPrimary">{formatDate(d.pickup_date)}</p>
                    </div>
                    {d.delivery_date && (
                      <div>
                        <p className="text-xs text-textSecondary uppercase font-semibold flex items-center gap-1"><Calendar className="w-3 h-3" /> Delivery</p>
                        <p className="text-sm text-textPrimary">{formatDate(d.delivery_date)}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => openStatusModal(d)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" /> Status
                    </button>
                    <button
                      onClick={() => openDriverModal(d)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-sm"
                    >
                      <Truck className="w-4 h-4" /> Driver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Status or Driver Assignment */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-textPrimary">
                {modalMode === 'status' ? 'Update Delivery Status' : 'Assign Driver'}
              </h2>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-xs text-textSecondary uppercase font-semibold">Tracking Number</label>
                <p className="text-lg font-mono font-bold text-primary">{selectedDelivery.tracking_number}</p>
              </div>
              <div>
                <label className="text-xs text-textSecondary uppercase font-semibold">Customer</label>
                <p className="text-lg font-semibold text-textPrimary">{selectedDelivery.user_name}</p>
                <p className="text-sm text-textSecondary">{selectedDelivery.user_email}</p>
              </div>
            </div>

            {modalMode === 'status' ? (
              <>
                {/* Current Status Timeline */}
                <div className="mb-6">
                  <DeliveryStatusTimeline
                    currentStatus={selectedDelivery.status}
                    pickupDate={selectedDelivery.pickup_date}
                    deliveryDate={selectedDelivery.delivery_date}
                  />
                </div>

                {/* Status Update Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Select New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
                      disabled={loading || newStatus === selectedDelivery.status}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Status'}
                    </button>
                    <button
                      onClick={() => setSelectedDelivery(null)}
                      className="flex-1 bg-gray-200 text-textPrimary py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Driver Assignment Form */}
                <div className="space-y-4">
                  {selectedDelivery.driver_name && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-textSecondary mb-2">Currently Assigned:</p>
                      <p className="text-lg font-semibold text-green-700">{selectedDelivery.driver_name}</p>
                      <p className="text-sm text-green-600">{selectedDelivery.driver_contact}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-textPrimary mb-2">
                      Select Driver
                    </label>
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Choose a driver --</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.contact_number})
                        </option>
                      ))}
                    </select>
                    {drivers.length === 0 && (
                      <p className="text-xs text-error mt-2">⚠ No drivers available. Please create driver accounts first.</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAssignDriver}
                      disabled={assigningDriver || !selectedDriver}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {assigningDriver ? 'Assigning...' : 'Assign Driver'}
                    </button>
                    <button
                      onClick={() => setSelectedDelivery(null)}
                      className="flex-1 bg-gray-200 text-textPrimary py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
