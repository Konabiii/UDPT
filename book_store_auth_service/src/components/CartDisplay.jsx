// src/components/CartDisplay.jsx
import React from 'react';
import { useCart } from '../hooks/useCart';

function CartDisplay() {
  const { cart, cartLoading, cartError } = useCart();

  if (cartLoading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  if (cartError) {
    return <p style={{ color: 'red' }}>Lỗi tải giỏ hàng: {cartError}</p>;
  }

  if (!cart || !cart.id) {
    return <p>Bạn chưa có giỏ hàng nào.</p>;
  }

  // Giả sử bạn có hàm để lấy các item trong giỏ hàng (từ useCart hoặc trực tiếp từ CartDisplay)
  // Hiện tại useCart đã trả về cart object nhưng không có items.
  // Bạn sẽ cần sửa lại useCart.js để nó cũng fetch các cart_items cùng với cart.
  // Hoặc bạn có thể gọi API riêng tại đây nếu muốn.

  // Giả định `cart` object từ backend giờ đây có chứa một mảng `items`
  // (Bạn cần điều chỉnh `getCart` trong `cart_controller.js` để trả về cả items)
  // Ví dụ trong cart_controller.js hàm getCart:
  // res.json({ cart: cart.rows[0], items: items.rows });

  const totalItems = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalPrice = cart.items ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  return (
    <div className="cart-display-container" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '30px', maxWidth: '400px', margin: '30px auto' }}>
      <h2>Giỏ hàng của bạn (ID: {cart.id})</h2>
      {totalItems === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.items && cart.items.map(item => (
              <li key={item.product_id} style={{ borderBottom: '1px dashed #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.product_id} (x{item.quantity})</span>
                <span>{item.price * item.quantity} VNĐ</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tổng cộng:</span>
            <span>{totalPrice} VNĐ</span>
          </div>
          <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', width: '100%' }}>
            Thanh toán
          </button>
        </>
      )}
    </div>
  );
}

export default CartDisplay;