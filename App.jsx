\
import React, { useState, useEffect } from 'react'
import { fetchChildren, fetchSponsors } from './api'

/**
 * WPD Sponsorship Child Data Management System
 * Demo UI — now production-ready scaffold:
 * - Replace localStorage demo with API calls (examples included below)
 * - Integrate authentication and role-based access control on backend
 */

const sampleChildren = [
  {
    id: 'C001',
    name: 'Aisha Namutebi',
    age: 9,
    gender: 'Female',
    school: 'St. Mary Primary',
    photo: '',
    health: 'Good',
    notes: 'Loves drawing. Needs school supplies.',
    sponsorId: 'S001',
    messages: [
      { id: 'm1', from: 'staff', text: 'Welcome to sponsorship program!', date: '2025-11-01' }
    ]
  },
  {
    id: 'C002',
    name: 'Emmanuel Okello',
    age: 11,
    gender: 'Male',
    school: 'Bunyonyi Primary',
    photo: '',
    health: 'Fair',
    notes: 'Needs eyeglasses.',
    sponsorId: null,
    messages: []
  }
]

const sampleSponsors = [
  {
    id: 'S001',
    name: 'John Smith',
    email: 'john@example.com',
    country: 'USA',
    sponsoredChildren: ['C001'],
    messages: [
      { id: 'ms1', to: 'C001', text: 'Glad to support Aisha!', date: '2025-11-02' }
    ]
  }
]

function Header({ user, onLogout }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center font-bold">WPD</div>
        <div>
          <h1 className="text-xl font-semibold">WPD Sponsorship CMS</h1>
          <div className="text-sm text-slate-500">Manage child-sponsor communication & relationships</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">{user?.role} • {user?.name}</div>
        <button className="px-3 py-1 rounded bg-slate-100 text-sm" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}

function Sidebar({ view, setView, counts }) {
  return (
    <aside className="w-64 p-4 bg-white/60 border-r">
      <nav className="flex flex-col gap-2">
        <button onClick={() => setView('dashboard')} className={`text-left p-2 rounded ${view==='dashboard'?'bg-slate-100':''}`}>Dashboard</button>
        <button onClick={() => setView('children')} className={`text-left p-2 rounded ${view==='children'?'bg-slate-100':''}`}>Children <span className="ml-2 text-slate-400">({counts.children})</span></button>
        <button onClick={() => setView('sponsors')} className={`text-left p-2 rounded ${view==='sponsors'?'bg-slate-100':''}`}>Sponsors <span className="ml-2 text-slate-400">({counts.sponsors})</span></button>
        <button onClick={() => setView('communication')} className={`text-left p-2 rounded ${view==='communication'?'bg-slate-100':''}`}>Communication</button>
        <button onClick={() => setView('reports')} className={`text-left p-2 rounded ${view==='reports'?'bg-slate-100':''}`}>Reports & Analytics</button>
        <button onClick={() => setView('settings')} className={`text-left p-2 rounded ${view==='settings'?'bg-slate-100':''}`}>Settings</button>
      </nav>
    </aside>
  )
}

function Login({ onLogin }) {
  const [name, setName] = useState('Staff User')
  const [role, setRole] = useState('Staff')
  const handle = () => onLogin({ name, role })
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Login to WPD CMS</h2>
        <label className="block text-sm">Name</label>
        <input className="w-full p-2 border rounded mb-3" value={name} onChange={e=>setName(e.target.value)} />
        <label className="block text-sm">Role</label>
        <select className="w-full p-2 border rounded mb-4" value={role} onChange={e=>setRole(e.target.value)}>
          <option>Staff</option>
          <option>Sponsor</option>
        </select>
        <button className="w-full p-2 bg-slate-800 text-white rounded" onClick={handle}>Continue</button>
      </div>
    </div>
  )
}

