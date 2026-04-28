import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AdminStaffPage.css'

export default function AdminStaffPage() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체')

  const ranks = ['회장', '이사', '부장', '과장', '주임', '사원']
  const departments = ['식품부', '부동산부']
  const teams = ['미지정', '본부', '자선사업과', '식품제조과', '개발과', '부동산관리과']

  async function loadUsers() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage('직원 신청 목록을 불러오지 못했습니다.')
      setUsers([])
    } else {
      setUsers(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    if (statusFilter === '전체') return users
    return users.filter((user) => user.status === statusFilter)
  }, [users, statusFilter])

  const summary = useMemo(() => {
    return {
      total: users.length,
      pending: users.filter((user) => user.status === 'pending').length,
      active: users.filter((user) => user.status === 'active').length,
      rejected: users.filter((user) => user.status === 'rejected').length,
    }
  }, [users])

  function updateField(id, key, value) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, [key]: value } : user
      )
    )
  }

  async function approve(user) {
    setMessage('승인 처리 중입니다...')

    const { error } = await supabase
      .from('profiles')
      .update({
        status: 'active',
        rank: user.rank || '사원',
        department: user.department || '식품부',
        team: user.team || '미지정',
      })
      .eq('id', user.id)

    if (error) {
      setMessage('승인 실패: ' + error.message)
      return
    }

    await supabase.from('organization_members').insert({
      name: user.mc_nickname,
      discord_name: user.discord_name,
      department: user.department || '식품부',
      team: user.team || '미지정',
      rank: user.rank || '사원',
      status: 'active',
      memo: user.intro || '',
    })

    setMessage(`${user.mc_nickname}님을 승인했습니다.`)
    await loadUsers()
  }

  async function reject(user) {
    const ok = confirm(`${user.mc_nickname}님의 가입 신청을 거절할까요?`)
    if (!ok) return

    setMessage('거절 처리 중입니다...')

    const { error } = await supabase
      .from('profiles')
      .update({ status: 'rejected' })
      .eq('id', user.id)

    if (error) {
      setMessage('거절 실패: ' + error.message)
      return
    }

    setMessage(`${user.mc_nickname}님의 신청을 거절했습니다.`)
    await loadUsers()
  }

  return (
    <div className="admin-staff-page">
      <div className="admin-staff-container">
        <section className="admin-staff-hero">
          <div>
            <div className="admin-staff-badge">MGP Staff Admin</div>
            <h1>직원 승인 관리</h1>
            <p>
              직원 가입 신청을 확인하고 승인, 거절, 직급, 부서, 과를 관리합니다.
            </p>
          </div>

          <div className="admin-staff-top-buttons">
            <button onClick={loadUsers}>새로고침</button>
            <button onClick={() => navigate('/admin')}>관리자 홈</button>
            <button onClick={() => navigate('/organization')}>조직도 보기</button>
          </div>
        </section>

        <section className="admin-staff-summary">
          <SummaryBox title="전체 신청" value={`${summary.total}명`} />
          <SummaryBox title="승인 대기" value={`${summary.pending}명`} />
          <SummaryBox title="활성 직원" value={`${summary.active}명`} />
          <SummaryBox title="거절됨" value={`${summary.rejected}명`} />
        </section>

        <section className="admin-staff-filter">
          <div>
            <h2>신청 목록</h2>
            <p>상태별로 직원 가입 신청을 확인할 수 있습니다.</p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>전체</option>
            <option value="pending">승인 대기</option>
            <option value="active">활성</option>
            <option value="rejected">거절됨</option>
          </select>
        </section>

        {message && <div className="admin-staff-message">{message}</div>}

        {loading ? (
          <div className="admin-staff-empty">직원 신청 목록을 불러오는 중입니다...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-staff-empty">조건에 맞는 직원 신청이 없습니다.</div>
        ) : (
          <div className="admin-staff-list">
            {filteredUsers.map((user) => (
              <div className="staff-card" key={user.id}>
                <div className="staff-card-header">
                  <div>
                    <span className={`status-pill ${user.status}`}>
                      {getStatusText(user.status)}
                    </span>
                    <h3>{user.mc_nickname}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="staff-info-grid">
                  <InfoBox label="디스코드" value={user.discord_name} />
                  <InfoBox label="자기소개" value={user.intro || '없음'} />
                </div>

                <div className="staff-select-grid">
                  <div>
                    <label>직급</label>
                    <select
                      value={user.rank || '사원'}
                      onChange={(e) => updateField(user.id, 'rank', e.target.value)}
                    >
                      {ranks.map((rank) => (
                        <option key={rank}>{rank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>부서</label>
                    <select
                      value={user.department || '식품부'}
                      onChange={(e) =>
                        updateField(user.id, 'department', e.target.value)
                      }
                    >
                      {departments.map((department) => (
                        <option key={department}>{department}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>과</label>
                    <select
                      value={user.team || '미지정'}
                      onChange={(e) => updateField(user.id, 'team', e.target.value)}
                    >
                      {teams.map((team) => (
                        <option key={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="staff-actions">
                  <button
                    className="approve-btn"
                    onClick={() => approve(user)}
                    disabled={user.status === 'active'}
                  >
                    승인
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => reject(user)}
                    disabled={user.status === 'rejected'}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryBox({ title, value }) {
  return (
    <div className="summary-box">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  )
}

function getStatusText(status) {
  if (status === 'pending') return '승인 대기'
  if (status === 'active') return '활성'
  if (status === 'rejected') return '거절됨'
  return status || '상태 없음'
}