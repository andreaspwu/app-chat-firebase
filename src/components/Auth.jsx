import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      cookies.set('auth-token', result.user.refreshToken)
      setIsAuth(true)
    } catch (err) {
      console.log(error)
    }
  }
  return (
    <div className="auth-container">
      <h3>🐱‍💻 CodeRoom 😎</h3>
      <button
        type="button"
        class="login-with-google-btn"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  )
}
