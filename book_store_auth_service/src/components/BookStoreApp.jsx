import React, { useState, useEffect, useCallback } from 'react';
// Suppress no-unused-vars warning for Input and Button since they are used in BookCard
import { Input } from "@/components/ui/input" // eslint-disable-line no-unused-vars
import { Button } from "@/components/ui/button" // eslint-disable-line no-unused-vars
// Suppress no-unused-vars warning for motion and AnimatePresence since they are used in BookCard and ShoppingCartItem
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Loader2, AlertTriangle, CheckCircle, User, LogIn, LogOut, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- BACKEND API FUNCTIONS ---
// Các hàm này sẽ gửi yêu cầu HTTP đến backend của bạn.

const API_BASE_URL = 'http://localhost:3000/api'; // Đảm bảo backend của bạn chạy trên cổng 3000

// Giả lập dữ liệu sách ban đầu (vì backend chưa có API quản lý sản phẩm)
let currentMockBooks = [
    {
        id: '1',
        title: 'Dế Mèn Phiêu Lưu Ký',
        author: 'Tô Hoài',
        description: 'Câu chuyện về cuộc phiêu lưu của chú dế Dế Mèn.',
        price: 120000,
        imageUrl: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195579.jpg',
        rating: 4.5,
        category: 'Văn học',
    },
    {
        id: '2',
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
        author: 'Nguyễn Nhật Ánh',
        description: 'Tuổi thơ êm đềm ở một làng quê Việt Nam.',
        price: 95000,
        imageUrl: 'https://salt.tikicdn.com/ts/product/6e/12/c1/9118c7e9f195187355c4839887758579.jpg',
        rating: 4.8,
        category: 'Văn học',
    },
    {
        id: '3',
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        description: 'Hành trình theo đuổi giấc mơ của chàng chăn cừu Santiago.',
        price: 150000,
        imageUrl: 'https://mcdn.nhakhoalananh.com/uploads/products/2022/07/19/nha-gia-kim-tai-ban-2020-bia-cung-1658237464.jpg',
        rating: 4.7,
        category: 'Tiểu thuyết',
    },
    {
        id: '4',
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử.',
        price: 180000,
        imageUrl: 'https://bizbooks.com.vn/wp-content/uploads/2023/02/dac-nhan-tam-bia-xanh-tai-ban-2023.jpg',
        rating: 4.6,
        category: 'Kỹ năng sống',
    },
    {
        id: '5',
        title: 'Harry Potter và Hòn Đá Phù Thủy',
        author: 'J.K. Rowling',
        description: 'Hành trình khám phá thế giới phép thuật của cậu bé Harry Potter.',
        price: 220000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/vi/thumb/f/f5/Harry_Potter_and_the_Philosopher%27s_Stone_cover.jpg/220px-Harry_Potter_and_the_Philosopher%27s_Stone_cover.jpg',
        rating: 4.9,
        category: 'Fantasy',
    },
    {
        id: '6',
        title: 'Chiến Binh Báo Đen',
        author: 'Ta-Nehisi Coates',
        description: 'Câu chuyện về T\'Challa, vị vua của Wakanda.',
        price: 165000,
        imageUrl: 'https://m.media-amazon.com/images/I/81M0ZQPa7jL._AC_UF1000,1000_QL80_.jpg',
        rating: 4.4,
        category: 'Truyện tranh',
    },
    {
        id: '7',
        title: 'Sapiens: Lược sử loài người',
        author: 'Yuval Noah Harari',
        description: 'Khám phá lịch sử phát triển của loài người từ thuở sơ khai.',
        price: 250000,
        imageUrl: 'https://cdn0.fahasa.com/media/catalog/product/s/a/sapiens_bia_cung.jpg',
        rating: 4.7,
        category: 'Lịch sử',
    },
    {
        id: '8',
        title: '1984',
        author: 'George Orwell',
        description: 'Cuốn tiểu thuyết kinh điển về một xã hội độc tài.',
        price: 110000,
        imageUrl: 'https://m.media-amazon.com/images/I/71yNgTMEcpL._AC_UF1000,1000_QL80_.jpg',
        rating: 4.6,
        category: 'Tiểu thuyết',
    },
];

