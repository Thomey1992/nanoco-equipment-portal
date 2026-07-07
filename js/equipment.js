// ======================================
// NEMS Enterprise V3
// equipment.js
// ======================================

const EQ = {

    id: "Mã tài sản",

    assetName: "Tên Theo mã tài sản",

    name: "TÊN\nName",

    model: "MODEL",

    serial: "Serial",

    manufacturer: "HÃNG SX\nManufacturer",

    vendor: "NHÀ CUNG CẤP\nVendor",

    position: "VỊ TRÍ LẮP ĐẶT\nPosition",

    maintenance: "CHU KỲ BẢO DƯỠNG\nMaintenance cycle",

    install: "NGÀY LẮP ĐẶT\nInstallation date",

    note: "GHI CHÚ\nNote"

};

let equipmentFilter = [];

function initEquipment() {

    buildEquipmentFilter();

    renderEquipment();

    bindEquipmentEvent();

}

function buildEquipmentFilter() {

    const area = document.getElementById("areaFilter");

    area.innerHTML =
        '<option value="">Tất cả khu vực</option>';

    const list =
        uniqueValues(
            equipmentData,
            EQ.position
        );

    list.forEach(item => {

        area.innerHTML +=
            `<option value="${item}">
                ${item}
            </option>`;

    });

}

function bindEquipmentEvent() {

    document
        .getElementById("areaFilter")
        .addEventListener("change", renderEquipment);

    document
        .getElementById("searchInput")
        .addEventListener("keyup", renderEquipment);

}

function renderEquipment() {

    const tbody =
        document.getElementById("equipmentTableBody");

    clearElement(tbody);

    let data = [...equipmentData];

    const area =
        document.getElementById("areaFilter").value;

    const keyword =
        document.getElementById("searchInput").value;

    if (area !== "") {

        data = data.filter(item =>
            safeText(item[EQ.position]) === area
        );

    }

    if (keyword !== "") {

        data = data.filter(item =>
            matchKeyword(item, keyword)
        );

    }

    document.getElementById("equipmentCount").innerHTML =
        data.length + " dòng";

    if (data.length === 0) {

        showEmptyRow(
            tbody,
            7,
            "Không có dữ liệu."
        );

        return;

    }

    data.forEach(item => {

        tbody.innerHTML += `

<tr>

<td>${safeText(item[EQ.id])}</td>

<td>${safeText(item[EQ.position])}</td>

<td>${safeText(item[EQ.name])}</td>

<td>${safeText(item[EQ.model])}</td>

<td>${safeText(item[EQ.serial])}</td>

<td>${safeText(item[EQ.manufacturer])}</td>

<td>

<button
class="primary-btn"
onclick="showEquipment('${safeText(item[EQ.id])}')">

Xem

</button>

</td>

</tr>

`;

    });

}
