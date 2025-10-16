## Step-by-Step Instructions

Follow these steps to successfully deploy and run the quiz generator:

1. **Open Apps Script:** In your Google Sheet (the one containing the quiz data), go to **Extensions** $\rightarrow$ **Apps Script**.
2. **Paste Code:** Replace any existing code with the contents of `createQuizFormFromSheet.gs`.
3. **Configure Constants:** In the code, update the following variables in the **`USER CONFIGURATION BLOCK`**:
    - `SPREADSHEET_ID`
    - `FOLDER_ID` (The Drive folder where you want the quiz saved)
4. **Save:** Click the floppy disk icon to save the script.
5. **Refresh Sheet:** Go back to your Google Sheet and refresh the browser page.
6. **Run:** A new menu item called **"Create"** will appear in the toolbar. Click **Create** $\rightarrow$ **Create Quiz**.
7. **Grant Permissions:** The first time you run the script, a pop-up will ask you to authorize it to access your Google Sheet and Google Drive/Forms. **You must grant these permissions.**
8. **Verify:** Upon completion, you will receive a success alert, and the **live Form URL** will be placed in the designated output cell (default is **B1**).



# Example Google Sheet Structure 
||**A**|**B**|**C**|**D**|**E**|
|---|---|---|---|---|---|
|**1**|**ELT 4001 - TELL Midterm**|_(Form URL will go here)_||||
|**2**|**Question**|**Correct Answer**|**Incorrect 1**|**Incorrect 2**|**Incorrect 3**|
|**3**|Which is a characteristic of synchronous TELL activities?|Live video chat|Email exchange|Blog comments|Forum posting|
|**4**|What does CALL stand for?|Computer Assisted Language Learning|Communicated And Listened Language|Comprehensive Active Lexicon Learning|Controlled Adaptive Learning Logic|
|**5**|Which app is an example of mobile learning?|Duolingo|Microsoft Word|Adobe Photoshop|iTunes (Desktop)|
