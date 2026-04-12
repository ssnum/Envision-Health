import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Activity, Users, FileText, LogOut, Calendar, Plus, Search, Bell, TrendingUp, ShieldAlert, HeartPulse, Clock, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ArrowLeft, XCircle, MapPin, Package, Beaker, ChevronDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = 'https://envision-health-backend.sahastasai.workers.dev'

// --- Mock Data for Dashboard ---
const chartData = [
  { name: 'Jan', patients: 400, volunteers: 24 },
  { name: 'Feb', patients: 600, volunteers: 28 },
  { name: 'Mar', patients: 800, volunteers: 35 },
  { name: 'Apr', patients: 750, volunteers: 40 },
  { name: 'May', patients: 900, volunteers: 42 },
  { name: 'Jun', patients: 1248, volunteers: 50 },
]

// --- Components ---
const AuthPage = ({ setToken, setRole }: { setToken: (t: string) => void, setRole: (r: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setFormRole] = useState('Admin')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: isLogin ? undefined : role })
      })
      const data = await res.json()
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.user.role)
          setRole(data.user.role)
          setToken(data.token)
          navigate('/')
        } else {
          setMsg('Registration successful! Please log in.')
          setIsLogin(true)
        }
      } else {
        setMsg(data.error || 'Authentication failed')
      }
    } catch (err) {
      setMsg('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Envision</h2>
          </div>
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Join the mission'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Or " : "Already registered? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              {isLogin ? 'create a new account' : 'sign in instead'}
            </button>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1">
                    <select value={role} onChange={e => setFormRole(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all">
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Patient">Patient (Portal Access)</option>
                    </select>
                  </div>
                </div>
              )}

              {msg && <div className={`p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Medical clinic" />
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl lg:text-6xl drop-shadow-lg">
              Healthcare, revolutionized.
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl drop-shadow">
              A unified platform for managing patients, empowering volunteers, and securing funding through AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const DropdownMenu = ({ label, items, role }: { label: string, items: { to: string, label: string, icon: any, roles?: string[] }[], role: string }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filtered = items.filter(i => !i.roles || i.roles.includes(role))
  if (filtered.length === 0) return null
  const isActive = filtered.some(i => location.pathname === i.to)

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 80)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}>
        {label}
        <ChevronDown size={13} className={`ml-0.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 pt-1 w-52 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {filtered.map(item => {
              const Icon = item.icon
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon size={14} className={active ? 'text-blue-500' : 'text-gray-400'} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const Layout = ({ children, logout, role }: { children: React.ReactNode, logout: () => void, role: string }) => {
  const overviewItems = [
    { to: '/', label: 'Dashboard', icon: Activity, roles: ['Admin', 'Doctor'] },
    { to: '/', label: 'My Portal', icon: Activity, roles: ['Patient'] },
    { to: '/', label: 'My Dashboard', icon: Activity, roles: ['Volunteer'] },
  ]
  const clinicItems = [
    { to: '/patients', label: 'Patient EHR', icon: Users, roles: ['Admin', 'Doctor'] },
    { to: '/volunteers', label: 'Volunteer CRM', icon: HeartPulse, roles: ['Admin'] },
    { to: '/inventory', label: 'Inventory', icon: Package, roles: ['Admin', 'Doctor'] },
    { to: '/appointments', label: 'My Appointments', icon: Calendar, roles: ['Patient'] },
    { to: '/opportunities', label: 'Opportunities', icon: Calendar, roles: ['Volunteer'] },
  ]
  const financeItems = [
    { to: '/grants', label: 'AI Grant Writer', icon: FileText, roles: ['Admin'] },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-6 h-13 flex items-center gap-5" style={{height: '52px'}}>
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
            <HeartPulse className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900 tracking-tight">Envision Hub</span>
          </Link>

          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all"
            />
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <nav className="flex items-center gap-0.5">
            <DropdownMenu label="Overview" items={overviewItems} role={role} />
            <DropdownMenu label="Clinic" items={clinicItems} role={role} />
            <DropdownMenu label="Finance & Growth" items={financeItems} role={role} />
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                {role.charAt(0)}
              </div>
              <span className="text-sm text-gray-700">{role}</span>
              <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
const StatCard = ({ title, value, trend, trendUp }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200">
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{title}</p>
    <p className="text-2xl font-semibold text-gray-900 mb-2">{value}</p>
    <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
      <span>{trendUp ? '↑' : '↓'} {trend}</span>
      <span className="text-gray-400 font-normal ml-1">vs last month</span>
    </div>
  </div>
)

const PatientPortal = ({ token }: { token: string }) => {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patient/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
  }, [token])

  if (!data) return <div className="p-8 text-center text-gray-500">Loading your medical records...</div>
  if (data.error) return <div className="p-8 text-center text-red-500">{data.error}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">My Health Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{data.first_name} {data.last_name}</p></div>
            <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{new Date(data.dob).toLocaleDateString()}</p></div>
            <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{data.phone || 'Not provided'}</p></div>
            <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{data.address || 'Not provided'}</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-2">Upcoming Appointment</h2>
          <p className="text-3xl font-light mb-1">None Scheduled</p>
          <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">Request Appointment</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <ShieldAlert className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-bold text-gray-900">Encrypted Health Summary</h2>
        </div>
        <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-xl font-mono text-sm border border-gray-100">
          {data.medicalData?.history ? (
            <div>
              <p><strong>Clinical History:</strong> {data.medicalData.history}</p>
              {data.medicalData.vitals && <p><strong>Recent Vitals:</strong> {data.medicalData.vitals}</p>}
              {data.medicalData.medications && <p><strong>Medications:</strong> {data.medicalData.medications}</p>}
            </div>
          ) : (
             <p>{data.medicalData?.history || 'No detailed records found. Please consult your physician.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}


const VolunteerPortal = ({ token, logout }: { token: string, logout: () => void }) => {
  const [profile, setProfile] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const location = useLocation()
  
  const isOpportunities = location.pathname.includes('/opportunities')

  useEffect(() => {
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setProfile(data)).catch(console.error)
      
    fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setEvents(data)).catch(console.error)
  }, [token])

  const handleRegister = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/events/${id}/register`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Successfully registered for shift!')
    // Refresh profile
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setProfile(data)).catch(console.error)
    setSelectedEvent(null)
  }

  // Check if user is already registered for selected event
  const isRegistered = selectedEvent && profile?.shifts?.some((s: any) => s.title === selectedEvent.title && new Date(s.date).getTime() === new Date(selectedEvent.date).getTime())

  if (selectedEvent) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedEvent(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Back to {isOpportunities ? 'Opportunities' : 'Dashboard'}
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center -mt-10 mb-4 border border-gray-100">
              <Calendar className="text-blue-600 h-10 w-10"/>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedEvent.category || 'Opportunity'}</span>
                  {selectedEvent.is_recurring === 1 && <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><Activity size={12}/> Recurring: {selectedEvent.recurrence_pattern}</span>}
                  {isRegistered && <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Registered</span>}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{selectedEvent.title}</h1>
              </div>
              <div className="flex gap-3">
                <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                  <FileText size={20} />
                </button>
                {!isRegistered && (
                  <button onClick={() => handleRegister(selectedEvent.id)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Sparkles size={18}/> Sign Up for Shift
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 py-8 border-y border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><Clock className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Date & Time</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(selectedEvent.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    {selectedEvent.end_date ? ` - ${new Date(selectedEvent.end_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><MapPin className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Location</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedEvent.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><Users className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Capacity</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedEvent.required_volunteers} volunteers needed</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About this opportunity</h3>
              <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                {selectedEvent.description}
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-2xl p-6 flex items-start gap-4 border border-blue-100">
              <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Prerequisites & Requirements</h4>
                <p className="text-blue-700 text-sm">Please ensure you have completed your mandatory compliance training and have your badge ready. Dress code is scrubs or business casual.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isOpportunities ? 'All Opportunities' : 'Volunteer Dashboard'}</h1>
          <p className="text-gray-500 mt-1">{isOpportunities ? 'Browse and sign up for upcoming clinical and community events.' : 'Track your hours and upcoming shifts.'}</p>
        </div>
      </div>
      
      {!isOpportunities && profile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4 col-span-1">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><Clock size={28}/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Hours Volunteered</p>
                <h2 className="text-3xl font-bold text-gray-900">{profile.total_hours} hrs</h2>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={20} className="text-blue-500"/> My Schedule</h2>
              <div className="space-y-3">
                {profile.shifts && profile.shifts.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 text-blue-700 font-bold p-2 px-3 rounded-lg text-center leading-tight shadow-sm">
                        <div className="text-xs uppercase">{new Date(s.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="text-lg">{new Date(s.date).getDate()}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{s.title}</h4>
                        <p className="text-sm text-gray-500">{s.location}</p>
                      </div>
                    </div>
                    <div>
                      {s.status === 'Pending' && <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200">Upcoming</span>}
                      {s.status === 'Confirmed' && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200">Completed</span>}
                      {s.status === 'No-Show' && <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium border border-rose-200">Missed</span>}
                    </div>
                  </div>
                ))}
                {(!profile.shifts || profile.shifts.length === 0) && <div className="text-gray-400 text-sm text-center p-6 border border-dashed rounded-xl border-gray-200">No shifts scheduled yet.</div>}
              </div>
            </div>
          </div>
          
          <div className="mt-10 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Featured Opportunities</h2>
          </div>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, isOpportunities ? undefined : 3).map(e => (
          <div key={e.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg hover:border-blue-200 transition-all group cursor-pointer" onClick={() => setSelectedEvent(e)}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-600 transition-colors"><Calendar className="text-blue-600 group-hover:text-white transition-colors h-6 w-6"/></div>
              <div className="flex gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
                {e.category && <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{e.category}</span>}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              {e.title}
              {e.is_recurring === 1 && <span title={`Recurring: ${e.recurrence_pattern}`}><Activity size={14} className="text-blue-500" /></span>}
            </h3>
            <p className="text-sm text-gray-500 flex-1 line-clamp-2 mb-4">{e.description}</p>
            
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1"><MapPin size={14}/> {e.location.split(',')[0]}</div>
              <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ChevronRight size={16}/></span>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="col-span-full text-center p-10 bg-white rounded-2xl border border-gray-100 text-gray-500">No upcoming events found.</div>}
      </div>
    </div>
  )
}


const DoctorDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patients', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() })
      .then(data => setPatients(data)).catch(console.error)
  }, [token])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Physician Dashboard</h1>
          <p className="text-gray-500 mt-1">Your daily clinical overview.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg transition-colors font-medium">
            <Calendar size={18} /> Today's Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><Users size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <h2 className="text-3xl font-bold text-gray-900">{patients.length}</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600"><Clock size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
            <h2 className="text-3xl font-bold text-gray-900">4</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><Activity size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Charts Updated</p>
            <h2 className="text-3xl font-bold text-gray-900">12</h2>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Recently Added Patients</h2>
          <div className="space-y-3">
            {patients.slice(0, 5).map(p => (
              <button onClick={() => navigate(`/patients?id=${p.id}`)} key={p.id} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{p.first_name} {p.last_name}</h4>
                    <p className="text-xs text-gray-500">DOB: {new Date(p.dob).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">Chart &rarr;</div>
              </button>
            ))}
            {patients.length === 0 && <p className="text-gray-500 text-sm">No patients found.</p>}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Quick Actions</h2>
          <div className="space-y-4">
            <button onClick={() => navigate('/patients?action=add')} className="w-full flex items-center justify-between p-4 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Plus className="text-blue-600"/>
                <span className="font-medium text-blue-900">Add New Patient</span>
              </div>
              <ChevronRight className="text-blue-400 group-hover:text-blue-600"/>
            </button>
            <button onClick={() => navigate('/patients?tab=prescriptions')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-600"/>
                <span className="font-medium text-gray-900">Write Prescriptions</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
            <button onClick={() => navigate('/patients?tab=labs')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Activity className="text-gray-600"/>
                <span className="font-medium text-gray-900">Review Lab Results</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {

  const updates = [
    { text: 'New patient registered', time: '10 mins ago', alert: false },
    { text: 'Volunteer shift completed', time: '1 hour ago', alert: false },
    { text: 'Grant proposal generated', time: '3 hours ago', alert: false },
    { text: 'Supplies running low — check inventory', time: '5 hours ago', alert: true },
    { text: 'New appointment booked', time: '1 day ago', alert: false },
    { text: 'Volunteer CRM updated', time: '1 day ago', alert: false },
  ]

  return (
    <div className="flex gap-12">

      {/* Left: main content */}
      <div className="flex-1 min-w-0 space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Clinic Overview</h1>
            <p className="text-sm text-gray-400 mt-0.5">Envision Health · Admin</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Live
          </div>
        </div>

        {/* — Patients — */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Patients</h2>
            <Link to="/patients" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="flex gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden mb-5">
            {[
              { label: 'Total', value: '1,248', trend: '+12.5%', up: true },
              { label: 'New this month', value: '84', trend: '+8.2%', up: true },
              { label: 'Avg wait time', value: '14m', trend: '−2.5%', up: false },
              { label: 'Appointments today', value: '17', trend: '+3', up: true },
            ].map((s, i) => (
              <div key={i} className="flex-1 bg-white px-5 py-4">
                <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
                <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                <p className={`text-xs mt-1 font-medium ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.trend} <span className="text-gray-400 font-normal">vs last month</span>
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Patient growth, Jan–Jun</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.07}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} />
                <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', boxShadow: 'none' }} cursor={{ stroke: '#f3f4f6', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={1.5} fill="url(#patientFill)" dot={false} activeDot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* — Volunteers — */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Volunteers</h2>
            <Link to="/volunteers" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="flex gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden mb-5">
            {[
              { label: 'Active volunteers', value: '42', trend: '+4.1%', up: true },
              { label: 'Shifts this month', value: '128', trend: '+11%', up: true },
              { label: 'Hours logged', value: '604 hrs', trend: '+9.3%', up: true },
              { label: 'No-show rate', value: '6.7%', trend: '+1.2%', up: false },
            ].map((s, i) => (
              <div key={i} className="flex-1 bg-white px-5 py-4">
                <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
                <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                <p className={`text-xs mt-1 font-medium ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.trend} <span className="text-gray-400 font-normal">vs last month</span>
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Volunteer growth, Jan–Jun</p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="volunteerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.07}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#d1d5db', fontSize: 11 }} />
                <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', boxShadow: 'none' }} cursor={{ stroke: '#f3f4f6', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="volunteers" stroke="#10b981" strokeWidth={1.5} fill="url(#volunteerFill)" dot={false} activeDot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* — Finance — */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Finance & Grants</h2>
            <Link to="/grants" className="text-xs text-blue-600 hover:underline">Open grant writer →</Link>
          </div>
          <div className="flex gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {[
              { label: 'Grants secured', value: '$124.5k', trend: '+22.4%', up: true },
              { label: 'Active proposals', value: '3', trend: '+1', up: true },
              { label: 'Success rate', value: '68%', trend: '+5%', up: true },
              { label: 'Pending review', value: '2', trend: '—', up: true },
            ].map((s, i) => (
              <div key={i} className="flex-1 bg-white px-5 py-4">
                <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
                <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                <p className={`text-xs mt-1 font-medium ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {s.trend} <span className="text-gray-400 font-normal">{s.trend !== '—' ? 'vs last month' : ''}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Right: updates column */}
      <div className="w-60 flex-shrink-0 pt-1">
        <div className="sticky top-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Updates</h2>
            <span className="text-xs text-gray-400">24h</span>
          </div>
          <div className="space-y-0 divide-y divide-gray-100">
            {updates.map((u, i) => (
              <div key={i} className="flex items-start gap-2.5 py-3">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${u.alert ? 'bg-red-400' : 'bg-gray-300'}`}></span>
                <div>
                  <p className={`text-xs leading-snug ${u.alert ? 'text-red-600 font-medium' : 'text-gray-600'}`}>{u.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{u.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

const PatientPrescriptions = ({ patientId, token, patientHistory, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [med, setMed] = useState('')
  const [sig, setSig] = useState('')
  const [dosage, setDosage] = useState('')
  const [refills, setRefills] = useState('')
  const [loading, setLoading] = useState(false)

  let parsed = { prescriptions: [] }
  try { parsed = JSON.parse(patientHistory) } catch(e) {}
  const prescriptions = parsed.prescriptions || []

  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch(API_URL + `/api/protected/patients/${patientId}/medicalData`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'prescription', payload: { medication: med, sig, dosage, refills } })
    })
    setMed(''); setSig(''); setDosage(''); setRefills(''); setShowForm(false); setLoading(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Prescriptions</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5">
          <Plus size={12} /> New Rx
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="space-y-3 pb-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Medication *</label>
              <input type="text" placeholder="e.g. Amoxicillin" required
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={med} onChange={e => setMed(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Dosage</label>
              <input type="text" placeholder="e.g. 500mg"
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={dosage} onChange={e => setDosage(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sig (instructions) *</label>
              <input type="text" placeholder="e.g. Take 1 PO TID for 10 days" required
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={sig} onChange={e => setSig(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Refills</label>
              <input type="text" placeholder="e.g. 0, 1, PRN"
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={refills} onChange={e => setRefills(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save & Sign'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Cancel</button>
          </div>
        </form>
      )}

      {prescriptions.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No active prescriptions on file.</p>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-4 py-2">
            <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Medication</span>
            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Dosage</span>
            <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Sig</span>
            <span className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Refills</span>
            <span className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</span>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {prescriptions.map((rx: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-3 items-center">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-900">{rx.medication}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">{rx.dosage || '—'}</p>
                </div>
                <div className="col-span-4">
                  <p className="text-sm text-gray-600">{rx.sig}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-gray-600">{rx.refills || '0'}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">{new Date(rx.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const PatientLabs = ({ patientId, token, patientHistory, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [testName, setTestName] = useState('')
  const [results, setResults] = useState('')
  const [orderedBy, setOrderedBy] = useState('')
  const [loading, setLoading] = useState(false)

  let parsed = { labs: [] }
  try { parsed = JSON.parse(patientHistory) } catch(e) {}
  const labs = parsed.labs || []

  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch(API_URL + `/api/protected/patients/${patientId}/medicalData`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lab', payload: { testName, results, orderedBy } })
    })
    setTestName(''); setResults(''); setOrderedBy(''); setShowForm(false); setLoading(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Lab Results</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5">
          <Plus size={12} /> Record result
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="space-y-3 pb-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Test / Panel *</label>
              <input type="text" placeholder="e.g. Comprehensive Metabolic Panel" required
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={testName} onChange={e => setTestName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ordered by</label>
              <input type="text" placeholder="e.g. Dr. Smith"
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={orderedBy} onChange={e => setOrderedBy(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Results *</label>
            <textarea placeholder="e.g. Glucose: 95 mg/dL (Normal), BUN: 18 mg/dL (Normal)..." required
              className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none h-20 font-mono"
              value={results} onChange={e => setResults(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save to chart'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Cancel</button>
          </div>
        </form>
      )}

      {labs.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No lab results on file.</p>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-4 py-2">
            <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Test / Panel</span>
            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Ordered by</span>
            <span className="col-span-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Results</span>
            <span className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</span>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {labs.map((lab: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-3 items-start">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-900">{lab.testName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">{lab.orderedBy || '—'}</p>
                </div>
                <div className="col-span-5">
                  <p className="text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">{lab.results}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs text-gray-400">{new Date(lab.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


const ClinicalNotes = ({ patientId, token, patientHistory, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0])
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)

  let parsed: any = {}
  try { parsed = JSON.parse(patientHistory) } catch(e) {}
  const notes = parsed.notes || []

  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch(API_URL + `/api/protected/patients/${patientId}/medicalData`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'note', payload: { text: noteText, date: noteDate, author } })
    })
    setNoteText(''); setAuthor(''); setShowForm(false); setLoading(false)
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Clinical Notes</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5">
          <Plus size={12} /> Add note
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="space-y-3 pb-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date *</label>
              <input type="date" required
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={noteDate} onChange={e => setNoteDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Author</label>
              <input type="text" placeholder="e.g. Dr. Smith"
                className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Note *</label>
            <textarea required placeholder="Patient presented with... Assessment: ... Plan: ..."
              className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none h-28"
              value={noteText} onChange={e => setNoteText(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save note'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Cancel</button>
          </div>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No clinical notes on file.</p>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {[...notes].reverse().map((note: any, i: number) => (
            <div key={i} className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{new Date(note.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  {note.author && <span className="text-xs text-gray-400">— {note.author}</span>}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Patients = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list')
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', email: '', phone: '', address: '', mrn: '', insurance: '', pcp: '', allergies: '', history: '', vitals: '', medications: '', mychartsId: '' })

  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const actionParam = queryParams.get('action')
  const idParam = queryParams.get('id')
  const tabParam = queryParams.get('tab') || 'demographics'

  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  useEffect(() => { if (actionParam === 'add') { setShowForm(true); setSelectedPatient(null) } }, [actionParam])

  const fetchPatients = async () => {
    try {
      const res = await fetch(API_URL + '/api/protected/patients', { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) { setPatients(await res.json()) }
      else if (res.status === 401) { logout() }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPatients() }, [])

  useEffect(() => {
    if (idParam && patients.length > 0) {
      const p = patients.find(pat => pat.id === idParam)
      if (p) { setSelectedPatient(p); setShowForm(false) }
    }
  }, [idParam, patients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      firstName: form.firstName, lastName: form.lastName, dob: form.dob,
      email: form.email, phone: form.phone, address: form.address,
      medicalData: { history: form.history, vitals: form.vitals, medications: form.medications, mrn: form.mrn, insurance: form.insurance, pcp: form.pcp, allergies: form.allergies, mychartsId: form.mychartsId }
    }
    const res = await fetch(API_URL + '/api/protected/patients', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.status === 401) return logout()
    setShowForm(false)
    setForm({ firstName: '', lastName: '', dob: '', email: '', phone: '', address: '', mrn: '', insurance: '', pcp: '', allergies: '', history: '', vitals: '', medications: '', mychartsId: '' })
    fetchPatients()
  }

  const exportToSheets = () => {
    const headers = ['Name', 'DOB', 'MRN', 'Phone', 'Email', 'Insurance', 'PCP', 'Vitals', 'Medications', 'History']
    const rows = patients.map(p => {
      let med: any = {}
      try { med = JSON.parse(p.medical_history) } catch {}
      return [
        `${p.first_name} ${p.last_name}`, new Date(p.dob).toLocaleDateString(),
        med.mrn || '', p.phone || '', p.email || '', med.insurance || '',
        med.pcp || '', med.vitals || '', med.medications || '', med.history || ''
      ]
    })
    const csv = [headers, ...rows].map(r => r.map((c: string) => '"' + c + '"').join(',')).join(String.fromCharCode(10));
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'patients.csv'; a.click()
  }

  const filtered = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const getParsed = (p: any) => { try { return JSON.parse(p.medical_history) } catch { return {} } }

  if (selectedPatient) {
    const med = getParsed(selectedPatient)
    const mychartsUrl = med.mychartsId ? `https://mychart.example.com/patient/${med.mychartsId}` : null

    return (
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back + title row */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => { navigate('/patients'); setSelectedPatient(null) }} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> All patients
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{selectedPatient.first_name} {selectedPatient.last_name}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span>DOB: {new Date(selectedPatient.dob).toLocaleDateString()}</span>
                <span>·</span>
                <span>ID: {selectedPatient.id.split('-')[0].toUpperCase()}</span>
                {med.mrn && <><span>·</span><span>MRN: {med.mrn}</span></>}
                {med.insurance && <><span>·</span><span>{med.insurance}</span></>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mychartsUrl ? (
              <a href={mychartsUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs border border-blue-200 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Open in MyChart
              </a>
            ) : (
              <button onClick={() => {
                const id = window.prompt('Enter MyChart Patient ID to link (e.g. MC-000123):')
                if (id) alert('MyChart ID saved. Update the patient record with MRN field: ' + id)
              }} className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-500">
                + Link MyChart
              </button>
            )}
            <button
              onClick={() => {
                const med = getParsed(selectedPatient)
                const rows = [
                  ['Field', 'Value'],
                  ['Name', `${selectedPatient.first_name} ${selectedPatient.last_name}`],
                  ['DOB', new Date(selectedPatient.dob).toLocaleDateString()],
                  ['MRN', med.mrn || ''],
                  ['Phone', selectedPatient.phone || ''],
                  ['Email', selectedPatient.email || ''],
                  ['Insurance', med.insurance || ''],
                  ['PCP', med.pcp || ''],
                  ['Allergies', med.allergies || ''],
                  ['Vitals', med.vitals || ''],
                  ['Medications', med.medications || ''],
                  ['History', med.history || ''],
                ]
                const csv = rows.map(r => r.map((c: string) => '"' + c + '"').join(',')).join(String.fromCharCode(10));
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = `${selectedPatient.last_name}_${selectedPatient.first_name}.csv`; a.click()
              }}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-600">
              ↗ Export to Sheets
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex gap-0 border-b border-gray-200">
          {[
            { key: 'demographics', label: 'Chart & Demographics' },
            { key: 'prescriptions', label: 'Prescriptions' },
            { key: 'labs', label: 'Lab Results' },
            { key: 'notes', label: 'Clinical Notes' },
          ].map(t => (
            <button key={t.key} onClick={() => navigate(`/patients?id=${selectedPatient.id}&tab=${t.key}`)}
              className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${tabParam === t.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tabParam === 'demographics' && (
          <div className="space-y-8">

            {/* Demographics row */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Demographics</h2>
              <div className="grid grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {[
                  { label: 'Full name', value: `${selectedPatient.first_name} ${selectedPatient.last_name}` },
                  { label: 'Date of birth', value: new Date(selectedPatient.dob).toLocaleDateString() },
                  { label: 'MRN', value: med.mrn || '—' },
                  { label: 'Phone', value: selectedPatient.phone || '—' },
                  { label: 'Email', value: selectedPatient.email || '—' },
                  { label: 'Address', value: selectedPatient.address || '—' },
                  { label: 'Insurance', value: med.insurance || '—' },
                  { label: 'Primary care provider', value: med.pcp || '—' },
                  { label: 'MyChart ID', value: med.mychartsId || '—' },
                ].map((row, i) => (
                  <div key={i} className="bg-white px-5 py-3.5">
                    <p className="text-xs text-gray-400 mb-1">{row.label}</p>
                    <p className="text-sm text-gray-900">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Vitals row */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Vitals</h2>
              <div className="flex gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                {(med.vitals || 'BP: —, HR: —, Temp: —, SpO2: —').split(',').map((v: string, i: number) => {
                  const [label, val] = v.trim().split(':')
                  return (
                    <div key={i} className="flex-1 bg-white px-5 py-4">
                      <p className="text-xs text-gray-400 mb-1">{label?.trim()}</p>
                      <p className="text-lg font-semibold text-gray-900">{val?.trim() || '—'}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Allergies + Medications row */}
            <section>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Allergies</h2>
                  {(med.allergies || 'None on record').split(',').map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{a.trim()}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Current Medications</h2>
                  {(med.medications || 'None on record').split(',').map((m: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{m.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Clinical history */}
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Clinical History & Notes</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{med.history || 'No history recorded.'}</p>
            </section>

          </div>
        )}

        {tabParam === 'prescriptions' && (
          <PatientPrescriptions patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
        )}

        {tabParam === 'labs' && (
          <PatientLabs patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
        )}

        {tabParam === 'notes' && (
          <ClinicalNotes patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
        )}

      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header row */}
      <div className="flex items-end justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Patient EHR</h1>
          <p className="text-xs text-gray-400 mt-0.5">Records are AES-256 encrypted · {patients.length} patients</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5">
              ↗ Export
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
              <button onClick={exportToSheets} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">CSV (Google Sheets)</button>
              <button onClick={() => {
                const headers = ['Name','DOB','MRN','Phone','Email','Insurance','PCP','Vitals','Medications','History']
                const rows = patients.map(p => { let med: any = {}; try { med = JSON.parse(p.medical_history) } catch {} return [p.first_name+' '+p.last_name, new Date(p.dob).toLocaleDateString(), med.mrn||'', p.phone||'', p.email||'', med.insurance||'', med.pcp||'', med.vitals||'', med.medications||'', med.history||''] })
                const tsv = [headers,...rows].map(r => r.join('	')).join(String.fromCharCode(10))
                const blob = new Blob([tsv], {type:'text/tab-separated-values'})
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href=url; a.download='patients.tsv'; a.click()
              }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">TSV (Excel)</button>
              <button onClick={() => {
                const rows = patients.map(p => { let med: any = {}; try { med = JSON.parse(p.medical_history) } catch {} return {name:p.first_name+' '+p.last_name, dob:new Date(p.dob).toLocaleDateString(), mrn:med.mrn||'', phone:p.phone||'', email:p.email||'', insurance:med.insurance||'', pcp:med.pcp||'', vitals:med.vitals||'', medications:med.medications||'', history:med.history||''} })
                const blob = new Blob([JSON.stringify(rows,null,2)],{type:'application/json'})
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href=url; a.download='patients.json'; a.click()
              }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">JSON</button>
              <button onClick={() => window.print()} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 border-t border-gray-100 mt-1">Print / PDF</button>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Plus size={13} /> Add patient
          </button>
        </div>
      </div>

      {/* Add patient form */}
      {showForm && (
        <div className="space-y-6 pb-6 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">New Patient Record</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <p className="text-xs text-gray-400 mb-3">Demographics</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'First name', key: 'firstName', type: 'text', required: true },
                  { label: 'Last name', key: 'lastName', type: 'text', required: true },
                  { label: 'Date of birth', key: 'dob', type: 'date', required: false },
                  { label: 'MRN', key: 'mrn', type: 'text', required: false },
                  { label: 'Phone', key: 'phone', type: 'text', required: false },
                  { label: 'Email', key: 'email', type: 'email', required: false },
                  { label: 'Address', key: 'address', type: 'text', required: false },
                  { label: 'Insurance provider', key: 'insurance', type: 'text', required: false },
                  { label: 'Primary care provider', key: 'pcp', type: 'text', required: false },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-500 mb-1">
                      {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                    </label>
                    <input type={f.type} required={f.required}
                      className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 mb-3">MyChart Integration</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">MyChart Patient ID</label>
                  <input type="text" placeholder="e.g. MC-000123"
                    className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={form.mychartsId} onChange={e => setForm({...form, mychartsId: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 mb-3">Clinical Data <span className="ml-1 text-gray-300">(encrypted)</span></p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Vitals</label>
                  <input type="text" placeholder="BP: 120/80, HR: 72, Temp: 98.6, SpO2: 98%"
                    className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={form.vitals} onChange={e => setForm({...form, vitals: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Allergies</label>
                  <input type="text" placeholder="Penicillin, Sulfa drugs"
                    className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Current medications</label>
                  <input type="text" placeholder="Lisinopril 10mg, Metformin 500mg"
                    className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={form.medications} onChange={e => setForm({...form, medications: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Clinical history & notes</label>
                <textarea placeholder="History of hypertension, Type 2 DM, allergic to penicillin..." required
                  className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none h-24"
                  value={form.history} onChange={e => setForm({...form, history: e.target.value})} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button type="submit" disabled={loading} className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save record'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
        <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Patient list */}
      {loading ? (
        <p className="text-sm text-gray-400 py-8">Loading records...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-8">No patients found.</p>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 py-2 px-1">
            <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Patient</span>
            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">DOB</span>
            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">MRN</span>
            <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Insurance</span>
            <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</span>
          </div>
          {filtered.map(p => {
            const med = getParsed(p)
            const mychartsUrl = med.mychartsId ? `https://mychart.example.com/patient/${med.mychartsId}` : null
            return (
              <div key={p.id} className="grid grid-cols-12 gap-4 py-3.5 px-1 items-center hover:bg-gray-50 transition-colors group">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-gray-400">{p.email || '—'}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700">{new Date(p.dob).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700">{med.mrn || '—'}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-700">{med.insurance || '—'}</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <button onClick={() => { navigate(`/patients?id=${p.id}`); setSelectedPatient(p) }}
                    className="text-xs text-blue-600 hover:underline">
                    View chart
                  </button>
                  {mychartsUrl && (
                    <a href={mychartsUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors" title="Open in MyChart">
                      MyChart ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// Spreadsheet cell editor component
const SheetCell = ({ value, type = 'text', options, onChange, className = '', readOnly = false }: {
  value: any, type?: string, options?: string[], onChange?: (v: any) => void,
  className?: string, readOnly?: boolean
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<any>(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus() }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft !== value && onChange) onChange(type === 'number' ? (isNaN(parseInt(draft)) ? 0 : parseInt(draft)) : draft)
  }

  if (readOnly) return (
    <div className={`px-2 py-1.5 text-sm text-gray-700 ${className}`}>{value || '—'}</div>
  )

  if (!editing) return (
    <div
      onClick={() => setEditing(true)}
      className={`px-2 py-1.5 text-sm cursor-text hover:bg-blue-50 hover:ring-1 hover:ring-blue-300 rounded transition-all min-h-[28px] ${className}`}
    >
      {value || <span className="text-gray-300 italic text-xs">click to edit</span>}
    </div>
  )

  if (options) return (
    <select
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      className="w-full px-2 py-1 text-sm border-0 outline-none ring-1 ring-blue-400 rounded bg-white"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )

  return (
    <input
      ref={inputRef}
      type={type}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
      className="w-full px-2 py-1 text-sm border-0 outline-none ring-1 ring-blue-400 rounded bg-white"
    />
  )
}

const INVENTORY_CATEGORIES = ['Medication', 'Vaccine', 'PPE', 'Wound Care', 'Diagnostic', 'IV/Infusion', 'Surgical Supply', 'Equipment', 'Lab Supply', 'Office/Admin']
const STORAGE_LOCATIONS = ['Pharmacy Cabinet A', 'Pharmacy Cabinet B', 'Exam Room 1', 'Exam Room 2', 'Exam Room 3', 'Supply Closet', 'Refrigerator 1', 'Refrigerator 2', 'Freezer', 'Lab Storage', 'Nurses Station', 'Reception']
const UNITS = ['units', 'boxes', 'bottles', 'vials', 'ampules', 'bags', 'rolls', 'packs', 'pairs', 'each', 'liters', 'mL']
const SUPPLIERS = ['McKesson', 'Cardinal Health', 'Medline', 'Henry Schein', 'Owens & Minor', 'Patterson Companies', 'PSS World Medical', 'Other']
const STATUS_OPTIONS = ['In Stock', 'Low Stock', 'Critical', 'On Order', 'Expired', 'Recalled', 'Discontinued']

const defaultNewRow = () => ({
  id: `local-${Date.now()}`,
  item_name: '',
  category: 'Medication',
  quantity: 0,
  unit: 'units',
  min_quantity: 10,
  location: 'Pharmacy Cabinet A',
  expiration_date: '',
  lot_number: '',
  supplier: 'McKesson',
  unit_cost: '',
  ndc_code: '',
  notes: '',
  status: 'In Stock',
  isNew: true,
  isDirty: false,
})

// ── Google Sheets import types ──
type SheetStep = 'url' | 'mapping' | 'preview' | 'importing'
type ColumnMapping = Record<string, string> // inventoryField -> sheetHeader

const INVENTORY_FIELD_LABELS: Record<string, string> = {
  item_name: 'Item Name *',
  quantity: 'Quantity *',
  category: 'Category',
  unit: 'Unit',
  expiration_date: 'Expiration Date',
  ndc_code: 'NDC / Drug Code',
  lot_number: 'Lot Number',
  location: 'Storage Location',
  supplier: 'Supplier',
  unit_cost: 'Unit Cost',
  min_quantity: 'Min Quantity',
  notes: 'Notes',
}

// Use Claude AI to suggest column mappings
const autoMapColumns = async (headers: string[]): Promise<ColumnMapping> => {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are mapping spreadsheet column headers to clinic inventory fields.

Sheet headers: ${JSON.stringify(headers)}

Inventory fields to map to: ${JSON.stringify(Object.keys(INVENTORY_FIELD_LABELS))}

Return ONLY a JSON object mapping inventory field names to the best matching header string (or null if no match). Example: {"item_name": "Product Name", "quantity": "Qty", "expiration_date": null}

Only return the JSON object, nothing else.`
        }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || '{}'
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return {}
  }
}

const Inventory = ({ token, logout }: { token: string, logout: () => void }) => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortCol, setSortCol] = useState('item_name')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'all'|'medications'|'supplies'|'equipment'>('all')
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [sheetConnected, setSheetConnected] = useState(false)

  // Sheet import state
  const [sheetStep, setSheetStep] = useState<SheetStep>('url')
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([])
  const [sheetRows, setSheetRows] = useState<string[][]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [mappingLoading, setMappingLoading] = useState(false)
  const [sheetError, setSheetError] = useState('')
  const [importProgress, setImportProgress] = useState(0)

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/protected/inventory', { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.status === 401) return logout()
      const data = await res.json()
      // Enrich with default fields that may not exist in backend
      setItems(data.map((item: any) => ({
        unit: 'units', min_quantity: 10, location: 'Pharmacy Cabinet A',
        lot_number: '', supplier: 'McKesson', unit_cost: '', ndc_code: '', notes: '',
        status: item.quantity < 5 ? 'Critical' : item.quantity < 10 ? 'Low Stock' : 'In Stock',
        ...item, isDirty: false, isNew: false,
      })))
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchInventory() }, [])

  // Extract sheet ID from any Google Sheets URL format
  const extractSheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : null
  }

  const fetchSheetData = async () => {
    setSheetError('')
    setMappingLoading(true)
    const sheetId = extractSheetId(sheetUrl)
    if (!sheetId) {
      setSheetError('Invalid Google Sheets URL. Make sure it looks like: https://docs.google.com/spreadsheets/d/...')
      setMappingLoading(false)
      return
    }
    try {
      // Google Sheets JSON export (requires sheet to be publicly shared)
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
      const res = await fetch(exportUrl)
      if (!res.ok) throw new Error('Could not fetch sheet')
      const text = await res.text()
      // Strip Google's JSONP wrapper
      const json = JSON.parse(text.replace(/^[^(]*\(/, '').replace(/\);?\s*$/, ''))
      const cols = json.table.cols as any[]
      const rowData = json.table.rows as any[]

      // Extract headers — use label if available, else fall back to column letter
      const headers = cols.map((c: any) => c.label || c.id || '')
      const nonEmptyHeaders = headers.filter((h: string) => h.trim())
      if (nonEmptyHeaders.length === 0) throw new Error('No headers found in sheet')

      // Extract data rows
      const rows = rowData.map((r: any) =>
        cols.map((_: any, i: number) => {
          const cell = r.c?.[i]
          if (!cell || cell.v === null || cell.v === undefined) return ''
          return String(cell.f || cell.v)
        })
      ).filter(row => row.some(cell => cell.trim()))

      setSheetHeaders(headers)
      setSheetRows(rows)

      // Use Claude to auto-map columns
      const suggested = await autoMapColumns(headers)
      setColumnMapping(suggested)
      setSheetStep('mapping')
    } catch (e: any) {
      setSheetError(e.message?.includes('fetch') || e.message?.includes('CORS')
        ? 'Could not access the sheet. Make sure sharing is set to "Anyone with the link can view".'
        : (e.message || 'Failed to read sheet. Check the URL and sharing settings.'))
    }
    setMappingLoading(false)
  }

  const importFromSheet = async () => {
    setSheetStep('importing')
    setImportProgress(0)
    const inventoryFields = Object.keys(INVENTORY_FIELD_LABELS)
    let imported = 0

    for (let i = 0; i < sheetRows.length; i++) {
      const row = sheetRows[i]
      const mapped: any = {
        unit: 'units', min_quantity: 10, location: 'Pharmacy Cabinet A',
        supplier: 'McKesson', category: 'Medication', quantity: 0,
      }
      // Map each field using columnMapping
      for (const field of inventoryFields) {
        const header = columnMapping[field]
        if (!header) continue
        const colIdx = sheetHeaders.indexOf(header)
        if (colIdx === -1) continue
        const val = row[colIdx]?.trim()
        if (!val) continue
        if (field === 'quantity' || field === 'min_quantity') {
          mapped[field] = parseInt(val.replace(/[^0-9]/g, '')) || 0
        } else {
          mapped[field] = val
        }
      }
      if (!mapped.item_name) continue // skip rows with no item name

      try {
        await fetch(API_URL + '/api/protected/inventory', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemName: mapped.item_name,
            category: mapped.category || 'Medication',
            quantity: mapped.quantity || 0,
            expirationDate: mapped.expiration_date || '',
          })
        })
        imported++
      } catch(e) { console.error(e) }
      setImportProgress(Math.round(((i + 1) / sheetRows.length) * 100))
    }

    setSheetConnected(true)
    setShowConnectModal(false)
    setSheetStep('url')
    setSheetUrl('')
    setSheetHeaders([])
    setSheetRows([])
    setColumnMapping({})
    await fetchInventory()
  }

  const resetModal = () => {
    setSheetStep('url')
    setSheetUrl('')
    setSheetHeaders([])
    setSheetRows([])
    setColumnMapping({})
    setSheetError('')
    setShowConnectModal(false)
  }

  const addRow = () => {
    setItems(prev => [...prev, defaultNewRow()])
  }

  const updateCell = async (id: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value, isDirty: true }
      // Auto-compute status from quantity
      if (field === 'quantity' || field === 'min_quantity') {
        const qty = field === 'quantity' ? value : item.quantity
        const min = field === 'min_quantity' ? value : item.min_quantity
        updated.status = qty <= 0 ? 'Critical' : qty < min * 0.5 ? 'Critical' : qty < min ? 'Low Stock' : 'In Stock'
      }
      return updated
    }))
    // Debounced auto-save for existing rows
    const item = items.find(i => i.id === id)
    if (item && !item.isNew) {
      setSavingIds(prev => new Set(prev).add(id))
      try {
        await fetch(API_URL + `/api/protected/inventory/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field === 'item_name' ? 'itemName' : field]: value, quantity: field === 'quantity' ? value : item.quantity })
        })
        setItems(prev => prev.map(i => i.id === id ? { ...i, isDirty: false } : i))
      } catch(e) { console.error(e) }
      setSavingIds(prev => { const s = new Set(prev); s.delete(id); return s })
    }
  }

  const saveNewRow = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item || !item.item_name.trim()) return
    setSavingIds(prev => new Set(prev).add(id))
    try {
      const res = await fetch(API_URL + '/api/protected/inventory', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: item.item_name, category: item.category, quantity: item.quantity, expirationDate: item.expiration_date })
      })
      if (res.ok) {
        fetchInventory()
      }
    } catch(e) { console.error(e) }
    setSavingIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const deleteSelected = () => {
    setItems(prev => prev.filter(item => !selectedRows.has(item.id)))
    setSelectedRows(new Set())
  }

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const tabFilter = (item: any) => {
    if (activeTab === 'medications') return ['Medication', 'Vaccine'].includes(item.category)
    if (activeTab === 'supplies') return ['PPE', 'Wound Care', 'IV/Infusion', 'Surgical Supply', 'Lab Supply', 'Diagnostic'].includes(item.category)
    if (activeTab === 'equipment') return item.category === 'Equipment'
    return true
  }

  const filtered = items
    .filter(tabFilter)
    .filter(i => filterCategory === 'All' || i.category === filterCategory)
    .filter(i => filterStatus === 'All' || i.status === filterStatus)
    .filter(i => !search || i.item_name?.toLowerCase().includes(search.toLowerCase()) || i.ndc_code?.toLowerCase().includes(search.toLowerCase()) || i.lot_number?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortCol] ?? '', bv = b[sortCol] ?? ''
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })

  const lowStockCount = items.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length
  const expiringCount = items.filter(i => {
    if (!i.expiration_date) return false
    const exp = new Date(i.expiration_date)
    const diff = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 90
  }).length

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 text-gray-300">
      {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  const columns = [
    { key: 'item_name', label: 'Item Name', width: 'w-48', type: 'text' },
    { key: 'ndc_code', label: 'NDC / Code', width: 'w-32', type: 'text' },
    { key: 'category', label: 'Category', width: 'w-36', type: 'select', options: INVENTORY_CATEGORIES },
    { key: 'quantity', label: 'Qty', width: 'w-20', type: 'number' },
    { key: 'unit', label: 'Unit', width: 'w-24', type: 'select', options: UNITS },
    { key: 'min_quantity', label: 'Min Qty', width: 'w-20', type: 'number' },
    { key: 'status', label: 'Status', width: 'w-28', type: 'select', options: STATUS_OPTIONS },
    { key: 'location', label: 'Location', width: 'w-40', type: 'select', options: STORAGE_LOCATIONS },
    { key: 'expiration_date', label: 'Exp. Date', width: 'w-32', type: 'date' },
    { key: 'lot_number', label: 'Lot #', width: 'w-28', type: 'text' },
    { key: 'supplier', label: 'Supplier', width: 'w-36', type: 'select', options: SUPPLIERS },
    { key: 'unit_cost', label: 'Unit Cost', width: 'w-24', type: 'text' },
    { key: 'notes', label: 'Notes', width: 'w-48', type: 'text' },
  ]

  const statusColors: Record<string, string> = {
    'In Stock': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200',
    'Critical': 'bg-red-50 text-red-700 border-red-200',
    'On Order': 'bg-blue-50 text-blue-700 border-blue-200',
    'Expired': 'bg-gray-100 text-gray-500 border-gray-200',
    'Recalled': 'bg-purple-50 text-purple-700 border-purple-200',
    'Discontinued': 'bg-gray-50 text-gray-400 border-gray-100',
  }

  const isExpiringSoon = (dateStr: string) => {
    if (!dateStr) return false
    const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 90
  }

  const isExpired = (dateStr: string) => {
    if (!dateStr) return false
    return new Date(dateStr).getTime() < Date.now()
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Inventory</h1>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} items · Click any cell to edit · Changes save automatically</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConnectModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${sheetConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V7.5L14.5 2Z" fill={sheetConnected ? '#10b981' : '#9ca3af'} fillOpacity="0.2" stroke={sheetConnected ? '#10b981' : '#6b7280'} strokeWidth="1.5"/>
              <path d="M14 2V8H20" stroke={sheetConnected ? '#10b981' : '#6b7280'} strokeWidth="1.5"/>
              <path d="M8 13H16M8 17H12" stroke={sheetConnected ? '#10b981' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {sheetConnected ? 'Sheets Connected' : 'Link Google Sheets'}
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={13} /> Add Row
          </button>
          {selectedRows.size > 0 && (
            <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100 transition-colors">
              Delete {selectedRows.size} row{selectedRows.size > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Status bar alerts */}
      {(lowStockCount > 0 || expiringCount > 0) && (
        <div className="flex gap-3 mb-4">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
              <span><strong>{lowStockCount}</strong> item{lowStockCount > 1 ? 's' : ''} at low or critical stock</span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
              <Clock size={13} className="text-orange-500 flex-shrink-0" />
              <span><strong>{expiringCount}</strong> item{expiringCount > 1 ? 's' : ''} expiring within 90 days</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs + filters row */}
      <div className="flex items-center justify-between mb-0 border-b border-gray-200">
        <div className="flex items-center">
          {(['all', 'medications', 'supplies', 'equipment'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-medium capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'all' ? `All Items (${items.length})` : tab === 'medications' ? `Medications & Vaccines` : tab === 'supplies' ? `Supplies & PPE` : `Equipment`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, NDC, lot#..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 w-52"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-600">
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* The spreadsheet */}
      <div className="overflow-x-auto border border-gray-200 border-t-0" style={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
        <table className="w-full text-left border-collapse" style={{ minWidth: '1400px' }}>
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Row number + checkbox */}
              <th className="w-10 px-2 py-2 border-r border-gray-200">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600 rounded"
                  checked={selectedRows.size === filtered.length && filtered.length > 0}
                  onChange={e => setSelectedRows(e.target.checked ? new Set(filtered.map(i => i.id)) : new Set())}
                />
              </th>
              <th className="w-8 px-2 py-2 text-xs text-gray-300 font-normal border-r border-gray-100">#</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`${col.width} px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-100 whitespace-nowrap select-none`}
                >
                  {col.label}<SortIcon col={col.key} />
                </th>
              ))}
              <th className="w-16 px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Save</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 3} className="py-16 text-center text-sm text-gray-400">Loading inventory...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 3} className="py-16 text-center">
                  <div className="text-gray-400 text-sm">
                    {search || filterCategory !== 'All' || filterStatus !== 'All' ? 'No items match your filters.' : 'No inventory items yet.'}
                  </div>
                  {!search && <button onClick={addRow} className="mt-3 text-xs text-blue-600 hover:underline">+ Add first item</button>}
                </td>
              </tr>
            ) : filtered.map((item, idx) => {
              const isSaving = savingIds.has(item.id)
              const isSelected = selectedRows.has(item.id)
              const rowClass = isSelected ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'

              return (
                <tr
                  key={item.id}
                  className={`${rowClass} hover:bg-blue-50/60 transition-colors border-b border-gray-100 group ${item.isNew ? 'ring-1 ring-inset ring-blue-300' : ''}`}
                >
                  <td className="px-2 py-0.5 border-r border-gray-100">
                    <input
                      type="checkbox"
                      className="w-3 h-3 text-blue-600 rounded"
                      checked={isSelected}
                      onChange={e => setSelectedRows(prev => {
                        const s = new Set(prev)
                        e.target.checked ? s.add(item.id) : s.delete(item.id)
                        return s
                      })}
                    />
                  </td>
                  <td className="px-2 py-0.5 text-xs text-gray-300 border-r border-gray-100 text-right">{idx + 1}</td>

                  {/* Item Name */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.item_name} type="text" onChange={v => updateCell(item.id, 'item_name', v)} className="font-medium text-gray-900 w-full" />
                  </td>
                  {/* NDC Code */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.ndc_code} type="text" onChange={v => updateCell(item.id, 'ndc_code', v)} className="font-mono text-gray-500 text-xs w-full" />
                  </td>
                  {/* Category */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.category} type="select" options={INVENTORY_CATEGORIES} onChange={v => updateCell(item.id, 'category', v)} className="w-full" />
                  </td>
                  {/* Quantity */}
                  <td className="border-r border-gray-100">
                    <SheetCell
                      value={item.quantity}
                      type="number"
                      onChange={v => updateCell(item.id, 'quantity', v)}
                      className={`font-mono font-semibold w-full ${item.quantity <= 0 ? 'text-red-600' : item.quantity < (item.min_quantity || 10) ? 'text-amber-600' : 'text-gray-700'}`}
                    />
                  </td>
                  {/* Unit */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.unit || 'units'} type="select" options={UNITS} onChange={v => updateCell(item.id, 'unit', v)} className="text-gray-500 w-full" />
                  </td>
                  {/* Min Qty */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.min_quantity || 10} type="number" onChange={v => updateCell(item.id, 'min_quantity', v)} className="text-gray-400 w-full" />
                  </td>
                  {/* Status */}
                  <td className="border-r border-gray-100 px-1.5 py-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                      {item.status}
                    </span>
                  </td>
                  {/* Location */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.location || 'Pharmacy Cabinet A'} type="select" options={STORAGE_LOCATIONS} onChange={v => updateCell(item.id, 'location', v)} className="text-gray-600 w-full" />
                  </td>
                  {/* Expiration Date */}
                  <td className="border-r border-gray-100">
                    <SheetCell
                      value={item.expiration_date ? item.expiration_date.split('T')[0] : ''}
                      type="date"
                      onChange={v => updateCell(item.id, 'expiration_date', v)}
                      className={`w-full ${isExpired(item.expiration_date) ? 'text-red-600 font-medium' : isExpiringSoon(item.expiration_date) ? 'text-amber-600' : 'text-gray-600'}`}
                    />
                  </td>
                  {/* Lot # */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.lot_number} type="text" onChange={v => updateCell(item.id, 'lot_number', v)} className="font-mono text-xs text-gray-500 w-full" />
                  </td>
                  {/* Supplier */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.supplier || 'McKesson'} type="select" options={SUPPLIERS} onChange={v => updateCell(item.id, 'supplier', v)} className="text-gray-600 w-full" />
                  </td>
                  {/* Unit Cost */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.unit_cost} type="text" onChange={v => updateCell(item.id, 'unit_cost', v)} className="font-mono text-gray-600 w-full" />
                  </td>
                  {/* Notes */}
                  <td className="border-r border-gray-100">
                    <SheetCell value={item.notes} type="text" onChange={v => updateCell(item.id, 'notes', v)} className="text-gray-400 italic text-xs w-full" />
                  </td>
                  {/* Save (for new rows) */}
                  <td className="px-2">
                    {item.isNew ? (
                      <button
                        onClick={() => saveNewRow(item.id)}
                        disabled={!item.item_name || isSaving}
                        className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
                      >
                        {isSaving ? '...' : 'Save'}
                      </button>
                    ) : isSaving ? (
                      <span className="text-xs text-blue-400">saving…</span>
                    ) : item.isDirty ? (
                      <span className="text-xs text-amber-400">●</span>
                    ) : (
                      <span className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer stats bar */}
        {filtered.length > 0 && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center gap-6 text-xs text-gray-500">
            <span>{filtered.length} row{filtered.length !== 1 ? 's' : ''}</span>
            {selectedRows.size > 0 && <span className="text-blue-600">{selectedRows.size} selected</span>}
            <span>Total qty: <strong className="text-gray-700">{filtered.reduce((s, i) => s + (i.quantity || 0), 0).toLocaleString()}</strong></span>
            <span>Low/critical: <strong className="text-amber-600">{filtered.filter(i => ['Low Stock', 'Critical'].includes(i.status)).length}</strong></span>
            <span>Expiring ≤90d: <strong className="text-orange-600">{filtered.filter(i => isExpiringSoon(i.expiration_date)).length}</strong></span>
          </div>
        )}
      </div>

      {/* Google Sheets smart import modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={resetModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full mx-4 overflow-hidden" style={{ maxWidth: sheetStep === 'mapping' ? '680px' : '480px' }} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-1.5 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14.5 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V7.5L14.5 2Z" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5"/><path d="M14 2V8H20" stroke="#10b981" strokeWidth="1.5"/><path d="M8 13H16M8 17H12" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Import from Google Sheets</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sheetStep === 'url' && 'Paste your sheet URL to get started'}
                    {sheetStep === 'mapping' && `${sheetRows.length} rows found — review column mapping`}
                    {sheetStep === 'preview' && 'Preview import data'}
                    {sheetStep === 'importing' && 'Importing rows...'}
                  </p>
                </div>
              </div>
              {/* Step indicators */}
              <div className="flex items-center gap-2">
                {(['url', 'mapping', 'importing'] as SheetStep[]).map((s, i) => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-colors ${sheetStep === s ? 'bg-blue-500' : ['url','mapping','importing'].indexOf(sheetStep) > i ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                ))}
                <button onClick={resetModal} className="ml-2 text-gray-300 hover:text-gray-500 transition-colors"><XCircle size={18} /></button>
              </div>
            </div>

            {/* Step 1: URL input */}
            {sheetStep === 'url' && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Google Sheets URL</label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={e => { setSheetUrl(e.target.value); setSheetError('') }}
                    onKeyDown={e => e.key === 'Enter' && sheetUrl && fetchSheetData()}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                  {sheetError && <p className="text-xs text-red-500 mt-2 flex items-start gap-1"><AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />{sheetError}</p>}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-gray-700">Before importing:</p>
                  <p>1. Open your Google Sheet</p>
                  <p>2. Click <strong>Share</strong> → <strong>Anyone with the link</strong> → set to <strong>Viewer</strong></p>
                  <p>3. Copy and paste the URL above</p>
                  <p className="text-gray-400 mt-2">Your sheet can have any column names — Claude will auto-detect what's what.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={resetModal} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                  <button
                    onClick={fetchSheetData}
                    disabled={!sheetUrl || mappingLoading}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors flex items-center gap-2"
                  >
                    {mappingLoading ? <><Activity size={14} className="animate-spin" /> Analyzing sheet...</> : 'Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Column mapping */}
            {sheetStep === 'mapping' && (
              <div className="p-6 space-y-5">
                <div className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                  Claude detected <strong className="text-gray-700">{sheetHeaders.filter(h => h).length} columns</strong> and <strong className="text-gray-700">{sheetRows.length} data rows</strong>. Review the mapping below and adjust if needed.
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {Object.entries(INVENTORY_FIELD_LABELS).map(([field, label]) => (
                    <div key={field} className="grid grid-cols-2 gap-3 items-center">
                      <div className="text-xs text-gray-600">
                        {label}
                        {columnMapping[field] && <span className="ml-1.5 text-emerald-500">✓</span>}
                      </div>
                      <select
                        value={columnMapping[field] || ''}
                        onChange={e => setColumnMapping(prev => ({ ...prev, [field]: e.target.value || '' }))}
                        className={`text-xs border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 ${columnMapping[field] ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200'}`}
                      >
                        <option value="">— skip this field —</option>
                        {sheetHeaders.filter(h => h).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Preview first 3 rows */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Sample data preview</p>
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {sheetHeaders.filter(h => h).slice(0, 5).map(h => (
                            <th key={h} className="px-2 py-1.5 text-gray-400 font-medium text-left whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sheetRows.slice(0, 3).map((row, i) => (
                          <tr key={i}>
                            {sheetHeaders.filter(h => h).slice(0, 5).map((h, j) => {
                              const idx = sheetHeaders.indexOf(h)
                              return <td key={j} className="px-2 py-1.5 text-gray-600 whitespace-nowrap max-w-32 truncate">{row[idx] || '—'}</td>
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button onClick={() => setSheetStep('url')} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  <div className="flex gap-2">
                    <button onClick={resetModal} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                    <button
                      onClick={importFromSheet}
                      disabled={!columnMapping['item_name']}
                      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} /> Import {sheetRows.length} rows
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Importing progress */}
            {sheetStep === 'importing' && (
              <div className="p-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Activity size={22} className="text-blue-500 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800">Importing inventory...</p>
                  <p className="text-xs text-gray-400 mt-1">{importProgress}% complete</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
                </div>
                <p className="text-xs text-gray-400">Do not close this window</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

const VolunteerCRM = ({ token, logout }: { token: string, logout: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [events, setEvents] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [pendingHours, setPendingHours] = useState<any[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', endDate: '', category: 'General', isRecurring: false, recurrencePattern: '', location: '', requiredVolunteers: 1 })
  const [stats, setStats] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [eventParticipants, setEventParticipants] = useState<any[]>([])
  const [flierData, setFlierData] = useState({ eventDetails: '', tone: 'Professional & Urgency' })
  const [flierResult, setFlierResult] = useState<any>(null)
  const [flierLoading, setFlierLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    try {
      const [eventsRes, volRes, hoursRes, statsRes] = await Promise.all([
        fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/volunteers', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/hours/pending', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      if (eventsRes.status === 401) return logout()
      setEvents(await eventsRes.json())
      setVolunteers(await volRes.json())
      setPendingHours(await hoursRes.json())
      setStats(await statsRes.json())
    } catch(e) { console.error(e) }
  }

  useEffect(() => { fetchData() }, [])

  const fetchParticipants = async (eventId: string) => {
    const res = await fetch(API_URL + `/api/protected/vms/events/${eventId}/participants`, { headers: { 'Authorization': `Bearer ${token}` } })
    setEventParticipants(await res.json())
  }

  const handleManageEvent = (e: any) => { setSelectedEvent(e); fetchParticipants(e.id) }

  const handleUpdateAttendance = async (eventId: string, userId: string, status: string, hours: number = 0) => {
    await fetch(API_URL + `/api/protected/vms/events/${eventId}/attendance/${userId}`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, hours })
    })
    fetchParticipants(eventId); fetchData()
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(API_URL + '/api/protected/vms/events', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm)
    })
    setShowEventForm(false)
    setEventForm({ title: '', description: '', date: '', endDate: '', category: 'General', isRecurring: false, recurrencePattern: '', location: '', requiredVolunteers: 1 })
    fetchData()
  }

  const handleConfirmHours = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/hours/confirm/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } })
    fetchData()
  }

  const handleRegisterEvent = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/events/${id}/register`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
    alert('Successfully registered!')
  }

  const handleGenerateFlier = async () => {
    setFlierLoading(true)
    const res = await fetch(API_URL + '/api/protected/vms/fliers/generate', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(flierData)
    })
    const data = await res.json()
    setFlierResult(data.flierCopy)
    setFlierLoading(false)
  }

  const tabs = [
    { key: 'dashboard', label: 'Overview' },
    { key: 'events', label: 'Events' },
    { key: 'directory', label: 'Directory' },
    { key: 'hours', label: `Pending Hours${pendingHours.length > 0 ? ` (${pendingHours.length})` : ''}` },
    { key: 'marketing', label: 'Marketing' },
  ]

  const filteredVolunteers = volunteers.filter(v => v.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Volunteer CRM</h1>
          <p className="text-xs text-gray-400 mt-0.5">{volunteers.length} volunteers · {events.length} events</p>
        </div>
        {activeTab === 'events' && !selectedEvent && (
          <button onClick={() => setShowEventForm(!showEventForm)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Plus size={13} /> New event
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => { setActiveTab(t.key); setSelectedEvent(null) }}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${activeTab === t.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-10">
          {stats && (
            <>
              {/* Stats row */}
              <section>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">At a glance</h2>
                <div className="flex gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  {[
                    { label: 'Total volunteers', value: stats.total_volunteers },
                    { label: 'Active events', value: stats.active_events },
                    { label: 'Completion rate', value: stats.completion_rate + '%' },
                    { label: 'No-show rate', value: stats.no_show_rate + '%' },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 bg-white px-5 py-4">
                      <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
                      <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* Upcoming events */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Upcoming events</h2>
                  <button onClick={() => setActiveTab('events')} className="text-xs text-blue-600 hover:underline">View all →</button>
                </div>
                {events.length === 0 ? (
                  <p className="text-sm text-gray-400">No upcoming events.</p>
                ) : (
                  <div className="divide-y divide-gray-100 border-t border-gray-100">
                    <div className="grid grid-cols-12 gap-4 py-2">
                      <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Event</span>
                      <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</span>
                      <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Location</span>
                      <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</span>
                      <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Spots</span>
                    </div>
                    {events.slice(0, 5).map(e => (
                      <div key={e.id} className="grid grid-cols-12 gap-4 py-3 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-4">
                          <p className="text-sm font-medium text-gray-900">{e.title}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">{new Date(e.date).toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">{e.location || '—'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">{e.category}</p>
                        </div>
                        <div className="col-span-2 flex items-center gap-3">
                          <p className="text-sm text-gray-600">{e.required_volunteers}</p>
                          <button onClick={() => { setActiveTab('events'); handleManageEvent(e) }} className="text-xs text-blue-600 hover:underline">Manage</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="border-t border-gray-100" />

              {/* Quick actions */}
              <section>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick actions</h2>
                <div className="flex gap-3">
                  <button onClick={() => { setActiveTab('events'); setShowEventForm(true) }}
                    className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-1.5">
                    <Plus size={12} /> Create event
                  </button>
                  <button onClick={() => setActiveTab('hours')}
                    className={`text-xs border px-4 py-2 rounded transition-colors flex items-center gap-1.5 ${pendingHours.length > 0 ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <CheckCircle2 size={12} /> Review pending hours {pendingHours.length > 0 && `(${pendingHours.length})`}
                  </button>
                  <button onClick={() => setActiveTab('marketing')}
                    className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-1.5">
                    <Sparkles size={12} /> Generate flier
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      )}

      {/* ── Events ── */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {showEventForm && !selectedEvent && (
            <div className="space-y-4 pb-6 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">New event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Title *', key: 'title', type: 'text', required: true, span: 2 },
                    { label: 'Location', key: 'location', type: 'text', required: false, span: 1 },
                    { label: 'Start date & time *', key: 'date', type: 'datetime-local', required: true, span: 1 },
                    { label: 'End date & time', key: 'endDate', type: 'datetime-local', required: false, span: 1 },
                    { label: 'Volunteers needed', key: 'requiredVolunteers', type: 'number', required: true, span: 1 },
                  ].map(f => (
                    <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                      <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                      <input type={f.type} required={f.required} min={f.type === 'number' ? 1 : undefined}
                        className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={(eventForm as any)[f.key]}
                        onChange={e => setEventForm({...eventForm, [f.key]: f.type === 'number' ? parseInt(e.target.value) : e.target.value})} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Category</label>
                    <select className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})}>
                      <option>General</option><option>Clinical</option><option>Community</option><option>Administrative</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <textarea placeholder="Describe the event, responsibilities, what to wear..."
                    className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none h-20"
                    value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={eventForm.isRecurring} onChange={e => setEventForm({...eventForm, isRecurring: e.target.checked})} />
                    Recurring
                  </label>
                  {eventForm.isRecurring && (
                    <select className="border border-gray-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={eventForm.recurrencePattern} onChange={e => setEventForm({...eventForm, recurrencePattern: e.target.value})}>
                      <option value="">Pattern...</option><option>Daily</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Publish event</button>
                  <button type="button" onClick={() => setShowEventForm(false)} className="text-xs border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 text-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {!selectedEvent ? (
            events.length === 0 ? <p className="text-sm text-gray-400 py-8">No events yet.</p> : (
              <div className="divide-y divide-gray-100 border-t border-gray-100">
                <div className="grid grid-cols-12 gap-4 py-2">
                  <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Event</span>
                  <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</span>
                  <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Location</span>
                  <span className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</span>
                  <span className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Spots</span>
                  <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</span>
                </div>
                {events.map(e => (
                  <div key={e.id} className="grid grid-cols-12 gap-4 py-3.5 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-4">
                      <p className="text-sm font-medium text-gray-900">{e.title}</p>
                      {e.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{e.description}</p>}
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700">{new Date(e.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700">{e.location || '—'}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500">{e.category}</p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-sm text-gray-700">{e.required_volunteers}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <button onClick={() => handleRegisterEvent(e.id)} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Join</button>
                      <button onClick={() => handleManageEvent(e)} className="text-xs text-blue-600 hover:underline">Manage →</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedEvent(null)} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                    <ArrowLeft size={13} /> All events
                  </button>
                  <div className="w-px h-4 bg-gray-200" />
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{selectedEvent.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedEvent.location} · {new Date(selectedEvent.date).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{eventParticipants.length} / {selectedEvent.required_volunteers} volunteers</p>
              </div>
              <div className="divide-y divide-gray-100 border-t border-gray-100">
                <div className="grid grid-cols-12 gap-4 py-2">
                  <span className="col-span-5 text-xs font-medium text-gray-400 uppercase tracking-wider">Volunteer</span>
                  <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
                  <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Hours</span>
                  <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</span>
                </div>
                {eventParticipants.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6">No volunteers registered yet.</p>
                ) : eventParticipants.map(p => (
                  <div key={p.registration_id} className="grid grid-cols-12 gap-4 py-3 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                        {p.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-700">{p.email}</p>
                    </div>
                    <div className="col-span-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        p.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                        p.status === 'No-Show' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-700'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 font-mono">{p.hours_logged || 0}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button onClick={() => handleUpdateAttendance(selectedEvent.id, p.user_id, 'Confirmed', 4)}
                        className="text-xs text-emerald-600 hover:underline" title="Mark attended">✓ Attended</button>
                      <button onClick={() => handleUpdateAttendance(selectedEvent.id, p.user_id, 'No-Show', 0)}
                        className="text-xs text-red-400 hover:underline" title="Mark no-show">✗</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Directory ── */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input type="text" placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <span className="text-xs text-gray-400">{filteredVolunteers.length} volunteer{filteredVolunteers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            <div className="grid grid-cols-12 gap-4 py-2">
              <span className="col-span-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Volunteer</span>
              <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Role</span>
              <span className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Total hours</span>
            </div>
            {filteredVolunteers.length === 0 ? (
              <p className="text-sm text-gray-400 py-6">No volunteers found.</p>
            ) : filteredVolunteers.map(v => (
              <div key={v.id} className="grid grid-cols-12 gap-4 py-3 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-6 flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                    {v.email.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-800">{v.email}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-gray-500">{v.role}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-mono text-gray-700">{v.total_hours} hrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pending Hours ── */}
      {activeTab === 'hours' && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pending hours</h2>
          {pendingHours.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">No pending hours to approve.</p>
          ) : (
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              <div className="grid grid-cols-12 gap-4 py-2">
                <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Volunteer</span>
                <span className="col-span-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Event</span>
                <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Hours</span>
                <span className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</span>
              </div>
              {pendingHours.map(h => (
                <div key={h.registration_id} className="grid grid-cols-12 gap-4 py-3.5 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-4">
                    <p className="text-sm text-gray-800">{h.volunteer_email}</p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm text-gray-600">{h.event_title}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-mono text-gray-800">{h.hours_logged} hrs</p>
                  </div>
                  <div className="col-span-2">
                    <button onClick={() => handleConfirmHours(h.registration_id)}
                      className="text-xs text-emerald-600 border border-emerald-200 bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <CheckCircle2 size={12} /> Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Marketing ── */}
      {activeTab === 'marketing' && (
        <div className="space-y-8">
          <div className="flex gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Flier generator</h2>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Event details & roles needed</label>
                <textarea className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none h-28"
                  value={flierData.eventDetails} onChange={e => setFlierData({...flierData, eventDetails: e.target.value})}
                  placeholder="e.g. Free flu shot clinic this Saturday. Need 5 nurses and 2 coordinators." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tone</label>
                <select className="w-full border border-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  value={flierData.tone} onChange={e => setFlierData({...flierData, tone: e.target.value})}>
                  <option>Professional & Urgency</option>
                  <option>Friendly & Community-Focused</option>
                  <option>Student/Academic (Internship Focus)</option>
                </select>
              </div>
              <button onClick={handleGenerateFlier} disabled={flierLoading}
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {flierLoading ? 'Generating...' : <><Sparkles size={12} /> Generate flier</>}
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Preview</h2>
              <div className="border border-gray-200 rounded p-4 min-h-48 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                {flierResult || <span className="text-gray-400 text-xs">Generated flier will appear here.</span>}
              </div>
              {flierResult && (
                <button onClick={() => { const b = new Blob([flierResult], {type:'text/plain'}); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href=u; a.download='flier.txt'; a.click() }}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors text-gray-600">
                  ↗ Export text
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


const AIWriter = ({ token, logout }: { token: string, logout: () => void }) => {
  const [metrics, setMetrics] = useState('We served 500 low-income patients last month across 3 mobile clinics. We need $50,000 for new portable ultrasound equipment to expand our prenatal care division. Our volunteer retention is 92%.')
  const [prompt, setPrompt] = useState('Write an executive summary for a federal healthcare grant proposal.')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isMatchMode, setIsMatchMode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const endpoint = isMatchMode ? '/api/protected/grants/match' : '/api/protected/grants/generate'
      const payload = isMatchMode ? { metrics } : { metrics, prompt }
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.status === 401) return logout()
      const data = await res.json()
      setResult(isMatchMode ? data.matches : (data.proposal || data.error))
    } catch (e) {
      setResult("Error connecting to AI engine.")
    }
    setLoading(false)
  }

  const handleCopy = () => {
    if (typeof result === 'string') {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Grant Writer</h1>
          <p className="text-sm text-gray-400 mt-0.5">Match live grants and generate proposals with AI</p>
        </div>
        <div className="flex items-center border border-gray-200 rounded overflow-hidden">
          <button
            onClick={() => { setIsMatchMode(false); setResult(null) }}
            className={`px-4 py-2 text-xs font-medium transition-colors ${!isMatchMode ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Proposal Writer
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => { setIsMatchMode(true); setResult(null) }}
            className={`px-4 py-2 text-xs font-medium transition-colors ${isMatchMode ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Grant Matcher
          </button>
        </div>
      </div>

      {/* Two-column layout — no cards, just clean columns */}
      <div className="flex gap-10" style={{ minHeight: '70vh' }}>

        {/* Left — inputs */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 border-r border-gray-100 pr-10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {isMatchMode ? 'Clinic Context' : 'Clinic Context & Metrics'}
            </p>
            <textarea
              className="w-full border-0 border-b border-gray-200 pb-3 focus:outline-none focus:border-gray-400 transition-colors resize-none text-sm text-gray-700 leading-relaxed bg-transparent"
              style={{ minHeight: '180px' }}
              value={metrics}
              onChange={e => setMetrics(e.target.value)}
              placeholder="Describe your clinic's mission, patient volume, key metrics, and funding needs..."
            />
          </div>

          {!isMatchMode && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Instruction</p>
              <input
                type="text"
                className="w-full border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-gray-400 transition-colors text-sm text-gray-700 bg-transparent"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Write an executive summary..."
              />
            </div>
          )}

          {/* Quick prompts */}
          {!isMatchMode && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Quick prompts</p>
              <div className="flex flex-col gap-1">
                {[
                  'Write an executive summary for a federal grant',
                  'Draft a needs statement for HRSA funding',
                  'Write project goals and objectives',
                  'Create an evaluation plan section',
                ].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className={`text-left text-xs py-1.5 text-gray-500 hover:text-gray-900 transition-colors border-l-2 pl-2.5 ${prompt === p ? 'border-blue-500 text-gray-900' : 'border-transparent'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Activity className="animate-spin" size={14} /> {isMatchMode ? 'Searching grants...' : 'Generating...'}</>
                : isMatchMode ? <><Search size={14} /> Find Matching Grants</> : <><FileText size={14} /> Generate Proposal</>
              }
            </button>
            {loading && (
              <p className="text-xs text-gray-400 text-center mt-2">This may take 10–20 seconds</p>
            )}
          </div>
        </div>

        {/* Right — output */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Output header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {isMatchMode ? 'Grant Matches' : 'Output'}
            </p>
            {result && typeof result === 'string' && (
              <button
                onClick={handleCopy}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
              >
                {copied ? <><CheckCircle2 size={12} className="text-emerald-500" /> Copied</> : 'Copy text'}
              </button>
            )}
          </div>

          {/* Output area */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 pt-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${85 - i * 7}%`, animationDelay: `${i * 80}ms` }} />
                ))}
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4 mt-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ) : result ? (
              isMatchMode && Array.isArray(result) ? (
                // Grant matches — row format, no cards
                <div className="divide-y divide-gray-100">
                  {result.map((match: any, idx: number) => (
                    <div key={idx} className="py-5 flex items-start gap-5 hover:bg-gray-50/50 transition-colors -mx-2 px-2">
                      {/* Score */}
                      <div className="flex-shrink-0 w-12 text-center pt-0.5">
                        <span className={`text-lg font-bold tabular-nums ${(match.match_score || 0) >= 80 ? 'text-emerald-600' : (match.match_score || 0) >= 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                          {match.match_score || 0}
                        </span>
                        <p className="text-xs text-gray-300 leading-none">%</p>
                      </div>
                      {/* Thin divider */}
                      <div className="w-px self-stretch bg-gray-100 flex-shrink-0" />
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{match.title || 'Unknown Grant'}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{match.agency || 'Unknown Agency'}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{match.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Proposal text — clean reading format
                <div className="text-sm text-gray-700 leading-8 whitespace-pre-wrap max-w-2xl" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}>
                  {result}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ minHeight: '300px' }}>
                <div className="w-8 h-px bg-gray-200 mx-auto mb-4" />
                <p className="text-sm text-gray-300">
                  {isMatchMode ? 'Fill in your clinic context and search for grants' : 'Fill in your context and choose a prompt to generate'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [role, setRole] = useState(localStorage.getItem('role') || 'Admin')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken('')
  }

  // Basic check for token format to avoid immediate 401s if clearly malformed
  useEffect(() => {
    if (token && token.split('.').length !== 3) {
      logout()
    }
  }, [token])

  if (!token) return <AuthPage setToken={setToken} setRole={setRole} />

  return (
    <Layout logout={logout} role={role}>
      <Routes>
        <Route path="/" element={
          role === 'Patient' ? <PatientPortal token={token} /> : 
          role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : 
          role === 'Doctor' ? <DoctorDashboard token={token} logout={logout} /> :
          <Dashboard />
        } />
        <Route path="/opportunities" element={role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/patients" element={['Doctor', 'Admin'].includes(role) ? <Patients token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/volunteers" element={role === 'Admin' ? <VolunteerCRM token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/inventory" element={['Admin', 'Doctor'].includes(role) ? <Inventory token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/grants" element={role === 'Admin' ? <AIWriter token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
