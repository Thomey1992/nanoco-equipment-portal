// ======================================
// NEMS Enterprise V3
// modal.js
// ======================================

const modal =
    document.getElementById("detailModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");

const closeModalBtn =
    document.getElementById("closeModalBtn");

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        closeModal();

    }

});

function closeModal() {

    modal.classList.add("hidden");

}

function openModal() {

    modal.classList.remove("hidden");

}

function showEquipment(assetId) {

    const eq = equipmentData.find(item =>

        safeText(item[EQ.id]) === safeText(assetId)

    );

    if (!eq) return;

    const history = getHistoryByAsset(assetId);

    modalTitle.textContent =
        safeText(eq[EQ.name]) + "  |  " + assetId;

    let html = "";

    html += `

<table class="detail-table">

<tr>
<th>Mã tài sản</th>
<td>${safeText(eq[EQ.id])}</td>
</tr>

<tr>
<th>Tên thiết bị</th>
<td>${safeText(eq[EQ.name])}</td>
</tr>

<tr>
<th>Tên theo mã</th>
<td>${safeText(eq[EQ.assetName])}</td>
</tr>

<tr>
<th>Model</th>
<td>${safeText(eq[EQ.model])}</td>
</tr>

<tr>
<th>Serial</th>
<td>${safeText(eq[EQ.serial])}</td>
</tr>

<tr>
<th>Hãng sản xuất</th>
<td>${safeText(eq[EQ.manufacturer])}</td>
</tr>

<tr>
<th>Nhà cung cấp</th>
<td>${safeText(eq[EQ.vendor])}</td>
</tr>

<tr>
<th>Vị trí</th>
<td>${safeText(eq[EQ.position])}</td>
</tr>

<tr>
<th>Chu kỳ bảo dưỡng</th>
<td>${safeText(eq[EQ.maintenance])}</td>
</tr>

<tr>
<th>Ngày lắp đặt</th>
<td>${formatDate(eq[EQ.install])}</td>
</tr>

<tr>
<th>Ghi chú</th>
<td>${safeText(eq[EQ.note])}</td>
</tr>

</table>

`;

    html += `

<h3>Lịch sử thiết bị (${history.length})</h3>

<table class="history-table">

<thead>

<tr>

<th>Ngày</th>

<th>Loại</th>

<th>Nội dung</th>

<th>Người thực hiện</th>

<th>Downtime</th>

<th>Chi phí</th>

</tr>

</thead>

<tbody>

`;

    if (history.length === 0) {

        html += `

<tr>

<td colspan="6">

Chưa có lịch sử.

</td>

</tr>

`;

    } else {

        history.forEach(item => {

            html += `

<tr>

<td>${formatDate(item[HIS.date])}</td>

<td>${safeText(item[HIS.type])}</td>

<td>${safeText(item[HIS.content])}</td>

<td>${safeText(item[HIS.user])}</td>

<td>${safeText(item[HIS.downtime])}</td>

<td>${safeText(item[HIS.cost])}</td>

</tr>

`;

        });

    }

    html += `

</tbody>

</table>

<br>

<table class="detail-table">

<tr>

<th>Tổng số sự kiện</th>

<td>${history.length}</td>

</tr>

<tr>

<th>Tổng Downtime</th>

<td>${totalDowntime(assetId)} phút</td>

</tr>

<tr>

<th>Tổng Chi phí</th>

<td>${totalCost(assetId)}</td>

</tr>

</table>

`;

    modalBody.innerHTML = html;

    openModal();

}
