import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <header>
            <h1>Expenses App</h1>
            <nav>
                <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/list">List</Link></li>
                </ul>
            </nav>
        </header>
    );
};
export default Header;