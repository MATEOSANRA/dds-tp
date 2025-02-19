// Se configura la pagina de inicio, pero tmb su boton que nos permite navegar
// Creo q aca se pone la parte de arriba
import { Link } from "react-router-dom";
function Inicio() {
    return (
      <div className="mt-4 p-5 rounded" style={{ backgroundColor: "lightgray" }}>
        <h1>Clubes 2024</h1>
        <p>Este ejemplo está desarrollado con las siguientes tecnologías:</p>
        <p>
          Backend: NodeJs, Express , WebApiRest, Swagger, Sequelize, Sqlite
          múltiples capas en Javascript.
        </p>
        <p>
          Frontend: Single Page Application, HTML, CSS, Bootstrap, Javascript, NodeJs y React.
        </p>
        <Link to="/carnetsfamilias" className="btn btn-lg btn-primary">
          <i className="fa fa-search"> </i>  Ver Carnets Familias
</Link>

      </div>
    );
  }
  export { Inicio };
  