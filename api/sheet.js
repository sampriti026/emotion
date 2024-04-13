const { google } = require('googleapis');

const authenticateGoogleSheets = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth.getClient();
};

const setupHeaders = async (sheets, spreadsheetId) => {
  const range = 'Sheet1!A1';
  const headers = [
    "Email ID", "Aggression", "Depression", "Fixations", "Abnormal Flat Speech",
    "Noise Sensitivity", "Social Difficulty", "Anxiety", "Abnormal Posture",
    "Poor Eye Contact", "Tics and Fidgets"
  ];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [headers],
    },
  });
};

const checkAndSetupSheet = async (sheets, spreadsheetId) => {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:K1',
    });
    if (res.data.values && res.data.values.length > 0) {
      // Headers already exist
      return true;
    } else {
      // Setup headers
      await setupHeaders(sheets, spreadsheetId);
    }
  } catch (error) {
    // If error is because of range not exist, set up headers
    if (error.code === 400) {
      await setupHeaders(sheets, spreadsheetId);
    } else {
      throw error;
    }
  }
};

exports.default = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { data } = req.body;
  const spreadsheetId = process.env.SPREADSHEET_ID;

  try {
    const authClient = await authenticateGoogleSheets();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Ensure the sheet is properly set up
    await checkAndSetupSheet(sheets, spreadsheetId);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [data],
      },
    });
    console.log(data)
    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error('The API returned an error: ' + error);
    res.status(500).json({ success: false, error });
  }
};
