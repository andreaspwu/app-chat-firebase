import { useState, useRef } from 'react'
import './App.css'
import Chat from './components/Chat'
import { Auth } from './components/Auth'
import Cookies from 'universal-cookie'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'

const cookies = new Cookies()

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'))
  const [room, setRoom] = useState(null)
  const roomInputRef = useRef(null)

  const signUserOut = async () => {
    await signOut(auth)
    cookies.remove('auth-token')
    setIsAuth(false)
    setRoom(null)
  }

  if (!isAuth) {
    return (
      <main className="App">
        <Auth setIsAuth={setIsAuth} />
      </main>
    )
  }
  return (
    <div className="App">
      {room ? (
        <Chat room={room} setIsAuth={setIsAuth} setRoom={setRoom} />
      ) : (
        <div className="joinChatContainer">
          <label className="enter-room">Enter A Room:</label>
          <select ref={roomInputRef}>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
          </select>
          <button
            className="join-room"
            onClick={() => setRoom(roomInputRef.current.value)}
          >
            Join A Room
          </button>
          <button className="sign-out" onClick={signUserOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default App
