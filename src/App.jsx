import { useMemo, useState } from 'react'
import {
  BarChart3, Bell, Boxes, ChevronDown, CircleUserRound, FileText, LayoutDashboard,
  Package, Plus, ReceiptText, Search, Settings, ShoppingCart, Truck, Users, WalletCards,
  ArrowDownToLine, ArrowUpFromLine, CreditCard, IndianRupee, RotateCcw, SlidersHorizontal,
} from 'lucide-react'
import Swal from 'sweetalert2'
import './App.css'

const products = [
  { code: '1001', name: 'Aashirvaad Atta 5 Kg', category: 'Grocery', unit: 'PCS', rate: 285, gst: 5, stock: 42, min: 10 },
  { code: '1002', name: 'Tata Salt 1 Kg', category: 'Grocery', unit: 'PCS', rate: 28, gst: 5, stock: 96, min: 20 },
  { code: '1003', name: 'Fortune Oil 1 Ltr', category: 'Grocery', unit: 'PCS', rate: 145, gst: 5, stock: 38, min: 10 },
  { code: '1004', name: 'Tata Tea 250 Gm', category: 'Beverages', unit: 'PCS', rate: 82, gst: 5, stock: 55, min: 15 },
  { code: '1005', name: 'Surf Excel 1 Kg', category: 'Home Care', unit: 'PCS', rate: 168, gst: 18, stock: 21, min: 8 },
  { code: '1006', name: 'Maggi Noodles 70 Gm', category: 'Grocery', unit: 'PCS', rate: 14, gst: 12, stock: 120, min: 30 },
  { code: '1007', name: 'Parle-G Biscuits 800 Gm', category: 'Grocery', unit: 'PCS', rate: 75, gst: 5, stock: 64, min: 15 },
  { code: '1008', name: 'Thums Up 750 Ml', category: 'Beverages', unit: 'PCS', rate: 45, gst: 28, stock: 18, min: 10 },
]

const customers = [
  { id: 'C001', name: 'Rahul Traders', phone: '9876543210', city: 'Moradabad', balance: 2450 },
  { id: 'C002', name: 'Sharma General Store', phone: '9812345678', city: 'Moradabad', balance: 0 },
  { id: 'C003', name: 'Amit Kumar', phone: '9898989898', city: 'Delhi', balance: 780 },
  { id: 'C004', name: 'Walk-in Customer', phone: '-', city: '-', balance: 0 },
]

const sales = [
  ['INV-000128', '11 Sep 2026', 'Rahul Traders', 'UPI', 598.50, 'Paid'],
  ['INV-000127', '11 Sep 2026', 'Walk-in Customer', 'Cash', 845.00, 'Paid'],
  ['INV-000126', '10 Sep 2026', 'Amit Kumar', 'Credit', 1240.00, 'Due'],
  ['INV-000125', '10 Sep 2026', 'Sharma General Store', 'Card', 2180.00, 'Paid'],
  ['INV-000124', '09 Sep 2026', 'Rahul Traders', 'Cash', 675.00, 'Paid'],
]

const purchases = [
  ['PUR-00041', '11 Sep 2026', 'Shiv Distributors', 12450, 'Received'],
  ['PUR-00040', '09 Sep 2026', 'Metro Wholesale', 8750, 'Received'],
  ['PUR-00039', '07 Sep 2026', 'Shiv Distributors', 15320, 'Pending'],
]

const menu = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'New Sale', icon: ReceiptText, hotkey: 'F2' },
  { label: 'Products', icon: Package, children: ['All Products', 'Categories', 'Price List'] },
  { label: 'Customers', icon: Users, children: ['All Customers', 'Add Customer', 'Customer Groups'] },
  { label: 'Stock / Inventory', icon: Boxes, children: ['Stock Overview', 'Low Stock', 'Stock Adjustment'] },
  { label: 'Purchase', icon: Truck, children: ['New Purchase', 'Purchase List', 'Suppliers'] },
  { label: 'Sales Reports', icon: BarChart3, children: ['Daily Sales', 'Sales Summary', 'GST Report', 'Payment Report'] },
  { label: 'Customer Ledger', icon: WalletCards, children: ['Ledger', 'Outstanding', 'Payments'] },
  { label: 'Settings', icon: Settings, children: ['Shop Profile', 'Invoice Settings', 'GST Settings', 'Users & Access', 'Backup & Restore'] },
]

