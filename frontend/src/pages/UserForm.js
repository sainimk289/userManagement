import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function UserForm() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            api.get(`/users/${id}`).then((res) => setForm(res.data));
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // clear error on input change
    };

    // Simple validation function
    const validate = () => {
        const newErrors = {};

        if (!form.firstName.trim()) newErrors.firstName = 'The first name field is required.';
        if (!form.lastName.trim()) newErrors.lastName = 'The last name field is required.';

        if (!form.email.trim()) {
            newErrors.email = 'The email field is required.';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'The email field must be a valid email address.';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const request = id ? api.put(`/users/${id}`, form) : api.post('/users', form);
            request
                .then((res) => {
                    if (res.status) {
                        setSuccess(res.data.message);
                        setTimeout(() => navigate('/'), 1000);
                    } else {
                        setError(res.data.message);
                    }

                })
                .catch((error) => {
                    if (error.response && error.response.status === 422) {
                        setErrors(error.response.data.errors || {});
                    } else {
                        console.error(error);
                    }
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Edit' : 'Create'} User</h2>
            {success && (
                <div className="alert alert-success">{success}</div>
            )}
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label>First Name</label>
                    <input
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={form.firstName}
                        placeholder='Enter First Name'
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={form.lastName}
                        placeholder='Enter Last Name'
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        placeholder='Enter Valid Email Address'
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <button type="submit" className="btn btn-success">
                    {id ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}

export default UserForm;
