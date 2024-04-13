
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
        if (tipoComida == "") {
            let comidas =  await this.model.obtenerComidas()
            let objetosAlimentos = await this.modelAlimentos.obtenerAlimentos();

            let idxAleatorio = Math.floor(Math.random() * comidas.length);
            let comida = comidas[idxAleatorio];
            return comida;




        } else {
            const nombreComidas = await this.model.obtenerComidas();
            
            let objetosAlimentos = await this.modelAlimentos.obtenerAlimentos();
            let arrayObjetoComidas = [];
            nombreComidas[0].forEach(nombre => {
                let alimentoAPushear = objetosAlimentos.find(alimento => alimento.Alimentos == nombre)
                arrayObjetoComidas.push(alimentoAPushear)
                
            });

            return comida;
        }
    }

}
export default Servicio