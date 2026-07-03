import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const redirectUrl =
        new URLSearchParams(location.search).get('redirect') || '/';

    // ==========================
    // XỬ LÝ ĐĂNG NHẬP
    // ==========================
    const handleLogin = async (e) => {
        e.preventDefault();

        setErrorMsg('');

        try {
            const response = await axiosClient.post('/Auth/login', {
                Email: email,
                Password: password
            });

            console.log("Response:", response);

            // axiosClient đã return response.data
            if (response && response.user) {

                login(response.user);

                navigate(redirectUrl);

            } else {

                setErrorMsg("Không tìm thấy thông tin người dùng.");

            }

        } catch (error) {

            console.error(error);

            setErrorMsg(
                error.response?.data?.message || "Đăng nhập thất bại."
            );
        }
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="glass-card p-5 shadow-lg">

                        <h3
                            className="text-center text-white font-weight-bold mb-4"
                            style={{ letterSpacing: '2px' }}
                        >
                            ĐĂNG <span className="text-neon">NHẬP</span>
                        </h3>

                        {errorMsg && (
                            <div className="alert alert-danger py-2 text-center small font-weight-bold">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>

                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold">
                                    EMAIL
                                </label>

                                <input
                                    type="email"
                                    className="form-control bg-dark text-white border-secondary py-4"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-5">
                                <label className="text-muted small font-weight-bold">
                                    MẬT KHẨU
                                </label>

                                <input
                                    type="password"
                                    className="form-control bg-dark text-white border-secondary py-4"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-cyber w-100 py-3 mb-3 font-weight-bold"
                            >
                                ĐĂNG NHẬP
                            </button>

                            <div className="text-center text-muted mt-3">
                                Chưa có tài khoản?{" "}
                                <Link
                                    to={`/register?redirect=${redirectUrl}`}
                                    className="text-neon text-decoration-none"
                                >
                                    Đăng ký ngay
                                </Link>
                            </div>
                            <div className="text-end mb-3">
                                <Link
                                    to="/forgot-password"
                                    className="text-warning text-decoration-none"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;