const EQ = {
  no: "No.",
  asset: "Mã tài sản",
  name: "TÊN\nName",
  model: "MODEL",
  serial: "Serial",
  position: "VỊ TRÍ LẮP ĐẶT\nPosition",
  maintenance: "CHU KỲ BẢO DƯỠNG\nMaintenance cycle"
};

function buildEquipmentList() {
  let currentArea = "";

  return equipmentData
    .map(row => {
      const no = safeText(row[EQ.no]);
      const name = safeText(row[EQ.name]);

      if (no.includes("Khu vực") || no.includes("Area")) {
        currentArea = no;
        return null;
      }

      if (!name) return null;

      return {
        id: safeText(row[EQ.asset]) || no,
        area: safeText(row[EQ.position]) || currentArea,
        name: name,
        model: safeText(row[EQ.model]),
        serial: safeText(row[EQ.serial]),
        maintenance: safeText(row[EQ.maintenance]),
        raw: row
      };
    })
    .filter(Boolean);
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

  buildEquipmentList().forEach(item => {
    if (item.area) areaSet.add(item.area);
  });

  [...areaSet].sort().forEach(x => {
    area.innerHTML += `<option value="${x}">${x}</option>`;
  });
}

function bindEquipmentEvent() {
  document.getElementById("areaFilter").addEventListener("change", renderEquipment);
  document.getElementById("searchInput").addEventListener("keyup", renderEquipment);
}

function renderEquipment() {
  const tbody = document.getElementById("equipmentTableBody");
  tbody.innerHTML = "";

  let data = buildEquipmentList();

  const area = document.getElementById("areaFilter").value;
  const keyword = safeText(document.getElementById("searchInput").value).toLowerCase();

  if (area) {
    data = data.filter(x => x.area === area);
  }

  if (keyword) {
    data = data.filter(x =>
      JSON.stringify(x).toLowerCase().includes(keyword)
    );
  }

  document.getElementById("equipmentCount").innerHTML = data.length + " dòng";
  document.getElementById("totalEquipment").innerHTML = data.length;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Không có dữ liệu.</td></tr>`;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.area}</td>
        <td>${item.name}</td>
        <td>${item.model}</td>
        <td>${item.serial}</td>
        <td>${item.maintenance}</td>
        <td>
          <button class="primary-btn" onclick="showEquipment('${item.id}')">
            Xem
          </button>
        </td>
      </tr>
    `;
  });
}
