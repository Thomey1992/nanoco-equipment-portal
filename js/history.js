// ======================================
// NEMS Enterprise V3
// history.js
// ======================================

const HIS = {

    id: "ID",

    asset: "Mã tài sản",

    assetName: "Tên theo mã tài sản",

    equipment: "Tên thiết bị",

    model: "Model",

    serial: "Số Serial",

    date: "Ngày nhận thông tin",

    type: "Loại trạng thái/sự kiện",

    content: "Nôi dung thông tin (Giờ nhận thông tin, Kênh nhận thông báo, Mô tả lỗi hoặc tình huống)",

    user: "Người phụ trách thực hiện",

    result: "Kết quả",

    cost: "CHi phí",

    downtime: "Downtime (Phút)",

    note: "Ghi chú"

};

function initHistory() {

    renderHistory();

}

function renderHistory() {

    const tbody =
        document.getElementById("eventTableBody");

    clearElement(tbody);

    const data =
        sortByDateDesc(
            eventData,
            HIS.date
        );

    document.getElementById("eventCount").innerHTML =
        data.length + " dòng";

    if (data.length === 0) {

        showEmptyRow(
            tbody,
            6,
            "Chưa có dữ liệu."
        );

        return;

    }

    data.forEach(item => {

        tbody.innerHTML += `

<tr>

<td>${safeText(item[HIS.id])}</td>

<td>${safeText(item[HIS.asset])}</td>

<td>${formatDate(item[HIS.date])}</td>

<td>${safeText(item[HIS.type])}</td>

<td>${safeText(item[HIS.content])}</td>

<td>${safeText(item[HIS.user])}</td>

</tr>

`;

    });

}

function getHistoryByAsset(assetId) {

    return sortByDateDesc(

        eventData.filter(item =>

            safeText(item[HIS.asset]) === safeText(assetId)

        ),

        HIS.date

    );

}

function countHistory(assetId) {

    return getHistoryByAsset(assetId).length;

}

function totalDowntime(assetId) {

    return getHistoryByAsset(assetId)

        .reduce((sum, item) => {

            return sum +

                Number(item[HIS.downtime] || 0);

        }, 0);

}

function totalCost(assetId) {

    return getHistoryByAsset(assetId)

        .reduce((sum, item) => {

            return sum +

                Number(item[HIS.cost] || 0);

        }, 0);

}
