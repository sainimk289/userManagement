import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1 });

    useEffect(() => {
        fetchUsers(pagination.current_page);
    }, []);

    const fetchUsers = (page = 1) => {
        api.get(`/users?page=${page}`).then((res) => {
            setUsers(res.data.data);
            setPagination(res.data);
        });
    };

    const deleteUser = (id) => {
        if (window.confirm('Are you sure want to delete this user?')) {
            api.delete(`/users/${id}`).then(() => fetchUsers(pagination.current_page));
        }
    };

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`btn btn-sm me-1 ${pagination.current_page === i ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="container mt-4">
            <h2>Users</h2>
            <Link to="/create" className="btn btn-primary mb-3">Create User</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.firstName + ' ' + u.lastName}</td>
                            <td>{u.email}</td>
                            <td>
                                <Link to={`/edit/${u.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-3">
                {renderPagination()}
            </div>
        </div>
    );
}

export default UserList;
