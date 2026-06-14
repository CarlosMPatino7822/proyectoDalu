import Hero from "../components/hero/hero.jsx"
import Navbar from "../components/navbar/navbar.jsx"
import Highlights from "../components/highlights/highlights.jsx"
import Redes from "../components/redes/redes.jsx"
import Datos from "../components/datos/datos.jsx"
import Contacto from "../components/contacto/contacto.jsx"
import SecretNotification from "../components/notificacion/notificacion.jsx"

function App() {
  return (
    <>
      <SecretNotification></SecretNotification>
      <Navbar></Navbar>
      <Hero></Hero>
      <Highlights></Highlights>
      <Datos></Datos>
      <Redes></Redes>
      <Contacto></Contacto>
    </>
  )
}

export default App