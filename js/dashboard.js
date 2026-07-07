// ======================================
// NEMS Enterprise V3
// dashboard.js
// ======================================

function initDashboard() {

    updateDashboard();

}

function updateDashboard() {

    document.getElementById("totalEquipment").textContent =
        equipmentData.length;

    document.getElementById("totalEvents").textContent =
        eventData.length;

    document.getElementById("activeEquipment").textContent =
        countEquipmentHasHistory();

    document.getElementById("repairEquipment").textContent =
        countRepairEquipment();

}

function countEquipmentHasHistory() {

    const assets = new Set();

    eventData.forEach(item => {

        const id = safeText(item[HIS.asset]);

        if (id !== "") {

            assets.add(id);

        }

    });

    return assets.size;

}

function countRepairEquipment() {

    let total = 0;

    eventData.forEach(item => {

        const type = normalizeText(item[HIS.type]);

        if (

            type.includes("repair") ||

            type.includes("sửa") ||

            type.includes("breakdown") ||

            type.includes("hỏng")

        ) {

            total++;

        }

    });

    return total;

}

function getTotalDowntime() {

    let total = 0;

    eventData.forEach(item => {

        total += Number(item[HIS.downtime] || 0);

    });

    return total;

}

function getTotalCost() {

    let total = 0;

    eventData.forEach(item => {

        total += Number(item[HIS.cost] || 0);

    });

    return total;

}

function getEquipmentCountByArea(area) {

    return equipmentData.filter(item =>

        safeText(item[EQ.position]) === safeText(area)

    ).length;

}

function getEventCountByType(type) {

    return eventData.filter(item =>

        normalizeText(item[HIS.type]) ===

        normalizeText(type)

    ).length;

}
