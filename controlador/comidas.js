import Servicio from '../servicio/comidas.js'


class ControladorComidas {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }


    traerComida = async (req, res) => {
        const nombreAlim1 = req.query.alimento1;
        const nombreAlim2 = req.query.alimento2;
        const nombreAlim3 = req.query.alimento3;
        const nombreAlim4 = req.query.alimento4;
        const tipoComida = req.query.tipoComida;
        
        console.log(tipoComida)
        console.log(nombreAlim1)
        console.log(nombreAlim2)
        console.log(nombreAlim3)
        console.log(nombreAlim4)

        if(nombreAlim2 == "") {
            console.log("El alimento 2 esta vacio")
        }

        const comida = await this.servicio.traerComida(tipoComida,nombreAlim1,nombreAlim2,nombreAlim3,nombreAlim4)
        res.json(comida)
    }






}

export default ControladorComidas
