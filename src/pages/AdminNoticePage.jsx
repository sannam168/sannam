import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminNoticePage() {
  const navigate = useNavigate()

  const [notices, setNotices] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [target, setTarget] = useState('public')
  const [isImportant, setIsImportant] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotices()
  }, [])

  async function loadNotices() {
    setLoading(true)

    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })

    setNotices(data || [])
    setLoading(false)
  }

  async function createNotice() {
    if (!title.trim() || !content.trim()) {
      setMessage('제목과 내용을 입력해 주세요.')
      return
    }

    const { error } = await supabase.from('notices').insert({
      title,
      content,
      target,
      is_important: isImportant,
      status: 'active',
    })

    if (error) {
      setMessage('공지 등록 실패')
      return
    }

    setTitle('')
    setContent('')
    setTarget('public')
    setIsImportant(false)
    setMessage('공지사항이 등록되었습니다.')
    loadNotices()
  }

  async function deleteNotice(id) {
  const ok = confirm('공지사항을 삭제할까요?')
  if (!ok) return

  const { error } = await supabase
    .from('notices')
    .update({ status: 'deleted' })
    .eq('id', id)

  if (error) {
    alert('삭제 실패: ' + error.message)
    return
  }

  setMessage('공지사항이 삭제되었습니다.')
  loadNotices()
}

  function targetText(value) {
    if (value === 'public') return '일반 유저'
    if (value === 'staff') return '직원 전용'
    if (value === 'admin') return '관리자 전용'
    return value
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div>
            <p style={styles.badge}>MGP Notice Admin</p>
            <h1 style={styles.title}>공지사항 관리</h1>
            <p style={styles.desc}>
              대상별 공지사항을 작성하고 관리할 수 있습니다.
            </p>
          </div>

          <div style={styles.topBtns}>
            <button onClick={loadNotices}>새로고침</button>
            <button onClick={() => navigate('/admin')}>
              관리자 홈
            </button>
          </div>
        </section>

        {message && <div style={styles.message}>{message}</div>}

        <section style={styles.writeBox}>
          <h2>공지 작성</h2>

          <input
            style={styles.input}
            placeholder="공지 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="공지 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <select
            style={styles.input}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="public">일반 유저용</option>
            <option value="staff">직원 전용</option>
            <option value="admin">관리자 전용</option>
          </select>

          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
            />
            중요공지로 등록
          </label>

          <button style={styles.mainBtn} onClick={createNotice}>
            공지 등록
          </button>
        </section>

        <section style={styles.listBox}>
          <h2>공지 목록</h2>

          {loading ? (
            <div style={styles.empty}>불러오는 중...</div>
          ) : (
            notices
              .filter((notice) => notice.status === 'active')
              .map((notice) => (
                <div style={styles.noticeCard} key={notice.id}>
                  <div style={styles.noticeHeader}>
                    <div>
                      <h3>{notice.title}</h3>
                      <small>{targetText(notice.target)}</small>
                    </div>

                    {notice.is_important && (
                      <span style={styles.important}>
                        중요
                      </span>
                    )}
                  </div>

                  <p>{notice.content}</p>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteNotice(notice.id)}
                  >
                    삭제
                  </button>
                </div>
              ))
          )}
        </section>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4fbf4',
    padding: '28px 20px',
  },
  container: {
    maxWidth: '980px',
    margin: '0 auto',
  },
  hero: {
    background: '#2f6b38',
    color: 'white',
    padding: '30px',
    borderRadius: '28px',
    marginBottom: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  badge: {
    fontSize: '13px',
    fontWeight: 800,
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '34px',
  },
  desc: {
    margin: 0,
  },
  topBtns: {
    display: 'flex',
    gap: '10px',
  },
  message: {
    background: 'white',
    padding: '14px',
    borderRadius: '14px',
    marginBottom: '18px',
    fontWeight: 800,
    color: '#2f6b38',
  },
  writeBox: {
    background: 'white',
    padding: '24px',
    borderRadius: '24px',
    marginBottom: '22px',
  },
  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid #ddd',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid #ddd',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  checkLabel: {
    display: 'flex',
    gap: '8px',
    marginBottom: '14px',
    fontWeight: 800,
  },
  mainBtn: {
    width: '100%',
    border: 'none',
    background: '#2f6b38',
    color: 'white',
    padding: '14px',
    borderRadius: '14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  listBox: {
    background: 'white',
    padding: '24px',
    borderRadius: '24px',
  },
  empty: {
    color: '#666',
  },
  noticeCard: {
    border: '1px solid #e1efe1',
    borderRadius: '18px',
    padding: '18px',
    marginBottom: '14px',
    background: '#f8fcf8',
  },
  noticeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
  },
  important: {
    background: '#facc15',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 800,
  },
  deleteBtn: {
    border: 'none',
    background: '#ffecec',
    color: '#c0392b',
    padding: '11px 16px',
    borderRadius: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: '10px',
  },
}