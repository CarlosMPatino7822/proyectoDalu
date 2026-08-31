import { createPortal } from "react-dom";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function CursorLuciernaga() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.4 });

    useEffect(() => {
        const mover = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener("mousemove", mover, { passive: true });
        return () => window.removeEventListener("mousemove", mover);
    }, [x, y]);

    return createPortal(
        <motion.div className="cursor-luciernaga" style={{ x: sx, y: sy }} aria-hidden="true" />,
        document.body
    );
}

export default CursorLuciernaga;

