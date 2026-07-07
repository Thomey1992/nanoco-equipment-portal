// ================================
// NEMS Enterprise V3
// ================================

const EXCEL_FILE =
  "data/Quản lý thiết bị.xlsx";

let equipmentData = [];
let eventData = [];

const equipmentBody =
  document.getElementById("equipmentTableBody");

const eventBody =
  document.getElementById("eventTableBody");

const areaFilter =
  document.getElementById("areaFilter");

const statusFilter =
  document.getElementById("statusFilter");

const searchInput =
  document.getElementById("searchInput");

const totalEquipment =
  document.getElementById("totalEquipment");

const activeEquipment =
  document.getElementById("activeEquipment");

const repairEquipment =
  document.getElementById("repairEquipment");

const totalEvents =
  document.getElementById("totalEvents");

const equipmentCount =
  document.getElementById("equipmentCount");

const eventCount =
  document.getElementById("eventCount");

const refreshBtn =
  document.getElementById("refreshBtn");

window.addEventListener("DOMContentLoaded", () => {

    loadExcel();

});

async function loadExcel(){

    try{

        const response = await fetch(EXCEL_FILE);

        const arrayBuffer =
            await response.arrayBuffer();

        const workbook =
            XLSX.read(arrayBuffer,{
                type:"array"
            });

        equipmentData =
            XLSX.utils.sheet_to_json(
                workbook.Sheets["Equipment_Register"],
                {
                    defval:""
                });

        eventData =
            XLSX.utils.sheet_to_json(
                workbook.Sheets["Asset_Event_Log1"],
                {
                    defval:""
                });

        initFilter();

        renderEquipment();

        renderEvent();

        updateDashboard();

    }
    catch(error){

        console.error(error);

        alert("Không đọc được file Excel.");

    }

}

refreshBtn.addEventListener("click",()=>{

    loadExcel();

});
