/**
 * Converts an English word to its IPA phonetic transcription using an external API.
 * * @param {string} input The English word to transcribe (e.g., "word").
 * @return {string} The IPA transcription (e.g., "/wɜːrd/") or an error message.
 * @customfunction
 */
function GET_IPA(input) {
  if (!input || typeof input !== 'string') {
    return "Error: Please provide a valid word.";
  }
  
  // Construct the actual API URL
  const word = input.trim().toLowerCase();
  const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word);

  try {
    // 1. Fetch the data from the API
    const response = UrlFetchApp.fetch(API_URL);
    const jsonText = response.getContentText();
    const data = JSON.parse(jsonText);
    
    // Check for an API error response (e.g., word not found)
    if (data.title === "No Definitions Found") {
      return "Error: Word not found.";
    }

    // 2. Safely extract the IPA (usually found in the first entry's phonetic field)
    let ipa = data[0].phonetic;
    
    // Fallback: Check the 'phonetics' array if the main 'phonetic' field is empty
    if (!ipa && data[0].phonetics && data[0].phonetics.length > 0) {
      ipa = data[0].phonetics[0].text;
    }
    
    if (ipa) {
      // Clean up the IPA to remove leading/trailing spaces and newlines
      return ipa.trim();
    } else {
      return "Error: IPA transcription not available for this word.";
    }
    
  } catch (e) {
    // This catches network/DNS errors and failed JSON parsing
    return "API Request Failed. Check word spelling or API status.";
  }
}
