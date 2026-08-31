import "./Puerta.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SecretContext } from "../../context/secretContext";
import { useNavigate } from "react-router-dom";
function Puerta() {
    const { secretosEncontrados } = useContext(SecretContext);
    const puertaRef = useRef(null);
    const [activarAnimacion, setActivarAnimacion] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (secretosEncontrados.length < 8) {
            setActivarAnimacion(false);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActivarAnimacion(true);
                }
            },
            {
                threshold: 0.45
            }
        );
        if (puertaRef.current) {
            observer.observe(puertaRef.current);
        }
        return () => observer.disconnect();
    }, [secretosEncontrados.length]);

    if (secretosEncontrados.length < 8) {
        return null;
    }

    return (
        <section className={`puerta ${activarAnimacion ? "active" : ""}`}
            ref={puertaRef}>
            <div className={`dark-overlay ${activarAnimacion ? "active" : ""}`}/>
            {activarAnimacion && (
                <div className="particles">
                    {[...Array(60)].map((_, i) => (
                        <span
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${8 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>
            )}
            {activarAnimacion && (
                <div className="stars">
                    {[...Array(8)].map((_, i) => (
                        <span
                            key={i}
                            className="big-star"
                            style={{
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`,
                                animationDelay: `${Math.random() * 4}s`
                            }}>
                            ✦
                        </span>
                    ))}
                </div>
            )}
            <h2>
                Has encontrado todos los secretos.
            </h2>
            <p>
                Pero todavía queda una última puerta.
            </p>
            <div className="portal-ring"></div>
            <button onClick={() => navigate("/portal-final")}>
                ✦ Entrar
            </button>
        </section>
    );
}
export default Puerta;