const pageInfo = {
  Dashboard: ['Business Overview', 'Today\'s performance at a glance'],
  'New Sale': ['New Sale', 'Fast keyboard-first billing counter'],
  Products: ['Products', 'Manage your product catalogue'],
  Customers: ['Customers', 'Customer master and credit accounts'],
  'Stock / Inventory': ['Stock / Inventory', 'Track stock, alerts and adjustments'],
  Purchase: ['Purchase', 'Incoming stock and supplier records'],
  'Sales Reports': ['Sales Reports', 'Sales, GST and payment analytics'],
  'Customer Ledger': ['Customer Ledger', 'Receivables, payments and account history'],
  Settings: ['Settings', 'Configure your shop and billing preferences'],
}

function App() {
  const [active, setActive] = useState('New Sale')
  const [subtab, setSubtab] = useState('')
  const [query, setQuery] = useState('')
  const [customer, setCustomer] = useState('Walk-in Customer')
  const [payment, setPayment] = useState('Cash')
  const [cart, setCart] = useState([{ ...products[0], qty: 1 }, { ...products[1], qty: 2 }])

  const filtered = useMemo(() => products.filter((p) => `${p.code} ${p.name}`.toLowerCase().includes(query.toLowerCase())), [query])
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.rate * item.qty, 0)
    const gst = cart.reduce((sum, item) => sum + (item.rate * item.qty * item.gst) / 100, 0)
    return { subtotal, gst, total: subtotal + gst }
  }, [cart])

  const navigate = (label, child = '') => { setActive(label); setSubtab(child) }
  const addProduct = (product) => {
    setCart((items) => items.some((item) => item.code === product.code)
      ? items.map((item) => item.code === product.code ? { ...item, qty: item.qty + 1 } : item)
      : [...items, { ...product, qty: 1 }])
    setQuery('')
  }
  const updateQty = (code, delta) => setCart((items) => items.map((item) => item.code === code ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
  const removeItem = (code) => setCart((items) => items.filter((item) => item.code !== code))
  const toast = (title, text = '') => Swal.fire({ icon: 'success', title, text, confirmButtonText: 'OK', background: '#101827', color: '#e6edf7', confirmButtonColor: '#26d9ff' })
  const action = (title) => toast(title, 'Demo UI action completed. Database integration will be added later.')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">R</div><div><strong>RADID</strong><span>Billing Software</span></div></div>
        <div className="shop-box"><span>ACTIVE SHOP</span><strong>My Retail Store</strong><small>GSTIN: 09ABCDE1234F1Z5</small></div>
        <nav className="menu">
          {menu.map(({ label, icon: Icon, hotkey, children }) => <div key={label} className="menu-group">
            <button className={active === label ? 'menu-item active' : 'menu-item'} onClick={() => navigate(label)}>
              <Icon size={18} /><span>{label}</span>{hotkey && <kbd>{hotkey}</kbd>}{children && <ChevronDown size={14} className={active === label ? 'rotate' : ''} />}
            </button>
            {active === label && children && <div className="submenu">{children.map((child) => <button key={child} className={subtab === child ? 'submenu-item active' : 'submenu-item'} onClick={() => navigate(label, child)}>{child}</button>)}</div>}
          </div>)}
        </nav>
        <div className="sidebar-bottom"><div className="version">FREE EDITION · v0.1</div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><div className="breadcrumb">Billing / {active}{subtab ? ` / ${subtab}` : ''}</div><h1>{subtab || pageInfo[active][0]}</h1></div>
          <div className="top-actions"><button className="icon-btn" onClick={() => action('Notifications')}><Bell size={19} /></button><button className="user-btn" onClick={() => navigate('Settings', 'Users & Access')}><CircleUserRound size={21} /><span>Admin</span><ChevronDown size={16} /></button></div>
        </header>

        {active === 'New Sale' && !subtab ? <BillingScreen {...{ customer, setCustomer, payment, setPayment, cart, query, setQuery, filtered, addProduct, updateQty, removeItem, totals, toast, action }} /> : <PageScreen {...{ active, subtab, navigate, action }} />}
        <footer className="statusbar"><span>● System Ready</span><span>Database: Local Demo</span><span>GST: Enabled</span><span>Items in Stock: 454</span></footer>
      </main>
    </div>
  )
}

