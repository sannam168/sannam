import { useNavigate } from 'react-router-dom'

function AdminOrderPage() {
  const navigate = useNavigate()

  const orderList = [
    {
      id: 1,
      orderNo: 'MGP-ORD-001',
      orderTime: '2026-04-10 19:10',
      minecraftName: '샌남윱',
      discordName: 'sannam#0001',
      orderSummary: '김밥 2 / 라면 1 / 콜라 1',
      totalPrice: '18,000원',
      status: '주문접수',
      reason: '',
      manager: '관리자A',
    },
    {
      id: 2,
      orderNo: 'MGP-ORD-002',
      orderTime: '2026-04-10 19:18',
      minecraftName: '플레이어2',
      discordName: 'player2#2222',
      orderSummary: '돈까스 1 / 사이다 1',
      totalPrice: '14,000원',
      status: '확인중',
      reason: '',
      manager: '관리자B',
    },
    {
      id: 3,
      orderNo: 'MGP-ORD-003',
      orderTime: '2026-04-10 19:25',
      minecraftName: '플레이어3',
      discordName: 'player3#3333',
      orderSummary: '비빔밥 1 / 만두 1',
      totalPrice: '16,000원',
      status: '지연',
      reason: '주방 주문 밀림',
      manager: '',
    },
  ]

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
        {/* 상단 */}
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
              <button
                onClick={() => navigate('/admin')}
                style={topButtonStyle}
              >
                관리자 홈
              </button>
              <button
                onClick={() => navigate('/')}
                style={topButtonStyle}
              >
                메인으로
              </button>
            </div>
          </div>
        </div>

        {/* 요약 박스 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <SummaryCard title="전체 주문" value="3건" />
          <SummaryCard title="처리 대기" value="1건" />
          <SummaryCard title="확인중" value="1건" />
          <SummaryCard title="지연" value="1건" />
        </div>

        {/* 검색 / 필터 영역 */}
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
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '12px',
            }}
          >
            <input
              type="text"
              placeholder="주문번호, 마크 닉네임, 디스코드 닉네임 검색"
              style={inputStyle}
            />
            <select style={inputStyle}>
              <option>전체 상태</option>
              <option>주문접수</option>
              <option>확인중</option>
              <option>처리완료</option>
              <option>지연</option>
              <option>취소</option>
            </select>
            <button style={searchButtonStyle}>검색</button>
          </div>
        </div>

        {/* 주문 카드 목록 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {orderList.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))}
        </div>
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

        <span style={getStatusBadgeStyle(item.status)}>{item.status}</span>
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
      </div>

      <div
        style={{
          background: '#f7fff7',
          border: '1px solid #dcfce7',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '18px',
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
          {item.orderSummary}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          marginBottom: '14px',
        }}
      >
        <div>
          <div style={fieldLabelStyle}>상태 선택</div>
          <select defaultValue={item.status} style={inputStyle}>
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
            defaultValue={item.manager}
            placeholder="담당자 이름 입력"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={fieldLabelStyle}>사유</div>
        <textarea
          defaultValue={item.reason}
          placeholder="상태 변경 사유를 입력하세요."
          style={textareaStyle}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button style={subButtonStyle}>초기화</button>
        <button style={saveButtonStyle}>저장하기</button>
      </div>
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
        {value}
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

const fieldLabelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#355e3b',
  marginBottom: '8px',
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

export default AdminOrderPage