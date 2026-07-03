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
        <div className="container my-5 py-5">
            <div className="row justify-content-center">
                <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div className="glass-card p-4 p-sm-5 shadow-lg rounded-4 border border-secondary border-opacity-25">

                        {/* Tiêu đề */}
                        <h3
                            className="text-center text-white font-weight-bold mb-4"
                            style={{ letterSpacing: '3px' }}
                        >
                            ĐĂNG <span className="text-neon" style={{ textShadow: '0 0 10px var(--neon-color)' }}>NHẬP</span>
                        </h3>

                        {/* Thông báo lỗi */}
                        {errorMsg && (
                            <div className="alert alert-danger py-2 px-3 text-center small font-weight-bold rounded-3 mb-4">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            {/* Input Email */}
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold mb-2" style={{ letterSpacing: '1px' }}>
                                    EMAIL
                                </label>
                                <input
                                    type="email"
                                    className="form-control bg-dark text-white border-secondary rounded-3 py-2 px-3"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                            </div>

                            {/* Input Mật khẩu */}
                            <div className="form-group mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="text-muted small font-weight-bold m-0" style={{ letterSpacing: '1px' }}>
                                        MẬT KHẨU
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-warning text-decoration-none small"
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    className="form-control bg-dark text-white border-secondary rounded-3 py-2 px-3"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                            </div>

                            {/* Nút Đăng nhập */}
                            <button
                                type="submit"
                                className="btn btn-cyber w-100 py-2.5 mt-4 mb-3 font-weight-bold rounded-3 uppercase transition-all"
                                style={{ letterSpacing: '1px' }}
                            >
                                ĐĂNG NHẬP
                            </button>

                            {/* Điều hướng Đăng ký */}
                            <div className="text-center text-muted small mt-4">
                                Chưa có tài khoản?{" "}
                                <Link
                                    to={`/register?redirect=${redirectUrl}`}
                                    className="text-neon text-decoration-none font-weight-bold ms-1"
                                >
                                    Đăng ký ngay
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