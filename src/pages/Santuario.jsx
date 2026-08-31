import "./Santuario.css";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import AmbientePolvo from "../components/santuario/AmbientePolvo";
import BotonSorpresa from "../components/santuario/BotonSorpresa";
import Cartas from "../components/santuario/Cartas";
import CursorLuciernaga from "../components/santuario/CursorLuciernaga";
import FondoAmbiental from "../components/santuario/FondoAmbiental";
import HeroFrasco from "../components/santuario/HeroFrasco";
import IntroBienvenida from "../components/santuario/IntroBienvenida";
import Momentos from "../components/santuario/Momentos";
import NavSantuario from "../components/santuario/NavSantuario";
import Playlist from "../components/santuario/Playlist";
import Recuerdos from "../components/santuario/Recuerdos";
import SobreTi from "../components/santuario/SobreTi";
import Textura from "../components/santuario/Textura";
import { CARTAS, easeCine } from "../components/santuario/santuarioConfig";

function Santuario() {
    const location = useLocation();
    const vieneDelPortal = location.state?.entrada === true;

    const [mostrarIntro, setMostrarIntro] = useState(vieneDelPortal);
    const [paginaVisible, setPaginaVisible] = useState(!vieneDelPortal);
    const [cartaAbierta, setCartaAbierta] = useState(null);

    const sorprender = () => {
        const indiceAleatorio = Math.floor(Math.random() * CARTAS.length);
        document.getElementById("cartas")?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setCartaAbierta(indiceAleatorio), 500);
    };

    return (
        <div className="santuario">
            <FondoAmbiental />
            <Textura />
            <CursorLuciernaga />
            <AmbientePolvo />
            <BotonSorpresa onSorpresa={sorprender} />

            <AnimatePresence>
                {mostrarIntro && (
                    <IntroBienvenida
                        onTerminar={() => {
                            setPaginaVisible(true);
                            setMostrarIntro(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: vieneDelPortal ? 0 : 1 }}
                animate={{ opacity: paginaVisible ? 1 : 0 }}
                transition={{ duration: 1.6, ease: easeCine }}
            >
                <NavSantuario visible={paginaVisible} />
                <HeroFrasco />
                <Recuerdos />
                <Cartas cartaAbierta={cartaAbierta} setCartaAbierta={setCartaAbierta} />
                <Playlist />
                <Momentos />
                <SobreTi />
            </motion.div>
        </div>
    );
}

export default Santuario;

