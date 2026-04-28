import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = '1234'

function AdminPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(
    sessionStorage.getItem('mgp_admin_auth') === 'true'
  )
  const [error, setError] = useState('')

  const [profiles, setProfiles] = useState([])
  const [orgMembers, setOrgMembers] = useState([])
  const [orders, setOrders] = useState([])

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

  async function loadDashboard() {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: orgData } = await supabase
      .from('organization_members')
      .select('*')

    setProfiles(profileData || [])
    setOrgMembers(orgData || [])

    try {
      const response = await fetch('/api/admin-orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
      }
    } catch {
      setOrders([])
    }
  }

  useEffect(() => {
    if (isAuthed) loadDashboard()
  }, [isAuthed])

  const stats = useMemo(() => {
    const pendingStaff = profiles.filter((v) => v.status === 'pending').length
    const activeStaff = profiles.filter((v) => v.status === 'active').length
    const orgActive = orgMembers.filter((v) => v.status === 'active').length
    const waitingOrders = orders.filter((v) => v.status === '주문접수').length

    return {
      waitingOrders,
      pendingStaff,
      activeStaff,
      orgActive,
    }
  }, [profiles, orgMembers, orders])

  const recentProfiles = profiles.slice(0, 4)

  if (!isAuthed) {
    return (
      <div style={pageStyle}>
        <div style={loginBoxStyle}>
          <div style={loginBadgeStyle}>MGP Admin Center</div>
          <h1 style={loginTitleStyle}>관리자 인증</h1>

          <p style={loginTextStyle}>
            관리자 기능을 사용하려면 비밀번호를 입력해 주세요.
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
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div>
            <div style={badgeStyle}>MGP Admin Center</div>

            <h1 style={heroTitleStyle}>관리자 페이지</h1>

            <p style={heroTextStyle}>
              샌남 회장님, 환영합니다.
              <br />
              주문, 임대, 직원, 조직도 정보를 관리하는 MGP 내부 관리자 센터입니다.
            </p>
          </div>

          <div style={topButtonBoxStyle}>
            <button onClick={loadDashboard} style={topButtonStyle}>
              새로고침
            </button>

            <button onClick={() => navigate('/')} style={topButtonStyle}>
              메인으로
            </button>

            <button onClick={logout} style={topButtonStyle}>
              로그아웃
            </button>
          </div>
        </section>

        <section style={dashboardGridStyle}>
          <StatCard title="주문 접수 대기" value={`${stats.waitingOrders}건`} />
          <StatCard title="승인 대기 직원" value={`${stats.pendingStaff}명`} />
          <StatCard title="활성 직원 계정" value={`${stats.activeStaff}명`} />
          <StatCard title="조직도 인원" value={`${stats.orgActive}명`} />
        </section>

        <section style={panelGridStyle}>
          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>최근 가입 신청</h2>

            {recentProfiles.length === 0 ? (
              <p style={emptyTextStyle}>최근 가입 신청이 없습니다.</p>
            ) : (
              recentProfiles.map((user) => (
                <div style={listItemStyle} key={user.id}>
                  <div>
                    <strong>{user.mc_nickname}</strong>
                    <p>{user.email}</p>
                  </div>
                  <span style={statusStyle}>{user.status}</span>
                </div>
              ))
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={panelTitleStyle}>부서별 조직 인원</h2>

            <DeptLine
              title="식품부"
              count={orgMembers.filter((v) => v.department === '식품부' && v.status === 'active').length}
            />

            <DeptLine
              title="부동산부"
              count={orgMembers.filter((v) => v.department === '부동산부' && v.status === 'active').length}
            />

            <DeptLine
              title="본사"
              count={orgMembers.filter((v) => v.department === '본사' && v.status === 'active').length}
            />
          </div>
        </section>

        <div style={sectionBoxStyle}>
          <h2 style={sectionTitleStyle}>관리자 메뉴</h2>
          <p style={sectionSubStyle}>
            관리할 항목을 선택해 각 관리자 페이지로 이동하세요.
          </p>
        </div>

        <div style={gridStyle}>
          <AdminCard
            icon="🏠"
            title="임대 관리자"
            text="임대 신청 및 문의 목록을 확인하고 상태를 처리하는 페이지입니다."
            buttonText="임대 관리자 이동"
            onClick={() => navigate('/admin/rental')}
          />

          <AdminCard
            icon="🍱"
            title="주문 관리자"
            text="주문 목록, 상태, 취소 사유, 담당자를 관리하는 페이지입니다."
            buttonText="주문 관리자 이동"
            onClick={() => navigate('/admin/order')}
          />

          <AdminCard
            icon="👥"
            title="직원 승인 관리"
            text="직원 가입 신청을 확인하고 승인, 거절, 직급과 부서를 지정합니다."
            buttonText="직원 승인 관리 이동"
            onClick={() => navigate('/admin/staff')}
          />

          <AdminCard
            icon="🏢"
            title="조직도 관리"
            text="조직원의 직급, 부서, 과, 상태를 수정하고 조직도에 반영합니다."
            buttonText="조직도 관리 이동"
            onClick={() => navigate('/admin/organization')}
          />
		  
		  <AdminCard
  icon="📢"
  title="공지사항 관리"
  text="일반 유저, 직원, 관리자 대상 공지사항을 작성하고 관리합니다."
  buttonText="공지사항 관리 이동"
  onClick={() => navigate('/admin/notices')}
/>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div style={statCardStyle}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function DeptLine({ title, count }) {
  return (
    <div style={deptLineStyle}>
      <span>{title}</span>
      <strong>{count}명</strong>
    </div>
  )
}

function AdminCard({ icon, title, text, buttonText, onClick }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{
        ...cardStyle,
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 20px 40px rgba(15, 23, 42, 0.12)'
          : cardStyle.boxShadow,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={iconStyle}>{icon}</div>

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
  padding: '28px 20px',
  color: '#1f2937',
}

const containerStyle = {
  maxWidth: '1180px',
  margin: '0 auto',
}

const loginBoxStyle = {
  maxWidth: '460px',
  margin: '80px auto',
  background: 'white',
  borderRadius: '28px',
  padding: '30px',
  boxShadow: '0 18px 45px rgba(55, 100, 55, 0.14)',
}

const loginBadgeStyle = {
  display: 'inline-block',
  padding: '7px 12px',
  borderRadius: '999px',
  background: '#eef6ee',
  color: '#2f6b38',
  fontSize: '13px',
  fontWeight: '800',
  marginBottom: '12px',
}

const loginTitleStyle = {
  marginTop: 0,
  marginBottom: '12px',
  color: '#14532d',
  fontSize: '32px',
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
}

const heroStyle = {
  background: 'linear-gradient(135deg, #14532d 0%, #15803d 45%, #65a30d 100%)',
  color: 'white',
  padding: '34px 30px',
  borderRadius: '30px',
  marginBottom: '22px',
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
  fontSize: '38px',
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

const topButtonBoxStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
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

const dashboardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '14px',
  marginBottom: '20px',
}

const statCardStyle = {
  background: 'white',
  borderRadius: '22px',
  padding: '20px',
  boxShadow: '0 12px 28px rgba(55, 100, 55, 0.09)',
}

const panelGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '18px',
  marginBottom: '30px',
}

const panelStyle = {
  background: 'white',
  borderRadius: '24px',
  padding: '22px',
  boxShadow: '0 12px 28px rgba(55, 100, 55, 0.09)',
}

const panelTitleStyle = {
  margin: '0 0 16px',
  color: '#14532d',
  fontSize: '22px',
}

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '12px 0',
  borderBottom: '1px solid #e5efe5',
}

const statusStyle = {
  color: '#2f6b38',
  fontWeight: 800,
}

const deptLineStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '13px 0',
  borderBottom: '1px solid #e5efe5',
}

const emptyTextStyle = {
  color: '#667466',
}

const sectionBoxStyle = {
  margin: '0 0 18px',
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '20px',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.94)',
  borderRadius: '26px',
  padding: '24px',
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.07)',
  border: '1px solid rgba(34, 197, 94, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '280px',
  transition: '0.22s ease',
}

const iconStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '18px',
  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '26px',
}

const cardTitleStyle = {
  margin: '0 0 10px 0',
  fontSize: '23px',
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