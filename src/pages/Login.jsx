import React, {useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';

const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({email, password});
            navigate('/');
        } catch (e) {
            setErr(e.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300">
            <form onSubmit = {handleSubmit} className = "bg-white rounded-xl p-8 w-full max-w-md space-y-4 shadow">
                <h2 className = "text-xl font-bold text-center mb-4">LOG IN</h2>

                <input
                    type = "email"
                    placeholder = "mail"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                    className = "w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type = "password"
                    placeholder = "password"
                    value = {password}
                    onChange = {(e) => setPwd(e.target.value)}
                    required
                    className = "w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type = "submit"
                    disabled = {loading}
                    className = {`w-full flex items-center justify-center gap-1 text-white py-2 rounded
                      ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    <MagnifyingGlassIcon className = "h-5 w-5"/>
                    {loading ? 'Login…' : 'LogIn'}
                </button>

                <p className = "text-sm text-center">
                    Don't have an account yet?<Link to = "/signup" className = "text-blue-600 hover:underline">REGISTER</Link>
                </p>

                <ErrorModal message = {err} onClose = {() => setErr('')}/>
            </form>
        </div>
    );
};

export default Login;
