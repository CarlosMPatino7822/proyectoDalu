import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";
import SeccionTitulo from "./SeccionTitulo";

function SobreTi() {
    return (
        <section className="s-section s-cierre" id="sobre-ti">
            <SeccionTitulo eyebrow="PARA TI" titulo="Sobre ti" />
            <motion.p
                className="cierre-texto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: easeCine }}
            >
                Llegaste hasta el final. Este espacio existe porque tú existes en él.
            </motion.p>
        </section>
    );
}

export default SobreTi;

