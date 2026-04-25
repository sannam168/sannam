import { google } from 'googleapis'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: '허용되지 않은 요청 방식입니다.',
      })
    }

    const { rowNumber, status, reason, manager } = req.body

    if (!rowNumber) {
      return res.status(400).json({
        success: false,
        message: '행 번호가 없습니다.',
      })
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'MGP 음식점 주문서!1:1',
    })

    const headers = headerResponse.data.values[0].map((h) =>
      String(h || '').trim().replace(/\s+/g, ' ')
    )

    const statusCol = headers.indexOf('상태 확인') + 1
    const reasonCol = headers.indexOf('취소 사유') + 1
    const managerCol = headers.indexOf('담당자') + 1

    if (!statusCol || !reasonCol || !managerCol) {
      return res.status(500).json({
        success: false,
        message: '시트 헤더를 확인해주세요.',
      })
    }

    const row = Number(rowNumber)

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: `MGP 음식점 주문서!${columnToLetter(statusCol)}${row}`,
            values: [[status || '']],
          },
          {
            range: `MGP 음식점 주문서!${columnToLetter(reasonCol)}${row}`,
            values: [[reason || '']],
          },
          {
            range: `MGP 음식점 주문서!${columnToLetter(managerCol)}${row}`,
            values: [[manager || '']],
          },
        ],
      },
    })

    return res.status(200).json({
      success: true,
      message: '저장되었습니다.',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message,
    })
  }
}

function columnToLetter(column) {
  let temp = ''
  let letter = ''

  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }

  return letter
}