# NANOCO Equipment Management System (NEMS)

Biên Hòa Factory - NANOCO

Prepared & Developed by Nguyễn Lĩnh (Thomey)

## Data source
This website reads only two JSON files:

- `data/equipment.json` generated from Excel sheet `Equipment_Register`
- `data/history.json` generated from Excel sheet `Asset_Event_Log1`

Users only see the **Refresh** button. There is no Excel upload button on the public page.

## Daily workflow
1. Update Excel Online.
2. Run Sync Tool to generate JSON.
3. Commit JSON files to GitHub.
4. Open website and click Refresh.
