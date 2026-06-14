import { createContext, useState, useEffect } from "react";
export const SecretContext = createContext();
const letrasSecretas = {
    logo: "E",
    mensaje: "S",
    hover: "T",
    scroll: "R",
    fecha: "E",
    whatsapp: "L",
    secreto7: "L",
    secreto8: "A"
};
export function SecretProvider({ children }) {
    const [mensaje, setMensaje] = useState("");
    const [secretosEncontrados, setSecretosEncontrados] = useState(() => {
        const guardados = localStorage.getItem("secretos");
        return guardados
            ? JSON.parse(guardados)
            : [];
    });
    useEffect(() => {
        localStorage.setItem(
            "secretos",
            JSON.stringify(secretosEncontrados)
        );
    }, [secretosEncontrados]);

    const desbloquearSecreto = (id) => {
        if (!secretosEncontrados.includes(id)) {
            setSecretosEncontrados([
                ...secretosEncontrados,
                id
            ]);
        }
        setMensaje(`✦ Secreto descubierto: ${letrasSecretas[id]}`);
        setTimeout(() => {

            setMensaje("");

        }, 3000);
    };
    const palabraOculta = Object.keys(letrasSecretas).map((id) => {

        return secretosEncontrados.includes(id)
            ? letrasSecretas[id]
            : "_";

    });
    return (
        <SecretContext.Provider value={{
            secretosEncontrados,
            desbloquearSecreto,
            mensaje,
            palabraOculta
        }}>
            {children}
        </SecretContext.Provider>
    );
}