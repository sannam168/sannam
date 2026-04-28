import { useNavigate } from 'react-router-dom'
import './PortalPage.css'

export default function PortalPage() {
  const navigate = useNavigate()

  return (
    <div className="portal-page">
      <div className="portal-card">
        <h1>MGP 로그인 센터</h1>

        <p className="portal-desc">
          직원 및 관리자 전용 페이지입니다.
          <br />
          필요한 항목을 선택해 주세요.
        </p>

        <div className="portal-buttons">
          <button onClick={() => navigate('/staff-login')}>
            직원 로그인
          </button>

          <button onClick={() => navigate('/staff-signup')}>
            직원 가입 신청
          </button>

          <button onClick={() => navigate('/admin')}>
            관리자 로그인
          </button>
        </div>

        <p className="portal-notice">
          승인된 직원 계정만 내부 시스템 이용이 가능합니다.
        </p>

        <button
          className="portal-home-btn"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}