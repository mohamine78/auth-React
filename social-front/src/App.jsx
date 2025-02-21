import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Posts from './pages/PostPage.jsx';
import ProtectedAuthRoute from './routes/ProtectedAuthRoute.jsx';
import Navbar from './pages/component/Navbar.jsx';
import SinglePost from './pages/SinglePost.jsx';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route element={<ProtectedAuthRoute />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        </Route>


        <Route path="/home" element={<HomePage />} />
        <Route path="/create-post" element={<Posts />} />
        <Route path="/post/:id" element={<SinglePost />} />

      </Routes>
    </Router>
  );
}

export default App;
