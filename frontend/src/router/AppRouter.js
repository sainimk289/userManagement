import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from '../pages/UserList';
import UserForm from '../pages/UserForm';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<UserForm />} />
        <Route path="/edit/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
