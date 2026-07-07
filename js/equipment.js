const EQ = {
  no: "No.",
  category: "Phân loại",
  asset: "Mã tài sản",
  assetName: "Tên Theo mã tài sản",
  name: "TÊN\nName",
  model: "MODEL",
  serial: "Serial",
  parameter: "THÔNG SỐ KỸ THUẬT\nParameter",
  quantity: "SỐ LƯỢNG\nQuantity",
  manufacturer: "HÃNG SX\nManufacturer",
  vendor: "NHÀ CUNG CẤP\nVendor",
  year: "Năm sản xuất",
  position: "VỊ TRÍ LẮP ĐẶT\nPosition",
  maintenance: "CHU KỲ BẢO DƯỠNG\nMaintenance cycle",
  install: "NGÀY LẮP ĐẶT\nInstallation date",
  accreditation: "KIỂM ĐỊNH\nAccreditation",
  calibration: "Hiệu chuẩn\nCalibration",
  note: "GHI CHÚ\nNote",
  spare: "Phụ tùng"
};

function eqText(item, key) {
  return safeText(item[key]);
}

function eqId(item) {
  return eqText(item, EQ.asset) || eqText(item, EQ.no);
}

function isRealEquipment(item) {
  const name = eqText(item, EQ.name);
  const model = eqText(item, EQ.model);
  const no = eqText(item, EQ.no);

  if (!name && !model) return false;
  if (no.includes("Khu vực")) return false;
  if (no.includes("Area")) return false;

  return true;
}

function getRealEquipmentData() {
  return equipmentData.filter(isRealEquipment);
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

  getRealEquipmentData().forEach(item => {
    const areaName = eqText(item, EQ.position);
    if (areaName) areaSet.add(areaName);
  });

  [...areaSet].sort().forEach(x => {
    area.innerHTML += `<option value="${x}">${x}</option>`;
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

  let data = getRealEquipmentData();

  const area = document.getElementById("areaFilter").value;
  const keyword = document.getElementById("searchInput").value;

  if (area) {
    data = data.filter(item => eqText(item, EQ.position) === area);
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
    const id = eqId(item);

    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${eqText(item, EQ.position)}</td>
        <td>${eqText(item, EQ.name)}</td>
        <td>${eqText(item, EQ.model)}</td>
        <td>${eqText(item, EQ.serial)}</td>
        <td>${eqText(item, EQ.maintenance)}</td>
        <td>
          <button class="primary-btn" onclick="showEquipment('${id}')">
            Xem
          </button>
        </td>
      </tr>
    `;
  });
}
