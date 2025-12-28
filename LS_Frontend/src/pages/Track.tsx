import axios from 'axios'
import { CheckCircle2, MapPin, Package, Phone, Search, Truck, XCircle } from 'lucide-react'
import { useState } from 'react'
import DeliveryStatusTimeline from '../components/DeliveryStatusTimeline'
import { COUNTRY_CODES, format10DigitPhone, isValid10DigitPhone } from '../utils/phoneFormat'

export default function Track() {
  const [searchType, setSearchType] = useState<'tracking' | 'phone'>('tracking')
  const [tracking, setTracking] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      let res
      if (searchType === 'tracking') {
        if (!tracking.trim()) {
          setError('Please enter a tracking number.')
          setLoading(false)
          return
        }
        res = await axios.get(`/api/track/${tracking}/`)
      } else {
        if (!isValid10DigitPhone(phone)) {
          setError('Please enter exactly 10 digits.')
          setLoading(false)
          return
        }
        res = await axios.get(`/api/track-by-phone/${phone}/`)
      }
      setData(res.data)
    } catch (err: any) {
      setData(null)
      const errorMsg = err.response?.data?.detail || 
                       (searchType === 'tracking' 
                         ? 'Tracking number not found. Please check and try again.'
                         : 'No shipments found for this phone number.')
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Track Package</h1>
          <p className="text-sm text-blue-100">Enter tracking number for real-time updates</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg border border-gray-200 shadow-md overflow-hidden">
          {/* Tab Toggle */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setSearchType('tracking')
                setPhone('')
                setError('')
              }}
              className={`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                searchType === 'tracking'
                  ? 'bg-primary text-white'
                  : 'text-textSecondary hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Tracking Number
            </button>
            <button
              onClick={() => {
                setSearchType('phone')
                setTracking('')
                setError('')
              }}
              className={`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                searchType === 'phone'
                  ? 'bg-primary text-white'
                  : 'text-textSecondary hover:bg-gray-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone Number
            </button>
          </div>

          {/* Form */}
          <div className="p-5">
            <form onSubmit={submit} className="space-y-3">
              {searchType === 'tracking' ? (
                <div>
                  <label className="text-xs font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value.toUpperCase())}
                    placeholder="e.g., LS-1234567890"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-textPrimary mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all bg-white"
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(format10DigitPhone(e.target.value))}
                      placeholder="1234567890"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-textSecondary mt-1">Enter 10-digit phone number</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-error/10 to-red-50 border border-error/30 text-error px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="font-semibold text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="max-w-4xl mx-auto animate-fadeIn">
          {/* Info Card */}
          <div className="bg-surface rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl mb-6">
            {/* Status Banner */}
            <div className={`px-8 py-6 ${
              data.status === 'Delivered' ? 'bg-gradient-to-r from-success to-secondary' :
              data.status === 'Cancelled' ? 'bg-gradient-to-r from-error to-red-600' :
              data.status === 'In Transit' || data.status === 'Out for Delivery' ? 'bg-gradient-to-r from-primary to-blue-600' :
              'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    {data.status === 'Delivered' ? <CheckCircle2 className="w-7 h-7" /> : <Truck className="w-7 h-7" />}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider font-semibold opacity-90">Current Status</p>
                    <h2 className="text-3xl font-bold">{data.status}</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Tracking Number</p>
                  <p className="text-2xl font-mono font-bold">{data.tracking_number}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-success" />
                  Pickup Location
                </h3>
                <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
                  <p className="text-textPrimary font-medium">{data.pickup_address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-error" />
                  Delivery Location
                </h3>
                <div className="p-4 bg-error/5 border border-error/20 rounded-xl">
                  <p className="text-textPrimary font-medium">{data.delivery_address}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-textSecondary font-semibold uppercase tracking-wide">Package Weight</p>
                <p className="text-lg text-textPrimary font-bold">{data.weight || 'N/A'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-textSecondary font-semibold uppercase tracking-wide">Package Type</p>
                <p className="text-lg text-textPrimary font-bold">{data.package_type || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <DeliveryStatusTimeline
            currentStatus={data.status}
            created_at={data.created_at}
            pickup_date={data.pickup_date}
            delivered_at={data.delivered_at}
          />
        </div>
      )}
    </div>
  )
}
