import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Xóa lỗi cũ (nếu có) trước khi kiểm tra lại

        // ==========================================
        // 🛡️ BỘ LỌC KIỂM TRA DỮ LIỆU (VALIDATION)
        // ==========================================

        // 1. Kiểm tra Tên (Không có ký tự đặc biệt)
        // Cho phép: Chữ cái (kể cả tiếng Việt), Số và Khoảng trắng
        const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s]+$/;
        if (!nameRegex.test(name)) {
            setErrorMsg('⛔ Họ và Tên không được chứa ký tự đặc biệt!');
            return;
        }

        // 2. Kiểm tra Số điện thoại (Đúng chuẩn nhà mạng Việt Nam)
        // Bắt buộc: 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(phone)) {
            setErrorMsg('⛔ Số điện thoại không hợp lệ (Phải là 10 số và bắt đầu bằng 03, 05, 07, 08, 09)!');
            return;
        }

        // 3. Kiểm tra Mật khẩu (Trên 6 ký tự, gồm cả chữ và số)
        // Tối thiểu 6 ký tự, có ít nhất 1 chữ cái và 1 chữ số
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMsg('⛔ Mật khẩu phải từ 6 ký tự trở lên, bao gồm ít nhất 1 chữ cái và 1 chữ số!');
            return;
        }

        // 4. Kiểm tra Mật khẩu nhập lại
        if (password !== confirmPassword) {
            setErrorMsg('⛔ Mật khẩu xác nhận không khớp!');
            return;
        }

        // ==========================================

        setIsLoading(true);

        try {
            const payload = {
                fullname: name,
                email: email,
                phone: phone,
                address: address,
                password: password
            };

            const response = await axiosClient.post('/Auth/register', payload);
            const newUser = response.user || response.data?.user;

            login(newUser);
            alert("🎉 Đăng ký thành công! Dữ liệu đã được kiểm tra và lưu an toàn.");
            navigate(redirectUrl);

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            const serverMsg = error.response?.data?.message || "Lỗi kết nối máy chủ, vui lòng thử lại sau!";
            setErrorMsg(`⛔ ${serverMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="glass-card p-5 shadow-lg">
                        <h3 className="text-center text-white font-weight-bold mb-4" style={{ letterSpacing: '2px' }}>
                            ĐĂNG <span className="text-neon">KÝ TÀI KHOẢN</span>
                        </h3>

                        {/* 🌟 Hộp thoại hiển thị thông báo lỗi Validation */}
                        {errorMsg && <div className="alert alert-danger py-2 text-center font-weight-bold">{errorMsg}</div>}

                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">HỌ VÀ TÊN <span className="text-danger">*</span></label>
                                <input type="text" className="form-control bg-dark text-white border-secondary py-3" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ví dụ: Nguyen Van A" />
                            </div>

                            <div className="row">
                                <div className="form-group col-md-6 mb-3">
                                    <label className="text-muted small font-weight-bold">EMAIL <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control bg-dark text-white border-secondary py-3" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
                                </div>
                                <div className="form-group col-md-6 mb-3">
                                    <label className="text-muted small font-weight-bold">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></label>
                                    <input type="tel" className="form-control bg-dark text-white border-secondary py-3" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="09xxxxxxxx" />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold">ĐỊA CHỈ <span className="text-danger">*</span></label>
                                <input type="text" className="form-control bg-dark text-white border-secondary py-3" placeholder="Số nhà, Tên đường, Quận/Huyện..." value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>

                            <div className="row">
                                <div className="form-group col-md-6 mb-3">
                                    <label className="text-muted small font-weight-bold">MẬT KHẨU <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control bg-dark text-white border-secondary py-3" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Ít nhất 6 ký tự gồm chữ & số" />
                                </div>
                                <div className="form-group col-md-6 mb-4">
                                    <label className="text-muted small font-weight-bold">XÁC NHẬN MẬT KHẨU <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control bg-dark text-white border-secondary py-3" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Nhập lại mật khẩu" />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="btn btn-cyber w-100 py-3 mb-3 font-weight-bold text-uppercase">
                                {isLoading ? 'Đang kiểm tra & lưu dữ liệu...' : 'Tạo tài khoản mới'}
                            </button>

                            <div className="text-center text-muted mt-3">
                                Đã có tài khoản? <Link to={`/login?redirect=${redirectUrl}`} className="text-neon text-decoration-none fw-bold">Đăng nhập ngay</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;