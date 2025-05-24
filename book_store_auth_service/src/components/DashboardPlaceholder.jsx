import React from 'react';
// import { useNavigate } from 'react-router-dom';

function DashboardPlaceholder() {
    const user = JSON.parse(localStorage.getItem('user')); //
    // const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); //
        // navigate('/auth'); 
        window.location.href = '/auth'; // Chuyển hướng về trang đăng nhập
    }

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}> {/* */}
            <h2>Chào mừng trở lại, {user?.full_name || user?.email}!</h2> {/* */}
            <p>Bạn đã đăng nhập thành công.</p> {/* */}
            <button 
                onClick={handleLogout} 
                style={{ 
                    padding: '10px 20px', 
                    marginTop: '20px', 
                    backgroundColor: '#d90000', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                }}
            >
                Đăng xuất
            </button> {/* */}
        </div>
    );
}
export default DashboardPlaceholder;