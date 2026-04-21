import { google } from 'googleapis'

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        message: '허용되지 않은 요청 방식입니다.',
      })
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return res.status(500).json({
        success: false,
        message: '환경변수가 설정되지 않았습니다.',
      })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'MGP 음식점 주문서',
    })

    const values = response.data.values || []

    if (values.length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      })
    }

    const headers = values[0].map((h) =>
      String(h || '').trim().replace(/\s+/g, ' ')
    )

    const idxOrderNo = headers.indexOf('주문번호')
    const idxMinecraft = headers.indexOf('마크 닉네임')
    const idxDiscord = headers.indexOf('디스코드 닉네임')
    const idxOrderTime = headers.indexOf('주문 시간')
    const idxOrderSummary = headers.indexOf('주문 내역')
    const idxTotalPrice = headers.indexOf('총 금액')
    const idxStatus = headers.indexOf('상태 확인')
    const idxReason = headers.indexOf('취소 사유')
    const idxManager = headers.indexOf('담당자')

    if (
      [
        idxOrderNo,
        idxMinecraft,
        idxDiscord,
        idxOrderTime,
        idxOrderSummary,
        idxTotalPrice,
        idxStatus,
        idxReason,
      ].includes(-1)
    ) {
      return res.status(500).json({
        success: false,
        message: '시트 헤더 이름을 확인해주세요.',
      })
    }

    const list = []

    for (let i = 1; i < values.length; i++) {
      const row = values[i]

      if (!row || row.length === 0) continue

      const orderNo = row[idxOrderNo] || ''
      if (!String(orderNo).trim()) continue

      list.push({
        id: i,
        orderNo: row[idxOrderNo] || '',
        minecraftName: row[idxMinecraft] || '',
        discordName: row[idxDiscord] || '',
        orderTime: row[idxOrderTime] || '',
        orderSummary: row[idxOrderSummary] || '',
        totalPrice: row[idxTotalPrice] || '',
        status: row[idxStatus] || '',
        reason: row[idxReason] || '',
        manager: idxManager > -1 ? (row[idxManager] || '') : '',
      })
    }

    return res.status(200).json({
      success: true,
      data: list,
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