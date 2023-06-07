import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./Pages/Home";
import Home from "./Pages/Home";
import NotFoundPage from "./Pages/NotFoundPage";
import Store from "./Pages/Store";
import ProductDetails from "./Pages/ProductDetails";
import Product from "./Components/admin/Product";
import Category from "./Components/admin/Category";
import Sidebar from "./Components/admin/Sidebar";

import Coupon from "./Components/admin/Coupon";
import Slider from "./Components/admin/Slider";
import Settings from "./Components/admin/Settings";
import ProductsTable from "./Components/admin/tables/ProductsTable";
import SliderTable from "./Components/admin/tables/SliderTable";
import CategoryTable from "./Components/admin/tables/CategoryTable";
import OrdersTable from "./Components/admin/tables/OrdersTable";
import CouponTable from "./Components/admin/tables/CouponsTable";
import UsersTable from "./Components/admin/tables/UsersTable";
import Checkout from "./Pages/Checkout";
import UpdateProduct from "./Components/admin/UpdateProduct";
import OrderDetail from "./Components/OrderDetail";
import Account from "./Components/Account";
import ClientOrders from "./Components/ClientOrders";
import ChangePassword from "./Components/ChangePassword";
import ClientOrderDetail from "./Components/ClientOrderDetail";
import ClientRoutes from "./utils/ClientRoutes";
import AdminRoutes from "./utils/AdminRoutes";
// import EmailOrder from './Components/EmailOrder'
import ForgetPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
import AdminDashboard from "./Components/admin/AdminDashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/forget" element={<ForgetPassword />} />
          <Route exact path="/reset" element={<ResetPassword />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Client Routes Start*/}
          <Route path="/dashboard/client" element={<ClientRoutes />}>
            <Route index element={<Account />} />
            <Route path="/dashboard/client/orders" element={<ClientOrders />} />
            <Route
              path="/dashboard/client/orders/:id"
              element={<ClientOrderDetail />}
            />
            <Route
              path="/dashboard/client/changePassword"
              element={<ChangePassword />}
            />
          </Route>
          {/* Client Routes End*/}

          {/* Admin Routes Start*/}
          <Route path="/dashboard/admin" element={<AdminRoutes />}>
            <Route index element={<AdminDashboard />} />
            <Route
              path="/dashboard/admin/category/add"
              element={<Category />}
            />
            <Route path="/dashboard/admin/products/add" element={<Product />} />
            <Route path="/dashboard/admin/coupon/add" element={<Coupon />} />
            <Route path="/dashboard/admin/slider/add" element={<Slider />} />
            <Route path="/dashboard/admin/settings" element={<Settings />} />
            <Route
              path="/dashboard/admin/order/:id/orderDetail"
              element={<OrderDetail />}
            />
            <Route
              path="/dashboard/admin/product/:id"
              element={<UpdateProduct />}
            />
            <Route
              path="/dashboard/admin/products"
              element={<ProductsTable />}
            />
            <Route path="/dashboard/admin/slider" element={<SliderTable />} />
            <Route
              path="/dashboard/admin/category"
              element={<CategoryTable />}
            />
            <Route path="/dashboard/admin/orders" element={<OrdersTable />} />
            <Route path="/dashboard/admin/coupon" element={<CouponTable />} />
            <Route path="/dashboard/admin/users" element={<UsersTable />} />
          </Route>
          {/* Admin Routes End*/}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
