import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function NoticePage() {
  const navigate = useNavigate()

  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotices()
  }, [])

  async function loadNotices() {
    setLoading(true)

    const { data } = await supabase
      .from('notices')
      .select('*')
      .eq('status', 'active')
      .eq('target', 'public')
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false })

    setNotices(data || [])
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <p style={styles.badge}>MGP Notice</p>
            <h1 style={styles.title}>공지사항</h1>
            <p style={styles.desc}>
              MGP 기업의 이용 안내, 변경사항, 이벤트 소식을 확인할 수 있습니다.
            </p>
          </div>

          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            홈으로
          </button>
        </section>

        {loading ? (
          <div style={styles.emptyBox}>공지사항을 불러오는 중입니다...</div>
        ) : notices.length === 0 ? (
          <div style={styles.emptyBox}>등록된 공지사항이 없습니다.</div>
        ) : (
          <div style={styles.noticeList}>
            {notices.map((notice) => (
              <article
                key={notice.id}
                style={{
                  ...styles.noticeCard,
                  borderColor: notice.is_important ? '#facc15' : '#e1efe1',
                  background: notice.is_important ? '#fffbea' : 'white',
                }}
              >
                <div style={styles.noticeHeader}>
                  <h2>{notice.title}</h2>

                  {notice.is_important && (
                    <span style={styles.importantBadge}>중요</span>
                  )}
                </div>

                <p style={styles.noticeContent}>{notice.content}</p>

                <div style={styles.noticeFooter}>
                  MGP Official Notice
                </div>
              </article>
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
    maxWidth: '900px',
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
  noticeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noticeCard: {
    border: '1px solid #e1efe1',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(55, 100, 55, 0.1)',
  },
  noticeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
  },
  importantBadge: {
    background: '#facc15',
    color: '#713f12',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 900,
  },
  noticeContent: {
    whiteSpace: 'pre-line',
    color: '#425242',
    lineHeight: 1.8,
    fontSize: '16px',
  },
  noticeFooter: {
    marginTop: '16px',
    color: '#8a988a',
    fontSize: '13px',
    fontWeight: 700,
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