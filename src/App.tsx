import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
