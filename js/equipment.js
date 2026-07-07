const EQ = {
  id: ["Mã tài sản", "ID"],
  position: ["Vị trí khu vực", "VỊ TRÍ LẮP ĐẶT\nPosition"],
  name: ["Tên thiết bị", "TÊN\nName"],
  model: ["Model", "MODEL"],
  serial: ["Số Serial", "Serial"],
  status: ["Loại trạng thái/sự kiện", "Trạng thái"],
  assetName: ["Tên theo mã tài sản", "Tên Theo mã tài sản"],
  manufacturer: ["HÃNG SX\nManufacturer"],
  vendor: ["NHÀ CUNG CẤP\nVendor"],
  maintenance: ["CHU KỲ BẢO DƯỠNG\nMaintenance cycle"],
  install: ["NGÀY LẮP ĐẶT\nInstallation date"],
  note: ["GHI CHÚ\nNote"]
};

function eqValue(item, keys) {
  return safeText(getByKeys(item, keys));
}

function initEquipment() {
  buildEquipmentFilter();
  renderEquipment();
  bindEquipmentEvent();
}

function buildEquipmentFilter() {
  const area = document.getElementById("areaFilter");
  const status = document.getElementById("statusFilter");

  area.innerHTML = '<option value="">Tất cả khu vực</option>';
  status.innerHTML = '<option value="">Tất cả trạng thái</option>';

  const areaSet = new Set();
  const statusSet = new Set();

  equipmentData.forEach(item => {
    const a = eqValue(item, EQ.position);
    const s = eqValue(item, EQ.status);

    if (a) areaSet.add(a);
    if (s) statusSet.add(s);
  });

  [...areaSet].sort().forEach(x => {
    area.innerHTML += `<option value="${x}">${x}</option>`;
  });

  [...statusSet].sort().forEach(x => {
    status.innerHTML += `<option value="${x}">${x}</option>`;
  });
}

function bindEquipmentEvent() {
  document.getElementById("areaFilter").addEventListener("change", renderEquipment);
  document.getElementById("statusFilter").addEventListener("change", renderEquipment);
  document.getElementById("searchInput").addEventListener("keyup", renderEquipment);
}

function renderEquipment() {
  const tbody = document.getElementById("equipmentTableBody");
  clearElement(tbody);

  let data = [...equipmentData];

  const area = document.getElementById("areaFilter").value;
  const status = document.getElementById("statusFilter").value;
  const keyword = document.getElementById("searchInput").value;

  if (area) {
    data = data.filter(item => eqValue(item, EQ.position) === area);
  }

  if (status) {
    data = data.filter(item => eqValue(item, EQ.status) === status);
  }

  if (keyword) {
    data = data.filter(item => matchKeyword(item, keyword));
  }

  document.getElementById("equipmentCount").innerHTML = data.length + " dòng";

  if (data.length === 0) {
    showEmptyRow(tbody, 7, "Không có dữ liệu.");
    return;
  }

  data.forEach(item => {
    const id = eqValue(item, EQ.id);

    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${eqValue(item, EQ.position)}</td>
        <td>${eqValue(item, EQ.name)}</td>
        <td>${eqValue(item, EQ.model)}</td>
        <td>${eqValue(item, EQ.serial)}</td>
        <td>${eqValue(item, EQ.status)}</td>
        <td>
          <button class="primary-btn" onclick="showEquipment('${id}')">
            Xem
          </button>
        </td>
      </tr>
    `;
  });
}
