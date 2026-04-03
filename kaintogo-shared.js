// ============================================================
// KAINTOGO SHARED DATA & UTILITIES
// Loaded by all role files via: <script src="kaintogo-shared.js">
// ============================================================

// ============================================================
// ██  IMPACT CONVERSION FACTORS — EDIT HERE TO UPDATE     ██
// ██  Source: UN FAO + WRAP methodology                   ██
// ============================================================
const IMPACT = {
  kgPerBag: 2.5,       // Default kg of food rescued per bag
  co2PerKg: 1.3,       // kg CO₂ prevented per kg food rescued (WRAP UK)
  waterPerKg: 200,     // Litres water saved per kg food rescued (FAO)
  landfillPerKg: 0.003,// m³ landfill preserved per kg food rescued
  moneyPerBag: 250,    // Avg original value per bag (for savings calc)
};

// ============================================================
// MAP CONFIGURATION
// Currently using OpenStreetMap (free, no API key needed).
// TO MIGRATE TO GOOGLE MAPS:
//   1. Replace the Leaflet <script> and <link> tags with:
//      <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
//   2. Replace L.map() calls with new google.maps.Map()
//   3. Replace L.marker() calls with new google.maps.Marker()
//   4. Replace L.tileLayer() with google.maps.ImageMapType or default tiles
//   Search for "// MAP:" comments throughout the code for all map-related lines.
// ============================================================
const MAP_CONFIG = {
  center: [14.5995, 120.9842], // Manila, Philippines
  zoom: 13,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttrib: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
};

// Demo Accounts (emails built in JS to avoid Cloudflare mangling)
const DEMO_ACCOUNTS = [
  {id:'u001',email:'customer'+'@'+'demo.com',password:'pass',name:'Alex Rivera',role:'customer',avatar:'AR',ktgId:'KTG-10001',phone:'+63 917 111 0001',country:'Philippines',birthday:'1995-06-15',gender:'male',diet:'everything',homeAddress:'123 Taft Ave, Pasay',workAddress:'BGC, Taguig',savedBags:12,moneySaved:1840,co2Saved:39,favoriteShops:['s1','s3']},
  {id:'u002',email:'merchant'+'@'+'demo.com',password:'pass',name:'Maria Santos',role:'merchant',avatar:'MS',shopId:'s1',shop:'Green Bowl'},
  {id:'u003',email:'hq'+'@'+'demo.com',password:'pass',name:'James Kain',role:'hq',avatar:'JK'},
  {id:'u004',email:'partner'+'@'+'demo.com',password:'pass',name:'Liza Gomez',role:'partner',avatar:'LG',org:'Feeding the Future PH',orgType:'foodbank'},
  {id:'u005',email:'admin'+'@'+'demo.com',password:'pass',name:'KainToGo Admin',role:'admin',avatar:'KA'},
];

const SHOPS = [
  {id:'s1',name:'Green Bowl',cuisine:'Healthy & Vegan',location:'BGC, Taguig',lat:14.5547,lng:121.0509,rating:4.8,bags:3,priceFrom:79,img:'🥗',merchantId:'u002',active:true},
  {id:'s2',name:'La Petite Boulangerie',cuisine:'French Bakery',location:'Makati City',lat:14.5547,lng:121.0244,rating:4.9,bags:2,priceFrom:89,img:'🥐',merchantId:'mx2',active:true},
  {id:'s3',name:'Spice Route',cuisine:'Asian Fusion',location:'Quezon City',lat:14.6507,lng:121.0483,rating:4.7,bags:4,priceFrom:99,img:'🍜',merchantId:'mx3',active:true},
  {id:'s4',name:'Brew & Bake',cuisine:'Cafe & Pastries',location:'Pasig City',lat:14.5764,lng:121.0851,rating:4.6,bags:2,priceFrom:79,img:'☕',merchantId:'mx4',active:true},
  {id:'s5',name:'Kusina ni Aling Rosa',cuisine:'Filipino Home Cooking',location:'Mandaluyong',lat:14.5794,lng:121.0359,rating:4.5,bags:3,priceFrom:99,img:'🍚',merchantId:'mx5',active:true},
];

