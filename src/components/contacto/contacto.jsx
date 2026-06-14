import "./contacto.css";
import { SecretContext } from "../../context/secretContext";
import { useContext, useState } from "react";

function Contacto() {
    const [mensaje, setMensaje] = useState("");

    const { desbloquearSecreto } = useContext(SecretContext);
    const revisarMensaje = () => {
    const texto = mensaje.toLowerCase().trim();

    if (texto === "las estrellas recuerdan") {

        desbloquearSecreto("mensaje");

    }

}
    return (

        <section
            className="contacto"
            id="contacto"
        >

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
                    placeholder="Escribe aquí..."
                />

                <button onClick={revisarMensaje}>
                    Enviar
                </button>

            </div>

        </section>

    )
}

export default Contacto;