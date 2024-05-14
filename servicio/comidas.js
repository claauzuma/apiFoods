
import ModelFactoryComidas from "../model/DAO/comidasFactory.js"
import ModelFactoryAlimentos from "../model/DAO/alimentosFactory.js"


class Servicio {
    constructor(persistencia) {
        //this.model = new ModelMem()
        //this.model = new ModelFile()
        this.model = ModelFactoryComidas.get(persistencia)
        this.modelAlimentos = ModelFactoryAlimentos.get(persistencia)

    }

    traerComida = async (tipoComida,alimento1,alimento2,alimento3,alimento4) => {

        let tipo = "";
        if(tipoComida =="Almuerzo" || tipoComida =="Cena") {
            tipo = "almuerzocena";
        }
        if(tipoComida =="Desayuno" || tipoComida =="Merienda") {
            tipo = "desayunomerienda";
        }

        if (alimento1 == "" && alimento2 =="" && alimento3 == "" && alimento4 =="") {
            console.log(alimento1)
 
            let comidas =  await this.model.obtenerComidas()

            let idxAleatorio = Math.floor(Math.random() * comidas.length);
            let comida = comidas[idxAleatorio];
    
            
            return comida;
            
            }

            ///ACA QUIERO DEVOLVER LA COMIDA QUE SALE PERO NO SOLO LOS NOMBRES, SI NO UNA COMIDA QUE TENGA COMO ATRIBUTOS
            ///LOS OBJETOS COMIDA



            return "Hola";




        }
    }

export default Servicio