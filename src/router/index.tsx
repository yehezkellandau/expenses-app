import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../components/Home';
import List from '../components/List';
import LoginPage from '@/components/Login';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="list" element={<List />} />
            </Route>
            <Route path="login" element={<LoginPage />} />
        </Routes>
    );
};
export default Router;