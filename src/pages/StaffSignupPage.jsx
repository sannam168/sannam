import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StaffSignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mcNickname, setMcNickname] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !mcNickname || !discordName) {
      alert("이메일, 비밀번호, 마크 닉네임, 디스코드 닉네임을 입력해 주세요.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert("회원가입 실패: " + error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setLoading(false);
      alert("회원가입은 되었지만 사용자 정보를 불러오지 못했습니다.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email,
      mc_nickname: mcNickname,
      discord_name: discordName,
      intro,
      status: "pending",
      role: "staff",
      department: "미지정",
      rank: "미지정",
    });

    setLoading(false);

    if (profileError) {
      alert("프로필 저장 실패: " + profileError.message);
      return;
    }

    alert("직원 가입 신청이 완료되었습니다. 관리자 승인 후 이용할 수 있습니다.");
    navigate("/staff-login");
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSignup}>
        <h1 style={styles.title}>직원 가입 신청</h1>
        <p style={styles.desc}>
          MGP 직원 계정을 신청합니다. 승인 전까지 직원 기능은 사용할 수 없습니다.
        </p>

        <label style={styles.label}>로그인 이메일</label>
        <input
          style={styles.input}
          type="email"
          placeholder="예: mgp_staff@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>비밀번호</label>
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={styles.label}>마인크래프트 닉네임</label>
        <input
          style={styles.input}
          placeholder="예: Sannam"
          value={mcNickname}
          onChange={(e) => setMcNickname(e.target.value)}
        />

        <label style={styles.label}>디스코드 닉네임</label>
        <input
          style={styles.input}
          placeholder="예: 샌남#0000 또는 표시 이름"
          value={discordName}
          onChange={(e) => setDiscordName(e.target.value)}
        />

        <label style={styles.label}>간단한 자기소개</label>
        <textarea
          style={styles.textarea}
          placeholder="간단한 지원 이유나 소개를 적어주세요."
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "신청 중..." : "가입 신청하기"}
        </button>

        <button
          type="button"
          style={styles.subButton}
          onClick={() => navigate("/staff-login")}
        >
          이미 계정이 있다면 로그인
        </button>

        <button type="button" style={styles.homeButton} onClick={() => navigate("/")}>
          홈으로 돌아가기
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f7fbf7 0%, #eaf4ea 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    background: "white",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 18px 45px rgba(55, 100, 55, 0.16)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    margin: 0,
    color: "#1f2d1f",
    fontSize: "30px",
  },
  desc: {
    margin: "0 0 12px",
    color: "#667466",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  label: {
    fontWeight: 800,
    color: "#2f6b38",
    marginTop: "8px",
    fontSize: "14px",
  },
  input: {
    border: "1px solid #dce8dc",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    border: "1px solid #dce8dc",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "15px",
    minHeight: "100px",
    resize: "vertical",
    outline: "none",
  },
  button: {
    marginTop: "16px",
    border: "none",
    borderRadius: "999px",
    background: "#2f6b38",
    color: "white",
    padding: "15px",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  subButton: {
    border: "none",
    background: "#eef6ee",
    color: "#2f6b38",
    padding: "13px",
    borderRadius: "14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  homeButton: {
    border: "none",
    background: "transparent",
    color: "#667466",
    padding: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },
};