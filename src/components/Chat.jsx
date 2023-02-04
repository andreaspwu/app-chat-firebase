import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  where,
  query,
  orderBy,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import ScrollToBottom from 'react-scroll-to-bottom'
import { signOut } from 'firebase/auth'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

function Chat({ room, setIsAuth, setRoom }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])

  const messagesRef = collection(db, 'messages')

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where('room', '==', room),
      orderBy('createdAt')
    )
    const unsub = onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessages(messages)
    })
    return () => unsub()
  }, [])

  const signUserOut = async () => {
    await signOut(auth)
    cookies.remove('auth-token')
    setIsAuth(false)
    setRoom(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage === '') return
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    })
    setNewMessage('')
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="online"></div>
        <p>Live Chat in {room}</p>
        <button className="sign-out-chat" onClick={signUserOut}>
          Sign out
        </button>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messages.map((message) => {
            return (
              <div
                className="message"
                id={
                  message.user === auth.currentUser.displayName
                    ? 'you'
                    : 'other'
                }
                key={message.id}
              >
                <div>
                  <div className="message-content">
                    <p>{message.text}</p>
                  </div>
                  <div className="message-meta">
                    {/* <p id="time">{message.createdAt.toString()}</p> */}
                    <p id="author">{message.user}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </ScrollToBottom>
      </div>

      <form onSubmit={handleSubmit} className="chat-footer">
        <input
          type="text"
          value={newMessage}
          placeholder="Type a message..."
          onChange={(e) => {
            setNewMessage(e.target.value)
          }}
        />
        <button type="submit">&#9658;</button>
      </form>
    </div>
  )
}

export default Chat
