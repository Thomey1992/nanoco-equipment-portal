// ================================
// NEMS Enterprise V3 - utils.js
// ================================

function safeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeText(value) {
  return safeText(value).toLowerCase();
}

function formatDate(value) {
  if (!value) return "";

  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return "";

    const yyyy = date.y;
    const mm = String(date.m).padStart(2, "0");
    const dd = String(date.d).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  return safeText(value);
}

function uniqueValues(data, key) {
  const set = new Set();

  data.forEach(item => {
    const value = safeText(item[key]);
    if (value !== "") set.add(value);
  });

  return Array.from(set).sort();
}

function clearElement(element) {
  if (element) element.innerHTML = "";
}

function showEmptyRow(tbody, colspan, message) {
  tbody.innerHTML = `
    <tr>
      <td colspan="${colspan}" class="empty-row">
        ${message}
      </td>
    </tr>
  `;
}

function matchKeyword(item, keyword) {
  if (!keyword) return true;

  const text = normalizeText(JSON.stringify(item));
  return text.includes(normalizeText(keyword));
}

function getByKeys(item, keys) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key];
    }
  }

  return "";
}

function sortByDateDesc(data, dateKey) {
  return [...data].sort((a, b) => {
    const da = new Date(formatDate(a[dateKey]));
    const db = new Date(formatDate(b[dateKey]));

    if (isNaN(da)) return 1;
    if (isNaN(db)) return -1;

    return db - da;
  });
}
