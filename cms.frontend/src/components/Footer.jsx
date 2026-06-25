import React from 'react';

const Footer = () => {
    return (
        <footer className="footer-dark pt-5 pb-3 mt-5">
            <div className="container">
                <div className="row border-bottom border-secondary pb-4 mb-4">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h5 className="text-white font-weight-bold mb-3" style={{ letterSpacing: '1px' }}>CAMERACLICK</h5>
                        <p className="small mb-2">Hệ thống phân phối máy ảnh, ống kính và thiết bị nhiếp ảnh chuyên nghiệp hàng đầu.</p>
                        <div className="d-flex mt-3">
                            <i className="fa-brands fa-facebook fa-lg mr-3 text-white cursor-pointer hover-neon"></i>
                            <i className="fa-brands fa-instagram fa-lg mr-3 text-white cursor-pointer hover-neon"></i>
                            <i className="fa-brands fa-youtube fa-lg text-white cursor-pointer hover-neon"></i>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4 mb-md-0">
                        <h6 className="text-white text-uppercase mb-3">Sản phẩm</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-white">Máy ảnh Sony</a></li>
                            <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-white">Máy ảnh Canon</a></li>
                            <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-white">Ống kính (Lens)</a></li>
                            <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-white">Gimbal & Chống rung</a></li>
                        </ul>
                    </div>

                    <div className="col-md-5">
                        <h6 className="text-white text-uppercase mb-3">Nhận bản tin công nghệ</h6>
                        <p className="small">Đăng ký để nhận thông tin về các dòng máy ảnh mới nhất và ưu đãi độc quyền.</p>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Email của bạn..." style={{ borderRadius: 0 }} />
                            <div className="input-group-append">
                                <button className="btn btn-cyber" type="button">Đăng ký</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center small">
                    © 2026 CameraClick. Bản quyền thuộc về Hệ thống Đồ án Thực hành.
                </div>
            </div>
        </footer>
    );
};

export default Footer;