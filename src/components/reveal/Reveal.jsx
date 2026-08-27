import { motion } from "framer-motion";

/**
 * Reveal
 * Envuelve cualquier sección/elemento y lo anima al entrar en viewport.
 * Reemplaza los "aparece de golpe" actuales por movimiento cinematográfico,
 * consistente en toda la web (facade + página real).
 *
 * Uso:
 *  <Reveal><h2>Datos</h2></Reveal>
 *  <Reveal delay={0.15} y={60}><div className="card" /></Reveal>
 *  <Reveal as="span" direction="left">Texto</Reveal>
 */
function Reveal({
    children,
    delay = 0,
    duration = 0.9,
    y = 40,
    x = 0,
    scale = 1,
    once = true,
    amount = 0.25,
    className = "",
    as = "div",
}) {
    const Tag = motion[as] || motion.div;

    return (
        <Tag
            className={className}
            initial={{ opacity: 0, y, x, scale }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once, amount }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // easeOutExpo — sensación "cinematográfica", sin rebote
            }}
        >
            {children}
        </Tag>
    );
}

export default Reveal;
