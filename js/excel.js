// ======================================
// NEMS Enterprise V3
// excel.js
// ======================================

const EXCEL_FILE = ".data/Quản lý thiết bị.xlsx";

let equipmentData = [];
let eventData = [];

async function loadExcel() {

    try {

        showLoading();

        const response = await fetch(
            EXCEL_FILE + "?v=" + new Date().getTime()
        );

        if (!response.ok) {

            throw new Error("Không đọc được file Excel");

        }

        const arrayBuffer =
            await response.arrayBuffer();

        const workbook =
            XLSX.read(arrayBuffer, {
                type: "array"
            });

        equipmentData =
            XLSX.utils.sheet_to_json(
                workbook.Sheets["Equipment_Register"],
                {
                    defval: ""
                }
            );

        eventData =
            XLSX.utils.sheet_to_json(
                workbook.Sheets["Asset_Event_Log1"],
                {
                    defval: ""
                }
            );

        afterLoadExcel();

    }

    catch (error) {

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

    const equipmentBody =
        document.getElementById("equipmentTableBody");

    const eventBody =
        document.getElementById("eventTableBody");

    equipmentBody.innerHTML =

        `<tr>

            <td colspan="7">

                Đang tải dữ liệu...

            </td>

        </tr>`;

    eventBody.innerHTML =

        `<tr>

            <td colspan="6">

                Đang tải dữ liệu...

            </td>

        </tr>`;

}
