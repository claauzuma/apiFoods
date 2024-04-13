import express from 'express'
import ControladorComidas from '../controlador/comidas.js'

class Router {
    constructor(persistencia) {
        this.router = express.Router()
        this.controladorComidas = new ControladorComidas(persistencia)    
    }

    start() {
    this.router.get('/traerComida', this.controladorComidas.traerComida);
    


    return this.router
    }
}

export default Router
