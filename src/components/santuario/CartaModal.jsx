import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

function CartaModal({ carta, onCerrar }) {
    return createPortal(
        <motion.div
            className="carta-modal-fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onCerrar}
        >
            <motion.div
                className="carta-modal-papel"
                initial={{ opacity: 0, scale: 0.4, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 6 }}
                transition={{ duration: 0.55, ease: easeCine }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="carta-modal-cerrar" onClick={onCerrar} aria-label="Cerrar carta">
                    ✕
                </button>
                <p className="carta-titulo">{carta.titulo}</p>
                <p className="carta-modal-texto">“{carta.texto}”</p>
                <span className="carta-firma">♡</span>
                <button className="carta-modal-salir" onClick={onCerrar}>
                    Cerrar carta
                </button>
            </motion.div>
        </motion.div>,
        document.body
    );
}

export default CartaModal;

