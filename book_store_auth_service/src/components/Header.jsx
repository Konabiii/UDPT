import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

function Header() {
  const navigate = useNavigate();
  const { setShowCart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">BookStore</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          className="border rounded px-2 py-1"
          disabled
        />
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Đăng xuất
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Đăng nhập
          </button>
        )}
        <button onClick={() => setShowCart(true)} className="text-2xl">
          🛒
        </button>
      </div>
    </header>
  );
}

export default Header;