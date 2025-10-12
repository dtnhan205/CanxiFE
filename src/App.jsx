import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageContacts from "./pages/admin/ManageContacts";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import Contact from "./pages/user/Contact";
import LoginAdmin from "./pages/admin/LoginAdmin";
import CreateProduct from "./pages/admin/ManageCreateProduct"; // Thêm component
import EditProduct from "./pages/admin/ManageEditProduct"; // Thêm component

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} /> {/* Thay :productSlug bằng :id */}
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/products/:id" element={<ManageProducts />} /> {/* Chi tiết sản phẩm */}
        <Route path="/admin/products/create" element={<CreateProduct />} /> {/* Form thêm */}
        <Route path="/admin/products/edit/:id" element={<EditProduct />} /> {/* Form sửa */}
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/contacts" element={<ManageContacts />} />

        {/* Fallback Route for 404 */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
      </Routes>
    </Router>
  );
}

export default App;