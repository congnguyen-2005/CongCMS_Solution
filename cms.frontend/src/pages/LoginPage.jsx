import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // 🌟 Thêm useLocation
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // 🌟 Lấy thông tin URL hiện tại
    const { login } = useContext(AuthContext);

    // 🌟 Đọc xem có yêu cầu quay lại trang nào không, nếu không thì về Trang chủ '/'
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    const handleLogin = (e) => {
        e.preventDefault();

        if (email && password) {
            const mockUser = {
                id: 13, // Khớp với SQL của bạn
                name: "Khách hàng VIP",
                email: email,
                role: "User"
            };
            login(mockUser);
            // 🌟 Đăng nhập xong thì đá về đúng cái trang vừa yêu cầu (Checkout)
            navigate(redirectUrl);
        }
    };

    return (
        <div className="container mt-5 pt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="glass-card p-5 shadow-lg">
                        <h3 className="text-center text-white font-weight-bold mb-4" style={{ letterSpacing: '2px' }}>
                            ĐĂNG <span className="text-neon">NHẬP</span>
                        </h3>
                        <form onSubmit={handleLogin}>
                            {/* ... Các ô input Email và Password giữ nguyên ... */}
                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold">EMAIL</label>
                                <input type="email" className="form-control bg-dark text-white border-secondary py-4" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-5">
                                <label className="text-muted small font-weight-bold">MẬT KHẨU</label>
                                <input type="password" className="form-control bg-dark text-white border-secondary py-4" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className="btn btn-cyber w-100 py-3 mb-3 font-weight-bold">
                                ĐĂNG NHẬP
                            </button>
                            <div className="text-center text-muted mt-3">
                                Chưa có tài khoản? <Link to={`/register?redirect=${redirectUrl}`} className="text-neon text-decoration-none">Đăng ký ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;