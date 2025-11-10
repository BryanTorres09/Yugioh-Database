import Form from "./routes/Form"
import Navbar from "./components/Navbar"
import { Routes,Route } from "react-router";
import Cards from "./routes/Cards";



function App() {
  

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/cardlist" element={<Cards />} />
      </Routes>
     
    </div>
  );
}

export default App
