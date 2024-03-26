
import ModelMongoDB from "./alimentosMongoDB.js"

class ModelFactoryAlimentos {
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

export default ModelFactoryAlimentos