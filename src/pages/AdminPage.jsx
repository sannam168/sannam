import { useNavigate } from 'react-router-dom'

function AdminPage() {
  const navigate = useNavigate()

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
        {/* 상단 헤더 */}
        <div
          style={{
            background:
              'linear-gradient(135deg, #14532d 0%, #166534 45%, #4d7c0f 100%)',
            color: 'white',
            padding: '38px 34px',
            borderRadius: '28px',
            marginBottom: '26px',
            boxShadow: '0 18px 40px rgba(20, 83, 45, 0.22)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
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
                Admin Control Center
              </div>

              <h1
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '38px',
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                }}
              >
                관리자 페이지
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: 1.8,
                  opacity: 0.95,
                }}
              >
                접수 내역을 확인하고, 상태를 변경하며, 관리자 기능을 한곳에서 관리할 수
                있습니다.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.24)',
                background: 'rgba(255,255,255,0.14)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>

        {/* 안내 */}
        <div
          style={{
            background: '#f7fff7',
            border: '1px solid #d9f5d9',
            borderRadius: '18px',
            padding: '16px 18px',
            marginBottom: '32px',
            color: '#355e3b',
            lineHeight: 1.7,
            boxShadow: '0 10px 24px rgba(34, 197, 94, 0.06)',
          }}
        >
          관리자 전용 기능입니다.
          <br />
          주문 관리와 임대 관리 페이지로 이동하여 접수된 데이터를 확인하고 상태를
          처리할 수 있습니다.
        </div>

        {/* 관리자 서비스 */}
        <div style={{ margin: '42px 0 18px' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#14532d',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            관리자 서비스
          </div>
          <div
            style={{
              color: '#5b6b60',
              fontSize: '15px',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            관리가 필요한 항목을 선택해 각 관리자 페이지로 이동하세요.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <AdminCard
            title="임대 관리자"
            text="임대 신청 및 문의 목록을 확인하고 상태, 메모, 답변 등을 관리하는 페이지입니다."
            buttonText="임대 관리자 이동"
            onClick={() => navigate('/admin/rental')}
            buttonStyle={primaryButtonStyle}
          />

          <AdminCard
            title="주문 관리자"
            text="주문 목록을 확인하고 상태, 취소 사유, 담당자 정보를 관리하는 페이지입니다."
            buttonText="주문 관리자 이동"
            onClick={() => navigate('/admin/order')}
            buttonStyle={secondaryButtonStyle}
          />
        </div>

        {/* 하단 메모 */}
        <div
          style={{
            marginTop: '8px',
            background: 'white',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
            color: '#4b5563',
            lineHeight: 1.8,
            fontSize: '14px',
          }}
        >
          현재는 Vercel 이전을 위한 관리자 구조를 먼저 구성하는 단계입니다.
          <br />
          이후 각 관리자 화면에 실제 조회/저장 기능을 순서대로 연결하면 됩니다.
        </div>
      </div>
    </div>
  )
}

function AdminCard({ title, text, buttonText, onClick, buttonStyle }) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          marginBottom: '18px',
          boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.18)',
        }}
      />
      <h3 style={titleStyle}>{title}</h3>
      <p style={textStyle}>{text}</p>
      <button style={buttonStyle} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '300px',
}

const titleStyle = {
  margin: '0 0 12px 0',
  fontSize: '24px',
  color: '#111827',
  fontWeight: 'bold',
  textAlign: 'center',
}

const textStyle = {
  margin: '0 0 20px 0',
  color: '#55635a',
  lineHeight: 1.75,
  flexGrow: 1,
  fontSize: '15px',
  textAlign: 'center',
}

const baseButtonStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
}

const primaryButtonStyle = {
  ...baseButtonStyle,
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  boxShadow: '0 10px 20px rgba(34, 197, 94, 0.18)',
}

const secondaryButtonStyle = {
  ...baseButtonStyle,
  background: 'linear-gradient(135deg, #3f6212, #65a30d)',
  color: 'white',
  boxShadow: '0 10px 20px rgba(101, 163, 13, 0.18)',
}

export default AdminPage