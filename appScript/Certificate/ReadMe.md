# ReadMe

## 🎬 How to Run the Script

1. **Open Apps Script:** In your Google Sheet, go to **Extensions** $\rightarrow$ **Apps Script**.
    
2. **Paste Code:** Paste the entire script from `generateSlides.gs` into the code editor.
    
3. **Save:** Click the floppy disk icon to save the script.
    
4. **Refresh Sheet:** Go back to your Google Sheet and refresh the browser page.
    
5. **Run:** A new menu item called **"Generate Slides"** will appear. Click the menu and select the wrapper function corresponding to the template slide you wish to use (e.g., **"For Template 1"** will use the slide at index 0).
    
6. **Grant Permissions:** The first time, you must authorize the script to access your Sheets, Slides, Drive, and perform external fetches (`UrlFetchApp`).
    
7. **Success:** A final alert will provide the URLs for the newly created **Google Slides presentation** and the **ZIP file of the PNGs**.
    

---
## 📊 Google Sheet Data Structure Demo

The script uses your spreadsheet data to drive the content of the generated slides. The structure must be consistent and include a header row that defines the dynamic placeholders in your template.

||**A**|**B**|**C**|**D**|**...**|**T**|
|---|---|---|---|---|---|---|
|**5**|_(Header Row for the Static Data Above)_|**PLACEHOLDER1**|**TOPIC**|**PRESENTER**|**...**|**NOTES**|
|**6**|_(Data starts here)_|Intro Session|Scripting Basics|John Doe|**...**|Remember to focus on the `onOpen` function.|
|**7**||Advanced Session|API Integrations|Jane Smith|**...**|Highlight the exponential backoff logic.|
|**8**||Q&A|Review and Next Steps|Team Lead|**...**|Final check of all Q&A items.|
|**...**|||||**...**||

### Key Points for the Sheet:

- **Header Row (Row 5 in this example):** The text in this row (**PLACEHOLDER1, TOPIC, PRESENTER, etc.**) must match the dynamic placeholders in your slide template (e.g., if the cell says `TOPIC`, the slide template must have `{{TOPIC}}`).
    
- **Data Range:** In the provided code, `DATA_RANGE = "B6:T18"`. This means the script will start reading from cell **B6** and include the header row at **Row 5** _if_ the range started at `B5`. Since your code uses `B6:T18`, and then `values.shift()` to remove the first row, your actual data (Header + Content) must start at **Row 6** if you are processing 13 rows total. **I recommend defining the range to include the header row.**
    
- **Empty Rows:** The script is designed to skip rows where all cells within the defined range are empty.
    

---

# ⚙️ Google Slides Generator and PNG Exporter

This is an advanced Google Apps Script designed to automate the generation of dynamic Google Slides presentations, export all generated slides as individual PNG files, and compress them into a single ZIP file, all from data residing in a Google Sheet.

## ✨ Core Features

- **Dynamic Slide Generation:** Duplicates a specified template slide for every row of data in your spreadsheet.
    
- **Data Binding:** Replaces dynamic placeholders (e.g., `{{TOPIC}}`, `{{PRESENTER}}`) on the new slides with corresponding column data.
    
- **Static Replacements:** Automatically populates common fields across _all_ slides (e.g., `{{CLass}}` with the sheet name, and `{{Date}}` with today's date).
    
- **Reliable PNG Export:** Utilizes the Slides API via `UrlFetchApp` with **Exponential Backoff and Retries** to reliably convert each slide into a high-resolution PNG, addressing common Google API rate-limiting errors (429s).
    
- **ZIP Packaging:** Compresses all exported PNGs into a single ZIP file and places it in the designated Drive folder.
    
- **Template Selector:** Uses wrapper functions and a custom menu to allow selecting different template slides (by index) from the master presentation.
    

---

## 🚀 Setup and Configuration

This script requires configuration in **two** main areas:

### 1. Script Configuration (`generateSlides.gs`)

You **must** update the variables in the **`USER CONFIGURATION BLOCK`** at the top of the file:

|**Variable**|**Description**|**Action Required**|
|---|---|---|
|`SLIDES_TEMPLATE_ID`|The ID of the master Google Slides presentation.|**Update with your ID.**|
|`DATA_RANGE`|The spreadsheet range that contains your header row and all data rows.|**Verify and update this range** (e.g., `"B5:T18"`).|
|`EXPORT_DELAY_MS`|Delay between each slide export.|Recommended value is **2500** (2.5 seconds).|
|`PRE_EXPORT_WAIT_SECONDS`|Time to wait after creation but before export (Crucial for stability).|Recommended value is **10** seconds.|

### 2. Google Slide Template

Ensure your master Google Slides template contains the following placeholders:

|**Placeholder Type**|**Example Placeholder**|**Source**|
|---|---|---|
|**Static (All Slides)**|`{{CLass}}`|Replaced by the **Spreadsheet Name**.|
|**Static (All Slides)**|`{{Date}}`|Replaced by **Today's Date**.|
|**Dynamic (Data Slides)**|`{{TOPIC}}`|Replaced by the content of the cell under the **TOPIC** header.|



## ⚠️ Important Note on Wrapper Functions

The menu items call specific wrapper functions that pass a **template slide index** to the main `generateSlides(templateSlideIndex)` function.

|**Menu Item**|**Wrapper Function**|**Template Slide Index (0-based)**|
|---|---|---|
|**For Template 1**|`generateSlidesWithTemplate0()`|**0** (First Slide)|
|**For Template 2**|`generateSlidesWithTemplate1()`|**1** (Second Slide)|
|**For Template 3**|`generateSlidesWithTemplate2()`|**2** (Third Slide)|

You can rename the menu items to match your actual templates (e.g., rename **"For Template 1"** to **"For Title Slide"**).
