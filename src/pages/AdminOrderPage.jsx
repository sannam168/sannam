import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminOrderPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/admin-orders')
      const data = await res.json()

      if (data.success) {
        setOrders(data.orders || [])
      } else {
        setError(data.message || '불러오기 실패')
      }
    } catch (err) {
      setError('서버 연결 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/admin-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      const data = await res.json()

      if (data.success) {
        loadOrders()
      } else {
        alert(data.message || '수정 실패')
      }
    } catch (err) {
      alert('상태 변경 실패')
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const keyword =
        `${item.id} ${item.markNickname} ${item.discordNickname} ${item.manager}`.toLowerCase()

      const matchSearch = keyword.includes(search.toLowerCase())

      const matchStatus =
        statusFilter === '전체' || item.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  const summary = {
    total: orders.length,
    received: orders.filter((v) => v.status === '주문접수').length,
    preparing: orders.filter((v) => v.status === '준비중').length,
    done: orders.filter((v) => v.status === '판매 완료').length,
    delay: orders.filter((v) => v.status === '지연').length,
    cancel: orders.filter((v) => v.status === '취소').length,
  }

  const badgeColor = (status) => {
    if (status === '주문접수') return '#2563eb'
    if (status === '준비중') return '#16a34a'
    if (status === '판매 완료') return '#15803d'
    if (status === '취소') return '#dc2626'
    if (status === '지연') return '#ca8a04'
    return '#6b7280'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#edf5ed',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            background:
              'linear-gradient(135deg,#166534,#16a34a,#65a30d)',
            color: 'white',
            padding: '30px',
            borderRadius: '28px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.15)',
                  fontSize: '13px',
                  marginBottom: '10px',
                }}
              >
                MGP Order Admin
              </div>

              <h1 style={{ margin: 0, fontSize: '42px' }}>
                주문 관리자
              </h1>

              <p style={{ marginTop: '10px', opacity: 0.9 }}>
                주문 목록을 확인하고 상태를 관리하는 관리자 페이지입니다.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={loadOrders}
                style={topBtn}
              >
                새로고침
              </button>

              <button
                onClick={() => navigate('/admin')}
                style={topBtn}
              >
                관리자 홈
              </button>

              <button
                onClick={() => navigate('/')}
                style={topBtn}
              >
                메인으로
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          <StatCard title="전체 주문" value={summary.total} />
          <StatCard title="주문접수" value={summary.received} />
          <StatCard title="준비중" value={summary.preparing} />
          <StatCard title="판매 완료" value={summary.done} />
          <StatCard title="지연" value={summary.delay} />
          <StatCard title="취소" value={summary.cancel} />
        </div>

        <div
          style={{
            background: 'white',
            padding: '18px',
            borderRadius: '22px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>주문 검색 및 필터</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr minmax(180px,220px) 140px',
              gap: '10px',
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="주문번호, 마크 닉네임, 디스코드 닉네임, 담당자 검색"
              style={inputStyle}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={inputStyle}
            >
              <option value="전체">전체 상태</option>
              <option value="주문접수">주문접수</option>
              <option value="준비중">준비중</option>
              <option value="판매 완료">판매 완료</option>
              <option value="취소">취소</option>
              <option value="지연">지연</option>
            </select>

            <button
              onClick={loadOrders}
              style={{
                border: 'none',
                borderRadius: '14px',
                background: '#22c55e',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              새로고침
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: '12px',
                background: '#fff7ed',
                border: '1px solid #fdba74',
                padding: '12px',
                borderRadius: '14px',
                color: '#c2410c',
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gap: '14px',
          }}
        >
          {loading ? (
            <div style={emptyBox}>불러오는 중...</div>
          ) : filteredOrders.length === 0 ? (
            <div style={emptyBox}>
              조건에 맞는 주문이 없습니다.
            </div>
          ) : (
            filteredOrders.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  padding: '18px',
                  borderRadius: '20px',
                  boxShadow:
                    '0 6px 18px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      #{item.id}
                    </div>

                    <div style={smallText}>
                      마크닉네임 : {item.markNickname}
                    </div>

                    <div style={smallText}>
                      디스코드 : {item.discordNickname}
                    </div>

                    <div style={smallText}>
                      담당자 : {item.manager || '-'}
                    </div>
                  </div>

                  <div
                    style={{
                      minWidth: '220px',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding:
                          '7px 12px',
                        borderRadius:
                          '999px',
                        background:
                          badgeColor(
                            item.status
                          ),
                        color: 'white',
                        fontSize: '13px',
                        marginBottom:
                          '10px',
                      }}
                    >
                      {item.status}
                    </div>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item.id,
                          e.target.value
                        )
                      }
                      style={{
                        ...inputStyle,
                        width: '100%',
                      }}
                    >
                      <option value="주문접수">
                        주문접수
                      </option>
                      <option value="준비중">
                        준비중
                      </option>
                      <option value="판매 완료">
                        판매 완료
                      </option>
                      <option value="취소">
                        취소
                      </option>
                      <option value="지연">
                        지연
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '18px',
        borderRadius: '18px',
      }}
    >
      <div style={{ color: '#555', fontSize: '14px' }}>
        {title}
      </div>

      <div
        style={{
          fontSize: '38px',
          fontWeight: 'bold',
          color: '#166534',
          marginTop: '6px',
        }}
      >
        {value}건
      </div>
    </div>
  )
}

const topBtn = {
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.12)',
  color: 'white',
  borderRadius: '14px',
  padding: '12px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
}

const inputStyle = {
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #cfe8cf',
  fontSize: '14px',
}

const smallText = {
  marginTop: '6px',
  color: '#555',
  fontSize: '14px',
}

const emptyBox = {
  background: 'white',
  padding: '40px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#666',
}

export default AdminOrderPage