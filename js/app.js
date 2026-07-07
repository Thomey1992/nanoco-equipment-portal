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
