/**
 * TIMBER WORLD LIMITED - EXPO REGISTRATION
 * Google Apps Script backend
 *
 * Spreadsheet ID:
 * 1oCqlhGsKqgyqYtHs1qPCNpX4riSRNdLQRDcmnMDU35o
 *
 * Set the Apps Script project timezone to Africa/Nairobi.
 */

const SPREADSHEET_ID = '1oCqlhGsKqgyqYtHs1qPCNpX4riSRNdLQRDcmnMDU35o';
const SHEET_NAME = 'Expo Leads';

function doGet() {
  return jsonOutput({
    success: true,
    service: 'Timber World Limited Expo Registration',
    status: 'online'
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Basic server-side validation.
    const name = clean_(p.name);
    const email = clean_(p.email);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonOutput({ success: false, message: 'Name and valid email are required.' });
    }

    // Ignore bot submissions caught by the hidden website field.
    if (clean_(p.website)) {
      return jsonOutput({ success: true });
    }

    lock.waitLock(15000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      'Timestamp',
      'Lead ID',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Company / Organisation',
      'Interest',
      'Source',
      'Campaign',
      'Landing Page'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#900522')
        .setFontColor('#ffffff');
      sheet.getRange('A:A').setNumberFormat('dd-mmm-yyyy hh:mm:ss');
    }

    const now = new Date();
    const leadId = 'TWL-' + Utilities.formatDate(now, 'Africa/Nairobi', 'yyyyMMdd-HHmmss') +
      '-' + Utilities.getUuid().slice(0, 6).toUpperCase();

    const row = [
      now,
      leadId,
      name,
      email,
      clean_(p.phone),
      clean_(p.company),
      clean_(p.interest),
      clean_(p.source) || 'EXISTING LINKTREE QR',
      clean_(p.campaign) || 'TIMBER WORLD LIMITED EXPO',
      clean_(p.landingPage)
    ];

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return jsonOutput({
      success: true,
      leadId: leadId,
      message: 'Registration saved.'
    });

  } catch (err) {
    console.error(err);
    return jsonOutput({
      success: false,
      message: 'Unable to save registration. Please try again.'
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

function clean_(value) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, 1000);
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once manually from the Apps Script editor to create
 * the tab and header row before publishing the form.
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    'Timestamp','Lead ID','Full Name','Email Address','Phone Number',
    'Company / Organisation','Interest','Source','Campaign','Landing Page'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#900522')
      .setFontColor('#ffffff');
    sheet.getRange('A:A').setNumberFormat('dd-mmm-yyyy hh:mm:ss');
    sheet.autoResizeColumns(1, headers.length);
  }
}
