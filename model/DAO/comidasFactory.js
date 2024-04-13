
import ModelMongoDB from "./comidasMongoDB.js"

class ModelFactoryComidas {
    static get(tipo) {
        switch (tipo) {
            
            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Persistiendo en Memoria (default) ****')
        
        }
    }
}

export default ModelFactoryComidas