// Hàm giả lập lấy tất cả sách (vì backend chưa có endpoint này)
const fetchAllBooks = async () => {
    console.log('Fetching all books from mock data...');
    await new Promise(resolve => setTimeout(resolve, 800)); // Mô phỏng độ trễ mạng
    return currentMockBooks;
};


// Tạo giỏ hàng mới
const createCartOnBackend = async (userId) => {
    console.log(`Creating cart for user ${userId}...`);
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) {
        throw new Error(`Failed to create cart: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// Lấy thông tin giỏ hàng
const getCartOnBackend = async (cartId) => {
    console.log(`Fetching cart ${cartId}...`);
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`);
    if (!response.ok) {
        if (response.status === 404) {
            return { cart: null, items: [] }; // Giỏ hàng không tồn tại
        }
        throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// Thêm hoặc cập nhật sản phẩm vào giỏ hàng
const addItemToCartOnBackend = async (cartId, item) => {
    console.log(`Adding/updating item in cart ${cartId}:`, item);
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error(`Failed to add/update item in cart: ${response.statusText}`);
    }
};

// Cập nhật số lượng/giá của một sản phẩm trong giỏ hàng
const updateCartItemOnBackend = async (cartId, productId, quantity, price) => {
    console.log(`Updating item ${productId} in cart ${cartId} to quantity ${quantity}...`);
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/item/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, price }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.statusText}`);
    }
};

// Xóa một sản phẩm khỏi giỏ hàng
const deleteCartItemOnBackend = async (cartId, productId) => {
    console.log(`Deleting item ${productId} from cart ${cartId}...`);
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}/item/${productId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete cart item: ${response.statusText}`);
    }
};

