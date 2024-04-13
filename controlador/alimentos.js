import Servicio from '../servicio/alimentos.js'


class ControladorAlimentos {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia)
    }


    obtenerAlimentos = async (req, res) => {
        const { id } = req.params
        const alimentos = await this.servicio.obtenerAlimentos(id)
        res.json(alimentos)
    }

    traerUrl = async (req, res) => {
        const { nombreAlimento } = req.params
        const url = await this.servicio.traerUrl(nombreAlimento)
        res.json(url)
    }
 


    obtenerProteicosMayorA = async (req, res) => {
        const { valor } = req.params;
        const alimentos = await this.servicio.obtenerProteicosMayorA(valor);
        res.json(alimentos)
    }

    obtenerChMayorA = async (req, res) => {
        const { valor } = req.params;
        const alimentos = await this.servicio.obtenerChMayorA(valor);
        res.json(alimentos)
    }

    obtenerGrasasMayorA = async (req, res) => {
        const { valor } = req.params;
        const alimentos = await this.servicio.obtenerGrasasMayorA(valor);
        res.json(alimentos)
    }

    obtenerCaloriasDeAlimento = async (req, res) => {
        console.log("Hasta aca todo ok")
        const alimento = req.params.alimento;
        const cantidad = parseFloat(req.params.cantidad);
        const calorias = await this.servicio.obtenerCaloriasDeAlimento(alimento, cantidad);
        res.json(calorias)
    }

    obtenerCombinacion2 = async (req, res) => {
        try {
            console.log("Hasta aca todo ok")
            const primerAlim = req.params.alimento1;
            const segundoAlim = req.params.alimento2;
            const caloriasObjetivo = parseInt(req.params.calorias);
            console.log(primerAlim)
            console.log(segundoAlim)
            console.log(caloriasObjetivo)
            const cantidadesAlimentos = await this.servicio.obtenerCombinacion2(primerAlim, segundoAlim, caloriasObjetivo);
            res.json(cantidadesAlimentos)

        }
        catch (error) {
            res.json("Se produjo un error " +error);
        }


    }

    obtenerDistribuciones = async (req, res) => {
        console.log("Arrancamossss")
        console.log("Holaaa")
        const nombreAlim1 = req.query.alimento1;
        const nombreAlim2 = req.query.alimento2;
        const nombreAlim3 = req.query.alimento3;
        const nombreAlim4 = req.query.alimento4;
        const nombreAlim5 = req.query.alimento5;
        const nombreAlim6 = req.query.alimento6;
        const nombreAlim7 = req.query.alimento7;
        const totalProteinas = parseFloat(req.query.proteinas);
        const totalCarbohidratos = parseFloat(req.query.carbohidratos);
        const totalGrasas = parseFloat(req.query.grasas);
        const totalCalorias = parseFloat(req.query.calorias);
        let resultado;
        const unAlimentoSolo = nombreAlim1 != "" && nombreAlim2 == "" && nombreAlim3 ==""
        const dosAlimentos = nombreAlim1 != "" && nombreAlim2 != "" && nombreAlim3 ==""
        const tresAlimentos = nombreAlim1 != "" && nombreAlim2 != "" && nombreAlim3 !=""

        if(unAlimentoSolo) {
            resultado = "Solo uno"
        }
        if(dosAlimentos) {
            resultado = "Solo dos"
        }
        if(tresAlimentos) {
            resultado = "Hay tres"
        }
        

        const arrayAlimentos = await this.servicio.obtenerDistribuciones(nombreAlim1,nombreAlim2,nombreAlim3,nombreAlim4,nombreAlim5,nombreAlim6,nombreAlim7,totalProteinas,totalCarbohidratos,totalGrasas,totalCalorias);

        res.json(arrayAlimentos)
    }


    obtenerAleatorioGrasas = async (req, res) => {
        console.log("Empieza por aca")
        const aleatorio = await this.servicio.obtenerAleatorioGrasas()
        console.log("Termina bien por aca")
        res.json(aleatorio)
    }

    obtenerAleatorioCarbo = async (req, res) => {
        console.log("Empieza por aca")
        const aleatorio = await this.servicio.obtenerAleatorioCarbo()
        console.log("Termina bien por aca")
        res.json(aleatorio)
    }

    obtenerAleatorioProte = async (req, res) => {
        console.log("Empieza por aca")
        const aleatorio = await this.servicio.obtenerAleatorioProte()
        console.log("Termina bien por aca")
        res.json(aleatorio)
    }







}

export default ControladorAlimentos
