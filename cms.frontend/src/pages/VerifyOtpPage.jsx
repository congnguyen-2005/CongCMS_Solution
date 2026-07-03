import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axiosClient.post(
                "/Auth/verify-otp",
                { email, otp }
            );

            setMessage(response.message || "Xác thực thành công!");

            setTimeout(() => {
                navigate("/reset-password", {
                    state: { email }
                });
            }, 1200);

        } catch (err) {
            setError(
                err.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn."
            );
        }
        setLoading(false);
    };

    const resendOTP = async () => {
        setError("");
        setMessage("");
        try {
            await axiosClient.post(
                "/Auth/forgot-password",
                { email }
            );
            setCountdown(60);
            setMessage("Mã OTP mới đã được gửi vào email của bạn.");
        } catch {
            setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
        }
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
                            XÁC THỰC <span className="text-neon" style={{ textShadow: '0 0 10px var(--neon-color)' }}>OTP</span>
                        </h3>

                        <p className="text-center text-muted small mb-4">
                            Mã xác thực đã được gửi tới hòm thư <br />
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

                        <form onSubmit={handleVerify}>
                            {/* Input mã OTP */}
                            <div className="form-group mb-4">
                                <label className="text-muted small font-weight-bold mb-2" style={{ letterSpacing: '1px' }}>
                                    NHẬP MÃ OTP
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white text-center border-secondary rounded-3 py-2.5 fs-5 font-weight-bold tracking-widest"
                                    placeholder="••••••"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    style={{ transition: 'all 0.3s ease', letterSpacing: '8px' }}
                                />
                            </div>

                            {/* Nút xác thực */}
                            <button
                                type="submit"
                                className="btn btn-cyber w-100 py-2.5 mb-4 font-weight-bold rounded-3 uppercase transition-all"
                                disabled={loading}
                                style={{ letterSpacing: '1px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    "XÁC NHẬN"
                                )}
                            </button>
                        </form>

                        {/* Khu vực Gửi lại OTP / Đếm ngược */}
                        <div className="text-center small pt-2 border-top border-secondary border-opacity-10">
                            {countdown > 0 ? (
                                <span className="text-muted">
                                    Gửi lại mã mới sau: <strong className="text-warning font-weight-bold ms-1">{countdown}s</strong>
                                </span>
                            ) : (
                                <div className="text-muted">
                                    Không nhận được mã?{" "}
                                    <button
                                        className="btn btn-link text-neon font-weight-bold p-0 ms-1 text-decoration-none vertical-align-baseline"
                                        onClick={resendOTP}
                                        style={{ fontSize: '0.875rem' }}
                                    >
                                        Gửi lại ngay
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Link quay lại */}
                        <div className="text-center mt-4">
                            <Link
                                to="/login"
                                className="text-muted text-decoration-none small transition-all hover-neon"
                            >
                                <i className="bi bi-arrow-left me-1"></i> Quay lại Đăng nhập
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;