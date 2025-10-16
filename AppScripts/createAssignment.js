// --- CONFIGURATION CONSTANTS ---
// 1. Template File ID: ID of your Google Doc Template file (e.g., the assignment template).
const TEMPLATE_DOC_ID = 'YOUR_GOOGLE_DOCS_TEMPLATE_ID_HERE'; 

// 2. Data Range: Define where the data starts in your spreadsheet.
// The script assumes 20 rows of data starting from the specified row.
const START_DATA_ROW = 12; // Change this to the row number where your data begins (e.g., 12)
const NUM_DATA_ROWS = 20;  // Number of rows to process from the start row

// The script expects the following column structure in your sheet:
// Col A: {{week}}
// Col B: {{startdate}} (Date)
// Col C: {{topic}}
// Col D: {{instructor}}
// Col E: {{deadline}} (Date)
// Col F: Assignment Link (This column is checked to see if the doc has already been created)


// --- MENU FUNCTION ---
/**
 * Adds a custom menu item to the spreadsheet interface called 'Assignment' 
 * with an option to run 'Create Assignment Docs'.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Assignment Tools');
  // NOTE: The string 'createAssignmentDocs' must match the function name exactly.
  menu.addItem('Create Assignment Docs', 'createAssignmentDocs'); 
  menu.addToUi();
}


// --- MAIN DOCUMENT CREATION FUNCTION ---
/**
 * The core function that reads spreadsheet data, maps it to course settings,
 * creates document copies from a template, replaces placeholders, and saves 
 * the URL back to the spreadsheet.
 */
function createAssignmentDocs() {
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = spreadsheet.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  const sheetName = activeSheet.getName();

  // --- PLACEHOLDER VARIABLES ---
  let courseCode = ''; 
  let courseName = ''; 
  let contextString = ''; // e.g., 'ELT4006 - Introduction to Linguistics - Batch 2 Semester 2'
  let folderId = '';      // The ID of the Google Drive folder where the documents will be saved

  // --------------------------------------------------------------------------------
  // 3. COURSE/SHEET MAPPING: CUSTOMIZE THE SWITCH STATEMENT
  //    Define settings for each course based on the sheet name.
  // --------------------------------------------------------------------------------

  switch (sheetName){
    // Example Batch 1
    case 'Course_A_Shortname':
      courseCode = 'CS101';
      courseName = 'Introduction to Computer Science';
      contextString = 'CS101 - Introduction to Computer Science - Batch X Semester Y';
      folderId = 'YOUR_FOLDER_ID_FOR_COURSE_A_HERE';
      break;
      
    // Example Batch 2
    case 'Course_B_Shortname':
      courseCode = 'MA205';
      courseName = 'Advanced Calculus';
      contextString = 'MA205 - Advanced Calculus - Batch Z Semester W';
      folderId = 'YOUR_FOLDER_ID_FOR_COURSE_B_HERE';
      break;

    // ADD ALL YOUR COURSE CASES HERE...

    default:
      ui.alert('Error: Unknown sheet name. Please ensure the active sheet name matches a case in the script.');
      return; // Exit the function if sheet name is not recognized
  }


  // --- DRIVE OPERATIONS ---
  try {
    const googleDocTemplate = DriveApp.getFileById(TEMPLATE_DOC_ID);
    const destinationFolder = DriveApp.getFolderById(folderId);

    // Get the data range based on configuration
    const dataRows = activeSheet.getRange(START_DATA_ROW, 1, NUM_DATA_ROWS, 6).getValues();

    // Iterate over each row of data
    dataRows.forEach(function(row, index){
      
      // Calculate the actual row number in the sheet for setting the link later
      const sheetRow = START_DATA_ROW + index;

      // Check if Column F (index 5) is already filled. If true, skip.
      if (!!row[5]) { 
        Logger.log(`Skipping row ${sheetRow}: Column F (Link column) is not empty.`);
        return; 
      }

      // --- Document Creation ---

      // Define the naming convention for the new file
      // Example: 'ID_Instructor - week[A] Topic[C] - SheetName_Context'
      const copyName = `YOUR_ID_PREFIX_HERE - week${row[0]} ${row[2]} - ${sheetName}_CONTEXT`; 
      
      const copy = googleDocTemplate.makeCopy(copyName, destinationFolder);
      const doc = DocumentApp.openById(copy.getId());
      const body = doc.getBody();

      // Format the date objects for display
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const startDate = new Date(row[1]).toLocaleDateString('en-US', options); 
      const deadline = new Date(row[4]).toLocaleDateString('en-US', options); 

      // --- Placeholder Replacement ---
      // NOTE: Ensure these {{placeholders}} exist in your Google Doc Template!
      body.replaceText('{{week}}', row[0]);          // Col A
      body.replaceText('{{startdate}}', startDate);  // Col B
      body.replaceText('{{topic}}', row[2]);         // Col C
      body.replaceText('{{instructor}}', row[3]);     // Col D
      body.replaceText('{{deadline}}', deadline);    // Col E
      body.replaceText('{{contextString}}', contextString); // From switch
      body.replaceText('{{courseCode}}', courseCode); // From switch
      body.replaceText('{{courseName}}', courseName); // From switch
      
      doc.saveAndClose();

      // --- Write Link Back to Sheet ---
      const url = doc.getUrl();
      const linkText = copyName; 
      const richText = SpreadsheetApp.newRichTextValue()
        .setText(linkText)
        .setLinkUrl(0, linkText.length, url)
        .build();

      // Place the rich-text link in Column F (column 6) of the current row
      activeSheet.getRange(sheetRow, 6).setRichTextValue(richText);
    });
    
    ui.alert('Document creation process completed!');
    
  } catch (error) {
    ui.alert(`An error occurred: ${error.message}. Check your IDs and permissions.`);
  }
}
