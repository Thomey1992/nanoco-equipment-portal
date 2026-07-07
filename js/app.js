// ======================================
// NEMS Enterprise V3
// app.js
// ======================================

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    bindGlobalEvent();

    loadExcel();

}

function bindGlobalEvent() {

    const refreshBtn =
        document.getElementById("refreshBtn");

    refreshBtn.addEventListener("click", () => {

        loadExcel();

    });

}

window.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        closeModal();

    }

});

window.addEventListener("resize", function () {

    // Reserved for responsive features

});

function reloadData() {

    loadExcel();

}

function getEquipmentById(assetId) {

    return equipmentData.find(item =>

        safeText(item[EQ.id]) === safeText(assetId)

    );

}

function getEventById(id) {

    return eventData.find(item =>

        safeText(item[HIS.id]) === safeText(id)

    );

}

console.log(
    "NEMS Enterprise V3 Loaded Successfully"
);
