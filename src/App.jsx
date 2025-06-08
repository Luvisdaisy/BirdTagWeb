import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Verify from "./pages/Verify";
import {ToastProvider} from "./contexts/ToastContext";
import Upload from "./pages/Upload";
import SearchTags from "./pages/SearchTags";
import SearchByFile from "./pages/SearchByFile";
import SearchTagsCount from "./pages/SearchTagsCount";
import {AuthProvider} from "./contexts/AuthContext";

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Router>
                    <Routes>
                        <Route path = "/signup" element = {<SignUp/>}/>
                        <Route path = "/login" element = {<Login/>}/>
                        <Route path = "/verify" element = {<Verify/>}/>
                        <Route
                            path = "/"
                            element = {
                                <ProtectedRoute>
                                    <Dashboard/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path = "/upload"
                            element = {
                                <ProtectedRoute>
                                    <Upload/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path = "/search-tags"
                            element = {
                                <ProtectedRoute>
                                    <SearchTags/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path = "/search-by-file"
                            element = {
                                <ProtectedRoute>
                                    <SearchByFile/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path = "/search-tags-count"
                            element = {
                                <ProtectedRoute>
                                    <SearchTagsCount/>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;