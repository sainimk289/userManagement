'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>User Dashboard</h1>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} – {user.email}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
