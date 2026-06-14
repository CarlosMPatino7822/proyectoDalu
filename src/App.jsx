import {BrowserRouter,Routes,Route} from "react-router-dom";

import Home from "./pages/Home.jsx";
import WhatsApp from "./pages/WhatsApp.jsx";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/whatsapp" element={<WhatsApp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;