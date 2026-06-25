import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
const ProfilePage = () => {
    const { user, login } = useContext(AuthContext); // Lấy user từ Context
    const navigate = useNavigate();

    // Khởi tạo state lưu thông tin form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    // Kiểm tra đăng nhập và nạp dữ liệu lên form
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '', // Nếu có SĐT thì hiện, ko thì rỗng
                address: user.address || ''
            });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Cập nhật lại thông tin mới vào user hiện tại
        const updatedUser = { ...user, ...formData };

        // Gọi lại hàm login từ AuthContext để lưu đè thông tin mới vào LocalStorage và State
        login(updatedUser);

        setIsEditing(false);
        alert("🎉 Cập nhật thông tin cá nhân thành công!");
    };

    if (!user) return null;

    return (
        <div className="container mt-5 pt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h3 className="font-weight-bold mb-4 text-uppercase text-center" style={{ color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                        <i className="fa-solid fa-id-badge mr-2"></i> Hồ Sơ Của Bạn
                    </h3>

                    <div className="glass-card p-5 shadow-lg position-relative overflow-hidden">
                        {/* Hiệu ứng mờ ảo góc phải */}
                        <div className="position-absolute" style={{ top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--neon-cyan)', opacity: '0.1', filter: 'blur(50px)', borderRadius: '50%' }}></div>

                        <div className="row">
                            {/* Cột trái: Avatar */}
                            <div className="col-md-4 text-center border-right border-secondary mb-4 mb-md-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                <div className="mb-3 d-inline-block p-1 rounded-circle" style={{ border: '2px dashed var(--neon-cyan)' }}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=120`}
                                        alt="Avatar"
                                        className="rounded-circle shadow"
                                    />
                                </div>
                                <h5 className="text-white font-weight-bold mb-1">{user.name}</h5>
                                <p className="text-muted small mb-3">{user.role || 'Thành viên tiêu chuẩn'}</p>

                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="btn btn-outline-info btn-sm px-4 rounded-pill">
                                        <i className="fa-solid fa-pen mr-1"></i> Chỉnh sửa
                                    </button>
                                )}
                            </div>

                            {/* Cột phải: Form thông tin */}
                            <div className="col-md-8 pl-md-4">
                                <form onSubmit={handleSave}>
                                    <div className="form-group mb-3">
                                        <label className="text-muted small font-weight-bold">HỌ VÀ TÊN</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control bg-dark text-white border-secondary py-3 ${!isEditing ? 'border-0 px-0 bg-transparent text-neon font-weight-bold h5 mb-0' : ''}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="text-muted small font-weight-bold">EMAIL (Không thể đổi)</label>
                                        <input
                                            type="email"
                                            className={`form-control bg-dark text-white border-secondary py-3 ${!isEditing ? 'border-0 px-0 bg-transparent font-weight-bold mb-0' : ''}`}
                                            value={formData.email}
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="text-muted small font-weight-bold">SỐ ĐIỆN THOẠI</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            className={`form-control bg-dark text-white border-secondary py-3 ${!isEditing ? 'border-0 px-0 bg-transparent font-weight-bold mb-0' : ''}`}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder={isEditing ? "Nhập số điện thoại..." : "Chưa cập nhật"}
                                            readOnly={!isEditing}
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="text-muted small font-weight-bold">ĐỊA CHỈ NHẬN HÀNG</label>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                className="form-control bg-dark text-white border-secondary"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ nhà của bạn..."
                                            ></textarea>
                                        ) : (
                                            <p className="text-white font-weight-bold mb-0">
                                                {formData.address || <span className="text-muted font-italic">Chưa cập nhật</span>}
                                            </p>
                                        )}
                                    </div>

                                    {/* Nút lưu hiển thị khi đang ở chế độ sửa */}
                                    {isEditing && (
                                        <div className="d-flex" style={{ gap: '10px' }}>
                                            <button type="button" className="btn btn-secondary py-2 flex-grow-1" onClick={() => setIsEditing(false)}>
                                                HỦY BỎ
                                            </button>
                                            <button type="submit" className="btn btn-cyber py-2 flex-grow-1">
                                                <i className="fa-solid fa-floppy-disk mr-2"></i> LƯU THAY ĐỔI
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;