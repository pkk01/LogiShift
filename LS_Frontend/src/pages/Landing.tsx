import { Activity, ArrowRight, ArrowUpRight, BadgeCheck, BellRing, Clock3, Globe2, LayoutDashboard, MapPin, ShieldCheck, Sparkles, Truck, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const isBrowser = typeof window !== 'undefined'
  const token = isBrowser ? localStorage.getItem('access_token') : null
  const userName = isBrowser ? localStorage.getItem('user_name') : null
  const role = isBrowser ? localStorage.getItem('role') : null

  const getDashboardPath = () => {
    if (!token) return '/login'
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'driver':
        return '/driver/dashboard'
      case 'support_agent':
        return '/agent/dashboard'
      default:
        return '/dashboard'
    }
  }

  const primaryCta = getDashboardPath()
  const secondaryCta = token ? '/track' : '/register'

  const signalBar = [
    { label: 'NPS', value: '72', note: 'Over the last 90 days' },
    { label: 'Ops Uptime', value: '99.95%', note: 'Across control tower' },
    { label: 'Cities active', value: '120+', note: 'Pan-India coverage' },
    { label: 'Avg. respond', value: '1m 48s', note: 'Pickup confirmation' }
  ]

  const pillars = [
    {
      title: 'Command deck',
      desc: 'See drivers, exceptions, and promised ETAs in one glassy dashboard built for ops speed.',
      icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
      tag: 'Live visibility'
    },
    {
      title: 'Precision pricing',
      desc: 'Weight, distance, and surcharge clarity with audit-ready history and instant quotes.',
      icon: <Zap className="w-5 h-5 text-primary" />,
      tag: 'Finance safe'
    },
    {
      title: 'Signals, not noise',
      desc: 'Proactive alerts to shippers and customers before they ask, not after tickets arrive.',
      icon: <BellRing className="w-5 h-5 text-primary" />,
      tag: 'Customer calm'
    }
  ]

  const roleTracks = [
    {
      title: 'Shippers',
      bullets: ['Book in 60 seconds', 'Share live ETAs with customers', 'Self-serve support window'],
      cta: token ? '/new-delivery' : '/register',
      hue: 'from-primary/15 via-blue-500/5 to-surface'
    },
    {
      title: 'Drivers',
      bullets: ['Clear queue and payouts', 'Two-tap status changes', 'Route hints with distance clarity'],
      cta: token ? '/driver/dashboard' : '/login',
      hue: 'from-emerald-400/15 via-surface to-surface'
    },
    {
      title: 'Admins',
      bullets: ['Network-wide control tower', 'Escalation lanes with owners', 'Usage and SLA insights'],
      cta: token ? '/admin/deliveries' : '/login',
      hue: 'from-amber-400/15 via-surface to-surface'
    }
  ]

  const flow = [
    { title: 'Draft the run', detail: 'Pickup + drop + constraints captured in a single pass.' },
    { title: 'Autopilot assigns', detail: 'Smart picks a driver; ops can override with context.' },
    { title: 'Everyone in sync', detail: 'Stakeholders get the same signal: ETA, proof, changes.' },
    { title: 'Close the loop', detail: 'Proof, charges, and SLA logs land automatically.' }
  ]

  const liveCard = {
    pickup: 'Koramangala, Bengaluru',
    drop: 'BKC, Mumbai',
    eta: '89 mins',
    distance: '28.4 km',
    status: 'Driver confirmed • Heading to pickup'
  }

  return (
    <div className="min-h-screen bg-bg text-textPrimary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-56 -left-24 w-96 h-96 bg-gradient-to-br from-primary/25 via-blue-500/20 to-emerald-300/10 blur-3xl" />
        <div className="absolute top-32 right-0 w-[26rem] h-[26rem] bg-gradient-to-bl from-emerald-400/20 via-primary/10 to-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[18rem] h-[18rem] bg-gradient-to-tr from-primary/10 to-transparent blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16 md:pt-16 md:pb-24 relative">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface shadow-md border border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase tracking-[0.18em]">
            <Sparkles className="w-4 h-4 text-primary" /> Built for modern logistics teams
          </span>
          {token && userName && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold">
              <Users className="w-4 h-4 text-primary" /> Welcome back, {userName}
            </span>
          )}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-blue-500/10 to-emerald-400/10 text-xs font-semibold border border-primary/20">
            <Globe2 className="w-4 h-4 text-primary" /> Pan-India, cloud-first
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div className="space-y-7">
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1]">
              Logistics, but with the calm of a control room.
              <span className="block text-primary">LogiShift keeps every promise visible.</span>
            </h1>
            <p className="text-lg text-textSecondary max-w-2xl leading-relaxed">
              Not another template. A startup-grade experience for ops: sharp typography, glass panels, and bold gradients that reflect momentum. Book, track, and resolve without switching tabs.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={primaryCta}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-semibold shadow-xl shadow-primary/30 hover:translate-y-[1px] transition-all"
              >
                {token ? 'Open your deck' : 'Launch control deck'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to={secondaryCta}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-textPrimary font-semibold hover:border-primary hover:bg-primary/5 transition-all"
              >
                {token ? 'Track live delivery' : 'Create account'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!token && (
                <Link to="/track" className="text-sm text-primary underline underline-offset-4 font-semibold">
                  Track without logging in
                </Link>
              )}
            </div>

            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-surface/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="grid sm:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800">
                {signalBar.map((item) => (
                  <div key={item.label} className="p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-textSecondary">{item.label}</p>
                    <p className="text-2xl font-bold mt-1">{item.value}</p>
                    <p className="text-xs text-textSecondary mt-1">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-primary/25 via-blue-500/10 to-emerald-300/15 blur-2xl" />
            <div className="relative rounded-[28px] border border-gray-100 dark:border-gray-800 bg-surface/90 backdrop-blur-xl shadow-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-textSecondary">Live shipment</p>
                  <p className="text-lg font-semibold">LogiShift Command Deck</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold">
                  <BadgeCheck className="w-4 h-4" /> SLA locked
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-primary/5 p-3">
                  <p className="text-textSecondary">ETA</p>
                  <p className="text-lg font-semibold">{liveCard.eta}</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/5 p-3">
                  <p className="text-textSecondary">Distance</p>
                  <p className="text-lg font-semibold">{liveCard.distance}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-textSecondary">Pickup</p>
                    <p className="font-semibold">{liveCard.pickup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-textSecondary">Drop</p>
                    <p className="font-semibold">{liveCard.drop}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-orange-500" />
                  <p className="font-semibold">{liveCard.status}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-700 text-white p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm text-white/80">Flightpath</p>
                  <p className="font-semibold leading-snug">Book, assign, notify, and proof — all on one slab of glass.</p>
                </div>
                <Link
                  to={token ? '/new-delivery' : '/register'}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white/15 rounded-lg font-semibold hover:bg-white/25 transition"
                >
                  Go faster <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-textSecondary">Product moodboard</p>
            <h2 className="text-2xl md:text-3xl font-bold">Glassmorphic surfaces, startup-bold typography</h2>
          </div>
          <Link
            to={token ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 shadow-sm font-semibold hover:border-primary"
          >
            {token ? 'Open dashboard' : 'Start free'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-surface/80 backdrop-blur-xl shadow-xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">{pillar.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{pillar.tag}</p>
                  <h3 className="text-lg font-semibold">{pillar.title}</h3>
                </div>
              </div>
              <p className="text-textSecondary leading-relaxed">{pillar.desc}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                Explore <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface/80 border-y border-gray-100 dark:border-gray-800 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-textSecondary">Role-specific paths</p>
              <h2 className="text-2xl font-bold">Three lanes, zero confusion</h2>
            </div>
            <Link
              to={token ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25"
            >
              {token ? 'Jump back in' : 'Claim your lane'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {roleTracks.map((roleTrack) => (
              <div
                key={roleTrack.title}
                className={`rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br ${roleTrack.hue} p-5 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{roleTrack.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-textSecondary" />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-textSecondary">
                  {roleTrack.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={roleTrack.cta}
                  className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline"
                >
                  Open workspace <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-[2px] bg-primary" />
          <p className="text-sm uppercase tracking-[0.2em] text-textSecondary">Operational rhythm</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {flow.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-surface/80 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">{index + 1}</span>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mt-3">{step.title}</h3>
              <p className="text-sm text-textSecondary mt-2 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="rounded-[28px] bg-gradient-to-r from-primary to-blue-700 text-white p-8 md:p-10 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Go live with a statement</p>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">Your logistics hub should look like it was designed this year.</h3>
            <p className="text-white/85">Invite your team, drop your first routes, and feel the difference between generic UI and startup-grade polish.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={primaryCta}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary font-semibold shadow-lg hover:translate-y-[1px] transition"
            >
              {token ? 'Return to deck' : 'Login'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={token ? '/track' : '/register'}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              {token ? 'Track live' : 'Create account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