function BillingScreen({ customer, setCustomer, payment, setPayment, cart, query, setQuery, filtered, addProduct, updateQty, removeItem, totals, toast, action }) {
  return <>
    <section className="billing-toolbar"><div className="invoice-meta"><span>Invoice No.</span><strong>INV-000128</strong></div><div className="invoice-meta"><span>Date</span><strong>11 Sep 2026</strong></div><div className="invoice-meta"><span>Customer</span><select value={customer} onChange={(e) => setCustomer(e.target.value)}>{customers.map((c) => <option key={c.id}>{c.name}</option>)}</select></div><button className="outline-btn" onClick={() => action('New Customer')}><Plus size={17} /> New Customer</button></section>
    <section className="workspace">
      <div className="bill-panel"><div className="panel-heading"><div><strong>Sale Items</strong><span>Scan barcode or search product</span></div><kbd>Ctrl + B</kbd></div>
        <div className="search-wrap"><Search size={19} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product by name, code or barcode..." />{query && <span className="search-hint">{filtered.length} found</span>}</div>
        {query && <div className="product-results">{filtered.map((p) => <button key={p.code} onClick={() => addProduct(p)}><span className="result-code">{p.code}</span><span>{p.name}</span><strong>₹{p.rate}</strong></button>)}</div>}
        <div className="table-wrap"><table><thead><tr><th>#</th><th>Item / Description</th><th>Unit</th><th>Qty</th><th>Rate</th><th>GST</th><th>Amount</th><th></th></tr></thead><tbody>{cart.map((item, index) => <tr key={item.code}><td>{index + 1}</td><td><strong>{item.name}</strong><small>Code: {item.code}</small></td><td>{item.unit}</td><td><div className="qty-control"><button onClick={() => updateQty(item.code, -1)}>−</button><b>{item.qty}</b><button onClick={() => updateQty(item.code, 1)}>+</button></div></td><td>₹{item.rate.toFixed(2)}</td><td>{item.gst}%</td><td><strong>₹{(item.rate * item.qty).toFixed(2)}</strong></td><td><button className="delete-btn" onClick={() => removeItem(item.code)}>×</button></td></tr>)}</tbody></table></div>
        <div className="table-footer"><button className="add-line" onClick={() => setQuery('')}><Plus size={16} /> Add Item</button><span>{cart.length} items · {cart.reduce((s, i) => s + i.qty, 0)} qty</span></div>
      </div>
      <aside className="summary-panel"><div className="summary-title"><strong>Bill Summary</strong><span>F4</span></div><div className="summary-lines"><div><span>Subtotal</span><b>₹{totals.subtotal.toFixed(2)}</b></div><div><span>Discount</span><b>₹0.00</b></div><div><span>GST</span><b>₹{totals.gst.toFixed(2)}</b></div></div><div className="grand-total"><span>Grand Total</span><strong>₹{totals.total.toFixed(2)}</strong></div><label className="field-label">Payment Mode</label><div className="payment-grid">{['Cash', 'UPI', 'Card', 'Credit'].map((mode) => <button key={mode} className={payment === mode ? 'payment active' : 'payment'} onClick={() => setPayment(mode)}>{mode}</button>)}</div><label className="field-label">Amount Received</label><input className="amount-input" value={totals.total.toFixed(2)} readOnly /><button className="save-btn" onClick={() => toast('Bill Saved', `₹${totals.total.toFixed(2)} received by ${payment}.`)}><ShoppingCart size={18} /> SAVE & PRINT <kbd>F10</kbd></button><button className="hold-btn" onClick={() => toast('Bill Held')}><FileText size={17} /> Hold Bill <span>F6</span></button><div className="shortcut-note">Tip: <b>F2</b> new sale · <b>F10</b> save & print · <b>Ctrl+B</b> product search</div></aside>
    </section>
  </>
}

function PageScreen({ active, subtab, navigate, action }) {
  const page = subtab || pageInfo[active][0]
  const content = {
    Dashboard: <Dashboard />,
    Products: <Products />,
    Customers: <Customers />,
    'Stock / Inventory': <Inventory />,
    Purchase: <Purchase />,
    'Sales Reports': <Reports />,
    'Customer Ledger': <Ledger />,
    Settings: <SettingsPage subtab={subtab} action={action} />,
  }
  return <section className="content-page"><div className="page-header"><div><div className="eyebrow">{active}</div><h2>{page}</h2><p>{subtab ? `Manage ${subtab.toLowerCase()} in the Free Edition demo.` : pageInfo[active][1]}</p></div><button className="primary-btn" onClick={() => action(`Add / Create in ${page}`)}><Plus size={17} /> Add New</button></div>{content[active]}</section>
}
function Dashboard() {
  return <div className="dashboard-grid"><Stat title="Today's Sales" value="₹18,450" icon={IndianRupee} trend="+12.4%" /><Stat title="Invoices" value="128" icon={ReceiptText} trend="+8 today" /><Stat title="Low Stock" value="7" icon={Boxes} trend="Needs attention" /><Stat title="Receivables" value="₹6,780" icon={WalletCards} trend="12 accounts" /><Panel title="Recent Sales"><DataTable headers={['Invoice','Date','Customer','Payment','Amount','Status']} rows={sales} /></Panel><Panel title="Quick Actions"><div className="quick-actions"><Quick icon={ReceiptText} text="New Sale" /><Quick icon={Package} text="Add Product" /><Quick icon={Users} text="Add Customer" /><Quick icon={Truck} text="New Purchase" /></div></Panel></div>
}

