import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(''); // 🌟 Thêm State báo lỗi công khai
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    // 🌟 LOGIC XỬ LÝ ĐĂNG NHẬP ĐỐI CHIẾU
    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMsg(''); // Reset lại thông báo lỗi cũ

        // 1. Lấy danh sách tài khoản đã đăng ký trên máy ra
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users')) || [];

        // 2. Tìm kiếm tài khoản khớp chính xác cả Email và Mật khẩu
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Nếu tìm thấy: Kích hoạt trạng thái đăng nhập hệ thống
            login(foundUser);
            alert(`🎉 Chào mừng ${foundUser.name} đã quay trở lại hệ thống!`);
            navigate(redirectUrl);
        } else {
            // Nếu không tìm thấy: Báo lỗi, không cho vào trang web
            setErrorMsg('❌ Email hoặc mật khẩu không đúng, hoặc tài khoản chưa được tạo!');
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

                        {/* Hiển thị lỗi đỏ ra màn hình nếu gõ sai */}
                        {errorMsg && <div className="alert alert-danger py-2 text-center small font-weight-bold">{errorMsg}</div>}

                        <form onSubmit={handleLogin}>
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