// Xóa toàn bộ giỏ hàng
const deleteCartOnBackend = async (cartId) => {
    console.log(`Deleting cart ${cartId}...`);
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete cart: ${response.statusText}`);
    }
};

// Tạo đơn hàng
const createOrderOnBackend = async (userId, items) => {
    console.log(`Creating order for user ${userId} with items:`, items);
    const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, items }),
    });
    if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// --- END BACKEND API FUNCTIONS ---


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

const BookCard = ({ book, onAddToCart }) => { // Đã bỏ isSeller prop
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        onAddToCart(book);
        setIsAdding(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group overflow-hidden relative border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-[3/4]"> {/* Adjusted aspect ratio for images */}
                    <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="object-cover w-full h-full rounded-t-lg"
                    />
                </div>
                <CardHeader className="p-3 pb-2"> {/* Reduced padding */}
                    <CardTitle className="text-base font-semibold line-clamp-2 group-hover:underline transition-colors duration-200"> {/* Smaller title font */}
                        {book.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">{book.author}</CardDescription> {/* Smaller description font */}
                </CardHeader>
                <CardContent className="p-3 pt-0"> {/* Reduced padding */}
                    <p className="text-xs text-gray-700 line-clamp-3">{book.description}</p> {/* Smaller description font */}
                    <div className="mt-2 flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-3 w-3", // Smaller star icons
                                    i < Math.floor(book.rating)
                                        ? "text-yellow-400"
                                        : i < book.rating
                                            ? "text-yellow-400/50"
                                            : "text-gray-300"
                                )}
                            />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">({book.rating.toFixed(1)})</span> {/* Smaller rating text */}
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">{book.category}</Badge> {/* Smaller badge text */}
                </CardContent>
                <CardFooter className="flex items-center justify-between p-3 pt-0"> {/* Reduced padding */}
                    <span className="text-base font-bold">{formatCurrency(book.price)}</span> {/* Smaller price font */}
                    {/* Luôn hiển thị nút thêm vào giỏ hàng vì không còn vai trò người bán */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 text-sm py-1 px-2 h-auto" // Smaller button
                    >
                        {isAdding ? (
                            <>
                                <Loader2 className="h-3 w-3 animate-spin" /> {/* Smaller icon */}
                                Đang thêm...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="h-3 w-3" /> {/* Smaller icon */}
                                Thêm
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const ShoppingCartItem = ({ item, onRemoveFromCart, onUpdateQuantity }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) {
            setError("Số lượng phải lớn hơn 0.");
            return;
        }
        if (newQuantity > 100) {
            setError("Số lượng không được vượt quá 100.");
            return;
        }
        setError(null);
        setIsUpdating(true);
        try {
            await onUpdateQuantity(item.book.id, newQuantity);
            setQuantity(newQuantity); // Update state only on success
        } catch (error) {
            console.error("Failed to update quantity:", error);
            setError("Cập nhật số lượng thất bại.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between py-4 border-b border-gray-200 last:border-none"
        >
            <div className="flex items-center gap-4">
                <img
                    src={item.book.imageUrl}
                    alt={item.book.title}
                    className="w-16 h-20 object-cover rounded-md"
                />
                <div>
                    <h3 className="text-lg font-semibold">{item.book.title}</h3>
                    <p className="text-gray-500 text-sm">Giá: {formatCurrency(item.book.price)}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1 || isUpdating}
                        className="h-8 w-8"
                    >
                        -
                    </Button>
                    <Input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (!isNaN(newQuantity)) {
                                handleQuantityChange(newQuantity);
                            }
                        }}
                        className="w-16 text-center"
                        disabled={isUpdating}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 100 || isUpdating}
                        className="h-8 w-8"
                    >
                        +
                    </Button>
                </div>
                <span className="text-lg font-bold">
                    {formatCurrency(item.book.price * quantity)}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFromCart(item.book.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25v-2.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v2.625m-4.5 0V16.5m7.5-5.25v8.25m-3-9.75h6m-9 0h.008"
                        />
                    </svg>
                </Button>
            </div>
            {error && (
                <div className="absolute top-full left-0 mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </motion.div>
    );
};

const ShoppingCartPage = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart, onCheckout }) => { // Đã bỏ isSeller prop
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);

    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.book.price * item.quantity;
    }, 0);

    const handleCheckoutClick = async () => {
        setIsCheckingOut(true);
        setCheckoutError(null);
        try {
            const success = await onCheckout(); // Gọi hàm onCheckout từ prop
            if (success) {
                setCheckoutSuccess(true);
                // onClearCart() sẽ được gọi trong BookStoreApp sau khi checkout thành công
            } else {
                throw new Error("Thanh toán không thành công. Vui lòng thử lại.");
            }
        } catch (error) {
            setCheckoutError(error.message || "Đã có lỗi xảy ra trong quá trình thanh toán.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (checkoutSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Thanh toán thành công!</h2>
                <p className="text-gray-600 mb-8 text-center">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ được giao trong thời gian sớm nhất.
                </p>
                <Button
                    onClick={() => setCheckoutSuccess(false)} // Reset for demo purposes
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500">Hãy thêm sách vào giỏ hàng để tiến hành thanh toán.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
            <AnimatePresence>
                {cartItems.map(item => (
                    <ShoppingCartItem
                        key={item.book.id}
                        item={item}
                        onRemoveFromCart={onRemoveFromCart}
                        onUpdateQuantity={onUpdateQuantity}
                    />
                ))}
            </AnimatePresence>
            <div className="mt-8 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">Tổng cộng:</h2>
                    <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
                </div>
                {/* Luôn hiển thị các nút này vì không còn vai trò người bán */}
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={onClearCart}
                        className="text-gray-700 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                    >
                        Xóa giỏ hàng
                    </Button>
                    <Button
                        onClick={handleCheckoutClick}
                        disabled={isCheckingOut}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 transition-colors"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang thanh toán...
                            </>
                        ) : (
                            "Thanh toán"
                        )}
                    </Button>
                </div>
            </div>
            {checkoutError && (
                <div className="mt-4 text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {checkoutError}
                </div>
            )}
        </div>
    );
};

const BookStoreApp = () => {
    // Lấy thông tin người dùng từ localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Đảm bảo vai trò luôn là 'buyer' khi tải từ localStorage
                setUser({ ...parsedUser, role: 'buyer' });
                console.log("BookStoreApp: User loaded from localStorage:", { ...parsedUser, role: 'buyer' });
            } catch (e) {
                console.error("BookStoreApp: Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userCartId'); // Xóa cartId khi đăng xuất
        window.location.href = '/auth'; // Chuyển hướng về trang đăng nhập
    };


    const [books, setBooks] = useState([]); // Khởi tạo rỗng để tải từ backend
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState('home'); // Luôn bắt đầu ở trang home
    const [loading, setLoading] = useState(true); // Bắt đầu với loading true
   
    const [categories, setCategories] = useState([]); // State cho danh mục
    const [userCartId, setUserCartId] = useState(null); // State để lưu cartId của người dùng

    // Load cartId từ local storage và fetch cart items khi khởi động
    useEffect(() => {
        const savedCartId = localStorage.getItem('userCartId');
        if (savedCartId) {
            setUserCartId(parseInt(savedCartId, 10));
            console.log("BookStoreApp: userCartId loaded from localStorage:", parseInt(savedCartId, 10));
        }
    }, []);

    // Lưu cartId vào local storage
    useEffect(() => {
        if (userCartId !== null) {
            localStorage.setItem('userCartId', userCartId.toString());
        } else {
            localStorage.removeItem('userCartId');
        }
        localStorage.setItem('bookstoreCart', JSON.stringify(cartItems));
        console.log("BookStoreApp: userCartId/cartItems persisted. Current userCartId:", userCartId);
    }, [userCartId, cartItems]);

    // Fetch books from mock data on component mount
    useEffect(() => {
        const getBooks = async () => {
            try {
                setLoading(true);
                const fetchedBooks = await fetchAllBooks(); // Lấy từ mock data
                setBooks(fetchedBooks);
                setCategories([...new Set(fetchedBooks.map(book => book.category))]);
            } catch (error) {
                console.error("BookStoreApp: Failed to fetch books:", error);
                // Xử lý lỗi hiển thị cho người dùng
            } finally {
                setLoading(false);
            }
        };
        getBooks();
    }, []);

    // Fetch cart items from backend when user logs in or cartId is available
    useEffect(() => {
        const fetchUserCart = async () => {
            console.log("fetchUserCart called. Current user:", user, "userCartId:", userCartId);
            // Luôn coi người dùng là 'buyer' cho logic giỏ hàng
            if (user && user.id) { // Chỉ cần user và user.id tồn tại
                let currentCartId = userCartId;
                if (!currentCartId) {
                    console.log("BookStoreApp: No userCartId found, attempting to create new cart for user:", user.id);
                    try {
                        const newCart = await createCartOnBackend(user.id);
                        currentCartId = newCart.id;
                        setUserCartId(newCart.id);
                        console.log("BookStoreApp: New cart created:", newCart.id);
                    } catch (createError) {
                        console.error("BookStoreApp: Failed to create new cart:", createError);
                        alert("Không thể tạo giỏ hàng mới. Vui lòng thử lại."); // Sử dụng alert để thông báo cho người dùng
                        return;
                    }
                }

                try {
                    console.log("BookStoreApp: Attempting to fetch cart items for cartId:", currentCartId);
                    const { items } = await getCartOnBackend(currentCartId);
                    // Map backend items to frontend Book type
                    const frontendItems = items.map(item => {
                        const bookDetail = books.find(book => book.id === item.product_id);
                        return bookDetail ? { book: bookDetail, quantity: item.quantity } : null;
                    }).filter(Boolean);
                    setCartItems(frontendItems);
                    console.log("BookStoreApp: Cart items fetched:", frontendItems);
                } catch (error) {
                    console.error("BookStoreApp: Failed to fetch user cart:", error);
                    // Nếu giỏ hàng không tồn tại trên backend (ví dụ: bị xóa thủ công), thử tạo lại
                    console.log("BookStoreApp: Cart fetch failed, attempting to re-create cart for user:", user.id);
                    try {
                        const newCart = await createCartOnBackend(user.id);
                        setUserCartId(newCart.id);
                        setCartItems([]); // Giỏ hàng mới sẽ trống
                        console.log("BookStoreApp: Cart re-created:", newCart.id);
                    } catch (recreateError) {
                        console.error("BookStoreApp: Failed to re-create cart:", recreateError);
                        alert("Không thể tải hoặc tạo giỏ hàng. Vui lòng thử lại.");
                    }
                }
            } else if (!user) { // Nếu không có người dùng đăng nhập, xóa giỏ hàng
                console.log("BookStoreApp: No user, clearing cart.");
                setCartItems([]);
                setUserCartId(null);
            } else {
                console.log("BookStoreApp: User.id is missing. User:", user);
            }
        };
        // Chỉ fetch cart nếu books đã được tải (để tìm bookDetail) VÀ user đã có
        if (books.length > 0 && user) {
            fetchUserCart();
        } else if (!user) {
            // Khi logout, đảm bảo giỏ hàng được xóa
            setCartItems([]);
            setUserCartId(null);
        }
    }, [user, userCartId, books]); // Thêm books vào dependency array

    const handleAddToCart = useCallback(async (book) => {
        console.log("handleAddToCart called. Current user:", user, "userCartId:", userCartId);
        // Chỉ cần user và userCartId tồn tại
        if (!user || !userCartId) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            console.log("Add to cart blocked: user:", user, "userCartId:", userCartId);
            return;
        }

        const existingItem = cartItems.find(item => item.book.id === book.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

        try {
            console.log("Attempting to add item to cart via backend:", { cartId: userCartId, productId: book.id, quantity: newQuantity, price: book.price });
            await addItemToCartOnBackend(userCartId, {
                product_id: book.id,
                quantity: newQuantity,
                price: book.price
            });
            setCartItems(prevItems => {
                if (existingItem) {
                    return prevItems.map(item =>
                        item.book.id === book.id ? { ...item, quantity: newQuantity } : item
                    );
                } else {
                    return [...prevItems, { book, quantity: newQuantity }];
                }
            });
            console.log("Item added/updated in cart successfully.");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            alert("Thêm sản phẩm vào giỏ hàng thất bại.");
        }
    }, [user, userCartId, cartItems]);

    const handleRemoveFromCart = useCallback(async (bookId) => {
        if (!user || !userCartId) return;
        try {
            await deleteCartItemOnBackend(userCartId, bookId);
            setCartItems(prevItems => prevItems.filter(item => item.book.id !== bookId));
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Xóa sản phẩm khỏi giỏ hàng thất bại.");
        }
    }, [user, userCartId]);

    const handleUpdateQuantity = useCallback(async (bookId, quantity) => {
        if (!user || !userCartId) return;
        const itemToUpdate = cartItems.find(item => item.book.id === bookId);
        if (!itemToUpdate) return;

        try {
            await updateCartItemOnBackend(userCartId, bookId, quantity, itemToUpdate.book.price);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.book.id === bookId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating item quantity:", error);
            alert("Cập nhật số lượng thất bại.");
        }
    }, [user, userCartId, cartItems]);

    const handleClearCart = useCallback(async () => {
        if (!user || !userCartId) return;
        try {
            await deleteCartOnBackend(userCartId);
            setCartItems([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
            alert("Xóa giỏ hàng thất bại.");
        }
    }, [user, userCartId]);

    // Hàm xử lý thanh toán, gọi API backend
    const handleCheckout = async () => {
        if (!user || !userCartId) {
            alert('Vui lòng đăng nhập để thanh toán.');
            return false;
        }
        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống.');
            return false;
        }

        const itemsForOrder = cartItems.map(item => ({
            product_id: item.book.id,
            quantity: item.quantity,
            price: item.book.price,
        }));

        try {
            await createOrderOnBackend(user.id, itemsForOrder);
            await deleteCartOnBackend(userCartId); // Xóa giỏ hàng sau khi tạo đơn hàng thành công
            setCartItems([]); // Cập nhật trạng thái frontend
            return true;
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Thanh toán thất bại. Vui lòng thử lại.");
            return false;
        }
    };

    const filteredBooks = books.filter(book => {
        const searchMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = !selectedCategory || book.category === selectedCategory;
        return searchMatch && categoryMatch;
    });

    // Simulate loading for search/category filter (separate from initial fetch)
    useEffect(() => {
        const timer = setTimeout(() => {
            // No need to set loading to true here, as initial fetch handles it
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 cursor-pointer"
                        onClick={() => setCurrentPage('home')}>
                        BookStore
                    </h1>
                    <div className="flex items-center gap-4">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        {user ? (
                            <>
                                <span className="font-semibold text-gray-700">
                                    <User className="inline-block mr-1" />
                                    {user.full_name || user.email} (Người mua) {/* Luôn hiển thị là Người mua */}
                                </span>
                                <Button
                                    onClick={logout} // Gọi hàm logout
                                    variant="outline"
                                    className="text-gray-700 hover:text-red-500 hover:bg-red-50/50 transition-colors"
                                >
                                    <LogOut className="mr-2" />
                                    Đăng xuất
                                </Button>
                                {/* Đã xóa nút "Quản lý sách" */}
                            </>
                        ) : (
                            // Nút đăng nhập sẽ chuyển hướng đến trang xác thực
                            <Button
                                variant="outline"
                                className="text-gray-700 hover:text-blue-500 hover:bg-blue-50/50 transition-colors"
                                onClick={() => window.location.href = '/auth'}
                            >
                                <LogIn className="mr-2" />
                                Đăng nhập
                            </Button>
                        )}
                        <Button
                            onClick={() => setCurrentPage('cart')}
                            className="relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartItems.length > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="absolute -top-1 -right-1 rounded-full text-xs"
                                >
                                    {cartItems.length}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8">
                {currentPage === 'home' && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={selectedCategory === null ? "secondary" : "outline"}
                                    onClick={() => setSelectedCategory(null)}
                                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                                >
                                    Tất cả
                                </Badge>
                                {categories.map(category => (
                                    <Badge
                                        key={category}
                                        variant={selectedCategory === category ? "secondary" : "outline"}
                                        onClick={() => setSelectedCategory(category)}
                                        className="cursor-pointer hover:bg-gray-200 transition-colors"
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <div className="relative aspect-[3/4] bg-gray-300 rounded-t-lg"></div>
                                        <CardHeader className="p-3 pb-2">
                                            <CardTitle className="h-4 bg-gray-300 rounded w-3/4"></CardTitle>
                                            <CardDescription className="h-3 bg-gray-200 rounded w-1/2"></CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0">
                                            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between p-3 pt-0">
                                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                            <div className="h-8 bg-blue-300 rounded w-1/2"></div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                <AnimatePresence>
                                    {filteredBooks.map(book => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            onAddToCart={handleAddToCart}
                                            // isSeller prop đã bị loại bỏ
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {filteredBooks.length === 0 && !loading && (
                            <div className="text-center text-gray-500 mt-8">
                                Không tìm thấy sách nào phù hợp với yêu cầu của bạn.
                            </div>
                        )}
                    </>
                )}
                {currentPage === 'cart' && (
                    <ShoppingCartPage
                        cartItems={cartItems}
                        onRemoveFromCart={handleRemoveFromCart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onClearCart={handleClearCart}
                        // isSeller prop đã bị loại bỏ
                        onCheckout={handleCheckout} // Truyền hàm handleCheckout xuống
                    />
                )}
            </main>
        </div>
    );
};

export default BookStoreApp;
