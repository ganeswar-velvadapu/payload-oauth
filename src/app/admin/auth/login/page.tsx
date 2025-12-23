'use client'

export default function AdminLoginPage() {
  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <main
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: '#fff',
      }}
    >
      <h1>Admin Login</h1>

      <button
        onClick={loginWithGoogle}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        Continue with Google
      </button>
    </main>
  )
}
