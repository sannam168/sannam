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
      preparing: orderList.filter((v) => v.status === '준비중').length,
      delay: orderList.filter((v) => v.status === '지연').length,
      done: orderList.filter((v) => v.status === '판매 완료').length,
    }
  }, [orderList])

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={heroStyle}>
          <div style={heroInnerStyle}>
            <div>
              <div style={badgeStyle}>MGP Order Admin</div>
              <h1 style={heroTitleStyle}>주문 관리자</h1>
              <p style={heroTextStyle}>
                주문 목록을 확인하고 상태, 취소 사유, 담당자를 관리할 수 있는 관리자 페이지입니다.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={loadOrders} style={topButtonStyle}>새로고침</button>
              <button onClick={() => navigate('/admin')} style={topButtonStyle}>관리자 홈</button>
              <button onClick={() => navigate('/')} style={topButtonStyle}>메인으로</button>
            </div>
          </div>
        </div>

        <div style={summaryGridStyle}>
          <SummaryCard title="전체 주문" value={`${summary.total}건`} />
          <SummaryCard title="주문접수" value={`${summary.waiting}건`} />
          <SummaryCard title="준비중" value={`${summary.preparing}건`} />
          <SummaryCard title="지연" value={`${summary.delay}건`} />
          <SummaryCard title="판매 완료" value={`${summary.done}건`} />
        </div>

        <div style={filterBoxStyle}>
          <div style={sectionTitleStyle}>주문 검색 및 필터</div>

          <div style={filterGridStyle}>
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
  <option>준비중</option>
  <option>판매 완료</option>
  <option>취소</option>
  <option>지연</option>
