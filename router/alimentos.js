import express from 'express'
import ControladorAlimentos from '../controlador/alimentos.js'

class Router {
    constructor(persistencia) {
        this.router = express.Router()
        this.controladorAlimentos = new ControladorAlimentos(persistencia)    
    }

    start() {
    
        this.router.get('/aleatoriograsas', this.controladorAlimentos.obtenerAleatorioGrasas);
        this.router.get('/aleatoriocarbo', this.controladorAlimentos.obtenerAleatorioCarbo);
        this.router.get('/aleatorioprote', this.controladorAlimentos.obtenerAleatorioProte);
        this.router.get('/distribuciones', this.controladorAlimentos.obtenerDistribuciones)
        this.router.get('/:id?', this.controladorAlimentos.obtenerAlimentos)
        this.router.get('/proteicos/:valor', this.controladorAlimentos.obtenerProteicosMayorA)
        this.router.get('/ch/:valor', this.controladorAlimentos.obtenerChMayorA)
        this.router.get('/grasas/:valor', this.controladorAlimentos.obtenerGrasasMayorA)
        this.router.get('/calorias/:alimento/:cantidad', this.controladorAlimentos.obtenerCaloriasDeAlimento)
        this.router.get('/combinacion-2alimentos/:alimento1/:alimento2/:calorias', this.controladorAlimentos.obtenerCombinacion2)
        
        
       

        return this.router
    }
}

export default Router
