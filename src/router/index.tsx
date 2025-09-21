import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../components/Home';
import List from '../components/List';
import LoginPage from '../components/Login';
import PrivateRoute from './PrivateRouter'; // <-- import
import SignupPage from '@/components/Signup';

const Router = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="list" element={<List />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