const PICKUP_SLOTS = [
  '10:00 AM – 12:00 PM','12:00 PM – 2:00 PM','2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM','5:00 PM – 7:00 PM','6:00 PM – 8:00 PM','7:00 PM – 9:00 PM',
];

// Storage helpers
function kLoad(k){try{const v=localStorage.getItem('ktg_'+k);return v?JSON.parse(v):null}catch{return null}}
function kSave(k,v){try{localStorage.setItem('ktg_'+k,JSON.stringify(v))}catch{}}
function today(){return new Date().toISOString().split('T')[0]}
function fmtDate(d){return new Date(d).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}
function genId(prefix){return prefix+'-'+Date.now().toString(36).toUpperCase()}
function pct(orig,disc){return Math.round((1-disc/orig)*100)}
function allUsers(){return [...DEMO_ACCOUNTS,...(kLoad('users')||[])]}
function getCurrentUser(){return kLoad('cu')}
function setCurrentUser(u){kSave('cu',u)}
function logout(){kSave('cu',null);window.location.href='index.html'}

// Bags seed
function seedBags(){
  return [
    {id:'b1',shopId:'s1',shop:'Green Bowl',name:'Green Bowl Surprise',emoji:'🥗',cat:'Meals',price:149,orig:450,qty:5,qtyLeft:3,kg:2.5,pickup:'5:00 PM – 7:00 PM',desc:"A mix of today's freshest healthy bowls and wraps.",active:true,date:today(),bagType:'recurring',recurDays:['Mon','Tue','Wed','Thu','Fri'],diet:['everything','vegetarian','vegan']},
    {id:'b2',shopId:'s2',shop:'La Petite Boulangerie',name:'Bread & Pastry Bag',emoji:'🥐',cat:'Breads & Pastries',price:99,orig:380,qty:8,qtyLeft:5,kg:1.8,pickup:'6:00 PM – 8:00 PM',desc:'Assorted freshly baked breads and viennoiserie.',active:true,date:today(),bagType:'recurring',recurDays:['Mon','Tue','Wed','Thu','Fri','Sat'],diet:['everything','vegetarian']},
    {id:'b3',shopId:'s3',shop:'Spice Route',name:'Asian Feast Bag',emoji:'🍜',cat:'Meals',price:179,orig:520,qty:6,qtyLeft:2,kg:3.0,pickup:'7:00 PM – 8:30 PM',desc:"Generous portions of today's unsold Asian dishes.",active:true,date:today(),bagType:'one-time',recurDays:[],diet:['everything']},
    {id:'b4',shopId:'s4',shop:'Brew & Bake',name:'Cafe Surprise Box',emoji:'☕',cat:'Breads & Pastries',price:119,orig:350,qty:4,qtyLeft:4,kg:1.5,pickup:'4:00 PM – 6:00 PM',desc:'Coffee pastries, muffins, and more.',active:true,date:today(),bagType:'recurring',recurDays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],diet:['everything','vegetarian']},
    {id:'b5',shopId:'s5',shop:'Kusina ni Aling Rosa',name:'Ulam Surprise',emoji:'🍚',cat:'Meals',price:99,orig:280,qty:5,qtyLeft:3,kg:2.0,pickup:'6:00 PM – 8:00 PM',desc:'Traditional Filipino home-cooked meals.',active:true,date:today(),bagType:'recurring',recurDays:['Mon','Tue','Wed','Thu','Fri'],diet:['everything']},
    {id:'b6',shopId:'s1',shop:'Green Bowl',name:'Smoothie Bowl Bag',emoji:'🫐',cat:'Groceries',price:129,orig:390,qty:3,qtyLeft:1,kg:2.0,pickup:'5:00 PM – 7:00 PM',desc:'Smoothie bowls and healthy snacks.',active:true,date:today(),bagType:'one-time',recurDays:[],diet:['everything','vegetarian','vegan']},
  ];
}

