import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function OrderStatusPage() {
  const navigate = useNavigate()

  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = async () => {
    const value = orderNumber.trim()

    if (!value) {
      setResult(null)
      setErrorMessage('주문번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')
      setResult(null)

      const response = await fetch(
        `/api/order-status?orderNumber=${encodeURIComponent(value)}`
      )

      const data = await response.json()

      if (!data.success) {
        setErrorMessage(data.message || '조회 중 오류가 발생했습니다.')
        return
      }

      setResult(data.data)
    } catch (error) {
      setErrorMessage('서버 연결 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={heroStyle}>
          <div style={heroInnerStyle}>
            <div>
              <div style={badgeStyle}>MGP Order Status</div>
              <h1 style={heroTitleStyle}>주문 조회</h1>
              <p style={heroTextStyle}>
                주문번호를 입력하면 현재 주문 상태와 주문 내역을 확인할 수 있습니다.
              </p>
            </div>

            <button onClick={() => navigate('/')} style={topButtonStyle}>
              메인으로
            </button>
          </div>
        </div>

        <div style={searchBoxStyle}>
          <div style={sectionTitleStyle}>주문번호 입력</div>

          <div style={searchGridStyle}>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              placeholder="예: MGP-ORD-001"
              style={inputStyle}
            />

            <button onClick={handleSearch} style={searchButtonStyle}>
              {loading ? '조회 중...' : '조회하기'}
            </button>
          </div>

          {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
        </div>

        {result && (
          <div style={resultBoxStyle}>
            <div style={resultHeaderStyle}>
              <div>
                <div style={smallLabelStyle}>주문번호</div>
                <div style={orderNoStyle}>{result.orderNo}</div>
              </div>

              <span style={getStatusStyle(result.status)}>
                {result.status || '-'}
              </span>
            </div>

            <div style={infoGridStyle}>
              <InfoBox label="주문 시간" value={result.orderTime} />
              <InfoBox label="마크 닉네임" value={result.minecraftName} />
              <InfoBox label="디스코드 닉네임" value={result.discordName} />
              <InfoBox label="총 금액" value={result.totalPrice} />
            </div>

            <div style={orderSummaryBoxStyle}>
              <div style={smallLabelStyle}>주문 내역</div>
              <div style={orderSummaryTextStyle}>
                {result.orderSummary || '-'}
              </div>
            </div>

            {result.reason && (
              <div style={reasonBoxStyle}>
                <div style={reasonTitleStyle}>취소 / 상태 사유</div>
                <div style={reasonTextStyle}>{result.reason}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div style={infoBoxStyle}>
      <div style={smallGrayLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value || '-'}</div>
    </div>
  )
}

function getStatusStyle(status) {
  const base = {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 'bold',
  }

  if (status === '주문접수') {
    return { ...base, background: '#dcfce7', color: '#166534' }
  }

  if (status === '준비중') {
    return { ...base, background: '#dbeafe', color: '#1d4ed8' }
  }

  if (status === '판매 완료') {
    return { ...base, background: '#bbf7d0', color: '#166534' }
  }

  if (status === '취소') {
    return { ...base, background: '#fee2e2', color: '#b91c1c' }
  }

  if (status === '지연') {
    return { ...base, background: '#fef3c7', color: '#b45309' }
  }

  return { ...base, background: '#e5e7eb', color: '#374151' }
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
}

const heroInnerStyle = {
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
  maxWidth: '720px',
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

const searchBoxStyle = {
  background: 'white',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  marginBottom: '20px',
}

const sectionTitleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#14532d',
  marginBottom: '14px',
}

const searchGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 160px',
  gap: '12px',
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  background: 'white',
  fontSize: '15px',
  boxSizing: 'border-box',
}

const searchButtonStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const errorBoxStyle = {
  marginTop: '14px',
  padding: '14px 16px',
  borderRadius: '14px',
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  color: '#9a3412',
  fontSize: '14px',
  lineHeight: 1.6,
}

const resultBoxStyle = {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
}

const resultHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '18px',
  alignItems: 'center',
}

const smallLabelStyle = {
  fontSize: '13px',
  color: '#5b6b60',
  marginBottom: '6px',
}

const orderNoStyle = {
  fontSize: '26px',
  fontWeight: 'bold',
  color: '#111827',
}

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
  marginBottom: '18px',
}

const infoBoxStyle = {
  background: '#f9fafb',
  borderRadius: '16px',
  padding: '14px',
  border: '1px solid #ecfdf5',
}

const smallGrayLabelStyle = {
  fontSize: '13px',
  color: '#6b7280',
  marginBottom: '6px',
}

const infoValueStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
  lineHeight: 1.6,
}

const orderSummaryBoxStyle = {
  background: '#f7fff7',
  border: '1px solid #dcfce7',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '16px',
}

const orderSummaryTextStyle = {
  fontSize: '16px',
  color: '#1f2937',
  lineHeight: 1.7,
  fontWeight: 'bold',
}

const reasonBoxStyle = {
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '16px',
  padding: '16px',
}

const reasonTitleStyle = {
  fontSize: '14px',
  color: '#9a3412',
  marginBottom: '8px',
  fontWeight: 'bold',
}

const reasonTextStyle = {
  fontSize: '15px',
  color: '#7c2d12',
  lineHeight: 1.7,
}

export default OrderStatusPage