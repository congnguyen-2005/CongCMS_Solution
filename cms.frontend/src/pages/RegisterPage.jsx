import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    // 🌟 Đọc URL để biết đường về
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (password !== confirmPassword) {
            setErrorMsg('Mật khẩu nhập lại không khớp!');
            return;
        }

        if (name && email && password) {
            const newUser = {
                id: 13, // Tạm gán 13 để test luồng giỏ hàng
                name: name,
                email: email,
                role: "User"
            };

            login(newUser);
            // 🌟 Đăng ký xong, tự đăng nhập và đá thẳng sang Thanh Toán
            navigate(redirectUrl);
        }
    };

    return (
        <div className="container mt-5 pt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="glass-card p-5 shadow-lg">
                        <h3 className="text-center text-white font-weight-bold mb-4" style={{ letterSpacing: '2px' }}>
                            ĐĂNG <span className="text-neon">KÝ</span>
                        </h3>

                        {errorMsg && <div className="alert alert-danger py-2 text-center small fw-bold">{errorMsg}</div>}

                        <form onSubmit={handleRegister}>
                            {/* ... Các ô input giữ nguyên ... */}
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">HỌ VÀ TÊN</label>
                                <input type="text" className="form-control bg-dark text-white border-secondary py-4" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">EMAIL</label>
                                <input type="email" className="form-control bg-dark text-white border-secondary py-4" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">MẬT KHẨU</label>
                                <input type="password" className="form-control bg-dark text-white border-secondary py-4" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-group mb-5">
                                <label className="text-muted small font-weight-bold">XÁC NHẬN MẬT KHẨU</label>
                                <input type="password" className="form-control bg-dark text-white border-secondary py-4" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className="btn btn-cyber w-100 py-3 mb-3 font-weight-bold">
                                TẠO TÀI KHOẢN MỚI
                            </button>
                            <div className="text-center text-muted mt-3">
                                Đã có tài khoản? <Link to={`/login?redirect=${redirectUrl}`} className="text-neon text-decoration-none">Đăng nhập ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;