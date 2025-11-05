import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage({ login }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            setTimeout(() => {
                if (formData.email === 'admin@company.com' && formData.password === 'admin123') {
                    const userData = {
                        id: 1,
                        name: 'Admin User',
                        email: formData.email,
                        role: 'admin'
                    };
                    login(userData, 'fake-jwt-token-admin');
                } else if (formData.email && formData.password) {
                    const userData = {
                        id: 2,
                        name: 'Employee User',
                        email: formData.email,
                        role: 'employee'
                    };
                    login(userData, 'fake-jwt-token-employee');
                } else {
                    setError('Invalid email or password');
                }
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login to Your Account</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>

                <div className="demo-accounts">
                    <h4>Demo Accounts:</h4>
                    <p><strong>Admin:</strong> admin@company.com / admin123</p>
                    <p><strong>Employee:</strong> any email/password</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
