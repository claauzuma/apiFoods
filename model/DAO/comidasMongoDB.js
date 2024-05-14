import { ObjectId } from "mongodb"
import CnxMongoDB from "../DBMongo.js"

class ModelMongoDB {
    obtenerComidas = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const comida = await CnxMongoDB.db.collection("comidas").findOne({_id: new ObjectId(id)})
            return comida
        }
        else {
            const comidas = await CnxMongoDB.db.collection("comidas").find({}).toArray()
            return comidas
        }
    }

    
}

export default ModelMongoDB