function Products() {
  return <Panel title="Product Catalogue"><DataTable headers={['Code','Product','Category','Unit','Rate','GST','Stock']} rows={products.map((p) => [p.code,p.name,p.category,p.unit,`₹${p.rate}`,`${p.gst}%`,p.stock])} /></Panel>
}
function Customers() {
  return <Panel title="Customer Master"><DataTable headers={['ID','Customer','Phone','City','Outstanding']} rows={customers.map((c) => [c.id,c.name,c.phone,c.city,`₹${c.balance}`])} /></Panel>
}
function Inventory() {
  return <div className="stack"><Panel title="Stock Overview"><DataTable headers={['Code','Product','Current Stock','Minimum','Status']} rows={products.map((p) => [p.code,p.name,p.stock,p.min,p.stock <= p.min ? 'LOW STOCK' : 'In Stock'])} /></Panel><Panel title="Inventory Actions"><div className="quick-actions"><Quick icon={ArrowUpFromLine} text="Stock In" /><Quick icon={ArrowDownToLine} text="Stock Out" /><Quick icon={RotateCcw} text="Adjustment" /></div></Panel></div>
}
function Purchase() {
  return <Panel title="Purchase Register"><DataTable headers={['Purchase No.','Date','Supplier','Amount','Status']} rows={purchases} /></Panel>
}
function Reports() {
  return <div className="report-grid"><Panel title="Sales Summary"><div className="report-number">₹1,84,520</div><p>Monthly sales · September 2026</p><div className="fake-bars">{[35,58,45,72,62,86,68].map((h,i)=><span key={i} style={{height:`${h}%`}} />)}</div></Panel><Panel title="Payment Split"><ReportLine label="Cash" value="₹72,450" pct="39%" /><ReportLine label="UPI" value="₹81,240" pct="44%" /><ReportLine label="Card" value="₹22,680" pct="12%" /><ReportLine label="Credit" value="₹8,150" pct="5%" /></Panel><Panel title="GST Summary"><ReportLine label="Taxable Sales" value="₹1,62,300" pct="" /><ReportLine label="CGST" value="₹8,110" pct="" /><ReportLine label="SGST" value="₹8,110" pct="" /></Panel></div>
}
function Ledger() {
  return <div className="stack"><Panel title="Customer Ledger"><DataTable headers={['Customer','Opening','Sales','Payments','Balance']} rows={customers.filter(c=>c.name!=='Walk-in Customer').map(c=>[c.name,'₹0','₹12,450',`₹${12450-c.balance}`,`₹${c.balance}`])} /></Panel><Panel title="Outstanding Accounts"><div className="ledger-total">₹3,230 <span>Total Outstanding</span></div></Panel></div>
}
function SettingsPage({ subtab, action }) {
  if (!subtab) return <div className="settings-grid">{['Shop Profile','Invoice Settings','GST Settings','Users & Access','Backup & Restore'].map((x)=><button className="setting-card" key={x} onClick={()=>action(x)}><Settings size={22}/><strong>{x}</strong><span>Configure {x.toLowerCase()}</span></button>)}</div>
  if (subtab === 'Users & Access') return <UsersAccess />
  return <Panel title={subtab}><div className="settings-form"><Field label="Business Name" value="My Retail Store" /><Field label="GSTIN" value="09ABCDE1234F1Z5" /><Field label="Invoice Prefix" value="INV-" /><Field label="Print Format" value="Thermal 80mm" /><button className="primary-btn" onClick={()=>action('Settings Saved')}>Save Settings</button></div></Panel>
}

