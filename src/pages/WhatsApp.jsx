import "./WhatsApp.css";
import { useContext, useEffect, useState } from "react";
import { SecretContext } from "../context/secretContext";

function WhatsApp() {

    const { desbloquearSecreto } = useContext(SecretContext);
    const [mostrarPista, setMostrarPista] = useState(false);
    const [fase, setFase] = useState(0);
    const avanzarSecreto = () => {

        if (fase === 0) {

            setFase(1);

        } else if (fase === 1) {

            desbloquearSecreto("whatsapp");

            setFase(2);

        }

    };
    useEffect(() => {

        const timer = setTimeout(() => {

            setMostrarPista(true);

        }, 8000);

        return () => clearTimeout(timer);

    }, []);
    return (

        <section className="whatsapp-page">

            <h1>
                No.
            </h1>
            <p>Por razones de seguridad,
                esta información no está disponible.</p>
            <p>
                <br />
                Nunca tendrás su WhatsApp.
            </p>

            <span>:)</span>

            <p
                className={`hidden-message ${mostrarPista ? "visible" : ""}`}
                onClick={avanzarSecreto}
            >

                {fase === 0 &&
                    "Algunas conversaciones nunca llegan por WhatsApp."
                }

                {fase === 1 &&
                    "No todas las respuestas están aquí."
                }

                {fase === 2 &&
                    "✦ Letra descubierta: L"
                }

            </p>
        </section>

    );

}

export default WhatsApp;