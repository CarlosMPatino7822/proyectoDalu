import "./notificacion.css";
import { useContext } from "react";
import { SecretContext } from "../../context/secretContext";

function SecretNotification(){

    const { mensaje } = useContext(SecretContext);

    if(!mensaje) return null;

    return(

        <div className="secret-notification">

            {mensaje}

        </div>

    );
}

export default SecretNotification;