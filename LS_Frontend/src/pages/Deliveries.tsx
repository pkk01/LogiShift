import axios from 'axios'
import { Edit2, Eye, IndianRupee, MapPin, Package, Phone, Truck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeliveryStatusTimeline from '../components/DeliveryStatusTimeline'
import { formatDateTime } from '../utils/dateFormat'
import { formatPrice } from '../utils/priceFormat'

interface Delivery {
  id: string
  status: string
  pickup_address: string
  delivery_address: string
  weight: number
  package_type: string
  pickup_date: string
  delivery_date?: string
  tracking_number: string
  price?: number
  distance?: number
  driver_name?: string
  driver_contact?: string
}

export default function Deliveries() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    axios.get('/api/deliveries/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setItems(res.data)
        setLoading(false)
      })
      .catch(() => {
        setItems([])
        setLoading(false)
      })
  }, [])

  const handleEdit = (delivery: Delivery) => {
    navigate(`/deliveries/${delivery.id}`, { state: { delivery, mode: 'edit' } })
  }

  const handleCancel = async (deliveryId: string) => {
    if (!window.confirm('Are you sure you want to cancel this delivery?')) return

    try {
      const token = localStorage.getItem('access_token')
      await axios.post(`/api/deliveries/${deliveryId}/cancel/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(items.filter(d => d.id !== deliveryId))
      setSelectedDelivery(null)
      alert('Delivery cancelled successfully')
    } catch (err) {
      alert('Failed to cancel delivery')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-textSecondary">Loading deliveries...</div>
  }

  return (
    <div className="space-y-9 pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              My Deliveries
            </h1>
            <p className="text-blue-100 text-base">Track and manage your shipments</p>
          </div>
          <button
            onClick={() => navigate('/order-history')}
            className="px-6 py-3 bg-white text-primary rounded-xl hover:bg-blue-50 transition-all font-semibold text-base shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            History
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-gradient-to-br from-surface to-gray-50 p-14 rounded-2xl text-center border-2 border-dashed border-gray-300 shadow-xl">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-5">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-textPrimary mb-3">No Active Deliveries</h3>
          <p className="text-textSecondary mb-6 text-base">Start by creating your first shipment</p>
          <button
            onClick={() => navigate('/new-delivery')}
            className="inline-flex items-center gap-3 px-9 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-semibold text-base"
          >
            <Package className="w-6 h-6" />
            Create New Delivery
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {items.map((d, idx) => (
            <div 
              key={d.id} 
              className="group bg-surface rounded-2xl border-2 border-gray-100 hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Status Badge Header */}
              <div className={`px-6 py-4 ${d.status === 'Delivered' ? 'bg-gradient-to-r from-success to-secondary' : d.status === 'Cancelled' ? 'bg-gradient-to-r from-error to-red-600' : d.status === 'In Transit' || d.status === 'Out for Delivery' ? 'bg-gradient-to-r from-primary to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {d.status}
                  </span>
                  <button
                    onClick={() => setSelectedDelivery(d)}
                    className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 space-y-5">
                {/* Tracking Number */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-textSecondary font-medium uppercase">Tracking</p>
                    <p className="font-mono font-bold text-primary text-base">{d.tracking_number}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-textSecondary font-medium uppercase">From</p>
                      <p className="text-base text-textPrimary truncate font-semibold">{d.pickup_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-textSecondary font-medium uppercase">To</p>
                      <p className="text-base text-textPrimary truncate font-semibold">{d.delivery_address}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-textSecondary font-medium uppercase">Weight</p>
                      <p className="text-base text-textPrimary font-semibold">{d.weight ? `${d.weight} kg` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-textSecondary font-medium uppercase">Type</p>
                      <p className="text-base text-textPrimary font-semibold">{d.package_type || 'N/A'}</p>
                    </div>
                    {d.price && (
                      <div className="col-span-2">
                        <p className="text-xs text-textSecondary font-medium uppercase flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          Price
                        </p>
                        <p className="text-lg text-primary font-bold">{formatPrice(d.price)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {d.status !== 'Delivered' && d.status !== 'Cancelled' && d.status !== 'In Transit' && d.status !== 'Out for Delivery' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(d)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-primary hover:bg-primary/10 rounded-lg transition-all text-sm font-semibold border border-primary/20"
                    >
                      <Edit2 className="w-5 h-5" /> Edit
                    </button>
                    <button
                      onClick={() => handleCancel(d.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-error hover:bg-error/10 rounded-lg transition-all text-sm font-semibold border border-error/20"
                    >
                      <X className="w-5 h-5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-surface rounded-2xl p-7 max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-textPrimary">Delivery Details</h2>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-textPrimary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Timeline */}
              <DeliveryStatusTimeline
                currentStatus={selectedDelivery.status}
                pickupDate={selectedDelivery.pickup_date}
                deliveryDate={selectedDelivery.delivery_date}
              />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-base">
                <div>
                  <label className="text-xs text-textSecondary uppercase font-semibold">Tracking</label>
                  <p className="font-mono font-bold text-primary text-lg">{selectedDelivery.tracking_number}</p>
                </div>
                <div>
                  <label className="text-xs text-textSecondary uppercase font-semibold">Status</label>
                  <p className="font-semibold text-textPrimary">{selectedDelivery.status}</p>
                </div>
                <div>
                  <label className="text-xs text-textSecondary uppercase font-semibold">Weight</label>
                  <p className="text-textPrimary text-base">{selectedDelivery.weight ? `${selectedDelivery.weight} kg` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-textSecondary uppercase font-semibold">Type</label>
                  <p className="text-textPrimary text-base">{selectedDelivery.package_type || 'N/A'}</p>
                </div>
                {selectedDelivery.distance && (
                  <div>
                    <label className="text-xs text-textSecondary uppercase font-semibold">Distance</label>
                    <p className="text-textPrimary text-base">{selectedDelivery.distance.toFixed(2)} km</p>
                  </div>
                )}
                {selectedDelivery.price && (
                  <div>
                    <label className="text-xs text-textSecondary uppercase font-semibold flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Price
                    </label>
                    <p className="text-lg font-bold text-primary">{formatPrice(selectedDelivery.price)}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-xs text-textSecondary uppercase font-semibold">Pickup</label>
                  <p className="text-textPrimary text-base">{selectedDelivery.pickup_address}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-textSecondary uppercase font-semibold">Delivery</label>
                  <p className="text-textPrimary text-base">{selectedDelivery.delivery_address}</p>
                </div>
                <div>
                  <label className="text-xs text-textSecondary uppercase font-semibold">Pickup Date</label>
                  <p className="text-textPrimary text-base">{formatDateTime(selectedDelivery.pickup_date)}</p>
                </div>
                {selectedDelivery.delivery_date && (
                  <div>
                    <label className="text-xs text-textSecondary uppercase font-semibold">Delivery</label>
                    <p className="text-textPrimary text-base">{formatDateTime(selectedDelivery.delivery_date)}</p>
                  </div>
                )}
              </div>

              {/* Driver Info */}
              {selectedDelivery.driver_name && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 space-y-3">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide">Assigned Driver</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-textPrimary">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{selectedDelivery.driver_name}</span>
                    </div>
                    {selectedDelivery.driver_contact && (
                      <div className="flex items-center gap-2 text-textPrimary">
                        <Phone className="w-5 h-5 text-primary" />
                        <span>{selectedDelivery.driver_contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
                {selectedDelivery.status !== 'Delivered' && selectedDelivery.status !== 'Cancelled' && selectedDelivery.status !== 'In Transit' && selectedDelivery.status !== 'Out for Delivery' && (
                  <>
                    <button
                      onClick={() => {
                        handleEdit(selectedDelivery)
                        setSelectedDelivery(null)
                      }}
                      className="flex-1 bg-primary text-white py-2.5 rounded-lg text-base font-medium hover:bg-primary/90 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleCancel(selectedDelivery.id)
                      }}
                      className="flex-1 bg-error text-white py-2.5 rounded-lg text-base font-medium hover:bg-error/90 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-textPrimary py-2.5 rounded-lg text-base font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
