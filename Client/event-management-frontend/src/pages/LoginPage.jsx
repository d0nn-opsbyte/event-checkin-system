import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage({ login }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Server response:', result); 

            if (response.ok) {
                
                const user = {
                    name: result.name,
                    email: email, 
                    role: result.role
                };
                const token = result.token;
                
                if (token && user.name && user.role) {
                    login(user, token);
                } else {
                    setError('Invalid response from server - missing required fields');
                }
            } else {
                setError(result.error || result.message || 'Login failed');
            }

        } catch (err) {
            setError('Cannot connect to server');
            console.error('Login error:', err);
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2>Login to Your Account</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;