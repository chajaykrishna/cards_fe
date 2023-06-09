import Home from "./components/Home";
import VerifyResult from "./components/VerifyResult";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verifyResult" element={<VerifyResult/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;
