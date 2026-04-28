import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mgpLogo from '../assets/MGP.jpg'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const isStaff = sessionStorage.getItem('mgp_staff_auth') === 'true'
  const staffName = sessionStorage.getItem('mgp_staff_name')

  const movePage = (path) => {
    setMenuOpen(false)
    setAccountOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mgp_staff_auth')
    sessionStorage.removeItem('mgp_staff_name')
    sessionStorage.removeItem('mgp_staff_role')
    sessionStorage.removeItem('mgp_staff_rank')

    setAccountOpen(false)
    setMenuOpen(false)

    alert('로그아웃되었습니다.')
    navigate('/')
  }

  return (
    <div className="mgp-home">
      <button
        className="home-menu-btn"
        onClick={() => setMenuOpen(true)}
      >
        ☰
      </button>

      {menuOpen && (
        <div
          className="home-menu-bg"
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="home-side-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="home-close-btn"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>

            <div className="menu-top-bar">
              <h2>MGP 메뉴</h2>

              {!isStaff ? (
                <button
                  className="menu-login-btn"
                  onClick={() => movePage('/portal')}
                >
                  로그인
                </button>
              ) : (
                <button
                  className="menu-login-btn"
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  {staffName}님 ▼
                </button>
              )}
            </div>

            <p>원하는 서비스를 선택해 주세요.</p>

            {isStaff && accountOpen && (
              <div className="menu-section account-box">
                <span>내 계정</span>

                <button onClick={() => movePage('/staff')}>
                  직원 페이지
                </button>

                <button onClick={() => alert('내 정보 기능은 다음 단계에서 추가할 예정입니다.')}>
                  내 정보
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}

            <div className="menu-section">
              <span>일반 이용자</span>

              <button onClick={() => movePage('/order')}>
                음식 주문
              </button>

              <button onClick={() => movePage('/order-status')}>
                주문 조회
              </button>

              <button onClick={() => movePage('/rental')}>
                부동산 신청
              </button>

              <button onClick={() => movePage('/notice')}>
                공지사항
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="home-main">
        <img
          src={mgpLogo}
          alt="MGP 로고"
          className="home-logo"
        />

        <h1>MGP 기업 통합 웹사이트</h1>

        <h2>함께 성장하는 기업, MGP</h2>

        <p>
          더 나은 서버 생활을 위해
          <br />
          주거와 식품 서비스를 제공합니다.
        </p>

        <button
          className="home-start-btn"
          onClick={() => setMenuOpen(true)}
        >
          시작하기
        </button>
      </main>

      <footer className="home-footer">
        MGP Official Website
      </footer>
    </div>
  )
}