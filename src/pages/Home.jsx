import { useNavigate } from 'react-router-dom'

function Home() {
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
        <div
          style={{
            background:
              'linear-gradient(135deg, #166534 0%, #15803d 45%, #65a30d 100%)',
            color: 'white',
            padding: '42px 34px',
            borderRadius: '28px',
            marginBottom: '26px',
            boxShadow: '0 18px 40px rgba(22, 101, 52, 0.22)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '18px',
            }}
          >
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.24)',
                background: 'rgba(255,255,255,0.14)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              관리자 페이지
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 500px' }}>
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
                MGP Integrated Service
              </div>

              <h1
                style={{
                  margin: '0 0 14px 0',
                  fontSize: '40px',
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                }}
              >
                MGP 종합 서비스
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: '17px',
                  lineHeight: 1.8,
                  opacity: 0.95,
                  maxWidth: '760px',
                }}
              >
                주문 접수, 주문 조회, 임대 문의, 공지 확인을 한곳에서 이용할 수 있는
                통합 서비스 페이지입니다.
              </p>
            </div>

            <div
              style={{
                minWidth: '220px',
                flex: '0 1 260px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '22px',
                padding: '18px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  opacity: 0.9,
                  marginBottom: '8px',
                }}
              >
                빠른 안내
              </div>
              <div
                style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  fontWeight: 'bold',
                }}
              >
                사용자 서비스 메뉴를
                <br />
                한 화면에서 바로 이용할 수 있습니다.
              </div>
            </div>
          </div>
        </div>

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
          자주 사용하는 기능은 아래 메뉴에서 바로 이동할 수 있습니다.
          <br />
          주문 조회, 임대 관련 신청 및 문의, 공지사항 확인 기능을 순서대로 이용할 수
          있습니다.
        </div>

        <SectionTitle
          title="사용자 서비스"
          sub="일반 사용자가 이용하는 주요 기능입니다."
        />

        <div style={{ ...gridStyle, marginBottom: '70px' }}>
          <ServiceCard
            title="주문하기"
            text="음식 주문 기능이 들어갈 자리입니다."
            buttonText="주문하기"
            buttonStyle={primaryButtonStyle}
            onClick={() => navigate('/order')}
          />
          <ServiceCard
            title="주문 조회"
            text="주문번호를 입력해 현재 주문 상태를 확인하는 기능이 들어갈 자리입니다."
            buttonText="주문 조회"
            buttonStyle={primaryButtonStyle}
            onClick={() => navigate('/order-status')}
          />
          <ServiceCard
            title="임대 문의"
            text="임대 신청, 문의, 내 신청 조회 기능이 들어갈 자리입니다."
            buttonText="임대 문의"
            buttonStyle={primaryButtonStyle}
            onClick={() => navigate('/rental')}
          />
          <ServiceCard
            title="공지사항"
            text="공지사항 데이터가 들어갈 자리입니다."
            buttonText="공지사항"
            buttonStyle={primaryButtonStyle}
            onClick={() => navigate('/notice')}
          />
        </div>

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
          모든 신청 및 문의는 관리자 확인 후 순차적으로 처리됩니다.
          <br />
          현재는 Vercel 이전을 위한 프론트 구조를 먼저 구성하는 단계입니다.
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, sub }) {
  return (
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
        {title}
      </div>
      <div
        style={{
          color: '#5b6b60',
          fontSize: '15px',
          lineHeight: 1.6,
          textAlign: 'center',
        }}
      >
        {sub}
      </div>
    </div>
  )
}

function ServiceCard({ title, text, buttonText, buttonStyle, onClick }) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
          marginBottom: '16px',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '18px',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '24px',
  padding: '22px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '280px',
}

const titleStyle = {
  margin: '0 0 10px 0',
  fontSize: '22px',
  color: '#111827',
  fontWeight: 'bold',
  textAlign: 'center',
}

const textStyle = {
  margin: '0 0 18px 0',
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

export default Home