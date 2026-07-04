let equipment = [];
let historyData = [];
let lang = 'vi';

const vi = {
  allArea:'Tất cả khu vực', allStatus:'Tất cả trạng thái', search:'Nhập mã máy, tên máy, khu vực, model, serial...',
  back:'← Quay lại danh sách', info:'Thông tin thiết bị', docs:'Tài liệu', history:'Lịch sử thiết bị', noHistory:'Chưa có lịch sử công khai cho thiết bị này.', noResult:'Không tìm thấy thiết bị phù hợp.',
  operation:'Hướng dẫn vận hành', maintenance:'Hướng dẫn bảo trì', calibration:'Hiệu chuẩn', certificate:'Chứng nhận', video:'Video'
};
const en = {
  allArea:'All areas', allStatus:'All status', search:'Search asset ID, machine name, area, model, serial...',
  back:'← Back to list', info:'Equipment information', docs:'Documents', history:'Equipment history', noHistory:'No public history for this equipment.', noResult:'No matching equipment found.',
  operation:'Operation Manual', maintenance:'Maintenance Guide', calibration:'Calibration', certificate:'Certificate', video:'Video'
};
const t = () => lang === 'vi' ? vi : en;

async function loadData(){
  const [eqRes, hisRes] = await Promise.all([fetch('data/equipment.json'), fetch('data/history.json')]);
  equipment = await eqRes.json();
  historyData = await hisRes.json();
  initFilters();
  applyUrlId();
  renderList();
}

function initFilters(){
  const areas = [...new Set(equipment.map(e=>e.area).filter(Boolean))].sort();
  const statuses = [...new Set(equipment.map(e=>e.status).filter(Boolean))].sort();
  areaFilter.innerHTML = `<option value="">${t().allArea}</option>` + areas.map(a=>`<option>${a}</option>`).join('');
  statusFilter.innerHTML = `<option value="">${t().allStatus}</option>` + statuses.map(s=>`<option>${s}</option>`).join('');
  searchInput.placeholder = t().search;
}

function filtered(){
  const q = searchInput.value.trim().toLowerCase();
  const area = areaFilter.value;
  const status = statusFilter.value;
  return equipment.filter(e=>{
    const hay = [e.assetId,e.machineName,e.area,e.machineType,e.model,e.serial,e.manufacturer,e.status].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!area || e.area===area) && (!status || e.status===status);
  });
}

function renderList(){
  detail.classList.add('hidden');
  equipmentList.classList.remove('hidden');
  const rows = filtered();
  if(!rows.length){ equipmentList.innerHTML = `<div class="empty">${t().noResult}</div>`; return; }
  equipmentList.innerHTML = rows.map(e=>`
    <article class="card" onclick="showDetail('${e.assetId}')">
      <div class="thumb">${e.photo ? `<img src="${e.photo}" alt="${e.machineName}">` : '<div class="placeholder">🏭</div>'}</div>
      <h3>${e.machineName}</h3>
      <div class="meta"><b>${e.assetId}</b> · ${e.area}<br>Model: ${e.model || '-'} · Serial: ${e.serial || '-'}</div>
      <span class="status ${/stop|ngưng|hỏng|repair/i.test(e.status)?'stop':''}">${e.status || '-'}</span>
    </article>`).join('');
}

function showDetail(id){
  const e = equipment.find(x=>x.assetId===id);
  if(!e) return;
  history.pushState(null,'',`?id=${encodeURIComponent(id)}`);
  equipmentList.classList.add('hidden');
  detail.classList.remove('hidden');
  const events = historyData.filter(h=>h.assetId===id).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  detail.innerHTML = `
    <button class="back" onclick="backToList()">${t().back}</button>
    <div class="detail-head">
      <div class="detail-img">${e.photo ? `<img src="${e.photo}" alt="${e.machineName}">` : '🏭'}</div>
      <div>
        <h2>${e.machineName}</h2>
        <span class="status ${/stop|ngưng|hỏng|repair/i.test(e.status)?'stop':''}">${e.status || '-'}</span>
        <h3>${t().info}</h3>
        <div class="info-grid">
          ${info('Asset ID',e.assetId)}${info('Area',e.area)}${info('Machine Type',e.machineType)}${info('Model',e.model)}${info('Serial',e.serial)}${info('Manufacturer',e.manufacturer)}${info('Installation Date',e.installationDate)}${info('Remark',e.remark)}
        </div>
        <div class="docs">
          ${doc(e.operationManual,t().operation)}${doc(e.maintenanceGuide,t().maintenance)}${doc(e.calibration,t().calibration,'secondary')}${doc(e.certificate,t().certificate,'secondary')}${doc(e.video,t().video,'secondary')}
        </div>
      </div>
    </div>
    <div class="history">
      <h3>${t().history}</h3>
      <div class="timeline">
        ${events.length ? events.map(renderEvent).join('') : `<div class="empty">${t().noHistory}</div>`}
      </div>
    </div>`;
  window.scrollTo({top:0,behavior:'smooth'});
}
function info(label,value){return `<div class="info"><div class="label">${label}</div><div class="value">${value || '-'}</div></div>`}
function doc(url,label,cls=''){return url ? `<a class="doc-btn ${cls}" href="${url}" target="_blank" rel="noopener">${label}</a>` : ''}
function renderEvent(h){return `<div class="event"><div class="event-top"><span class="event-type">${h.type}</span><span>${h.date}</span></div><p>${h.content}</p><small>Status: ${h.status || '-'}${h.result ? ' · Result: '+h.result : ''}</small></div>`}
function backToList(){ history.pushState(null,'',location.pathname); detail.classList.add('hidden'); equipmentList.classList.remove('hidden'); }
function applyUrlId(){ const id = new URLSearchParams(location.search).get('id'); if(id) setTimeout(()=>showDetail(id),200); }

searchInput.addEventListener('input',renderList); areaFilter.addEventListener('change',renderList); statusFilter.addEventListener('change',renderList);
langBtn.addEventListener('click',()=>{ lang = lang==='vi'?'en':'vi'; langBtn.textContent = lang==='vi'?'EN':'VI'; initFilters(); renderList(); });
loadData().catch(err=>{equipmentList.innerHTML='<div class="empty">Không tải được dữ liệu. Vui lòng kiểm tra file data/equipment.json.</div>'; console.error(err);});
