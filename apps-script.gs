/**
 * Rg Ng Sur Fan Vote — Google Apps Script backend
 *
 * Setup (one time, ~5 minutes):
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Rename Sheet1 to "Votes"
 * 3. Add headers in row 1: A1 = "Option", B1 = "Count"
 * 4. Add rows: A2 = "music", A3 = "vlogs", A4 = "merch" (leave B2:B4 as 0)
 * 5. Extensions → Apps Script → paste this entire file → Save
 * 6. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the web app URL into poll-config.js as window.POLL_API_URL
 */

var OPTIONS = {
  music: 2,
  vlogs: 3,
  merch: 4
};

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Votes');

  if (!sheet) {
    return jsonResponse({ error: 'Votes sheet not found' }, 500);
  }

  if (params.action === 'vote') {
    var choice = String(params.choice || '').toLowerCase();
    var row = OPTIONS[choice];
    if (!row) {
      return jsonResponse({ error: 'Invalid choice' }, 400);
    }
    var cell = sheet.getRange('B' + row);
    cell.setValue(Number(cell.getValue() || 0) + 1);
  }

  var counts = readCounts(sheet);
  return jsonResponse(counts);
}

function readCounts(sheet) {
  var music = Number(sheet.getRange('B2').getValue()) || 0;
  var vlogs = Number(sheet.getRange('B3').getValue()) || 0;
  var merch = Number(sheet.getRange('B4').getValue()) || 0;
  return {
    music: music,
    vlogs: vlogs,
    merch: merch,
    total: music + vlogs + merch
  };
}

function jsonResponse(data, status) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}