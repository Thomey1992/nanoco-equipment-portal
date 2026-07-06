# NANOCO Equipment Management System (NEMS) - Enterprise V1.0

Biên Hòa Factory - NANOCO  
Prepared & Developed by Nguyễn Lĩnh (Thomey)

## Data source
The website reads only these two JSON files:

- `data/equipment.json` generated from Excel sheet `Equipment_Register`
- `data/history.json` generated from Excel sheet `Asset_Event_Log1`

Public users only see the **Refresh / Làm mới** button. There is no public Excel upload button.

## Daily workflow
1. Update `Quản lý thiết bị.xlsx` in Excel Online.
2. Download/open the latest Excel file on your computer.
3. Run `tools/1_NEMS_SYNC.bat`.
4. Select the Excel file.
5. Choose GitHub upload option or manually upload `data/equipment.json` and `data/history.json`.
6. Open the website and click **Refresh**.

## GitHub automatic upload
For one-click upload, create a GitHub fine-grained token with Contents: Read and Write for repository `nanoco-equipment-portal`, then paste it when the Sync Tool asks.
