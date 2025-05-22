import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) {
      await api.put(`/users/${id}`, form);
    } else {
      await api.post('/users', form);
    }
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      <input name="name" value={form.name} onChange={handleChange} required />
      <input name="email" value={form.email} onChange={handleChange} required />
      <button type="submit">{id ? 'Update' : 'Create'}</button>
    </form>
  );
}

export default UserForm;
