import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function OrderPage() {
  const navigate = useNavigate()

  const [minecraftName, setMinecraftName] = useState('')
  const [discordName, setDiscordName] = useState('')
  const [request, setRequest] = useState('')
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const selectedItems = useMemo(() => {
    return MENU.map((item) => ({
      ...item,
      quantity: Number(quantities[item.name] || 0),
    })).filter((item) => item.quantity > 0)
  }, [quantities])

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const changeQuantity = (name, amount) => {
    setQuantities((prev) => {
      const current = Number(prev[name] || 0)
      const next = Math.max(0, current + amount)

      return {
        ...prev,
        [name]: next,
      }
    })
  }

  const submitOrder = async () => {
    try {
      setMessage('')
      setResult(null)

      if (!minecraftName.trim() || !discordName.trim()) {
        setMessage('마크 닉네임과 디스코드 닉네임을 입력해주세요.')
        return
      }

      if (selectedItems.length === 0) {
        setMessage('음식을 1개 이상 선택해주세요.')
        return
      }

      setLoading(true)

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minecraftName,
          discordName,
          request,
          items: selectedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setMessage(data.message || '주문 접수 중 오류가 발생했습니다.')
        return
      }

      setResult(data.data)
      setMessage('주문이 접수되었습니다.')

      setMinecraftName('')
      setDiscordName('')
      setRequest('')
      setQuantities({})
    } catch (error) {
      setMessage('서버 연결 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const copyOrderNumber = async () => {
    if (!result?.orderNumber) return

    try {
      await navigator.clipboard.writeText(result.orderNumber)
      setMessage('주문번호가 복사되었습니다.')
    } catch (error) {
      setMessage('복사에 실패했습니다. 직접 복사해주세요.')
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={heroStyle}>
          <div>
            <div style={badgeStyle}>MGP Food Order</div>
            <h1 style={heroTitleStyle}>주문하기</h1>
            <p style={heroTextStyle}>
              원하는 음식을 선택하고 수량을 입력하면 주문이 접수됩니다.
            </p>
          </div>

          <button onClick={() => navigate('/')} style={topButtonStyle}>
            메인으로
          </button>
        </div>

        <div style={formBoxStyle}>
          <div style={sectionTitleStyle}>주문자 정보</div>

          <div style={userGridStyle}>
            <input
              value={minecraftName}
              onChange={(e) => setMinecraftName(e.target.value)}
              placeholder="마크 닉네임"
              style={inputStyle}
            />

            <input
              value={discordName}
              onChange={(e) => setDiscordName(e.target.value)}
              placeholder="디스코드 닉네임"
              style={inputStyle}
            />
          </div>

          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="요청사항이 있다면 입력해주세요."
            style={textareaStyle}
          />
        </div>

        <div style={menuGridStyle}>
          {MENU.map((item) => {
            const quantity = Number(quantities[item.name] || 0)

            return (
              <div key={item.name} style={menuCardStyle}>
                <div>
                  <div style={menuNameStyle}>{item.name}</div>
                  <div style={priceStyle}>{item.price.toLocaleString()}원</div>
                </div>

                <div style={quantityRowStyle}>
                  <button
                    onClick={() => changeQuantity(item.name, -1)}
                    style={quantityButtonStyle}
                  >
                    -
                  </button>

                  <div style={quantityStyle}>{quantity}</div>

                  <button
                    onClick={() => changeQuantity(item.name, 1)}
                    style={quantityButtonStyle}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={summaryBoxStyle}>
          <div style={sectionTitleStyle}>주문 요약</div>

          {selectedItems.length === 0 ? (
            <div style={{ color: '#6b7280' }}>선택한 음식이 없습니다.</div>
          ) : (
            <div style={summaryListStyle}>
              {selectedItems.map((item) => (
                <div key={item.name}>
                  {item.name} x{item.quantity} ={' '}
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
              ))}
            </div>
          )}

          <div style={totalBoxStyle}>
            <div style={{ fontSize: '14px', color: '#5b6b60' }}>총 금액</div>
            <div style={totalPriceStyle}>{totalPrice.toLocaleString()}원</div>
          </div>

          <button onClick={submitOrder} disabled={loading} style={submitButtonStyle}>
            {loading ? '주문 접수 중...' : '주문하기'}
          </button>

          {message && <div style={messageBoxStyle}>{message}</div>}

          {result && (
            <div style={resultBoxStyle}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>
                주문이 완료되었습니다!
              </div>

              <div style={orderNumberBoxStyle}>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>주문번호</div>
                <div style={orderNumberStyle}>{result.orderNumber}</div>
              </div>

              <div style={buttonRowStyle}>
                <button onClick={copyOrderNumber} style={greenButtonStyle}>
                  복사하기
                </button>

                <button
                  onClick={() => navigate('/order-status')}
                  style={whiteButtonStyle}
                >
                  주문 조회로 이동
                </button>
              </div>

              <div style={noticeStyle}>
                주문번호를 잃어버리시면 주문 현황 조회가 어려울 수 있습니다.
                <br />
                복사하기 버튼을 눌러 안전하게 보관해 주세요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: '100vh', background: '#eef8ef', padding: '30px' }
const heroStyle = { background: '#16a34a', color: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px' }
const badgeStyle = { fontSize: '13px', marginBottom: '10px' }
const heroTitleStyle = { margin: 0, fontSize: '34px' }
const heroTextStyle = { marginTop: '10px' }
const topButtonStyle = { marginTop: '16px', padding: '10px 14px' }
const formBoxStyle = { background: 'white', padding: '20px', borderRadius: '18px', marginBottom: '20px' }
const sectionTitleStyle = { fontSize: '22px', fontWeight: 'bold', marginBottom: '14px' }
const userGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
const inputStyle = { padding: '12px' }
const textareaStyle = { width: '100%', marginTop: '12px', minHeight: '90px' }
const menuGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px', marginBottom: '20px' }
const menuCardStyle = { background: 'white', padding: '18px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between' }
const menuNameStyle = { fontWeight: 'bold' }
const priceStyle = { color: '#16a34a' }
const quantityRowStyle = { display: 'flex', gap: '8px', alignItems: 'center' }
const quantityButtonStyle = { width: '32px', height: '32px' }
const quantityStyle = { minWidth: '24px', textAlign: 'center' }
const summaryBoxStyle = { background: 'white', padding: '20px', borderRadius: '18px' }
const summaryListStyle = { lineHeight: 1.8, marginBottom: '16px' }
const totalBoxStyle = { marginBottom: '16px' }
const totalPriceStyle = { fontSize: '28px', fontWeight: 'bold' }
const submitButtonStyle = { width: '100%', padding: '14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '14px' }
const messageBoxStyle = { marginTop: '14px', padding: '12px', background: '#f0fdf4', borderRadius: '14px' }
const resultBoxStyle = { marginTop: '14px', padding: '16px', background: '#f0fdf4', borderRadius: '14px' }
const orderNumberBoxStyle = { background: 'white', padding: '14px', borderRadius: '14px', marginBottom: '14px' }
const orderNumberStyle = { fontSize: '24px', fontWeight: 'bold' }
const buttonRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }
const greenButtonStyle = { padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '12px' }
const whiteButtonStyle = { padding: '12px', background: 'white', borderRadius: '12px' }
const noticeStyle = { background: '#fff7ed', padding: '12px', borderRadius: '12px' }

export default OrderPage