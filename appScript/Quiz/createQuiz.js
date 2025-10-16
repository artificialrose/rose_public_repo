// ====================================================================
// --- USER CONFIGURATION BLOCK ---
// IMPORTANT: Update all placeholder values below before running.
// ====================================================================

// 1. SPREADSHEET SOURCE: Replace with the ID of the Google Sheet containing your quiz data.
// Find this ID in the spreadsheet's URL (after /d/ and before /edit).
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 

// 2. DRIVE DESTINATION: The ID of the Google Drive folder where the created quiz will be stored.
const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; 

// 3. OUTPUT CELL: The cell on the source sheet where the published quiz URL will be written.
const FORM_URL_CELL = 'B1'; 

// 4. SCORING: The point value for every question created.
const POINTS_PER_QUESTION = 1;

// 5. QUIZ TITLE SUFFIX: Text to append to the title read from Cell A1.
const QUIZ_TITLE_SUFFIX = ' Quiz'; // e.g., "Unit 1" + " Quiz"

// ====================================================================
// --- SPREADSHEET DATA STRUCTURE ASSUMPTIONS ---
// ====================================================================
// Cell A1: Form Title
// Row 2: Headers (Ignored by script logic)
// Row 3 onwards:
//   Column A (Index 0): Question Text
//   Column B (Index 1): Correct Answer Text
//   Column C onwards (Index 2+): Incorrect Choice Text

// ====================================================================
// --- MENU FUNCTION ---
// ====================================================================
/**
 * Adds a custom menu item to the spreadsheet interface called 'Create'.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Create');
  menu.addItem('Create Quiz', 'createQuizFormFromSheet'); 
  menu.addToUi();
}

// ====================================================================
// --- MAIN QUIZ CREATION FUNCTION ---
// ====================================================================
/**
 * Creates a Google Form quiz from data in the specified Google Sheet.
 */
function createQuizFormFromSheet() {
  const ui = SpreadsheetApp.getUi();

  // --- 1. Load Spreadsheet and Data ---
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    ui.alert('Spreadsheet Error', 'Could not open the specified spreadsheet. Check the SPREADSHEET_ID.\nError: ' + e.message, ui.ButtonSet.OK);
    return;
  }
  
  // Use .getSheets()[0] for the first sheet. Change to .getActiveSheet() or .getSheetByName('NAME') if needed.
  const sheet = ss.getSheets()[0]; 

  if (!sheet) {
    ui.alert('Sheet Error', 'Could not find the target sheet in the specified spreadsheet.', ui.ButtonSet.OK);
    return;
  }

  const values = sheet.getDataRange().getValues();

  // Check minimum data requirements (Title, Header, 1 Question)
  if (values.length < 3) {
    ui.alert('Error', 'Sheet must contain a form title (A1), a header row (Row 2), and at least one question row (Row 3 onwards).', ui.ButtonSet.OK);
    return;
  }

  // Extract form title from A1
  const baseTitle = String(values[0][0] || '').trim();
  const formTitle = baseTitle ? baseTitle + QUIZ_TITLE_SUFFIX : "Generated Quiz";
  
  if (!baseTitle) {
    ui.alert('Error', 'Cell A1 (Form Title) cannot be empty. Please provide a title there.', ui.ButtonSet.OK);
    return;
  }

  // --- 2. Load Target Folder ---
  let targetFolder;
  try {
    targetFolder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    ui.alert('Folder Error', 'Could not find the specified folder. Check the FOLDER_ID.\nError: ' + e.message, ui.ButtonSet.OK);
    return;
  }

  // --- 3. Create and Configure Form ---
  const form = FormApp.create(formTitle);
  form.setIsQuiz(true); 
  form.setDescription("Automatically generated from Google