function seedOrders(){
  return [
    {id:'ORD-AA1B2',customerId:'u001',customerName:'Alex Rivera',ktgId:'KTG-10001',shopId:'s1',shop:'Green Bowl',bagId:'b1',bagName:'Green Bowl Surprise',price:149,kgSaved:2.5,co2Saved:3.25,waterSaved:500,status:'completed',date:'2026-03-10',pickup:'5:00 PM – 7:00 PM',pickupCode:'KTG-AA1B2-XZ9',assignedFriendId:null},
    {id:'ORD-CC3D4',customerId:'u001',customerName:'Alex Rivera',ktgId:'KTG-10001',shopId:'s3',shop:'Spice Route',bagId:'b3',bagName:'Asian Feast Bag',price:179,kgSaved:3.0,co2Saved:3.9,waterSaved:600,status:'confirmed',date:today(),pickup:'7:00 PM – 8:30 PM',pickupCode:'KTG-CC3D4-PQ7',assignedFriendId:null},
  ];
}

function seedWasteLogs(){
  return [
    {id:'W001',shopId:'s1',date:'2026-03-10',category:'Edible',type:'Prepared meals',qty:3.5,condition:'Fresh',storage:'Fridge',expiry:'2026-03-11',partner:'Feeding the Future PH',status:'donated'},
    {id:'W002',shopId:'s1',date:'2026-03-11',category:'Inedible',type:'Bakery items',qty:1.2,condition:'Stale',storage:'Room temp',expiry:null,partner:'EcoRecycle PH',status:'recycled'},
  ];
}

function seedPartners(){
  return [
    {id:'p1',name:'Feeding the Future PH',type:'foodbank',contact:'liza'+'@'+'feedingfuture.ph',area:'Metro Manila',status:'active',partneredShops:['s1','s2']},
    {id:'p2',name:'EcoRecycle PH',type:'recycler',contact:'ops'+'@'+'ecorecycle.ph',area:'NCR',status:'active',partneredShops:['s1']},
    {id:'p3',name:'Caritas Manila',type:'ngo',contact:'info'+'@'+'caritas.ph',area:'Metro Manila',status:'pending',partneredShops:[]},
  ];
}

