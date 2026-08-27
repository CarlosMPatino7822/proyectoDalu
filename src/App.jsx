import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home.jsx";
import WhatsApp from "./pages/WhatsApp.jsx";
import PortalFinal from "./pages/PortalFinal.jsx";
import Santuario from "./pages/Santuario.jsx";
import PageTransition from "./components/transition/PageTransition.jsx";

function RoutesConAnimacion() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/whatsapp" element={<PageTransition><WhatsApp /></PageTransition>} />
        <Route path="/portal-final" element={<PageTransition><PortalFinal /></PageTransition>} />
        <Route path="/santuario" element={<PageTransition><Santuario /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RoutesConAnimacion />
    </BrowserRouter>
  );
}
export default App;
