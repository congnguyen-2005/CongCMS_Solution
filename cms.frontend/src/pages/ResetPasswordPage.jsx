import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        // Kiểm tra mật khẩu trùng khớp ở client trước khi gửi API
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu nhập lại không trùng khớp.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosClient.post(
                "/Auth/reset-password",
                {
                    email,
                    newPassword,
                    confirmPassword
                }
            );

            setMessage(response.message || "Cập nhật mật khẩu mới thành công!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
            );
        }
        setLoading(false);
    };

    return (
        <div className="container my-5 py-5">
            <div className="row justify-content-center">
                <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div className="glass-card p-4 p-sm-5 shadow-lg rounded-4 border border-secondary border-opacity-25">

                        {/* Tiêu đề */}
                        <h3
                            className="text-center text-white font-weight-bold mb-3"
                            style={{ letterSpacing: '2px' }}
                        >
                            THIẾT LẬP <span className="text-neon" style={{ textShadow: '0 0 10px var(--neon-color)' }}>MẬT KHẨU</span>
                        </h3>

                        <p className="text-center text-muted small mb-4">
                            Đặt lại mật khẩu mới cho tài khoản: <br />
                            <strong className="text-white border-bottom border-secondary pb-1 d-inline-block mt-1">{email}</strong>
                        </p>

                        {/* Thông báo thành công */}
                        {message && (
                            <div className="alert alert-success py-2 px-3 text-center small font-weight-bold rounded-3 mb-4">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                {message}
                            </div>
                        )}

                        {/* Thông báo lỗi */}
                        {error && (
                            <div className="alert alert-danger py-2 px-3 text-center small font-weight-bold rounded-3 mb-4">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Ô nhập mật khẩu mới */}
                            <div className="form-group mb-3">
                                <label className="text-muted small font-weight-bold mb-2" style={{ letterSpacing: '1px' }}>
                                    MẬT KHẨU MỚI
                                </label>
                                <input
                                    type="password"
                                    className="form-control bg-dark text-white border-secondary rounded-3 py-2 px-3"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                            </div>

                            {/* Ô nhập lại mật khẩu */}
                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold mb-2" style={{ letterSpacing: '1px' }}>
                                    NHẬP LẠI MẬT KHẨU
                                </label>
                                <input
                                    type="password"
                                    className="form-control bg-dark text-white border-secondary rounded-3 py-2 px-3"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ transition: 'all 0.3s ease' }}
                                />
                            </div>

                            {/* Nút Cập nhật */}
                            <button
                                type="submit"
                                className="btn btn-cyber w-100 py-2.5 mb-3 font-weight-bold rounded-3 uppercase transition-all"
                                disabled={loading}
                                style={{ letterSpacing: '1px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    "ĐỔI MẬT KHẨU"
                                )}
                            </button>

                            {/* Link hủy bỏ / quay lại */}
                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-muted text-decoration-none small transition-all hover-neon"
                                >
                                    Hủy bỏ & Quay lại
                                </Link>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;