// Shared CSS variables string (injected into each page's <style>)
const SHARED_CSS = `
:root{
  --g:#1B4D3E;--gl:#E5F5E8;--gm:#2d6b58;--gd:#133829;
  --w:#FFFFFF;--dark:#212529;--gray:#6c757d;--lgray:#f8f9fa;
  --bdr:#dee2e6;--amber:#e8a020;--amber-l:#fff8e6;--red:#dc3545;
  --r:8px;--rl:16px;
  --sh:0 2px 12px rgba(27,77,62,.10);--shl:0 8px 32px rgba(27,77,62,.15);
  --serif:'Cormorant Garamond',serif;--sans:'Montserrat',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--sans);background:var(--lgray);color:var(--dark)}
.hidden{display:none!important}
.btn{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.8px;padding:9px 22px;border-radius:var(--r);border:1.5px solid var(--g);cursor:pointer;transition:all .2s;text-transform:uppercase;display:inline-block}
.btn-p{background:var(--g);color:var(--w)}.btn-p:hover{background:var(--gd)}
.btn-o{background:transparent;color:var(--g)}.btn-o:hover{background:var(--gl)}
.btn-sm{padding:6px 14px;font-size:10px}
.btn-amber{background:var(--amber);color:var(--w);border-color:var(--amber)}
.btn-danger{border-color:var(--red);color:var(--red);background:transparent}.btn-danger:hover{background:#fff5f5}
.btn-w{background:white;color:var(--g);border-color:white}.btn-w:hover{background:var(--gl)}
.btn-ghost{border-color:rgba(255,255,255,.5);color:white;background:transparent}.btn-ghost:hover{background:rgba(255,255,255,.1)}
.fg{margin-bottom:1rem}
.fg label{display:block;font-size:10px;font-weight:700;color:var(--dark);letter-spacing:.8px;text-transform:uppercase;margin-bottom:5px}
.fg input,.fg select,.fg textarea{width:100%;padding:10px 14px;border:1.5px solid var(--bdr);border-radius:var(--r);font-family:var(--sans);font-size:13px;color:var(--dark);transition:border-color .2s;background:var(--w)}
.fg input:focus,.fg select:focus,.fg textarea:focus{outline:none;border-color:var(--g)}
.fg textarea{resize:vertical;min-height:80px}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--g);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase}
.b-green{background:var(--gl);color:var(--g)}.b-amber{background:#fff3cd;color:#856404}
.b-blue{background:#cff4fc;color:#055160}.b-red{background:#f8d7da;color:#842029}
.b-gray{background:#e9ecef;color:#495057}
.card{background:var(--w);border-radius:var(--rl);box-shadow:var(--sh);overflow:hidden}
.scard{background:var(--w);border-radius:var(--rl);padding:1.25rem;box-shadow:var(--sh)}
.slbl{font-size:10px;font-weight:700;color:var(--gray);letter-spacing:.8px;text-transform:uppercase;margin-bottom:.4rem}
.sval{font-family:var(--serif);font-size:28px;font-weight:600;color:var(--g);line-height:1}
.schg{font-size:10px;color:#28a745;margin-top:5px;font-weight:600}
.icard{background:var(--g);border-radius:var(--rl);padding:1.25rem;color:white;box-shadow:var(--sh)}
.icard .ico2{font-size:26px;margin-bottom:.5rem}
.icard .ilbl{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:4px}
.icard .ival{font-family:var(--serif);font-size:30px;font-weight:600}
.icard .iunit{font-size:11px;color:rgba(255,255,255,.7);margin-top:2px}
.tcard{background:var(--w);border-radius:var(--rl);box-shadow:var(--sh);overflow:hidden;margin-bottom:1.5rem}
.thead2{padding:1rem 1.25rem;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
.thead2 h3{font-family:var(--serif);font-size:17px}
table{width:100%;border-collapse:collapse}
thead th{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--gray);padding:9px 14px;text-align:left;background:var(--lgray);border-bottom:1px solid var(--bdr)}
tbody tr{border-bottom:1px solid var(--bdr);transition:background .15s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--gl)}
tbody td{padding:11px 14px;font-size:12px}
.moverlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:500;display:none;align-items:center;justify-content:center;padding:1rem}
.moverlay.open{display:flex}
.modal{background:var(--w);border-radius:var(--rl);padding:2rem;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;position:relative}
.modal h3{font-family:var(--serif);font-size:22px;color:var(--g);margin-bottom:1.25rem}
.mfoot{display:flex;gap:10px;justify-content:flex-end;margin-top:1.5rem}
.close-x{position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:20px;cursor:pointer;color:var(--gray)}
.tabs{display:flex;border-bottom:2px solid var(--bdr);margin-bottom:1.5rem;overflow-x:auto}
.tab{padding:10px 18px;font-size:11px;font-weight:700;letter-spacing:.5px;cursor:pointer;color:var(--gray);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s;text-transform:uppercase;white-space:nowrap}
.tab.act{color:var(--g);border-bottom-color:var(--g)}
.dash{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 64px)}
.dside{background:var(--w);border-right:1px solid var(--bdr);padding:1rem 0}
.ditem{display:flex;align-items:center;gap:10px;padding:10px 1.25rem;font-size:12px;font-weight:600;color:var(--gray);cursor:pointer;transition:all .2s;border-left:3px solid transparent}
.ditem:hover,.ditem.act{color:var(--g);background:var(--gl);border-left-color:var(--g)}
.ditem .ico{font-size:15px;width:20px;text-align:center}
.dcon{padding:1.5rem;background:var(--lgray);overflow-y:auto}
.dhead{margin-bottom:1.5rem}
.dhead h2{font-family:var(--serif);font-size:26px}
.dhead p{font-size:12px;color:var(--gray);margin-top:3px}
.sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem}
.igrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem}
.chart-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem}
.chart-card{background:var(--w);border-radius:var(--rl);padding:1.25rem;box-shadow:var(--sh)}
.chart-card h3{font-family:var(--serif);font-size:16px;margin-bottom:1rem}
.chart-wrap{position:relative;height:200px}
.frow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:1.25rem}
.fsel{padding:7px 12px;border:1.5px solid var(--bdr);border-radius:var(--r);font-family:var(--sans);font-size:11px;font-weight:600;color:var(--dark);background:var(--w);cursor:pointer}
.fsel:focus{outline:none;border-color:var(--g)}
.search-in{padding:8px 14px;border:1.5px solid var(--bdr);border-radius:var(--r);font-family:var(--sans);font-size:12px;color:var(--dark);background:var(--w)}
.search-in:focus{outline:none;border-color:var(--g)}
.toast-con{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{background:var(--dark);color:white;padding:11px 18px;border-radius:var(--r);font-size:12px;font-weight:500;box-shadow:var(--shl);animation:tin .3s ease;max-width:320px}
.toast.s{background:var(--g)}.toast.e{background:var(--red)}
@keyframes tin{from{transform:translateX(80px);opacity:0}to{transform:translateX(0);opacity:1}}
nav{background:var(--w);border-bottom:1px solid var(--bdr);padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:200}
.logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.logo img{height:36px;object-fit:contain}
.logo-text{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--g);letter-spacing:2px}
.ham{display:none;background:none;border:none;cursor:pointer;font-size:22px;color:var(--dark)}
.err{background:#fff5f5;border:1px solid #f5c6c6;color:var(--red);border-radius:var(--r);padding:10px 14px;font-size:12px;margin-bottom:1rem}
@media(max-width:900px){.dash{grid-template-columns:1fr}.dside{display:none}.ham{display:block}}
@media(max-width:600px){.chart-row{grid-template-columns:1fr}.sgrid{grid-template-columns:1fr 1fr}.igrid{grid-template-columns:1fr 1fr}}
`;

