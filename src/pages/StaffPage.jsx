import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function StaffPage() {
  const navigate = useNavigate()

  const staffName = sessionStorage.getItem('mgp_staff_name')
  const staffRole = sessionStorage.getItem('mgp_staff_role')
  const staffRank = sessionStorage.getItem('mgp_staff_rank')

  const [notices, setNotices] = useState([])

  useEffect(() => {
    loadNotices()
  }, [])

  async function loadNotices() {
    const { data } = await supabase
  .from('notices')
  .select('*')
  .eq('status', 'active')
  .eq('target', 'staff')
  .order('is_important', { ascending: false })
  .order('created_at', { ascending: false })
  .limit(3)

    setNotices(data || [])
  }

  const handleLogout = () => {
    sessionStorage.removeItem('mgp_staff_auth')
    sessionStorage.removeItem('mgp_staff_name')
    sessionStorage.removeItem('mgp_staff_role')
    sessionStorage.removeItem('mgp_staff_rank')

    alert('로그아웃되었습니다.')
    navigate('/')
  }

  const ready = () => {
    alert('아직 준비 중인 기능입니다.')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <p style={styles.badge}>MGP Staff Dashboard</p>
            <h1 style={styles.title}>MGP 직원 대시보드</h1>
            <p style={styles.welcome}>
              {staffName || '직원'}님, 오늘도 좋은 근무 되세요.
            </p>
          </div>

          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            홈으로
          </button>
        </section>

        <section style={styles.profileCard}>
          <h2 style={styles.sectionTitle}>직원 정보</h2>

          <div style={styles.profileGrid}>
            <div style={styles.infoBox}>
              <span>직원명</span>
              <strong>{staffName || '정보 없음'}</strong>
            </div>

            <div style={styles.infoBox}>
              <span>직급</span>
              <strong>{staffRank || '미지정'}</strong>
            </div>

            <div style={styles.infoBox}>
              <span>권한</span>
              <strong>{staffRole || 'staff'}</strong>
            </div>
          </div>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>오늘의 업무</h2>
            <p style={styles.desc}>
              직원 업무 처리를 위한 주요 기능입니다.
            </p>

            <div style={styles.buttonList}>
              <button style={styles.primaryBtn} onClick={ready}>
                내 담당 주문
              </button>

              <button
                style={styles.primaryBtn}
                onClick={() => navigate('/staff/orders')}
              >
                주문 처리
              </button>

              <button
                style={styles.primaryBtn}
                onClick={() => navigate('/notice')}
              >
                직원 공지
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>내 활동 요약</h2>

            <div style={styles.statBox}>
              <div>
                <span>오늘 처리 주문</span>
                <strong>0건</strong>
              </div>

              <div>
                <span>진행 중 주문</span>
                <strong>0건</strong>
              </div>

              <div>
                <span>근무 상태</span>
                <strong>대기중</strong>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.noticeCard}>
          <div style={styles.noticeHeader}>
            <h2 style={styles.sectionTitle}>직원 공지사항</h2>
            <button style={styles.noticeMoreBtn} onClick={() => navigate('/notice')}>
              전체 보기
            </button>
          </div>

          {notices.length === 0 ? (
            <p style={styles.desc}>현재 등록된 직원 공지사항이 없습니다.</p>
          ) : (
            <div style={styles.noticeList}>
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  style={{
                    ...styles.noticeItem,
                    borderColor: notice.is_important ? '#facc15' : '#e1efe1',
                    background: notice.is_important ? '#fffbea' : '#f8fcf8',
                  }}
                >
                  <div style={styles.noticeItemTop}>
                    <strong>{notice.title}</strong>
                    {notice.is_important && (
                      <span style={styles.importantBadge}>중요</span>
                    )}
                  </div>

                  <p>{notice.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.bottomActions}>
          <button style={styles.subBtn} onClick={() => navigate('/order')}>
            음식 주문 페이지 보기
          </button>

          <button style={styles.subBtn} onClick={() => navigate('/order-status')}>
            주문 조회 페이지 보기
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            로그아웃
          </button>
        </section>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f7fbf7 0%, #eaf4ea 100%)',
    padding: '28px',
  },
  container: {
    maxWidth: '980px',
    margin: '0 auto',
  },
  hero: {
    background: 'white',
    borderRadius: '28px',
    padding: '30px',
    boxShadow: '0 18px 45px rgba(55, 100, 55, 0.14)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  badge: {
    display: 'inline-block',
    margin: '0 0 10px',
    padding: '7px 12px',
    borderRadius: '999px',
    background: '#eef6ee',
    color: '#2f6b38',
    fontSize: '13px',
    fontWeight: 800,
  },
  title: {
    margin: 0,
    fontSize: '34px',
    color: '#1f2d1f',
  },
  welcome: {
    margin: '10px 0 0',
    color: '#667466',
    fontSize: '16px',
  },
  homeBtn: {
    border: 'none',
    background: '#2f6b38',
    color: 'white',
    padding: '13px 20px',
    borderRadius: '999px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  profileCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 14px',
    color: '#1f2d1f',
    fontSize: '22px',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  infoBox: {
    background: '#f3f7f3',
    borderRadius: '18px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
  },
  desc: {
    color: '#667466',
    lineHeight: 1.6,
    margin: '0 0 18px',
  },
  buttonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryBtn: {
    border: 'none',
    background: '#2f6b38',
    color: 'white',
    padding: '15px',
    borderRadius: '16px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  noticeCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
    marginBottom: '20px',
  },
  noticeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  noticeMoreBtn: {
    border: 'none',
    background: '#eef6ee',
    color: '#2f6b38',
    padding: '10px 14px',
    borderRadius: '999px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  noticeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  noticeItem: {
    border: '1px solid #e1efe1',
    borderRadius: '18px',
    padding: '16px',
  },
  noticeItemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  importantBadge: {
    background: '#facc15',
    color: '#713f12',
    padding: '5px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 900,
  },
  bottomActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  subBtn: {
    flex: 1,
    minWidth: '180px',
    border: 'none',
    background: 'white',
    color: '#2f6b38',
    padding: '15px',
    borderRadius: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(55, 100, 55, 0.1)',
  },
  logoutBtn: {
    flex: 1,
    minWidth: '180px',
    border: 'none',
    background: '#ffecec',
    color: '#c0392b',
    padding: '15px',
    borderRadius: '16px',
    fontWeight: 800,
    cursor: 'pointer',
  },
}