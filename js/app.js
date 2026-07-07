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
function renderEquipment(){

    equipmentBody.innerHTML="";

    let data=[...equipmentData];

    const area=areaFilter.value;
    const status=statusFilter.value;
    const keyword=searchInput.value.toLowerCase();

    if(area!=""){

        data=data.filter(x=>String(x.Area)==area);

    }

    if(status!=""){

        data=data.filter(x=>String(x.Status)==status);

    }

    if(keyword!=""){

        data=data.filter(x=>

            JSON.stringify(x)
            .toLowerCase()
            .includes(keyword)

        );

    }

    equipmentCount.innerHTML=data.length+" dòng";

    if(data.length==0){

        equipmentBody.innerHTML=

        `<tr>

            <td colspan="7">

                Không có dữ liệu

            </td>

        </tr>`;

        return;

    }

    data.forEach(item=>{

        equipmentBody.innerHTML+=`

        <tr>

            <td>${item.ID||""}</td>

            <td>${item.Area||""}</td>

            <td>${item.Equipment_Name||""}</td>

            <td>${item.Model||""}</td>

            <td>${item.Serial||""}</td>

            <td>${item.Status||""}</td>

            <td>

                <button
                    onclick="showEquipment('${item.ID}')">

                    Xem

                </button>

            </td>

        </tr>

        `;

    });

}
function renderEvent(){

    eventBody.innerHTML="";

    eventCount.innerHTML=

        eventData.length+" dòng";

    eventData.forEach(item=>{

        eventBody.innerHTML+=`

        <tr>

            <td>${item.ID||""}</td>

            <td>${item.Equipment_ID||""}</td>

            <td>${item.Date||""}</td>

            <td>${item.Action||""}</td>

            <td>${item.Description||""}</td>

            <td>${item.User||""}</td>

        </tr>

        `;

    });

}
function updateDashboard(){

    totalEquipment.innerHTML=

        equipmentData.length;

    totalEvents.innerHTML=

        eventData.length;

    activeEquipment.innerHTML=

        equipmentData.filter(x=>

            x.Status=="Đang hoạt động"

        ).length;

    repairEquipment.innerHTML=

        equipmentData.filter(x=>

            x.Status=="Chờ sửa chữa"

        ).length;

}
function initFilter(){

    areaFilter.innerHTML=

        '<option value="">Tất cả khu vực</option>';

    statusFilter.innerHTML=

        '<option value="">Tất cả trạng thái</option>';

    const areaSet=new Set();

    const statusSet=new Set();

    equipmentData.forEach(x=>{

        if(x.Area!="")

            areaSet.add(x.Area);

        if(x.Status!="")

            statusSet.add(x.Status);

    });

    [...areaSet]
    .sort()
    .forEach(x=>{

        areaFilter.innerHTML+=

        `<option>

            ${x}

        </option>`;

    });

    [...statusSet]
    .sort()
    .forEach(x=>{

        statusFilter.innerHTML+=

        `<option>

            ${x}

        </option>`;

    });

}
areaFilter.addEventListener("change",renderEquipment);

statusFilter.addEventListener("change",renderEquipment);

searchInput.addEventListener("keyup",renderEquipment);

// ===============================
// Equipment Detail
// ===============================

const modal =
    document.getElementById("detailModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");

const closeModalBtn =
    document.getElementById("closeModalBtn");


closeModalBtn.addEventListener("click", () => {

    modal.classList.add("hidden");

});


window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.add("hidden");

    }

});


function showEquipment(id){

    const equipment =
        equipmentData.find(x => x.ID == id);

    if(!equipment) return;

    const history =
        eventData.filter(x => x.Equipment_ID == id);

    modalTitle.innerHTML =
        equipment.Equipment_Name + " (" + id + ")";

    let html = "";

    html += `

    <div class="equipment-info">

        <table class="detail-table">

            <tr>

                <th>ID</th>

                <td>${equipment.ID||""}</td>

            </tr>

            <tr>

                <th>Khu vực</th>

                <td>${equipment.Area||""}</td>

            </tr>

            <tr>

                <th>Tên thiết bị</th>

                <td>${equipment.Equipment_Name||""}</td>

            </tr>

            <tr>

                <th>Model</th>

                <td>${equipment.Model||""}</td>

            </tr>

            <tr>

                <th>Serial</th>

                <td>${equipment.Serial||""}</td>

            </tr>

            <tr>

                <th>Nhà sản xuất</th>

                <td>${equipment.Manufacturer||""}</td>

            </tr>

            <tr>

                <th>Trạng thái</th>

                <td>${equipment.Status||""}</td>

            </tr>

        </table>

    </div>

    `;

    html += `

    <h3>Lịch sử thiết bị</h3>

    <table class="history-table">

        <thead>

            <tr>

                <th>Ngày</th>

                <th>Loại</th>

                <th>Nội dung</th>

                <th>Người thực hiện</th>

            </tr>

        </thead>

        <tbody>

    `;

    if(history.length==0){

        html += `

        <tr>

            <td colspan="4">

                Chưa có lịch sử.

            </td>

        </tr>

        `;

    }
    else{

        history.sort((a,b)=>{

            return new Date(b.Date)-new Date(a.Date);

        });

        history.forEach(item=>{

            html += `

            <tr>

                <td>${item.Date||""}</td>

                <td>${item.Action||""}</td>

                <td>${item.Description||""}</td>

                <td>${item.User||""}</td>

            </tr>

            `;

        });

    }

    html += `

        </tbody>

    </table>

    `;

    modalBody.innerHTML = html;

    modal.classList.remove("hidden");

}
