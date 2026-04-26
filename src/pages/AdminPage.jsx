import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = '1234'

function AdminPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(
    sessionStorage.getItem('mgp_admin_auth') === 'true'
  )
  const [error, setError] = useState('')

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('mgp_admin_auth', 'true')
      setIsAuthed(true)
      setError('')
      return
    }

    setError('비밀번호가 올바르지 않습니다.')
  }

  const logout = () => {
    sessionStorage.removeItem('mgp_admin_auth')
    setIsAuthed(false)
    setPassword('')
  }

  if (!isAuthed) {
    return (
      <div style={pageStyle}>
        <div style={loginBoxStyle}>
          <h1 style={loginTitleStyle}>관리자 인증</h1>

          <p style={loginTextStyle}>
            관리자 페이지에 접근하려면 비밀번호를 입력해주세요.
          </p>

          <input
            type="password"
            placeholder="관리자 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') login()
            }}
            style={inputStyle}
          />

          <button onClick={login} style={mainButtonStyle}>
            입장하기
          </button>

          {error && <div style={errorStyle}>{error}</div>}

          <button onClick={() => navigate('/')} style={backButtonStyle}>
            메인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={heroStyle}>
          <div>
            <div style={badgeStyle}>MGP Admin Center</div>

            <h1 style={heroTitleStyle}>관리자 페이지</h1>

            <p style={heroTextStyle}>
              주문 및 임대 관련 접수 내역을 확인하고 상태를 관리하는 관리자 전용
              페이지입니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} style={topButtonStyle}>
              메인으로
            </button>

            <button onClick={logout} style={topButtonStyle}>
              로그아웃
            </button>
          </div>
        </div>

        <div style={noticeStyle}>
          관리자 기능은 일반 사용자 화면과 분리되어 있습니다.
          <br />
          아래 메뉴에서 관리할 항목을 선택해 이동할 수 있습니다.
        </div>

        <div style={{ margin: '0 0 18px' }}>
          <div style={sectionTitleStyle}>관리자 메뉴</div>
          <div style={sectionSubStyle}>
            관리할 항목을 선택해 각 관리자 페이지로 이동하세요.
          </div>
        </div>

        <div style={gridStyle}>
          <AdminCard
            title="임대 관리자"
            text="임대 신청 및 문의 목록을 확인하고 상태를 처리하는 페이지입니다."
            buttonText="임대 관리자 이동"
            onClick={() => navigate('/admin/rental')}
          />

          <AdminCard
            title="주문 관리자"
            text="주문 목록, 상태, 취소 사유, 담당자를 관리하는 페이지입니다."
            buttonText="주문 관리자 이동"
            onClick={() => navigate('/admin/order')}
          />
        </div>
      </div>
    </div>
  )
}

function AdminCard({ title, text, buttonText, onClick }) {
  return (
    <div style={cardStyle}>
      <div style={iconStyle} />

      <h3 style={cardTitleStyle}>{title}</h3>

      <p style={cardTextStyle}>{text}</p>

      <button onClick={onClick} style={mainButtonStyle}>
        {buttonText}
      </button>
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

const loginBoxStyle = {
  maxWidth: '460px',
  margin: '80px auto',
  background: 'white',
  borderRadius: '24px',
  padding: '28px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
}

const loginTitleStyle = {
  marginTop: 0,
  marginBottom: '12px',
  color: '#14532d',
  fontSize: '30px',
}

const loginTextStyle = {
  color: '#4b5563',
  lineHeight: 1.7,
  marginBottom: '18px',
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #cfe8cf',
  background: 'white',
  fontSize: '15px',
  boxSizing: 'border-box',
  marginBottom: '12px',
}

const mainButtonStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #166534, #22c55e)',
  color: 'white',
  boxShadow: '0 10px 20px rgba(34, 197, 94, 0.18)',
}

const backButtonStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '13px 14px',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 'bold',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  background: 'white',
  color: '#374151',
}

const errorStyle = {
  marginTop: '12px',
  padding: '12px 14px',
  borderRadius: '14px',
  background: '#fff7ed',
  border: '1px solid #fed7aa',
  color: '#9a3412',
  fontSize: '14px',
}

const heroStyle = {
  background: 'linear-gradient(135deg, #14532d 0%, #15803d 45%, #65a30d 100%)',
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

const noticeStyle = {
  background: '#f7fff7',
  border: '1px solid #d9f5d9',
  borderRadius: '18px',
  padding: '16px 18px',
  marginBottom: '30px',
  color: '#355e3b',
  lineHeight: 1.7,
  boxShadow: '0 10px 24px rgba(34, 197, 94, 0.06)',
}

const sectionTitleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#14532d',
  marginBottom: '8px',
  textAlign: 'center',
}

const sectionSubStyle = {
  color: '#5b6b60',
  fontSize: '15px',
  lineHeight: 1.6,
  textAlign: 'center',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '24px',
  padding: '24px',
  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '280px',
}

const iconStyle = {
  width: '52px',
  height: '52px',
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
  marginBottom: '16px',
  boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.18)',
}

const cardTitleStyle = {
  margin: '0 0 10px 0',
  fontSize: '24px',
  color: '#111827',
  fontWeight: 'bold',
  textAlign: 'center',
}

const cardTextStyle = {
  margin: '0 0 18px 0',
  color: '#55635a',
  lineHeight: 1.75,
  flexGrow: 1,
  fontSize: '15px',
  textAlign: 'center',
}

export default AdminPage