function toast(msg,type=''){
  let con=document.getElementById('toastCon');
  if(!con){con=document.createElement('div');con.className='toast-con';con.id='toastCon';document.body.appendChild(con);}
  const el=document.createElement('div');el.className='toast '+(type||'');el.textContent=msg;
  con.appendChild(el);setTimeout(()=>el.remove(),3500);
}
function closeMod(id){document.getElementById(id)?.classList.remove('open');}
function openMod(id){document.getElementById(id)?.classList.add('open');}
function calcImpact(resArr){
  const comp=resArr.filter(r=>r.status==='completed'||r.status==='confirmed');
  const kgSaved=+comp.reduce((a,r)=>a+r.kgSaved,0).toFixed(2);
  const revenue=comp.reduce((a,r)=>a+r.price,0);
  const co2=+comp.reduce((a,r)=>a+r.co2Saved,0).toFixed(2);
  const water=+comp.reduce((a,r)=>a+r.waterSaved,0).toFixed(0);
  const landfill=+(kgSaved*IMPACT.landfillPerKg).toFixed(4);
  const moneySaved=comp.reduce((a,r)=>a+(r.origPrice||0)-r.price,0);
  return{kgSaved,revenue,co2,water,landfill,bagsSold:comp.length,moneySaved};
}
function filterByPeriod(data,period,shopId=null){
  let from=new Date();
  if(period==='today')from.setHours(0,0,0,0);
  else if(period==='week')from.setDate(from.getDate()-7);
  else if(period==='month')from.setDate(from.getDate()-30);
  else if(period==='year')from.setFullYear(from.getFullYear()-1);
  else return shopId?data.filter(r=>r.shopId===shopId):data;
  let res=data.filter(r=>new Date(r.date)>=from);
  if(shopId)res=res.filter(r=>r.shopId===shopId);
  return res;
}
