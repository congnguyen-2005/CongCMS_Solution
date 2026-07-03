import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setMessage('');

        try {

            const res = await axiosClient.post('/Auth/forgot-password', {

                Email: email,
                NewPassword: password

            });

            setMessage(res.message);

            setTimeout(() => {

                navigate('/login');

            }, 1500);

        } catch (err) {

            setError(err.response?.data?.message || "Có lỗi xảy ra.");

        }

    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card p-4">

                        <h3 className="text-center mb-4">
                            Quên mật khẩu
                        </h3>

                        {message &&
                            <div className="alert alert-success">
                                {message}
                            </div>
                        }

                        {error &&
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        }

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label>Email</label>

                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                            </div>

                            <div className="mb-3">

                                <label>Mật khẩu mới</label>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                            </div>

                            <button className="btn btn-primary w-100">
                                Đổi mật khẩu
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ForgotPasswordPage;