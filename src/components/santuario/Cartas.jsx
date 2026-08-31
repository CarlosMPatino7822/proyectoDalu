import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { CARTAS } from "./santuarioConfig";
import CartaModal from "./CartaModal";
import SeccionTitulo from "./SeccionTitulo";
import Sobre from "./Sobre";

function Cartas({ cartaAbierta, setCartaAbierta }) {
    useEffect(() => {
        if (cartaAbierta === null) return undefined;

        const onKey = (e) => {
            if (e.key === "Escape") setCartaAbierta(null);
        };
        const scrollActual = window.scrollY;

        window.addEventListener("keydown", onKey);
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollActual}px`;
        document.body.style.width = "100%";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollActual);
        };
    }, [cartaAbierta, setCartaAbierta]);

    return (
        <section className="s-section" id="cartas">
            <SeccionTitulo eyebrow="PALABRAS" titulo="Cartas" />
            <div className="sobres-grid">
                {CARTAS.map((c, i) => (
                    <Sobre
                        key={i}
                        indice={i}
                        onAbrir={() => setCartaAbierta(i)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {cartaAbierta !== null && (
                    <CartaModal
                        carta={CARTAS[cartaAbierta]}
                        onCerrar={() => setCartaAbierta(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

export default Cartas;

