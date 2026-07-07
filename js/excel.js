const EXCEL_FILE = "./data/equipment.xlsx";

let equipmentData = [];
let eventData = [];

async function loadExcel() {
    try {
        showLoading();

        const response = await fetch(EXCEL_FILE);

        if (!response.ok) {
            throw new Error("Không đọc được file Excel");
        }

        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
            type: "array"
        });

        console.log("URL:", response.url);
console.log("Content-Type:", response.headers.get("content-type"));
console.log("Size:", arrayBuffer.byteLength);
console.log("Sheet names:", workbook.SheetNames);

        const equipmentSheet = workbook.Sheets["Equipment_Register"];
        const eventSheet = workbook.Sheets["Asset_Event_Log1"];

        console.log("Equipment sheet:", equipmentSheet);
        console.log("Event sheet:", eventSheet);

        equipmentData = XLSX.utils.sheet_to_json(equipmentSheet, {
            defval: ""
        });

        eventData = XLSX.utils.sheet_to_json(eventSheet, {
            defval: ""
        });

        console.log("Equipment rows:", equipmentData.length);
        console.log("Event rows:", eventData.length);

        afterLoadExcel();

    } catch (error) {
        console.error(error);
        alert("Không thể đọc file Excel.");
    }
}

function afterLoadExcel() {
    initDashboard();
    initEquipment();
    initHistory();
}

function showLoading() {
    document.getElementById("equipmentTableBody").innerHTML = `
        <tr>
            <td colspan="7">Đang tải dữ liệu...</td>
        </tr>
    `;

    document.getElementById("eventTableBody").innerHTML = `
        <tr>
            <td colspan="6">Đang tải dữ liệu...</td>
        </tr>
    `;
}
