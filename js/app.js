
const I18N = {
  vi: {
    subtitle: "Nhà Máy Biên Hòa - NANOCO / Biên Hòa Factory - NANOCO",
    eyebrow: "Cổng tra cứu thiết bị",
    heroTitle: "Tra cứu lý lịch và lịch sử máy trong một trang",
    heroDesc: "Tìm theo tên máy, mã tài sản, model, serial, khu vực, hãng sản xuất hoặc nhà cung cấp. Phù hợp để trình bày nhanh cho quản lý, auditor và khách hàng.",
    equipmentCount: "Thiết bị",
    statEquipment: "Tổng thiết bị",
    statArea: "Khu vực",
    statEvents: "Sự kiện",
    statVisible: "Đang hiển thị",
    searchTitle: "Tìm kiếm thiết bị",
    searchHint: "Nhập bất kỳ thông tin nào bạn biết: tên máy, model, serial, khu vực, hãng...",
    allAreas: "Tất cả khu vực",
    allStatus: "Tất cả trạng thái",
    allTypes: "Tất cả loại thiết bị",
    equipmentList: "Danh sách thiết bị",
    emptyTitle: "Chọn một thiết bị để xem chi tiết",
    emptyDesc: "Hoặc nhập từ khóa vào ô tìm kiếm để lọc nhanh danh sách.",
    profile: "Lý lịch máy",
    history: "Lịch sử thiết bị",
    noHistory: "Chưa có lịch sử cho thiết bị này.",
    qr: "QR từng máy",
    searchPh: "Nhập tên máy, model, serial, khu vực, hãng...",
    fields: {
      no:"No.", category:"Phân loại", assetId:"Mã tài sản", assetName:"Tên theo mã tài sản", machineName:"Tên máy",
      model:"Model", serial:"Serial", parameter:"Thông số kỹ thuật", quantity:"Số lượng", manufacturer:"Hãng SX",
      vendor:"Nhà cung cấp", year:"Năm sản xuất", position:"Vị trí lắp đặt", maintenanceCycle:"Chu kỳ bảo dưỡng",
      installationDate:"Ngày lắp đặt", accreditation:"Kiểm định", calibration:"Hiệu chuẩn", note:"Ghi chú", status:"Trạng thái"
    }
  },
  en: {
    subtitle: "Biên Hòa Factory - NANOCO / Nhà Máy Biên Hòa - NANOCO",
    eyebrow: "Equipment lookup portal",
    heroTitle: "View equipment profile and history on one page",
    heroDesc: "Search by machine name, asset ID, model, serial, area, manufacturer, or vendor. Suitable for quick presentation to management, auditors, and customers.",
    equipmentCount: "Equipment",
    statEquipment: "Total equipment",
    statArea: "Areas",
    statEvents: "Events",
    statVisible: "Visible",
    searchTitle: "Search Equipment",
    searchHint: "Enter any information you know: machine name, model, serial, area, manufacturer...",
    allAreas: "All areas",
    allStatus: "All status",
    allTypes: "All equipment types",
    equipmentList: "Equipment List",
    emptyTitle: "Select equipment to view details",
    emptyDesc: "Or enter a keyword in the search box to filter the list quickly.",
    profile: "Equipment Profile",
    history: "Equipment History",
    noHistory: "No history for this equipment yet.",
    qr: "Machine QR",
    searchPh: "Enter machine name, model, serial, area, manufacturer...",
    fields: {
      no:"No.", category:"Category", assetId:"Asset ID", assetName:"Asset Name", machineName:"Machine Name",
      model:"Model", serial:"Serial", parameter:"Parameter", quantity:"Quantity", manufacturer:"Manufacturer",
      vendor:"Vendor", year:"Year", position:"Position", maintenanceCycle:"Maintenance Cycle",
      installationDate:"Installation Date", accreditation:"Accreditation", calibration:"Calibration", note:"Note", status:"Status"
    }
  }
};

