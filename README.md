# NEMS Enterprise V2

Nanoco Equipment Management System - static version for GitHub Pages.

## Cấu trúc

```text
NEMS-Enterprise-V2/
├── index.html
├── css/style.css
├── js/app.js
├── data/equipment.json
├── data/maintenance.json
├── data/breakdowns.json
├── data/spareparts.json
├── data/pm_schedule.json
├── data/users.json
└── assets/
```

## Cách chạy nhanh

1. Copy toàn bộ thư mục lên repository GitHub.
2. Bật GitHub Pages từ branch `main`.
3. Mở link GitHub Pages.

## Cách sửa dữ liệu

Chỉ cần sửa các file trong thư mục `data/`:

- `equipment.json`: danh mục thiết bị.
- `maintenance.json`: lịch sử bảo trì.
- `breakdowns.json`: lịch sử sự cố.
- `spareparts.json`: phụ tùng.
- `pm_schedule.json`: lịch bảo trì định kỳ.
- `users.json`: người phụ trách.

## Nguyên tắc dữ liệu

- Mỗi thiết bị có mã duy nhất dạng `EQ-0001`.
- Các bảng khác liên kết với thiết bị bằng trường `equipmentId`.
- Không dùng backend, không dùng database, không dùng macro.
- Có thể mở rộng sau này sang Excel import/export hoặc SharePoint.

## Phiên bản

Milestone 2 - Enterprise static architecture.
