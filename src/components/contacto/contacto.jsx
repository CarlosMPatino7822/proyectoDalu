import "./contacto.css";
import { SecretContext } from "../../context/secretContext";
import { useContext, useState, useEffect } from "react";
function Contacto() {
    const [mensaje, setMensaje] = useState("");
    const [mostrarEstrella, setMostrarEstrella] = useState(false);
    const [placeholderActual, setPlaceholderActual] = useState(0);
    const {
        setMensaje: setNotificacion
    } = useContext(SecretContext);
    const [escapes, setEscapes] = useState(0);
    const [posicion, setPosicion] = useState({
        x: 180,
        y: 80
    });
    const pistas = [
        "Escribe aquí...",
        "Escribe aquí...",
        "Algunas palabras tienen más peso que otras...",
        "Escribe aquí...",
        "Escribe aquí...",
        "No todas las frases abren puertas...",
        "Escribe aquí...",
        "Escribe aquí...",
        "Las respuestas suelen encontrarse en...",
        "Escribe aquí...",
        "Escribe aquí...",
        "ellas ______",
        "Escribe aquí...",
        "Escribe aquí...",
        "Hay recuerdos que nunca desaparecen...",
        "Escribe aquí...",
        "Escribe aquí...",
        "A ver solo es copiar y pegar -_-"
    ];
    const mensajes = [
        "No.",
        "Casi.",
        "Más cerca.",
        "Ahora sí.",
        "Deberias ver tu cara.",
        "Podría hacer esto todo el dia.",
        "Muajajajaja."
    ];
    useEffect(() => {
        const detectarScroll = () => {
            const scrollMax =
                document.documentElement.scrollHeight -
                window.innerHeight;
            if (window.scrollY >= scrollMax - 50) {
                setMostrarEstrella(true);
            }
        };
        window.addEventListener(
            "scroll",
            detectarScroll
        );
        return () =>
            window.removeEventListener(
                "scroll",
                detectarScroll
            );
    }, []);
    const { desbloquearSecreto } = useContext(SecretContext);
    const revisarMensaje = () => {
        const texto = mensaje.toLowerCase().trim();
        if (texto === "ellas siempre recuerdan") {
            desbloquearSecreto("mensaje");
            setMensaje("");
            return;
        }
        if (
            texto.includes("recuerdan") ||
            texto.includes("ellas") ||
            texto.includes("siempre")
        ) {
            setNotificacion("✦ Estás cerca.");
            setTimeout(() => {
                setNotificacion("");
            }, 3000);
        }
    }
    const moverEstrella = () => {
        if (escapes >= 7) return;
        const distancia = 200 + escapes * 150;
        setPosicion({
            x: Math.random() * distancia,
            y: Math.random() * (distancia / 2)
        });
        setEscapes(prev => prev + 1);
    };
    useEffect(() => {
        const intervalo = setInterval(() => {
            setPlaceholderActual(prev =>
                (prev + 1) % pistas.length
            );
        }, 4000);
        return () => clearInterval(intervalo);
    }, []);
    return (
        <section
            className="contacto"
            id="contacto">
            <div className="section-title">
                <p>CONVERSACIÓN</p>
                <h2>Contacto</h2>
            </div>
            <div className="contact-box">
                <h3>
                    ¿Quieres dejar un mensaje?
                </h3>
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder={pistas[placeholderActual]}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            if(revisarMensaje()){
                                placeholder = "Escribe aqui..."
                            }
                            setMensaje("");
                        }
                    }}/>
                <button onClick={revisarMensaje}>
                    Enviar
                </button>
            </div>
            {mostrarEstrella && (
                <div className="star-container">
                    <div
                        className="star-group"
                        style={{
                            left: `${posicion.x}px`,
                            top: `${posicion.y}px`
                        }}>
                        <div
                            className="secret-star"
                            onMouseEnter={moverEstrella}
                            onClick={() => {
                                if (escapes >= 7) {
                                    desbloquearSecreto("secreto7");
                                }
                            }}>
                            ✦
                        </div>
                        {escapes > 0 && escapes <= 7 && (
                            <p className="star-message">
                                {mensajes[escapes - 1]}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
export default Contacto;