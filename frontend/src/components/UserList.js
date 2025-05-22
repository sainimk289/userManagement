import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <h2>Users</h2>
      <Link to="/create">Create New User</Link>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <Link to={`/edit/${user.id}`}>Edit</Link>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
