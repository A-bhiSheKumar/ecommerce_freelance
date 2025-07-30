import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import { Toaster } from "react-hot-toast";
import HomeLayout from "./components/HomeLayout";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home/*" element={<HomeLayout />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
