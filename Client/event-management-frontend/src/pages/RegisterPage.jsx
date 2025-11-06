import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage({ login }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

   
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok) {
               
                alert('Registration successful! Please login.');
                
                window.location.href = '/login';
            } else {
                setError(result.error || result.message || 'Registration failed!');
            }

        } catch (err) {
            setError('Cannot connect to server. Please try again later.');
            console.log('Error:', err);
        }

        setLoading(false);
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;