function DashboardView({ childrenData, sponsorsData }) {
  const totalSponsored = childrenData.filter(c=>c.sponsorId).length
  const totalUnsponsored = childrenData.length - totalSponsored
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Total Children</div>
          <div className="text-2xl font-bold">{childrenData.length}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Sponsored</div>
          <div className="text-2xl font-bold">{totalSponsored}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Unsponsored</div>
          <div className="text-2xl font-bold">{totalUnsponsored}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Recent Messages</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            {childrenData.slice(0,5).map(c=> (
              <li key={c.id} className="p-2 border rounded">{c.name} — {c.messages?.length || 0} messages</li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Top Sponsors</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            {sponsorsData.slice(0,5).map(s=> (
              <li key={s.id} className="p-2 border rounded">{s.name} — {s.sponsoredChildren?.length || 0} child(ren)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ChildrenView({ childrenData, setChildren, openChild }) {
  const [query, setQuery] = useState('')
  const filtered = childrenData.filter(c=> c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase()))
  const addChild = () => {
    const id = 'C' + Math.floor(Math.random()*10000)
    const newChild = { id, name: 'New Child', age: 0, gender: 'Female', school: '', photo: '', health: '', notes: '', sponsorId: null, messages: [] }
    setChildren(prev => [newChild, ...prev])
    openChild(newChild)
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Children</h2>
        <div className="flex gap-2">
          <input placeholder="Search by name or ID" className="p-2 border rounded" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={addChild}>Add Child</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(c=> (
          <div key={c.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.name} <span className="text-slate-400">({c.id})</span></div>
              <div className="text-sm text-slate-500">Age: {c.age} • School: {c.school} • Health: {c.health}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-1 bg-slate-100 rounded" onClick={()=>openChild(c)}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SponsorsView({ sponsorsData, setSponsors, openSponsor }) {
  const [query, setQuery] = useState('')
  const filtered = sponsorsData.filter(s=> s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase()))
  const addSponsor = () => {
    const id = 'S' + Math.floor(Math.random()*10000)
    const newS = { id, name: 'New Sponsor', email: '', country: '', sponsoredChildren: [], messages: [] }
    setSponsors(prev => [newS, ...prev])
    openSponsor(newS)
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Sponsors</h2>
        <div className="flex gap-2">
          <input placeholder="Search by name or ID" className="p-2 border rounded" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={addSponsor}>Add Sponsor</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(s=> (
          <div key={s.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name} <span className="text-slate-400">({s.id})</span></div>
              <div className="text-sm text-slate-500">{s.email} • {s.country}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-1 bg-slate-100 rounded" onClick={()=>openSponsor(s)}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunicationView({ childrenData, sponsorsData, setChildren, setSponsors }) {
  const [fromType, setFromType] = useState('staff')
  const [toId, setToId] = useState('')
  const [text, setText] = useState('')

  const send = () => {
    if(!toId || !text) return alert('Select recipient and write a message')
    const message = { id: 'm' + Math.floor(Math.random()*100000), from: fromType, text, date: new Date().toISOString().slice(0,10) }
    if(fromType === 'sponsor'){
      setSponsors(prev => prev.map(s=> s.id===toId ? {...s, messages: [...s.messages, {...message, to: 'child'} ]} : s))
    } else {
      const isChild = childrenData.some(c=>c.id===toId)
      const isSponsor = sponsorsData.some(s=>s.id===toId)
      if(isChild){
        setChildren(prev => prev.map(c=> c.id===toId ? {...c, messages:[...(c.messages||[]), message]} : c))
      } else if(isSponsor){
        setSponsors(prev => prev.map(s=> s.id===toId ? {...s, messages:[...(s.messages||[]), message]} : s))
      } else alert('Recipient not found')
    }
    setText('')
    alert('Message sent (demo)')
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Communication Center</h2>
      <div className="p-4 bg-white rounded shadow mb-4">
        <div className="flex gap-2 items-center mb-2">
          <label className="text-sm">From:</label>
          <select value={fromType} onChange={e=>setFromType(e.target.value)} className="p-2 border rounded">
            <option value="staff">Staff</option>
            <option value="sponsor">Sponsor</option>
          </select>
          <label className="text-sm">To (ID):</label>
          <input className="p-2 border rounded" value={toId} onChange={e=>setToId(e.target.value)} placeholder="e.g. C001 or S001" />
        </div>
        <textarea className="w-full p-2 border rounded mb-2" rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Write message here"></textarea>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 text-white rounded" onClick={send}>Send</button>
          <button className="px-4 py-2 bg-slate-100 rounded" onClick={()=>{setText(''); setToId('')}}>Clear</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Recent Child Messages</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            {childrenData.flatMap(c=> (c.messages||[]).map(m=> ({...m, childName: c.name, childId: c.id}))).slice(0,10).map(m=> (
              <li key={m.id} className="p-2 border rounded">{m.date} • {m.childName} ({m.childId}) — {m.text}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Recent Sponsor Messages</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            {sponsorsData.flatMap(s=> (s.messages||[]).map(m=> ({...m, sponsorName: s.name, sponsorId: s.id}))).slice(0,10).map(m=> (
              <li key={m.id} className="p-2 border rounded">{m.date} • {m.sponsorName} ({m.sponsorId}) — {m.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ReportsView({ childrenData, sponsorsData }){
  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Export Data</h3>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={()=>exportJSON(childrenData, 'children.json')}>Export Children</button>
            <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={()=>exportJSON(sponsorsData, 'sponsors.json')}>Export Sponsors</button>
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Quick Stats</h3>
          <div className="mt-2 text-sm text-slate-600">
            Total children: {childrenData.length}<br/>
            Total sponsors: {sponsorsData.length}<br/>
            Sponsored children: {childrenData.filter(c=>c.sponsorId).length}
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsView({ childrenData, sponsorsData, setChildren, setSponsors }){
  const importData = (kind, raw) => {
    try{
      const data = JSON.parse(raw)
      if(kind==='children') setChildren(data)
      else setSponsors(data)
      alert('Imported successfully (demo).')
    }catch(e){ alert('Invalid JSON') }
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Import / Reset</h3>
        <div className="mb-2 text-sm text-slate-600">You can import JSON exported from Reports or reset demo data.</div>
        <ImportPanel onImport={importData} />
        <div className="mt-4">
          <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={()=>{ if(confirm('Reset demo data?')){ setChildren(sampleChildren); setSponsors(sampleSponsors) } }}>Reset Demo Data</button>
        </div>
      </div>
    </div>
  )
}

function ImportPanel({ onImport }){
  const [kind, setKind] = useState('children')
  const [raw, setRaw] = useState('')
  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <select value={kind} onChange={e=>setKind(e.target.value)} className="p-2 border rounded">
          <option value="children">Children</option>
          <option value="sponsors">Sponsors</option>
        </select>
        <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={()=>{ const example = kind==='children' ? JSON.stringify(sampleChildren, null, 2) : JSON.stringify(sampleSponsors, null, 2); setRaw(example) }}>Load Example</button>
      </div>
      <textarea className="w-full p-2 border rounded" rows={8} value={raw} onChange={e=>setRaw(e.target.value)} placeholder='Paste exported JSON here'></textarea>
      <div className="mt-2">
        <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={()=>onImport(kind, raw)}>Import</button>
      </div>
    </div>
  )
}

function DetailModal({ item, type, onClose, onSave, childrenData, sponsorsData, setChildren, setSponsors }){
  const [draft, setDraft] = useState(item)
  useEffect(()=> setDraft(item), [item])
  if(!item) return null
  const save = () => {
    if(type==='child'){
      setChildren(prev => prev.map(p=> p.id===draft.id ? draft : p))
    } else {
      setSponsors(prev => prev.map(p=> p.id===draft.id ? draft : p))
    }
    onSave && onSave(draft)
    onClose()
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{type==='child' ? 'Child Details' : 'Sponsor Details'} — {draft.name}</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(draft).map(k=> (
            <div key={k}>
              <label className="text-sm text-slate-600">{k}</label>
              <input className="w-full p-2 border rounded" value={draft[k] ?? ''} onChange={e=>setDraft(prev=>({...prev, [k]: e.target.value}))} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-2 bg-slate-800 text-white rounded" onClick={save}>Save</button>
          <button className="px-3 py-2 bg-slate-100 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [user, setUser] = useState(null)
  const [childrenData, setChildren] = useState(sampleChildren)
  const [sponsorsData, setSponsors] = useState(sampleSponsors)
  const [view, setView] = useState('dashboard')
  const [openItem, setOpenItem] = useState(null)
  const [openType, setOpenType] = useState(null)

  useEffect(()=>{
    // In production, replace these with API calls:
    // fetchChildren().then(r => setChildren(r.data)).catch(()=>{})
    // fetchSponsors().then(r => setSponsors(r.data)).catch(()=>{})
    // For now we use demo data; backend integration points are in src/api.js
  }, [])

  const logout = () => { setUser(null); setView('dashboard') }

  if(!user) return <Login onLogin={(u)=>{ setUser(u); setView('dashboard') }} />

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={logout} />
      <div className="flex">
        <Sidebar view={view} setView={setView} counts={{children: childrenData.length, sponsors: sponsorsData.length}} />
        <main className="flex-1">
          {view==='dashboard' && <DashboardView childrenData={childrenData} sponsorsData={sponsorsData} />}
          {view==='children' && <ChildrenView childrenData={childrenData} setChildren={setChildren} openChild={(c)=>{ setOpenType('child'); setOpenItem(c)}} />}
          {view==='sponsors' && <SponsorsView sponsorsData={sponsorsData} setSponsors={setSponsors} openSponsor={(s)=>{ setOpenType('sponsor'); setOpenItem(s)}} />}
          {view==='communication' && <CommunicationView childrenData={childrenData} sponsorsData={sponsorsData} setChildren={setChildren} setSponsors={setSponsors} />}
          {view==='reports' && <ReportsView childrenData={childrenData} sponsorsData={sponsorsData} />}
          {view==='settings' && <SettingsView childrenData={childrenData} sponsorsData={sponsorsData} setChildren={setChildren} setSponsors={setSponsors} />}
        </main>
      </div>

      {openItem && <DetailModal item={openItem} type={openType==='child' ? 'child' : 'sponsor'} onClose={()=>{ setOpenItem(null); setOpenType(null)}} onSave={()=>{}} childrenData={childrenData} sponsorsData={sponsorsData} setChildren={setChildren} setSponsors={setSponsors} />}

    </div>
  )
}
