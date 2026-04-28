import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function OrganizationPage() {
  const navigate = useNavigate()

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const departments = ['식품부', '부동산부']
  const rankOrder = ['회장', '이사', '부장', '과장', '주임', '사원']

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    setLoading(true)

    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('status', 'active')

    if (error) {
      alert('조직도 정보를 불러오지 못했습니다.')
      setMembers([])
    } else {
      setMembers(data || [])
    }

    setLoading(false)
  }

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aRank = rankOrder.indexOf(a.rank)
      const bRank = rankOrder.indexOf(b.rank)

      return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank)
    })
  }, [members])

  const executives = sortedMembers.filter((m) =>
    ['회장', '이사'].includes(m.rank)
  )

  const departmentGroups = departments.map((department) => {
    const deptMembers = sortedMembers.filter(
      (m) => m.department === department && !['회장', '이사'].includes(m.rank)
    )

    const leaders = deptMembers.filter((m) => m.rank === '부장')

    const teams = [
      ...new Set(
        deptMembers
          .filter((m) => m.team && m.team !== '미지정' && m.rank !== '부장')
          .map((m) => m.team)
      ),
    ]

    return {
      department,
      leaders,
      teams,
      members: deptMembers,
    }
  })

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <p style={styles.badge}>MGP Organization</p>
            <h1 style={styles.title}>MGP 조직도</h1>
            <p style={styles.desc}>
              MGP 기업의 부서와 직급 구조를 간단하게 확인할 수 있습니다.
            </p>
          </div>

          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            홈으로
          </button>
        </section>

        {loading ? (
          <div style={styles.emptyBox}>조직도 정보를 불러오는 중입니다...</div>
        ) : sortedMembers.length === 0 ? (
          <div style={styles.emptyBox}>등록된 조직원이 없습니다.</div>
        ) : (
          <>
            <section style={styles.executiveSection}>
              <h2 style={styles.sectionTitle}>임원진</h2>

              {executives.length === 0 ? (
                <p style={styles.emptyText}>등록된 임원진이 없습니다.</p>
              ) : (
                <div style={styles.executiveGrid}>
                  {executives.map((member) => (
                    <div style={styles.executiveCard} key={member.id}>
                      <span style={styles.rankBadge}>{member.rank}</span>
                      <strong>{member.name}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {departmentGroups.map((group) => (
              <section style={styles.departmentSection} key={group.department}>
                <div style={styles.departmentHeader}>
                  <h2>{group.department}</h2>
                  <span>
                    부서장:{' '}
                    {group.leaders.length > 0
                      ? group.leaders.map((m) => m.name).join(', ')
                      : '미배정'}
                  </span>
                </div>

                {group.teams.length === 0 ? (
                  <p style={styles.emptyText}>등록된 과가 없습니다.</p>
                ) : (
                  <div style={styles.teamList}>
                    {group.teams.map((team) => {
                      const teamMembers = group.members.filter(
                        (m) => m.team === team && m.rank !== '부장'
                      )

                      const managers = teamMembers.filter((m) => m.rank === '과장')
                      const staff = teamMembers.filter((m) =>
                        ['주임', '사원'].includes(m.rank)
                      )

                      return (
                        <div style={styles.teamBox} key={team}>
                          <div style={styles.teamHeader}>
                            <h3>{team}</h3>
                            <span>
                              과장:{' '}
                              {managers.length > 0
                                ? managers.map((m) => m.name).join(', ')
                                : '미배정'}
                            </span>
                          </div>

                          <div style={styles.staffList}>
                            {staff.length === 0 ? (
                              <p style={styles.emptyText}>배정된 직원이 없습니다.</p>
                            ) : (
                              staff.map((member) => (
                                <div style={styles.staffItem} key={member.id}>
                                  <span>{member.name}</span>
                                  <em>{member.rank}</em>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            ))}
          </>
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
    marginBottom: '22px',
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
  executiveSection: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 16px',
    color: '#2f6b38',
    fontSize: '24px',
  },
  executiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  executiveCard: {
    background: '#f3f7f3',
    borderRadius: '18px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  rankBadge: {
    color: '#2f6b38',
    fontSize: '13px',
    fontWeight: 800,
  },
  departmentSection: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
    marginBottom: '20px',
  },
  departmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '18px',
    borderBottom: '1px solid #e5efe5',
    paddingBottom: '14px',
  },
  teamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  teamBox: {
    background: '#f8fcf8',
    border: '1px solid #e1efe1',
    borderRadius: '20px',
    padding: '18px',
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '14px',
  },
  staffList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  staffItem: {
    background: 'white',
    border: '1px solid #e4eee4',
    borderRadius: '14px',
    padding: '12px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 800,
  },
  emptyBox: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
    color: '#667466',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
  },
  emptyText: {
    color: '#667466',
    margin: '8px 0',
  },
}