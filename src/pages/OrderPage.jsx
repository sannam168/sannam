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
        headers: {
          'Content-Type': 'application/json',
        },
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
          <div>
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
          </div>

          <div style={totalBoxStyle}>
            <div style={{ fontSize: '14px', color: '#5b6b60' }}>총 금액</div>
            <div style={totalPriceStyle}>{totalPrice.toLocaleString()}원</div>
          </div>

          <button onClick={submitOrder} disabled={loading} style={submitButtonStyle}>
            {loading ? '주문 접수 중...' : '주문하기'}
          </button>

          {message && (
            <div
              style={{
                ...messageBoxStyle,
                background: result ? '#f0fdf4' : '#fff7ed',
                borderColor: result ? '#bbf7d0' : '#fed7aa',
                color: result ? '#166534' : '#9a3412',
              }}
            >
              {message}
            </div>
          )}

          {result && (
  <div style={resultBoxStyle}>
    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
      주문이 완료되었습니다!
    </div>

    <div style={orderNumberBoxStyle}>
      <div style={{ fontSize: '13px', color: '#5b6b60', marginBottom: '6px' }}>
        주문번호
      </div>
      <div style={orderNumberStyle}>{result.orderNumber}</div>
    </div>

    <div style={resultButtonRowStyle}>
      <button onClick={copyOrderNumber} style={copyButtonStyle}>
        주문번호 복사하기
      </button>

      <button
        onClick={() => navigate('/order-status')}
        style={goStatusButtonStyle}
      >
        주문 조회로 이동
      </button>
    </div>

    <div style={orderNoticeStyle}>
      주문번호를 잃어버리시면 주문 현황 조회가 어려울 수 있습니다.
      <br />
      아래 복사하기 버튼을 눌러 안전하게 보관해 주세요.
    </div>

    <div style={{ marginTop: '14px', lineHeight: 1.8 }}>
      <div>주문내역: {result.orderSummary}</div>
      <div>총금액: {Number(result.totalPrice).toLocaleString()}원</div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f4fbf4 0%, #eef8ef 45%, #e9f5ea 100%)',
  fontFamily: 'Arial, sans-serif',
  padding: '28px 20px',
  color: '#1f2937',
}

const heroStyle = {
  background: 'linear-gradient(135deg, #166534 0%, #15803d 45%, #65a30d 100%)',
  color: 'white',
  padding: '34px 30px',
  borderRadius: '28px',
  marginBottom: '24px',
  boxShadow: '0 18px 40px rgba(22, 101, 52, 0.22)',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'center',
}

const badgeStyle = {
  display: 'inline-block',
  padding: '8px 14px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.16)',
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '14px',
}

const heroTitleStyle = {
  margin: '0 0 10px 0',
  fontSize: '36px',
  lineHeight: 1.2,
  fontWeight: 'bold',
}

const heroTextStyle = {
  margin: 0,
  fontSize: '16px',
  lineHeight: 1.8,
  opacity: 0.95,
}

const topButtonStyle = {
  padding: '12px 18px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.24)',
  background: 'rgba(255,255,255,0.14)',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const formBoxStyle = {
  background: 'white',
  borderRadius: '24px',
  padding: '22px',
  marginBottom: '22px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
}

const sectionTitleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#14532d',
  marginBottom: '14px',
}

const userGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '12px',
  marginBottom: '12px',
}

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const textareaStyle = {
  width: '100%',
  minHeight: '90px',
  padding: '13px 14px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  fontSize: '14px',
  boxSizing: 'border-box',
  resize: 'vertical',
}

const menuGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  marginBottom: '22px',
}

const menuCardStyle = {
  background: 'white',
  borderRadius: '22px',
  padding: '20px',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '14px',
  alignItems: 'center',
}

const menuNameStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '8px',
}

const priceStyle = {
  color: '#166534',
  fontWeight: 'bold',
}

const quantityRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const quantityButtonStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  border: 'none',
  background: '#dcfce7',
  color: '#166534',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const quantityStyle = {
  minWidth: '24px',
  textAlign: 'center',
  fontWeight: 'bold',
}

const summaryBoxStyle = {
  background: 'white',
  borderRadius: '24px',
  padding: '22px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
}

const summaryListStyle = {
  color: '#374151',
  lineHeight: 1.8,
  marginBottom: '18px',
}

const totalBoxStyle = {
  background: '#f7fff7',
  border: '1px solid #dcfce7',
  borderRadius: '18px',
  padding: '18px',
  marginBottom: '16px',
}

const totalPriceStyle = {
  fontSize: '30px',
  fontWeight: 'bold',
  color: '#14532d',
  marginTop: '6px',
}

const submitButtonStyle = {
  width: '100%',
  padding: '15px 16px',
  borderRadius: '16px',
  border: 'none',
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const messageBoxStyle = {
  marginTop: '14px',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid',
  fontSize: '14px',
}

const resultBoxStyle = {
  marginTop: '14px',
  padding: '14px 16px',
  borderRadius: '14px',
  background: '#f7fff7',
  border: '1px solid #bbf7d0',
  color: '#14532d',
  lineHeight: 1.8,
  fontWeight: 'bold',
}

const orderNumberBoxStyle = {
  background: 'white',
  border: '1px solid #bbf7d0',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '14px',
}

const orderNumberStyle = {
  fontSize: '26px',
  fontWeight: 'bold',
  color: '#14532d',
  wordBreak: 'break-all',
}

const resultButtonRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '14px',
}

const copyButtonStyle = {
  padding: '13px 14px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const goStatusButtonStyle = {
  padding: '13px 14px',
  borderRadius: '14px',
  border: '1px solid #bbf7d0',
  background: 'white',
  color: '#166534',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const orderNoticeStyle = {
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  color: '#9a3412',
  borderRadius: '14px',
  padding: '13px 14px',
  fontSize: '14px',
  lineHeight: 1.7,
}

export default OrderPage