import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminOrganizationPage() {
  const navigate = useNavigate()

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const ranks = ['회장', '이사', '부장', '과장', '주임', '사원']
  const departments = ['본사', '식품부', '부동산부']
  const teams = ['본부', '자선사업과', '식품제조과', '개발과', '부동산관리과', '미지정']
  const statuses = ['active', 'inactive']

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      setMessage('조직원 목록을 불러오지 못했습니다.')
      setMembers([])
    } else {
      setMembers(data || [])
    }

    setLoading(false)
  }

  function updateField(id, key, value) {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [key]: value } : member
      )
    )
  }

  async function saveMember(member) {
    setMessage('저장 중입니다...')

    const { error } = await supabase
      .from('organization_members')
      .update({
        name: member.name,
        discord_name: member.discord_name,
        department: member.department,
        team: member.team,
        rank: member.rank,
        status: member.status,
        memo: member.memo,
      })
      .eq('id', member.id)

    if (error) {
      setMessage('저장 실패: ' + error.message)
      return
    }

    setMessage('저장되었습니다.')
    await loadMembers()
  }

  async function addMember() {
    setMessage('조직원 추가 중입니다...')

    const { error } = await supabase.from('organization_members').insert({
      name: '새 조직원',
      discord_name: '',
      department: '식품부',
      team: '미지정',
      rank: '사원',
      status: 'active',
      memo: '',
    })

    if (error) {
      setMessage('추가 실패: ' + error.message)
      return
    }

    setMessage('조직원이 추가되었습니다.')
    await loadMembers()
  }

  async function deleteMember(member) {
    const ok = confirm(`${member.name} 조직원을 삭제할까요?`)

    if (!ok) return

    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', member.id)

    if (error) {
      setMessage('삭제 실패: ' + error.message)
      return
    }

    setMessage('삭제되었습니다.')
    await loadMembers()
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <p style={styles.badge}>MGP Admin</p>
            <h1 style={styles.title}>조직도 관리</h1>
            <p style={styles.desc}>
              조직원의 직급, 부서, 과, 상태를 수정할 수 있는 관리자 페이지입니다.
            </p>
          </div>

          <div style={styles.topButtons}>
            <button style={styles.topBtn} onClick={addMember}>
              조직원 추가
            </button>

            <button style={styles.topBtn} onClick={() => navigate('/organization')}>
              조직도 보기
            </button>

            <button style={styles.topBtn} onClick={() => navigate('/admin')}>
              관리자 홈
            </button>
          </div>
        </section>

        {message && <div style={styles.messageBox}>{message}</div>}

        {loading ? (
          <div style={styles.emptyBox}>조직원 목록을 불러오는 중입니다...</div>
        ) : members.length === 0 ? (
          <div style={styles.emptyBox}>등록된 조직원이 없습니다.</div>
        ) : (
          <div style={styles.list}>
            {members.map((member) => (
              <div style={styles.card} key={member.id}>
                <div style={styles.cardHeader}>
                  <h2>{member.name || '이름 없음'}</h2>
                  <span>{member.status}</span>
                </div>

                <div style={styles.grid}>
                  <div>
                    <label style={styles.label}>이름</label>
                    <input
                      style={styles.input}
                      value={member.name || ''}
                      onChange={(e) => updateField(member.id, 'name', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>디스코드</label>
                    <input
                      style={styles.input}
                      value={member.discord_name || ''}
                      onChange={(e) =>
                        updateField(member.id, 'discord_name', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label style={styles.label}>직급</label>
                    <select
                      style={styles.input}
                      value={member.rank || '사원'}
                      onChange={(e) => updateField(member.id, 'rank', e.target.value)}
                    >
                      {ranks.map((rank) => (
                        <option key={rank}>{rank}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>부서</label>
                    <select
                      style={styles.input}
                      value={member.department || '미지정'}
                      onChange={(e) =>
                        updateField(member.id, 'department', e.target.value)
                      }
                    >
                      {departments.map((department) => (
                        <option key={department}>{department}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>과</label>
                    <select
                      style={styles.input}
                      value={member.team || '미지정'}
                      onChange={(e) => updateField(member.id, 'team', e.target.value)}
                    >
                      {teams.map((team) => (
                        <option key={team}>{team}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>상태</label>
                    <select
                      style={styles.input}
                      value={member.status || 'active'}
                      onChange={(e) => updateField(member.id, 'status', e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={styles.label}>메모</label>
                  <textarea
                    style={styles.textarea}
                    value={member.memo || ''}
                    onChange={(e) => updateField(member.id, 'memo', e.target.value)}
                    placeholder="관리자 메모"
                  />
                </div>

                <div style={styles.actions}>
                  <button style={styles.saveBtn} onClick={() => saveMember(member)}>
                    저장
                  </button>

                  <button style={styles.deleteBtn} onClick={() => deleteMember(member)}>
                    삭제
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

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f7fbf7 0%, #eaf4ea 100%)',
    padding: '28px',
  },
  container: {
    maxWidth: '1080px',
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
  desc: {
    margin: '10px 0 0',
    color: '#667466',
    lineHeight: 1.6,
  },
  topButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  topBtn: {
    border: 'none',
    background: '#2f6b38',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '999px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  messageBox: {
    background: 'white',
    borderRadius: '16px',
    padding: '14px 18px',
    marginBottom: '18px',
    color: '#2f6b38',
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(55, 100, 55, 0.08)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '18px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '7px',
    color: '#2f6b38',
    fontWeight: 800,
    fontSize: '14px',
  },
  input: {
    width: '100%',
    border: '1px solid #dce8dc',
    borderRadius: '14px',
    padding: '13px',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    border: '1px solid #dce8dc',
    borderRadius: '14px',
    padding: '13px',
    fontSize: '15px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
  },
  saveBtn: {
    border: 'none',
    background: '#2f6b38',
    color: 'white',
    padding: '13px 20px',
    borderRadius: '14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  deleteBtn: {
    border: 'none',
    background: '#ffecec',
    color: '#c0392b',
    padding: '13px 20px',
    borderRadius: '14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  emptyBox: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
    color: '#667466',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
  },
}