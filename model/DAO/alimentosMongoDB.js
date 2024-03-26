import { ObjectId } from "mongodb"
import CnxMongoDB from "../DBMongo.js"

class ModelMongoDB {
    obtenerAlimentos = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const alimento = await CnxMongoDB.db.collection('fooddatabase').findOne({_id: new ObjectId(id)})
            return alimento
        }
        else {
            const alimentos = await CnxMongoDB.db.collection('fooddatabase').find({}).toArray()
            return alimentos
        }
    }

    
}

export default ModelMongoDB