</select>

            <button onClick={loadOrders} style={searchButtonStyle}>새로고침</button>
          </div>

          {errorMessage && <div style={errorBoxStyle}>{errorMessage}</div>}
        </div>

        {loading ? (
          <EmptyBox text="주문 목록을 불러오는 중입니다..." />
        ) : filteredList.length === 0 ? (
          <EmptyBox text="조건에 맞는 주문이 없습니다." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredList.map((item) => (
              <OrderCard key={item.id} item={item} onSaved={loadOrders} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ item, onSaved }) {
  const [status, setStatus] = useState(item.status || '주문접수')
  const [reason, setReason] = useState(item.reason || '')
  const [manager, setManager] = useState(item.manager || '')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = async () => {
    try {
      if ((status === '취소' || status === '지연') && !reason.trim()) {
        setSaveMessage('취소 또는 지연 상태는 사유를 입력해주세요.')
        return
      }

      setSaving(true)
      setSaveMessage('저장 중입니다...')

      const response = await fetch('/api/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowNumber: item.rowNumber || item.id + 1,
          status,
          reason,
          manager,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setSaveMessage(data.message || '저장 중 오류가 발생했습니다.')
        return
      }

      setSaveMessage('저장되었습니다.')
      await onSaved()
    } catch (error) {
      setSaveMessage('서버 연결 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setStatus(item.status || '주문접수')
    setReason(item.reason || '')
    setManager(item.manager || '')
    setSaveMessage('')
  }

  return (
    <div style={orderCardStyle}>
      <div style={orderHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>주문번호</div>
          <div style={orderNoStyle}>{item.orderNo}</div>
        </div>

        <span style={getStatusBadgeStyle(status)}>{status || '-'}</span>
      </div>

      <div style={infoGridStyle}>
        <InfoBox label="주문 시간" value={item.orderTime} />
        <InfoBox label="마크 닉네임" value={item.minecraftName} />
        <InfoBox label="디스코드 닉네임" value={item.discordName} />
        <InfoBox label="총 금액" value={item.totalPrice} />
      </div>

      <div style={orderSummaryBoxStyle}>
        <div style={smallLabelStyle}>주문 내역</div>
        <div style={orderSummaryTextStyle}>{item.orderSummary || '-'}</div>
      </div>

      <div style={editGridStyle}>
        <div>
          <div style={fieldLabelStyle}>상태 선택</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option>주문접수</option>
            <option>확인중</option>
            <option>처리완료</option>
            <option>지연</option>
            <option>취소</option>
          </select>
        </div>

        <div>
          <div style={fieldLabelStyle}>담당자</div>
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            placeholder="담당자 이름 입력"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={fieldLabelStyle}>사유</div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="상태 변경 사유를 입력하세요."
          style={textareaStyle}
        />
      </div>

      {saveMessage && (
        <div
          style={{
            ...messageBoxStyle,
            background: saveMessage === '저장되었습니다.' ? '#f0fdf4' : '#fff7ed',
            borderColor: saveMessage === '저장되었습니다.' ? '#bbf7d0' : '#fed7aa',
            color: saveMessage === '저장되었습니다.' ? '#166534' : '#9a3412',
          }}
        >
          {saveMessage}
        </div>
      )}

      <div style={buttonRowStyle}>
        <button onClick={handleReset} style={subButtonStyle}>초기화</button>
        <button onClick={handleSave} style={saveButtonStyle} disabled={saving}>
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  )
}

function SummaryCard({ title, value }) {
  return (
    <div style={summaryCardStyle}>
      <div style={{ fontSize: '14px', color: '#5b6b60', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#14532d' }}>
        {value}
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

function EmptyBox({ text }) {
  return (
    <div style={emptyBoxStyle}>
      {text}
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

  if (status === '주문접수') return { ...base, background: '#dcfce7', color: '#166534' }
if (status === '준비중') return { ...base, background: '#dbeafe', color: '#1d4ed8' }
if (status === '판매 완료') return { ...base, background: '#dcfce7', color: '#166534' }
if (status === '취소') return { ...base, background: '#fee2e2', color: '#b91c1c' }
if (status === '지연') return { ...base, background: '#fef3c7', color: '#b45309' }

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
  background: 'linear-gradient(135deg, #14532d 0%, #15803d 45%, #65a30d 100%)',
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

const summaryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
  marginBottom: '28px',
}

const summaryCardStyle = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
}

const filterBoxStyle = {
  background: 'white',
  borderRadius: '22px',
  padding: '20px',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
  marginBottom: '24px',
}

const sectionTitleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#14532d',
  marginBottom: '14px',
}

const filterGridStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 160px',
  gap: '12px',
}

const orderCardStyle = {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: '24px',
  padding: '22px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
}

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '18px',
  alignItems: 'center',
}

const orderNoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#111827',
}

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
  marginBottom: '18px',
}

const editGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '14px',
  marginBottom: '14px',
}

const orderSummaryBoxStyle = {
  background: '#f7fff7',
  border: '1px solid #dcfce7',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '14px',
}

const orderSummaryTextStyle = {
  fontSize: '16px',
  color: '#1f2937',
  lineHeight: 1.7,
  fontWeight: 'bold',
}

const smallLabelStyle = {
  fontSize: '13px',
  color: '#5b6b60',
  marginBottom: '6px',
}

const fieldLabelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#355e3b',
  marginBottom: '8px',
}

const smallGrayLabelStyle = {
  fontSize: '13px',
  color: '#6b7280',
  marginBottom: '6px',
}

const infoBoxStyle = {
  background: '#f9fafb',
  borderRadius: '16px',
  padding: '14px',
  border: '1px solid #ecfdf5',
}

const infoValueStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111827',
  lineHeight: 1.6,
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

const textareaStyle = {
  width: '100%',
  minHeight: '90px',
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  background: 'white',
  fontSize: '14px',
  boxSizing: 'border-box',
  resize: 'vertical',
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

const subButtonStyle = {
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#374151',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const saveButtonStyle = {
  padding: '12px 16px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #3f6212, #65a30d)',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const buttonRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  flexWrap: 'wrap',
}

const messageBoxStyle = {
  marginBottom: '14px',
  padding: '12px 14px',
  borderRadius: '14px',
  border: '1px solid',
  fontSize: '14px',
  lineHeight: 1.6,
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

const emptyBoxStyle = {
  background: 'white',
  borderRadius: '24px',
  padding: '30px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  textAlign: 'center',
  color: '#4b5563',
}

export default AdminOrderPage