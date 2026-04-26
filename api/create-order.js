import { google } from 'googleapis'

const MENU = [
  { name: '고구마맛탕', price: 20000 },
  { name: '딸기모찌', price: 30000 },
  { name: '주먹밥', price: 20000 },
  { name: '주스', price: 20000 },
  { name: '냉면', price: 40000 },
  { name: '스파게티', price: 45000 },
  { name: '탕후루', price: 35000 },
  { name: '닭발', price: 80000 },
  { name: '과일화채', price: 40000 },
  { name: '붕어빵', price: 40000 },
]

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: '허용되지 않은 요청 방식입니다.',
      })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { minecraftName, discordName, items, request } = body

    if (!minecraftName || !discordName) {
      return res.status(400).json({
        success: false,
        message: '마크 닉네임과 디스코드 닉네임을 입력해주세요.',
      })
    }

    const selectedItems = MENU.map((menu) => {
      const found = items?.find((v) => v.name === menu.name)
      const quantity = Number(found?.quantity || 0)

      return {
        ...menu,
        quantity,
      }
    }).filter((v) => v.quantity > 0)

    if (selectedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: '음식을 1개 이상 선택해주세요.',
      })
    }

    const orderNumber = `MGP-${Date.now()}`
    const orderTime = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    })

    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const orderSummary = selectedItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(' / ')

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

    const headers = headerResponse.data.values?.[0] || []

    const row = headers.map((header) => {
      const h = String(header || '').trim()

      if (h === '주문번호') return orderNumber
      if (h === '마크 닉네임') return minecraftName
      if (h === '디스코드 닉네임') return discordName
      if (h === '주문 시간') return orderTime
      if (h === '총 금액') return totalPrice
      if (h === '주문 내역') return orderSummary
      if (h === '상태 확인') return '주문접수'
      if (h === '취소 사유') return ''
      if (h === '담당자') return ''
      if (h === '요청사항') return request || ''

      const menu = selectedItems.find((item) => item.name === h)
      if (menu) return menu.quantity

      return ''
    })

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'MGP 음식점 주문서',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    })

    return res.status(200).json({
      success: true,
      message: '주문이 접수되었습니다.',
      data: {
        orderNumber,
        totalPrice,
        orderSummary,
      },
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