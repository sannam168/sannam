import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminOrderPage() {
  const navigate = useNavigate()

  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체 상태')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const response = await fetch('/api/admin-orders')
      const data = await response.json()

      if (!data.success) {
        setErrorMessage(data.message || '주문 목록을 불러오지 못했습니다.')
        setOrderList([])
        return
      }

      setOrderList(data.data || [])
    } catch (error) {
      setErrorMessage('서버 연결 중 오류가 발생했습니다.')
      setOrderList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredList = useMemo(() => {
    return orderList.filter((item) => {
      const keyword = searchKeyword.trim().toLowerCase()

      const keywordMatch =
        !keyword ||
        [
          item.orderNo,
          item.minecraftName,
          item.discordName,
          item.orderSummary,
          item.manager,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword)

      const statusMatch =
        statusFilter === '전체 상태' || item.status === statusFilter

      return keywordMatch && statusMatch
    })
  }, [orderList, searchKeyword, statusFilter])

  const summary = useMemo(() => {
    return {
      total: orderList.length,
      waiting: orderList.filter((v) => v.status === '주문접수').length,
      checking: orderList.filter((v) => v.status === '확인중').length,
      delay: orderList.filter((v) => v.status === '지연').length,
      done: orderList.filter((v) => v.status === '처리완료').length,
    }
  }, [orderList])

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f4fbf4 0%, #eef8ef 45%, #e9f5ea 100%)',
        fontFamily: 'Arial, sans-serif',
        padding: '28px 20px',
        color: '#1f2937',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(135deg, #14532d 0%, #15803d 45%, #65a30d 100%)',
            color: 'white',
            padding: '34px 30px',
            borderRadius: '28px',
            marginBottom: '24px',
            boxShadow: '0 18px 40px rgba(22, 101, 52, 0.22)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.16)',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginBottom: '14px',
                }}
              >
                MGP Order Admin
              </div>

              <h1
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '36px',
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                }}
              >
                주문 관리자
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: 1.8,
                  opacity: 0.95,
                  maxWidth: '720px',
                }}
              >
                주문 목록을 확인하고 상태, 취소 사유, 담당자를 관리할 수 있는
                관리자 페이지입니다.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={loadOrders} style={topButtonStyle}>
                새로고침
              </button>
              <button onClick={() => navigate('/admin')} style={topButtonStyle}>
                관리자 홈
              </button>
              <button onClick={() => navigate('/')} style={topButtonStyle}>
                메인으로
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <SummaryCard title="전체 주문" value={`${summary.total}건`} />
          <SummaryCard title="주문접수" value={`${summary.waiting}건`} />
          <SummaryCard title="확인중" value={`${summary.checking}건`} />
          <SummaryCard title="지연" value={`${summary.delay}건`} />
          <SummaryCard title="처리완료" value={`${summary.done}건`} />
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '22px',
            padding: '20px',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#14532d',
              marginBottom: '14px',
            }}
          >
            주문 검색 및 필터
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 160px',
              gap: '12px',
            }}
          >
            <input
              type="text"
              placeholder="주문번호, 마크 닉네임, 디스코드 닉네임, 담당자 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={inputStyle}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option>전체 상태</option>
              <option>주문접수</option>
              <option>확인중</option>
              <option>처리완료</option>
              <option>지연</option>
              <option>취소</option>
            </select>
            <button onClick={loadOrders} style={searchButtonStyle}>
              새로고침
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                marginTop: '14px',
                padding: '14px 16px',
                borderRadius: '14px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#9a3412',
                fontSize: '14px',
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>

        {loading ? (
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
              textAlign: 'center',
              color: '#355e3b',
              fontWeight: 'bold',
            }}
          >
            주문 목록을 불러오는 중입니다...
          </div>
        ) : filteredList.length === 0 ? (
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
              textAlign: 'center',
              color: '#4b5563',
            }}
          >
            조건에 맞는 주문이 없습니다.
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {filteredList.map((item) => (
              <OrderCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        border: '1px solid rgba(34, 197, 94, 0.08)',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: '#5b6b60',
          marginBottom: '10px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#14532d',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function OrderCard({ item }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '22px',
        boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
        border: '1px solid rgba(34, 197, 94, 0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '18px',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13px',
              color: '#5b6b60',
              marginBottom: '6px',
            }}
          >
            주문번호
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
            }}
          >
            {item.orderNo}
          </div>
        </div>

        <span style={getStatusBadgeStyle(item.status)}>{item.status || '-'}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '18px',
        }}
      >
        <InfoBox label="주문 시간" value={item.orderTime} />
        <InfoBox label="마크 닉네임" value={item.minecraftName} />
        <InfoBox label="디스코드 닉네임" value={item.discordName} />
        <InfoBox label="총 금액" value={item.totalPrice} />
        <InfoBox label="담당자" value={item.manager || '-'} />
      </div>

      <div
        style={{
          background: '#f7fff7',
          border: '1px solid #dcfce7',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: '#5b6b60',
            marginBottom: '8px',
          }}
        >
          주문 내역
        </div>
        <div
          style={{
            fontSize: '16px',
            color: '#1f2937',
            lineHeight: 1.7,
            fontWeight: 'bold',
          }}
        >
          {item.orderSummary || '-'}
        </div>
      </div>

      {item.reason && (
        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: '#9a3412',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            사유
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#7c2d12',
              lineHeight: 1.7,
            }}
          >
            {item.reason}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div
      style={{
        background: '#f9fafb',
        borderRadius: '16px',
        padding: '14px',
        border: '1px solid #ecfdf5',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#111827',
          lineHeight: 1.6,
        }}
      >
        {value || '-'}
      </div>
    </div>
  )
}

function getStatusBadgeStyle(status) {
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
  if (status === '확인중') {
    return { ...base, background: '#dbeafe', color: '#1d4ed8' }
  }
  if (status === '처리완료') {
    return { ...base, background: '#ecfccb', color: '#4d7c0f' }
  }
  if (status === '지연') {
    return { ...base, background: '#fef3c7', color: '#b45309' }
  }
  if (status === '취소') {
    return { ...base, background: '#fee2e2', color: '#b91c1c' }
  }

  return { ...base, background: '#e5e7eb', color: '#374151' }
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

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  background: 'white',
  fontSize: '14px',
  boxSizing: 'border-box',
}

const searchButtonStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

export default AdminOrderPage