let lang = localStorage.getItem("lang") || "vi";
let equipment = [];
let history = [];
let filtered = [];
let selectedId = null;

async function loadData(){
  const [eq, hi] = await Promise.all([
    fetch("data/equipment.json").then(r=>r.json()),
    fetch("data/history.json").then(r=>r.json())
  ]);
  equipment = eq;
  history = hi;
  filtered = [...equipment];
  selectedId = getUrlId() || (equipment[0]?.assetId || equipment[0]?.machineName);
  setupFilters();
  applyLang();
  render();
}

function getUrlId(){
  return new URLSearchParams(location.search).get("id");
}

function t(key){
  return I18N[lang][key] || key;
}

function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.getElementById("langBtn").textContent = lang === "vi" ? "EN" : "VI";
  document.getElementById("searchInput").placeholder = t("searchPh");
}

function normalize(v){
  return (v ?? "").toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function keyOf(e){
  return e.assetId || e.assetName || e.machineName || e.no;
}

function setupFilters(){
  const area = [...new Set(equipment.map(e=>e.position || e.area).filter(Boolean))].sort();
  const status = [...new Set(equipment.map(e=>e.status).filter(Boolean))].sort();
  const type = [...new Set(equipment.map(e=>e.category || e.machineType).filter(Boolean))].sort();
  fillSelect("areaFilter", area, t("allAreas"));
  fillSelect("statusFilter", status, t("allStatus"));
  fillSelect("typeFilter", type, t("allTypes"));
}

function fillSelect(id, arr, label){
  const s = document.getElementById(id);
  const current = s.value;
  s.innerHTML = `<option value="">${label}</option>` + arr.map(v=>`<option>${escapeHtml(v)}</option>`).join("");
  s.value = current;
}

function filterData(){
  const q = normalize(document.getElementById("searchInput").value);
  const area = document.getElementById("areaFilter").value;
  const status = document.getElementById("statusFilter").value;
  const type = document.getElementById("typeFilter").value;
  filtered = equipment.filter(e=>{
    const text = normalize(Object.values(e).join(" "));
    const okQ = !q || text.includes(q);
    const okA = !area || (e.position || e.area) === area;
    const okS = !status || e.status === status;
    const okT = !type || (e.category || e.machineType) === type;
    return okQ && okA && okS && okT;
  });
  if(!filtered.some(e=>keyOf(e)===selectedId) && filtered[0]) selectedId = keyOf(filtered[0]);
  render();
}

function render(){
  renderStats();
  renderList();
  renderDetail();
}

function renderStats(){
  document.getElementById("totalCount").textContent = equipment.length;
  document.getElementById("statEquip").textContent = equipment.length;
  document.getElementById("statArea").textContent = new Set(equipment.map(e=>e.position || e.area).filter(Boolean)).size;
  document.getElementById("statEvents").textContent = history.length;
  document.getElementById("statVisible").textContent = filtered.length;
  document.getElementById("listCount").textContent = filtered.length;
}

function renderList(){
  const box = document.getElementById("equipmentList");
  box.innerHTML = filtered.map(e=>{
    const id = keyOf(e);
    return `<div class="equip-item ${id===selectedId?'active':''}" onclick="selectEquipment('${escapeAttr(id)}')">
      <div class="item-title">${escapeHtml(e.machineName || e.assetName || "-")}</div>
      <div class="item-meta">
        ${(e.model||"-")} · ${(e.position||e.area||"-")}<br>
        ${(e.manufacturer||"-")} · ${(e.vendor||"-")}
      </div>
      <span class="badge">${escapeHtml(e.status || "Running")}</span>
    </div>`
  }).join("");
}

function selectEquipment(id){
  selectedId = id;
  const url = new URL(location.href);
  url.searchParams.set("id", id);
  history.replaceState(null,"",url);
  render();
  document.getElementById("detailPanel").scrollIntoView({behavior:"smooth",block:"start"});
}

function matchHistory(e,h){
  const ids = [e.assetId,e.assetName,e.machineName,e.model,e.serial].filter(Boolean).map(normalize);
  const hText = normalize([h.assetId,h.machineName,h.model,h.serial].join(" "));
  return ids.some(id=>id && hText.includes(id));
}

function renderDetail(){
  const panel = document.getElementById("detailPanel");
  const e = equipment.find(x=>keyOf(x)===selectedId) || filtered[0] || equipment[0];
  if(!e){
    panel.innerHTML = `<div class="empty"><h3>${t("emptyTitle")}</h3><p>${t("emptyDesc")}</p></div>`;
    return;
  }
  const evs = history.filter(h=>matchHistory(e,h)).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const qrLink = `${location.origin}${location.pathname}?id=${encodeURIComponent(keyOf(e))}`;
  panel.innerHTML = `
    <div class="detail-hero">
      <div class="detail-title">
        <h2>${escapeHtml(e.machineName || "-")}</h2>
        <div class="detail-sub">${escapeHtml([e.assetId,e.model,e.position||e.area].filter(Boolean).join(" · "))}</div>
        <span class="badge">${escapeHtml(e.status || "Running")}</span>
      </div>
      <div class="qr-box"><b>${t("qr")}</b><br>${escapeHtml(qrLink)}</div>
    </div>

    <h3 class="block-title">${t("profile")}</h3>
    <div class="info-grid">
      ${info("no",e.no)}
      ${info("category",e.category)}
      ${info("assetId",e.assetId || "-")}
      ${info("assetName",e.assetName || "-")}
      ${info("model",e.model || "-")}
      ${info("serial",e.serial || "-")}
      ${info("parameter",e.parameter || "-")}
      ${info("quantity",e.quantity || "-")}
      ${info("manufacturer",e.manufacturer || "-")}
      ${info("vendor",e.vendor || "-")}
      ${info("year",e.year || "-")}
      ${info("position",e.position || e.area || "-")}
      ${info("maintenanceCycle",e.maintenanceCycle || "-")}
      ${info("installationDate",e.installationDate || "-")}
      ${info("accreditation",e.accreditation || "-")}
      ${info("calibration",e.calibration || "-")}
      ${info("note",e.note || e.remark || "-")}
      ${info("status",e.status || "-")}
    </div>

    <h3 class="block-title">${t("history")}</h3>
    ${evs.length ? `<div class="timeline">${evs.map(eventHtml).join("")}</div>` : `<div class="no-events">${t("noHistory")}</div>`}
  `;
}

function info(k,v){
  return `<div class="info"><label>${escapeHtml(I18N[lang].fields[k] || k)}</label><div>${escapeHtml(v ?? "-")}</div></div>`;
}

function eventHtml(ev){
  return `<div class="event">
    <div class="event-head"><span>${escapeHtml(ev.type || ev.eventType || "Event")}</span><span>${escapeHtml(formatDate(ev.date))}</span></div>
    <p>${escapeHtml(ev.description || ev.content || ev.note || "-")}</p>
    <div class="event-foot">
      ${escapeHtml([ev.reporter && "Reporter: "+ev.reporter, ev.responsible && "PIC: "+ev.responsible, ev.result && "Result: "+ev.result, ev.downtime && "Downtime: "+ev.downtime, ev.cost && "Cost: "+ev.cost].filter(Boolean).join(" · "))}
    </div>
  </div>`
}

function formatDate(d){
  if(!d) return "-";
  return String(d).slice(0,10);
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,"&#096;")}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("searchInput").addEventListener("input", filterData);
  ["areaFilter","statusFilter","typeFilter"].forEach(id=>document.getElementById(id).addEventListener("change", filterData));
  document.getElementById("langBtn").addEventListener("click",()=>{
    lang = lang === "vi" ? "en" : "vi";
    localStorage.setItem("lang",lang);
    setupFilters();
    applyLang();
    render();
  });
  loadData();
});