function UsersAccess() {
  const [users, setUsers] = useState([
    { id:'U001', name:'Admin', username:'admin', role:'Administrator', phone:'9876543210', status:'Active' },
    { id:'U002', name:'Billing Counter', username:'counter1', role:'Billing Operator', phone:'9812345678', status:'Active' },
  ])
  const empty = { name:'', username:'', phone:'', role:'Billing Operator', status:'Active' }
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)

  const saveUser = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.username.trim()) return Swal.fire({ icon:'warning', title:'Name and username required', background:'#101827', color:'#e6edf7', confirmButtonColor:'#26d9ff' })
    if (editing) {
      setUsers(list => list.map(u => u.id === editing ? { ...u, ...form } : u))
      Swal.fire({ icon:'success', title:'User Updated', text:`${form.name} updated successfully.`, background:'#101827', color:'#e6edf7', confirmButtonColor:'#26d9ff' })
    } else {
      const id = `U${String(users.length + 1).padStart(3,'0')}`
      setUsers(list => [...list, { ...form, id }])
      Swal.fire({ icon:'success', title:'User Added', text:`${form.name} can now be assigned billing access.`, background:'#101827', color:'#e6edf7', confirmButtonColor:'#26d9ff' })
    }
    setForm(empty); setEditing(null)
  }
  const editUser = (u) => { setEditing(u.id); setForm({ name:u.name, username:u.username, phone:u.phone, role:u.role, status:u.status }) }
  const deleteUser = (u) => Swal.fire({ icon:'warning', title:`Delete ${u.name}?`, text:'This removes the user from the demo user list.', showCancelButton:true, confirmButtonText:'Delete', cancelButtonText:'Cancel', background:'#101827', color:'#e6edf7', confirmButtonColor:'#ff526d' }).then(r => { if(r.isConfirmed) setUsers(list=>list.filter(x=>x.id!==u.id)) })
  const toggleUser = (u) => setUsers(list=>list.map(x=>x.id===u.id ? {...x,status:x.status==='Active'?'Inactive':'Active'} : x))

  return <div className="users-page">
    <div className="users-layout">
      <Panel title={editing ? 'Edit User' : 'Add New User'}>
        <form className="user-form" onSubmit={saveUser}>
          <Field label="Full Name *" value={form.name} onChange={v=>setForm({...form,name:v})} />
          <Field label="Username *" value={form.username} onChange={v=>setForm({...form,username:v})} />
          <Field label="Mobile Number" value={form.phone} onChange={v=>setForm({...form,phone:v})} />
          <label className="settings-field"><span>Role</span><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Administrator</option><option>Billing Operator</option><option>Stock Manager</option><option>Report Viewer</option></select></label>
          <label className="settings-field"><span>Status</span><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Active</option><option>Inactive</option></select></label>
          <div className="user-form-actions"><button type="submit" className="primary-btn">{editing ? 'Update User' : 'Add User'}</button>{editing && <button type="button" className="ghost-btn" onClick={()=>{setForm(empty);setEditing(null)}}>Cancel</button>}</div>
        </form>
      </Panel>
      <Panel title={`Users & Access Â· ${users.length}`}>
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>User</th><th>Username</th><th>Role</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><strong>{u.id}</strong></td><td>{u.name}</td><td>{u.username}</td><td>{u.role}</td><td>{u.phone || '-'}</td><td><button className={`status-pill ${u.status==='Active'?'on':'off'}`} onClick={()=>toggleUser(u)}>{u.status}</button></td><td><div className="row-actions"><button className="ghost-btn" onClick={()=>editUser(u)}>Edit</button><button className="danger-btn" onClick={()=>deleteUser(u)}>Delete</button></div></td></tr>)}</tbody></table></div>
      </Panel>
    </div>
    <div className="permission-note"><strong>Access model:</strong> Administrator = full access Â· Billing Operator = billing/cash counter Â· Stock Manager = inventory/purchase Â· Report Viewer = reports only. For now this is demo-state UI; database authentication and server-side permission checks will be added later.</div>
  </div>
}
function Stat({ title, value, icon: Icon, trend }) { return <div className="stat-card"><Icon size={22}/><span>{title}</span><strong>{value}</strong><small>{trend}</small></div> }
function Panel({ title, children }) { return <div className="data-panel"><div className="data-panel-title"><strong>{title}</strong><button className="ghost-btn"><SlidersHorizontal size={15}/> Filter</button></div>{children}</div> }
function DataTable({ headers, rows }) { return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{j===0?<strong>{cell}</strong>:cell}</td>)}</tr>)}</tbody></table></div> }
function Quick({ icon: Icon, text }) { return <button className="quick-card"><Icon size={20}/><span>{text}</span></button> }
function ReportLine({ label, value, pct }) { return <div className="report-line"><span>{label}</span><strong>{value}</strong><small>{pct}</small></div> }
function Field({ label, value, onChange }) { return <label className="settings-field"><span>{label}</span><input value={value} onChange={e=>onChange?.(e.target.value)} readOnly={!onChange}/></label> }

export default App
