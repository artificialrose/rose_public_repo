#  How to Run the Script
- Open your Google Sheet.
- Go to Extensions --> Apps Script.
- Copy and paste the entire code from createAssignmentDocs.gs
- into the script editor, replacing any existing code.
- Save the script (click the floppy disk icon).
- Refresh your Google Sheet page.
- A new custom menu called "Assignment Tools" will appear.
- Select Assignment Tools $\rightarrow$ Create Assignment Docs.
- The first time you run it, you'll need to grant the script permissions to access Drive and your spreadsheet.
- The script will alert you when it's finished!

  That's a smart idea! A dedicated `README.md` for this Apps Script project will help others (or your future self!) quickly understand what it does and how to set it up.

Here is a `README.md` file tailored for your **Google Apps Script Assignment Document Generator** project.

---

# 📑 Google Apps Script: Assignment Document Generator

This project contains a Google Apps Script (`.gs`) file designed to automate the repetitive task of creating individual assignment documents from a template for multiple students or topics listed in a Google Sheet.

The script runs directly from the Google Sheet and is essential for educators or administrators who manage course assignments across different subjects.

---

## ✨ Key Features

- **Custom Menu Integration:** Adds a custom **"Assignment Tools"** menu item to the Google Sheet UI for one-click document generation.
    
- **Sheet-to-Course Mapping:** Uses a **`switch` statement** to dynamically determine the correct course code, name, and target Drive folder based on the **active sheet's name** (e.g., 'Linguistics' $\rightarrow$ 'ELT4006').
    
- **Template Duplication:** Creates a copy of a master Google Docs template for each assignment row.
    
- **Placeholder Replacement:** Automatically replaces **`{{placeholders}}`** in the document body with specific data from the spreadsheet row (week number, topic, deadlines, etc.).
    
- **Link Back:** Writes a formatted **hyperlink** (rich-text value) to the newly created document back into the spreadsheet, preventing duplicate creation.
    

---

## 🛠️ Setup and Configuration

To get this script running, you need to configure the following within the **`createAssignmentDocs()`** function:

### 1. Spreadsheet Data Structure

The script is hardcoded to look for data starting at **Row 20** and assumes a column structure that maps to the document placeholders:

|**Column**|**Data Field**|**Placeholder in Doc**|**Notes**|
|---|---|---|---|
|**A**|Week Number|`{{week}}`||
|**B**|Start Date|`{{startdate}}`|Must be a valid date format.|
|**C**|Topic/Title|`{{topic}}`||
|**D**|Instructor|`{{instructor}}`||
|**E**|Due Date|`{{deadline}}`|Must be a valid date format.|
|**F**|**Assignment Link**|_(None)_|**This column is where the script writes the URL and is checked for existing links.**|


### 2. Configuration Constants

Update the constant variables at the top of the script:

|**Constant**|**Description**|**Your Value (Based on Script)**|
|---|---|---|
|`TEMPLATE_DOC_ID`|The ID of the master Google Doc you want to copy.|`'1IrdPAvcjPZ6MHodKvjDEfTdGh23y_Gmee1Knpsd5OUM'`|
|`START_DATA_ROW`|Row where data processing begins.|`20`|
|`NUM_DATA_ROWS`|How many rows to check for assignments.|`20`|
