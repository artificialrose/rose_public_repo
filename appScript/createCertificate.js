// ====================================================================
// --- USER CONFIGURATION BLOCK ---
// IMPORTANT: Update all placeholder values below before running.
// ====================================================================

// 1. SLIDES TEMPLATE ID: The ID of the master Google Slides presentation.
// Find this ID in the presentation's URL.
const SLIDES_TEMPLATE_ID = "YOUR_GOOGLE_SLIDES_TEMPLATE_ID_HERE";

// 2. DATA RANGE: The range in the active sheet containing the data, INCLUDING the header row.
// Example: "A1:G50"
const DATA_RANGE = "B6:T18"; 

// 3. EXPORT DELAY: Delay (in milliseconds) between *each* successful slide export API call.
// This helps prevent hitting API rate limits (429 errors). 2500ms (2.5 seconds) is a safe start.
const EXPORT_DELAY_MS = 2500; 

// 4. PRE-EXPORT WAIT: Time (in seconds) to wait after generating all slides but before exporting them.
// This is CRUCIAL to ensure Google's servers fully finalize the slide IDs. 10 seconds is recommended.
const PRE_EXPORT_WAIT_SECONDS = 10; 

// 5. STATIC PLACEHOLDERS: Define placeholders that are replaced on ALL slides.
const SHEET_NAME_PLACEHOLDER = "{{CLass}}";
const DATE_PLACEHOLDER = "{{Date}}";


// ====================================================================
// --- MENU INITIALIZATION ---
// ====================================================================
/**
 * Initializes the custom menu in your Google Sheet.
 * Customize the 'Menu Name' and the function calls ('generateSlidesWithTemplateX').
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Generate Slides') 
      .addItem('For Template 1', 'generateSlidesWithTemplate0') // Calls main function with templateSlideIndex = 0
      .addItem('For Template 2', 'generateSlidesWithTemplate1') // Calls main function with templateSlideIndex = 1
      .addItem('For Template 3', 'generateSlidesWithTemplate2') // Calls main function with templateSlideIndex = 2
      // Add more items here if you have more template slides...
      .addToUi();
}


// ====================================================================
// --- WRAPPER FUNCTIONS (DO NOT EDIT THESE) ---
// ====================================================================
/**
 * Wrapper function to call the main generator with a specific template slide index.
 * The index is 0-based.
 */
function generateSlidesWithTemplate0() { generateSlides(0); }
function generateSlidesWithTemplate1() { generateSlides(1); }
function generateSlidesWithTemplate2() { generateSlides(2); }
// Add more wrapper functions if you add more menu items above:
// function generateSlidesWithTemplate3() { generateSlides(3); } 

// ====================================================================
// --- MAIN GENERATOR FUNCTION ---
// ====================================================================
/**
 * Generates Google Slides presentations, exports them as PNGs, and zips them.
 * * @param {number} templateSlideIndex The 0-based index of the slide in the TEMPLATE presentation
 * that should be duplicated for each row of data.
 */
function generateSlides(templateSlideIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet(); 
  const ui = SpreadsheetApp.getUi();
  
  // --- Data Validation and Preparation ---
  try {
    const range = sheet.getRange(DATA_RANGE);
    const values = range.getValues();

    if (values.length < 2) { // Need at least 2 rows (1 header + 1 data)
      ui.alert("Data Error", "No data found in the range " + DATA_RANGE + " (Requires a header row and at least one data row).", ui.ButtonSet.OK);
      return;
    }

    // Header row contains the dynamic placeholder names (e.g., 'NAME', 'TOPIC', etc.)
    const headerRow = values.shift(); 
    
    if (values.length === 0) {
      ui.alert("Data Error", "No data rows found after removing the header row. Check the range " + DATA_RANGE + ".", ui.ButtonSet.OK);
      return;
    }
    
    // --- Drive Setup ---
    const templateFile = DriveApp.getFileById(SLIDES_TEMPLATE_ID);
    const parentFolders = templateFile.getParents();
    let destinationFolder = parentFolders.hasNext() ? parentFolders.next() : DriveApp.getRootFolder();
    
    // --- Create and Open New Presentation ---
    const newPresentationName = sheet.getName();
    const newPresentationFile = templateFile.makeCopy(newPresentationName, destinationFolder);
    const newPresentationId = newPresentationFile.getId();
    let newPresentation = SlidesApp.openById(newPresentationId);

    // --- Static Placeholder Replacement ---
    const formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMM,YYYY");

    newPresentation.getSlides().forEach(slide => {
      slide.replaceAllText(SHEET_NAME_PLACEHOLDER, newPresentationName);
      slide.replaceAllText(DATE_PLACEHOLDER, formattedDate);
    });
    
    // --- Get Template Slide and Duplicate for Data ---
    const dataTemplateSlide = newPresentation.getSlides()[templateSlideIndex];

    values.forEach(function(rowData, rowIndex) {
      const isRowEmpty = rowData.every(cell => cell === "" || cell === null || typeof cell === 'undefined');

      if (isRowEmpty) {
        Logger.log(`Skipping row ${rowIndex + range.getRow() + 1} as it appears empty.`);
        return;
      }

      const slideToPopulate = dataTemplateSlide.duplicate();

      // Replace dynamic placeholders using headers as placeholder keys
      headerRow.forEach(function(header, colIndex) {
        const placeholder = "{{" + header + "}}"; // e.g., {{NAME}}
        const replacement = rowData[colIndex];
        const replacementString = (replacement !== undefined && replacement !== null && replacement !== "") ? replacement.toString() : "";
        slideToPopulate.replaceAllText(placeholder, replacementString);
      });
    });

    // Optional: Remove the original dataTemplateSlide if it's not needed
    // dataTemplateSlide.remove(); 
    
    // --- Finalize and Prepare for Export ---
    Logger.log("Saving and closing presentation to finalize slide IDs...");
    newPresentation.saveAndClose();

    Logger.log(`Waiting ${PRE_EXPORT_WAIT_SECONDS} seconds for server processing...`);
    Utilities.
