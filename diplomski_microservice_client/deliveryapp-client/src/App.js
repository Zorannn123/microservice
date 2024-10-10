import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/utils/ProtectedRoute';
import { AllUsers } from './components/AllUsers/AllUsers';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Logout } from './components/auth/Logout';
import { UserProfile } from './components/UserProfile/UserProfile';
import { EditProfile } from './components/EditProfile/EditProfile';
import { AllUnactivated } from './components/AllUnactivated/AllUnactivated';
import { AddProduct } from './components/AddProduct/AddProduct';
import { AllProducts } from './components/AllProducts/AllProducts';
import { NewOrder } from './components/NewOrder/NewOrder';
import { OrderSummary } from './OrderSummary/OrderSummary';
import { UndeliveredOrders } from './components/Undeliveder/Undelivered';
import Countdown from './components/Countdown/Countdown';
import OrderHistoryDeliverer from './components/OrderHistoryDeliverer/OrderHistoryDeliverer';
import { OrderHistory } from './components/OrderHistory/OrderHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/yourProfile" element={<UserProfile />} />
          <Route path="/allUsers" element={<AllUsers />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unactivated" element={<AllUnactivated />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/newOrder" element={<NewOrder />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/undeliveredOrders" element={<UndeliveredOrders />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/orderHistoryDeliverer" element={<OrderHistoryDeliverer />} />
          <Route path="/orderHistory" element={<OrderHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
