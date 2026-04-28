import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StaffLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert("로그인 실패: " + error.message);
      return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      alert("직원 정보를 찾을 수 없습니다.");
      return;
    }

    if (profile.status !== "active") {
      alert("아직 승인되지 않은 계정입니다.");
      return;
    }

    sessionStorage.setItem("mgp_staff_auth", "true");
    sessionStorage.setItem("mgp_staff_name", profile.mc_nickname);
    sessionStorage.setItem("mgp_staff_role", profile.role);
    sessionStorage.setItem("mgp_staff_rank", profile.rank);

    alert(profile.mc_nickname + "님 환영합니다.");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h1 style={styles.title}>직원 로그인</h1>
        <p style={styles.desc}>
          승인된 직원 계정만 로그인할 수 있습니다.
        </p>

        <label style={styles.label}>이메일</label>
        <input
          style={styles.input}
          type="email"
          placeholder="이메일 입력"
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

        <button style={styles.button} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <button
          type="button"
          style={styles.subButton}
          onClick={() => navigate("/staff-signup")}
        >
          직원 가입 신청 (회원가입)
        </button>

        <button
          type="button"
          style={styles.homeButton}
          onClick={() => navigate("/")}
        >
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
    maxWidth: "430px",
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
    fontSize: "30px",
    color: "#1f2d1f",
  },
  desc: {
    margin: "0 0 12px",
    color: "#667466",
    fontSize: "14px",
    lineHeight: 1.6,
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