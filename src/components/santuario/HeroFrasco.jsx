import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FrascoReal from "../../assets/images/frasco-real.webp";
import { easeCine } from "./santuarioConfig";
import ContadorDias from "./ContadorDias";
import Mariposas from "./Mariposas";

function HeroFrasco() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const yTexto = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const escalaImg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

    return (
        <section className="s-hero" id="inicio" ref={ref}>
            <div className="s-hero-frame">
                <motion.img
                    src={FrascoReal}
                    alt="Frasco de recuerdos con luces y polaroids"
                    className="s-hero-img"
                    style={{ scale: escalaImg }}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.6, ease: easeCine }}
                />
                <div className="s-hero-degradado" />
                <div className="s-hero-vineta-inferior" />

                <motion.div className="s-hero-text" style={{ y: yTexto, opacity: opacidad }}>
                    <ContadorDias />
                    <motion.p
                        className="s-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: easeCine }}
                    >
                        Hecho con cariño, para alguien especial.
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.5, duration: 1, ease: easeCine }}
                    >
                        Proyecto
                        <span>Dalu <i>♡</i></span>
                    </motion.h1>
                    <motion.p
                        className="s-sub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.9, ease: easeCine }}
                    >
                        Cada recuerdo, cada sonrisa, cada momento... guardados aquí.
                    </motion.p>
                    <motion.div
                        className="s-cta-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.9, ease: easeCine }}
                    >
                        <a href="#recuerdos" className="s-btn s-btn-primary">
                            ✦ Comenzar
                        </a>
                        <a href="#momentos" className="s-btn s-btn-ghost">
                            ▷ Ver recuerdos
                        </a>
                    </motion.div>
                </motion.div>

                <Mariposas cantidad={7} />

                <motion.div
                    className="s-scroll-hint"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    ⌄
                </motion.div>
            </div>
        </section>
    );
}

export default HeroFrasco;

