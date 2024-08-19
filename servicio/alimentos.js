//import ModelMem from '../model/DAO/productosMem.js'
//import ModelFile from '../model/DAO/productosFile.js'
import jsonwebtoken from 'jsonwebtoken';


import ModelFactoryAlimentos from "../model/DAO/alimentosFactory.js"




class Servicio {
    constructor(persistencia) {
        //this.model = new ModelMem()
        //this.model = new ModelFile()
        this.model = ModelFactoryAlimentos.get(persistencia)

    }

    obtenerAlimentos = async nombreAlimento => {
        const alimentos = await this.model.obtenerAlimentos()

        if (nombreAlimento) {
            console.log("EL NOMBRE DEL ALIMENTO ESSSSSSSSSSS : ")
            console.log(nombreAlimento)
            return alimentos.find(alimento => alimento.Alimentos == nombreAlimento)
        } else {
            return alimentos
        }
    }


    obtenerObjetoAlimentoConCantidades = async (nombreAlimento, cantidadAlimento) => {
        // Obtener el objeto alimento desde el modelo
        const alimentos = await this.model.obtenerAlimentos();
        const objetoAlimento = alimentos.find(alimento => alimento.Alimentos == nombreAlimento);
        console.log("Aca vemos al objeto alimento " + objetoAlimento)
        
        if (!objetoAlimento) {
            throw new Error(`Alimento ${nombreAlimento} no encontrado`);
        }
    
        // Clonar el objeto alimento para evitar modificar el original
        const objetoModificado = { ...objetoAlimento };
        
        // Modificar las propiedades basadas en la cantidad
        objetoModificado.Cantidad = cantidadAlimento;
        objetoModificado.Proteinas *= cantidadAlimento;
        objetoModificado.Carbohidratos *= cantidadAlimento;
        objetoModificado.Grasas *= cantidadAlimento;
        objetoModificado.Calorias *= cantidadAlimento;
    
        // Crear el objeto a devolver con las propiedades necesarias
        const objetoADevolver = {
            Nombre: objetoModificado.Alimentos,
            Cantidad: objetoModificado.Cantidad,
            Carbohidratos: objetoModificado.Carbohidratos,
            Proteinas: objetoModificado.Proteinas,
            Grasas: objetoModificado.Grasas,
            Calorias: objetoModificado.Calorias,
            Unidad: objetoModificado.Unidad
        };

        console.log(objetoADevolver)
    
        return objetoADevolver;
    }

    traerUrl = async nombreAlimento => {

        const alimentos = await this.obtenerAlimentos();
        const alimento = alimentos.find(alimento => alimento.Alimentos == nombreAlimento)
        const url = alimento.ImagenUrl;
        return url;
    }


    obtenerProteicosMayorA = async valor => {

        const alimentos = await this.obtenerAlimentos();
        const alimentosFiltrados = alimentos.filter(alimento => alimento.Proteinas > valor)
        return alimentosFiltrados;
    }

    obtenerChMayorA = async valor => {

        const alimentos = await this.obtenerAlimentos();
        const alimentosFiltrados = alimentos.filter(alimento => alimento.Carbohidratos > valor)
        return alimentosFiltrados;
    }

    obtenerGrasasMayorA = async valor => {

        const alimentos = await this.obtenerAlimentos();
        const alimentosFiltrados = alimentos.filter(alimento => alimento.Grasas > valor)
        return alimentosFiltrados;
    }

    obtenerCaloriasDeAlimento = async (alimento, cantidad) => {



        const alimentos = await this.obtenerAlimentos();


        const alimentoBuscado = alimentos.find(item => item.Alimentos === alimento); // Usamos find en lugar de filter


        if (alimentoBuscado) {
            const calorias = alimentoBuscado.Calorias * cantidad;
            return calorias;
        } else {
            throw new Error('El alimento especificado no se encontró en la base de datos');
        }
    };

    obtenerCombinacion2 = async (primerAlim, segundoAlim, calorias) => {


        const mitadCalorias = calorias / 2

        const alimentos = await this.obtenerAlimentos();

        const alimento1 = alimentos.find(item => item.Alimentos === primerAlim)
        const alimento2 = alimentos.find(item => item.Alimentos === segundoAlim)


        const arrayAlimentos = [alimento1, alimento2]
        const arrayCantidades = []

        for (let i = 0; i < arrayAlimentos.length; i++) {
            let cantidad = mitadCalorias / arrayAlimentos[i].Calorias;
            arrayCantidades.push(cantidad)


        }

        console.log(arrayCantidades[0])
        console.log(arrayCantidades[1])

        return arrayCantidades;
    }



    obtenerDistribuciones = async (
        nombreAlim1, 
        nombreAlim2, 
        nombreAlim3, 
        nombreAlim4, 
        nombreAlim5, 
        nombreAlim6, 
        nombreAlim7, 
        proteinas, 
        carbohidratos, 
        grasas, 
        calorias, 
        alimentoManual1, 
        cantidadManual1, 
        alimentoManual2, 
        cantidadManual2, 
        alimentoManual3, 
        cantidadManual3, 
        alimentoManual4, 
        cantidadManual4, 
        alimentoManual5, 
        cantidadManual5, 
        alimentoManual6, 
        cantidadManual6, 
        alimentoManual7, 
        cantidadManual7
    ) => {

        const idxProteinas = 0;
        const idxCarbohidratos = 1;
        const idxGrasas = 2;
        const arrayNombresAlimentos = [nombreAlim1, nombreAlim2, nombreAlim3, nombreAlim4, nombreAlim5, nombreAlim6, nombreAlim7]
        const arrayObjetosAlimentos = []
        const alimentos = await this.obtenerAlimentos();
        const arrayNombresFiltrado = arrayNombresAlimentos.filter(nombre => nombre !== '')

        arrayNombresFiltrado.forEach(nombre => {

            const objetoAlimento = alimentos.find(alimento => alimento.Alimentos === nombre)

            if (objetoAlimento != null) {



                if (objetoAlimento.Grasas >= objetoAlimento.Proteinas && objetoAlimento.Grasas > objetoAlimento.Carbohidratos) {
                    objetoAlimento.Fuente = "Grasas"
                }
                else if (objetoAlimento.Proteinas > objetoAlimento.Carbohidratos && objetoAlimento.Proteinas > objetoAlimento.Grasas) {
                    objetoAlimento.Fuente = "Proteinas"
                }
                else {
                    objetoAlimento.Fuente = "Carbohidratos"
                }



                arrayObjetosAlimentos.push(objetoAlimento)

            }

        });

        const listaAlimentosPorMacros = []
        for (let i = 0; i < 3; i++) {
            listaAlimentosPorMacros.push([])

        }

        arrayObjetosAlimentos.forEach(objetoAlimento => {

            if (objetoAlimento.Fuente == "Proteinas") {
                listaAlimentosPorMacros[idxProteinas].push(objetoAlimento)
            }
            if (objetoAlimento.Fuente == "Carbohidratos") {
                listaAlimentosPorMacros[idxCarbohidratos].push(objetoAlimento)
            }
            if (objetoAlimento.Fuente == "Grasas") {
                listaAlimentosPorMacros[idxGrasas].push(objetoAlimento)
            }

        });

        const arrayFinal = [[], [], [], []]

        let proteinasRestantes = proteinas;
        let carbohidratosRestantes = carbohidratos;
        let grasasRestantes = grasas;
        let arrayPorcentajes = []
        let totalPr = 0, totalCh = 0, totalGr = 0, totalCals = 0;

        let i = 0;
        while (i < listaAlimentosPorMacros.length) {

            let j = 0;
            while (j < listaAlimentosPorMacros[i].length) {

                let alimentoActual = listaAlimentosPorMacros[i][j]
                let cantidadAlimentosPorMacro = listaAlimentosPorMacros[i].length





                if (alimentoActual.Fuente == "Proteinas") {


                    if (j == 0) {
                        arrayPorcentajes = traerArrayPorcentajes(proteinas, cantidadAlimentosPorMacro)

                    }


                    let cantidadMacroAlimActual = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadMacroAlimActual / alimentoActual.Proteinas);
                    let objetoMacroProte = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4, "Unidad": alimentoActual.Unidad }
                    totalPr += alimentoActual.Proteinas * cantidadAlimento;
                    totalGr += alimentoActual.Grasas * cantidadAlimento;
                    totalCh += alimentoActual.Carbohidratos * cantidadAlimento;

                    //Actualizamos los carbohidratos y grasas restantes deacuerdo a las proteinas usasdas
                    carbohidratosRestantes = carbohidratosRestantes - (cantidadAlimento * alimentoActual.Carbohidratos)
                    grasasRestantes = grasasRestantes - (cantidadAlimento * alimentoActual.Grasas)


                    arrayFinal[i].push(objetoMacroProte)




                }
                else if (alimentoActual.Fuente == "Carbohidratos" && carbohidratosRestantes > 0) {


                    if (j == 0) {

                        arrayPorcentajes = traerArrayPorcentajes(carbohidratosRestantes, cantidadAlimentosPorMacro)

                    }


                    let cantidadACalcular = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadACalcular / alimentoActual.Carbohidratos);
                    let objetoMacroCarbo = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4, "Unidad": alimentoActual.Unidad }
                    totalPr += alimentoActual.Proteinas * cantidadAlimento;
                    totalGr += alimentoActual.Grasas * cantidadAlimento;
                    totalCh += alimentoActual.Carbohidratos * cantidadAlimento;


                    grasasRestantes = grasasRestantes - (cantidadAlimento * alimentoActual.Grasas)


                    arrayFinal[i].push(objetoMacroCarbo)

                }

                else if (alimentoActual.Fuente == "Grasas" && grasasRestantes > 0) {

                    if (j == 0) {

                        arrayPorcentajes = traerArrayPorcentajes(grasasRestantes, cantidadAlimentosPorMacro)

                    }

                    let cantidadACalcular = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadACalcular / alimentoActual.Grasas);
                    let objetoMacroGrasas = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4, "Unidad": alimentoActual.Unidad }
                    totalPr += alimentoActual.Proteinas * cantidadAlimento;
                    totalGr += alimentoActual.Grasas * cantidadAlimento;
                    totalCh += alimentoActual.Carbohidratos * cantidadAlimento;

                    arrayFinal[i].push(objetoMacroGrasas)
                }



                j++;


            }

            i++;

        }


        totalCals = totalPr * 4 + totalCh * 4 + totalGr * 9;

        arrayFinal[i].push({ "Proteinas": totalPr, "Carbohidratos": totalCh, "Grasas": totalGr, "Calorias": totalCals })
        const diferenciaLimite = 10;
        let ix = 0;

        while (ix < arrayFinal.length) {
            let jx = 0;


            while (jx < arrayFinal[ix].length) {

                console.log(arrayFinal[ix][jx].Nombre)
                console.log(arrayFinal[ix][jx].Cantidad)
                jx++;
            }
            ix++;
        }





        let diferenciaCalorica = totalCals - calorias

        let diferenciaProteica = totalPr - proteinas





        console.log("ANTES DE PASAR POR EL IF")
        console.log("Calorias pasadas por parametro" + calorias)
        console.log("Calorias totales de alimentos" + totalCals)

        console.log("diferencia calorias" + diferenciaCalorica)
        console.log(diferenciaCalorica >= diferenciaLimite)


        if (diferenciaCalorica >= diferenciaLimite) {
            console.log("Pasa por aca SIIIIIIIII")
            if (diferenciaProteica >= 2) {
                console.log("Actualizamos cantidad macro")
                actualizarCantidadMacro()
            }

            diferenciaProteica = proteinas - arrayFinal[3][0].Proteinas;
            if (diferenciaProteica < -2) {

            }

            actualizarArrayFinal();

            console.log("Ahora hay que equilibrar las calorías")

            equilibrarCalorias();



        }


        if (diferenciaCalorica * -1 >= diferenciaLimite) {

            if (diferenciaProteica >= 2) {
                console.log("Actualizamos cantidad macro")
                actualizarCantidadMacro()
            }

            diferenciaProteica = proteinas - arrayFinal[3][0].Proteinas;
            if (diferenciaProteica < -2) {

            }

            console.log("AHORA PAASA POR ACA GENIO")


            actualizarArrayFinal();
            console.log("Array actualizado")
            console.log("Proteinas " + arrayFinal[3][0].Proteinas)
            console.log("Carbo " + arrayFinal[3][0].Carbohidratos)
            console.log("Grasas " + arrayFinal[3][0].Grasas)

            console.log("AHORA PAASA POR ACA GENIO")
            console.log("Proteinas " + arrayFinal[idxProteinas].length)
            console.log("Carbo " + arrayFinal[idxCarbohidratos].length)
            console.log("Grasas " + arrayFinal[idxGrasas].length)


            let objetoAlimProteicos = arrayFinal[idxProteinas]
            let objetoAlimCarbos = arrayFinal[idxCarbohidratos]
            let objetoAlimGrasas = arrayFinal[idxGrasas]
            let objetoCantidades = arrayFinal[3][0]
            let proteYGrasas = objetoAlimProteicos.length > 0 && objetoAlimGrasas.length > 0 && objetoAlimCarbos.length == 0;
            let carboYGrasas = objetoAlimProteicos.length == 0 && objetoAlimGrasas.length > 0 && objetoAlimCarbos.length > 0;
            let proteYCarbos = objetoAlimProteicos.length > 0 && objetoAlimGrasas.length == 0 && objetoAlimCarbos.length > 0;
            let soloCarbos = objetoAlimProteicos.length == 0 && objetoAlimGrasas.length == 0 && objetoAlimCarbos.length > 0;;
            let soloGrasas = objetoAlimProteicos.length == 0 && objetoAlimGrasas.length > 0 && objetoAlimCarbos.length == 0;;
            let soloProteinas = objetoAlimProteicos.length > 0 && objetoAlimGrasas.length == 0 && objetoAlimCarbos.length == 0;;
            let caloriasRestantes = calorias - objetoCantidades.Calorias;
            console.log("Calorias pasadas por parametro " + calorias)

            console.log("Calorias totales de alimentos  " + objetoCantidades.Calorias)
            let faltanCalorias = caloriasRestantes >= 10


            ////Falta hacer metodo de traerArrayPorcentajes

            console.log("ProtesGrasas " + proteYGrasas)
            console.log("ProtesCarbos " + proteYCarbos)
            console.log("CarbosGrasas " + carboYGrasas)
            console.log("soloprote " + soloProteinas)
            console.log("solocarbos " + soloCarbos)
            console.log("solograsas " + soloGrasas)
            console.log(faltanCalorias)


            if (proteYGrasas && faltanCalorias) {
                console.log("Prote y grasas")
                console.log(caloriasRestantes)
                sumarEnMacros(caloriasRestantes, idxGrasas);

            }

            if (carboYGrasas && faltanCalorias) {
                console.log("carbo y grasas")
                console.log(caloriasRestantes)
                let caloriasDistri = caloriasRestantes / 2
                sumarEnMacros(caloriasDistri, idxCarbohidratos);
                sumarEnMacros(caloriasDistri, idxGrasas);

            }

            if (proteYCarbos && faltanCalorias) {
                console.log("Prote y carbos")
                console.log(caloriasRestantes)
                sumarEnMacros(caloriasRestantes, idxCarbohidratos);

            }


            if (soloProteinas && faltanCalorias) {
                console.log("Prote")
                sumarEnMacros(caloriasRestantes, idxProteinas);

            }

            if (soloGrasas && faltanCalorias) {
                console.log("Grasas")
                console.log(caloriasRestantes)
                sumarEnMacros(caloriasRestantes, idxGrasas);


            }

            if (soloCarbos && faltanCalorias) {
                console.log("Carbos")
                sumarEnMacros(caloriasRestantes, idxCarbohidratos);


            }

            actualizarArrayFinal();
            console.log("Ahora hay que equilibrar todo de vuelta")

            if (proteYCarbos && arrayFinal[3][0].Proteinas + 5 > proteinas) {
                console.log("Prote y carbos")
                acomodarMacros(idxProteinas, idxCarbohidratos)
            }

            if (proteYGrasas && arrayFinal[3][0].Proteinas + 5 > proteinas) {
                console.log("Prote y grasas modifiquemosss")
                acomodarMacros(idxProteinas, idxGrasas)
            }

            if (carboYGrasas) {
                console.log("Esta pasando por aca che")
            }

            ////Falta hacer metodo de traerArrayPorcentajes y probar si anda bien lo de arriba
            ///Debo fijarme si solo ponen grasas, proteinas o carbohidratos, tambien.
            ///Fijarme si puedo dejar en 0 si tengo algun alimento con 0 gramos.
            ///Ahora debo fijarme si las calorías estan bien todavía, si no , seguir modificando hasta que quede todo ok.
            ///Tambien debo fijarme si tengo mas de algun macronutriente que otro, y modificar si hace falta.



            ////

        }

        function equilibrarCalorias() {
        console.log("Hola equilibramos las caloriasss")
        }


        function compararEnArray(arrayFinal) {
            console.log("Empezamos a comparar en array")
            let i = 0;

            while (i < arrayObjetosAlimentos.length) {
                let idx = 0;

                let alimentoActual = arrayObjetosAlimentos[i];
                if(alimentoActual.Fuente == "Carbohidratos") {
                    idx = 1;
                }
                if(alimentoActual.Fuente == "Grasas") {
                    idx = 2;
                }

               let alimentoExistente = arrayFinal[idx].find(alimento => alimento.Nombre == alimentoActual.Alimentos)
               if(alimentoExistente === undefined) {
                console.log("undefined")
                console.log(alimentoActual.Alimentos)
                arrayFinal[idx].push(
                    {
                        "Nombre": alimentoActual.Alimentos,
                        "Cantidad":0,
                        "Carbohidratos": 0,
                        "Proteinas": 0,
                        "Grasas": 0,
                        "Calorias": 0,
                        "Unidad": alimentoActual.Fuente

                    }
                )
                
               }

             
             i++;

            }
        }



        function acomodarMacros(idxProteinas, idxOtroMacro) {
            let proteinasActuales = arrayFinal[3][0].Proteinas;
            let proteinasRest = proteinasActuales - proteinas;
            console.log(proteinasRest)
            let caloriasRest = proteinasRest * 4;
            console.log(caloriasRest)
            restarProteico(caloriasRest);
            console.log("Despues de restar las proteinas, queda asi" + arrayFinal[3][0].Calorias)
            sumarOtroMacro(idxOtroMacro, caloriasRest)
            actualizarArrayFinal();


        }

        function restarProteico(caloriasRest) {
            const idxProteMenosPura = buscarIdxMacrosMenosPuro(idxProteinas);
            console.log("Nombre " + arrayFinal[idxProteinas][idxProteMenosPura])
            let caloriasDeAlimentoPorUnidad = listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Calorias;
            let cantidadAlimASacar = caloriasRest / caloriasDeAlimentoPorUnidad; //Esto esta bien
            console.log("Cantidad de gramos o unid a sacar " + cantidadAlimASacar)
            arrayFinal[idxProteinas][idxProteMenosPura].Cantidad = arrayFinal[idxProteinas][idxProteMenosPura].Cantidad - cantidadAlimASacar;
            arrayFinal[idxProteinas][idxProteMenosPura].Proteinas = arrayFinal[idxProteinas][idxProteMenosPura].Cantidad * listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Proteinas;
            arrayFinal[idxProteinas][idxProteMenosPura].Carbohidratos = arrayFinal[idxProteinas][idxProteMenosPura].Cantidad * listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Carbohidratos;
            arrayFinal[idxProteinas][idxProteMenosPura].Grasas = arrayFinal[idxProteinas][idxProteMenosPura].Cantidad * listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Grasas;
            console.log("AHora actualizamos el array final")
            actualizarArrayFinal();



        }

        function sumarOtroMacro(idxOtroMacro, caloriasRest) {
            let cantidadAlim = arrayFinal[idxOtroMacro].length;
            console.log("Las calorias restantes para sumar en ch son " + caloriasRest)
            console.log(idxOtroMacro)
            let caloriasASumarPorAlimento = caloriasRest / cantidadAlim;

            let i = 0;
            while (i < cantidadAlim) {
                console.log("Alimento a sumar " + arrayFinal[idxOtroMacro][i].Nombre)
                let caloriasDeAlimentoPorUnidad = listaAlimentosPorMacros[idxOtroMacro][i].Calorias;
                console.log("Calorias por unidad " + caloriasDeAlimentoPorUnidad)
                let cantidadAlimASumar = caloriasASumarPorAlimento / caloriasDeAlimentoPorUnidad; //Esto esta bien
                console.log("CantidadAlimASumar " + cantidadAlimASumar)
                arrayFinal[idxOtroMacro][i].Cantidad = arrayFinal[idxOtroMacro][i].Cantidad + cantidadAlimASumar;
                console.log("Cantidad de alimento total" + arrayFinal[idxOtroMacro][i].Cantidad)
                arrayFinal[idxOtroMacro][i].Proteinas = arrayFinal[idxOtroMacro][i].Cantidad * listaAlimentosPorMacros[idxOtroMacro][i].Proteinas;
                arrayFinal[idxOtroMacro][i].Carbohidratos = arrayFinal[idxOtroMacro][i].Cantidad * listaAlimentosPorMacros[idxOtroMacro][i].Carbohidratos;
                arrayFinal[idxOtroMacro][i].Grasas = arrayFinal[idxOtroMacro][i].Cantidad * listaAlimentosPorMacros[idxOtroMacro][i].Grasas;
                console.log("AHora actualizamos el array final")


                i++;

            }
            actualizarArrayFinal();


        }



        function sumarEnMacros(caloriasRestantes, idxMacro) {
            let i = 0;
            let cantidadDeAlimentos = arrayFinal[idxMacro].length
            let arrayDePorcentajes = [];
            console.log("cantidad de alimentos por macro" + cantidadDeAlimentos)
            arrayDePorcentajes = damePorcentajesCaloricos(caloriasRestantes, cantidadDeAlimentos)
            console.log(arrayDePorcentajes)
            while (i < cantidadDeAlimentos) {
                const alimentoPorUnidad = listaAlimentosPorMacros[idxMacro][i];
                console.log(alimentoPorUnidad)
                let caloriasPorUnidad = alimentoPorUnidad.Calorias;
                console.log(alimentoPorUnidad.Calorias)
                let cantidadASumar = arrayDePorcentajes[i] / caloriasPorUnidad;
                console.log(arrayDePorcentajes[i])
                console.log(caloriasPorUnidad)
                console.log("Hay que sumar " + cantidadASumar)

                console.log("cantidad antes " + arrayFinal[idxMacro][i].Cantidad)
                arrayFinal[idxMacro][i].Cantidad = arrayFinal[idxMacro][i].Cantidad + cantidadASumar;
                console.log("cantidad despues " + arrayFinal[idxMacro][i].Cantidad)
                arrayFinal[idxMacro][i].Proteinas = arrayFinal[idxMacro][i].Cantidad * alimentoPorUnidad.Proteinas;
                arrayFinal[idxMacro][i].Carbohidratos = arrayFinal[idxMacro][i].Cantidad * alimentoPorUnidad.Carbohidratos;
                arrayFinal[idxMacro][i].Grasas = arrayFinal[idxMacro][i].Cantidad * alimentoPorUnidad.Grasas;
                arrayFinal[idxMacro][i].Calorias = arrayFinal[idxMacro][i].Proteinas * 4 + arrayFinal[idxMacro][i].Carbohidratos * 4 + arrayFinal[idxMacro][i].Grasas * 9
                i++;

            }

        }

        function damePorcentajesCaloricos(caloriasRestantes, cantidadAlimentos) {
            let arrayPorcentajes = [];
            let i = 0;
            let restante = caloriasRestantes;

            while (i < cantidadAlimentos) {

                let total;
                if (i + 1 === cantidadAlimentos) {
                    total = restante;
                } else {
                    total = Math.round(Math.random() * restante);
                    restante -= total;
                }
                arrayPorcentajes.push(total);
                i++;
            }


            return arrayPorcentajes;
        }



        function actualizarCantidadMacro() {
            const idxProteMenosPura = buscarIdxMacrosMenosPuro(idxProteinas); //Me devuelve el indice de un alimento
            console.log("Hasta aca tengo de proteina esto :" + arrayFinal[0][0].Proteinas)
            console.log(diferenciaCalorica)
            console.log(diferenciaProteica)


            const alimentoAModificar = arrayFinal[idxProteinas][idxProteMenosPura] //Tengo el alimento mas puro
            let caloriasDeAlimentoPorUnidad = listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Calorias;
            let cantidadASacarPorTodasCalorias = diferenciaCalorica / caloriasDeAlimentoPorUnidad; //Esto esta bien
            let cantidadASacarPorProteina = (diferenciaProteica * 4) / caloriasDeAlimentoPorUnidad
            console.log(cantidadASacarPorTodasCalorias)
            console.log(cantidadASacarPorProteina)

            if (cantidadASacarPorTodasCalorias > cantidadASacarPorProteina) {
                //Resto la cantidad de proteinas de diferencia entre proteinas

                restarProteinas(cantidadASacarPorProteina, alimentoAModificar, idxProteinas, idxProteMenosPura)

                let diferenciaDeCalorias = diferenciaCalorica - (diferenciaProteica * 4);

                restarCarbohidratos(diferenciaDeCalorias)
                console.log("Hasta aca tengo de proteina esto :" + arrayFinal[0][0].Proteinas)
            }


            else {
                console.log(cantidadASacarPorTodasCalorias)
                restarProteinas(cantidadASacarPorTodasCalorias, alimentoAModificar, idxProteinas, idxProteMenosPura)
                console.log("EY Hasta aca tengo de proteina esto :" + arrayFinal[0][0].Proteinas)
            }

        }


        function restarProteinas(cantidadASacarPorProteina, alimentoAModificar, idxMacro, idxMacroMenosPuro) {
            const alimentoPorUnidad = listaAlimentosPorMacros[idxMacro][idxMacroMenosPuro];




            let cantidadARestar = cantidadASacarPorProteina;
            console.log(alimentoAModificar.Cantidad - cantidadARestar)




            if (cantidadARestar > alimentoAModificar.Cantidad) {
                let cantidadAOtroAlimento = cantidadARestar - alimentoAModificar.Cantidad
                let caloriasAOtroAlimento = cantidadAOtroAlimento * alimentoPorUnidad.Calorias;
                cantidadARestar = alimentoAModificar.Cantidad;
                modificarOtroAlimento(caloriasAOtroAlimento, idxMacroMenosPuro, idxProteinas)

            }


            modificarAlimento(alimentoAModificar, alimentoPorUnidad, cantidadARestar)


        }


        function modificarOtroAlimento(caloriasAProcesar, idxQueNoVa, idxMacro) {



            let i = 0;
            while (i < listaAlimentosPorMacros[idxMacro].length && caloriasAProcesar > 0) {

                if (i != idxQueNoVa) {
                    let alimentoPorUnidad = listaAlimentosPorMacros[idxMacro][i]
                    let alimentoAModificar = arrayFinal[idxMacro][i]

                    if (alimentoAModificar.Calorias >= caloriasAProcesar) {
                        let cantidadDeEsteAlimento = caloriasAProcesar / alimentoPorUnidad.Calorias

                        modificarAlimento(alimentoAModificar, alimentoPorUnidad, cantidadDeEsteAlimento)
                        caloriasAProcesar = 0;

                    }
                    else {
                        caloriasAProcesar = caloriasAProcesar - alimentoAModificar.Calorias;
                    }

                }
                i++;

            }




        }






        function restarCarbohidratos(diferenciaDeCalorias) {

            let idxCarboMasPuro = buscarIdxMacrosMenosPuro(idxCarbohidratos);
            const alimentoPorUnidad = listaAlimentosPorMacros[idxCarbohidratos][idxCarboMasPuro];

            let cantidadAlimentoCarboASacar = diferenciaDeCalorias / alimentoPorUnidad.Calorias

            const alimentoEnArrayFinal = arrayFinal[idxCarbohidratos][idxCarboMasPuro]



            alimentoEnArrayFinal.Cantidad = alimentoEnArrayFinal.Cantidad - cantidadAlimentoCarboASacar;
            alimentoEnArrayFinal.Proteinas = alimentoPorUnidad.Proteinas * alimentoEnArrayFinal.Cantidad;
            alimentoEnArrayFinal.Carbohidratos = alimentoPorUnidad.Carbohidratos * alimentoEnArrayFinal.Cantidad;
            alimentoEnArrayFinal.Grasas = alimentoPorUnidad.Grasas * alimentoEnArrayFinal.Cantidad;
            alimentoEnArrayFinal.Calorias = alimentoEnArrayFinal.Carbohidratos * 4 + alimentoEnArrayFinal.Proteinas * 4 + alimentoEnArrayFinal.Grasas * 9;


        }


        function buscarIdxMacrosMenosPuro(idxMacro) {
            console.log(listaAlimentosPorMacros[idxMacro].length)
            let i = 0;
            let alimentoActual;
            let elMejorIndice;
            let grasasMasBajas = 1111101111;


            while (i < listaAlimentosPorMacros[idxMacro].length) {
                alimentoActual = listaAlimentosPorMacros[idxMacro][i];

                if (alimentoActual.Grasas < grasasMasBajas) {
                    grasasMasBajas = alimentoActual.Grasas;
                    elMejorIndice = i;
                }

                i++;


            }


            return elMejorIndice;
        }




        function traerArrayPorcentajes(cantidadMacros, cantidadAlimentosPorMacro) {
            let arrayADevolver = [];
            let arrayDePorcentajesReales = []

            let numeroAzar = Math.floor(Math.random() * 4);

            if (numeroAzar == 0 || numeroAzar == 1 || numeroAzar == 2) {

                if (cantidadAlimentosPorMacro == 1) {
                    arrayADevolver = [cantidadMacros]

                }
                if (cantidadAlimentosPorMacro == 2) {

                    arrayDePorcentajesReales = traerPorcentajesManual2()
                    pushearEnArray(arrayDePorcentajesReales, arrayADevolver, cantidadMacros)


                }
                if (cantidadAlimentosPorMacro == 3) {
                    arrayDePorcentajesReales = traerPorcentajesManual3()
                    pushearEnArray(arrayDePorcentajesReales, arrayADevolver, cantidadMacros)

                }
                if (cantidadAlimentosPorMacro == 4) {
                    arrayDePorcentajesReales = traerPorcentajesManual4()
                    pushearEnArray(arrayDePorcentajesReales, arrayADevolver, cantidadMacros)

                }

                if (cantidadAlimentosPorMacro == 5) {
                    arrayDePorcentajesReales = traerPorcentajesManual5()
                    pushearEnArray(arrayDePorcentajesReales, arrayADevolver, cantidadMacros)

                }


            }
            else {



                let i = 0;
                let restante = cantidadMacros;

                while (i < cantidadAlimentosPorMacro) {

                    let total;
                    if (i + 1 === cantidadAlimentosPorMacro) {
                        total = restante;
                    } else {
                        total = Math.round(Math.random() * restante);
                        restante -= total;
                    }
                    arrayADevolver.push(total);
                    i++;
                }
            }


            return arrayADevolver;
        }



        function actualizarArrayFinal() {
            let pr = 0;
            let ch = 0;
            let gr = 0;
            let cals = 0;
            let i = 0;
            let j;
            while (i < arrayFinal.length - 1) {
                j = 0;
                while (j < arrayFinal[i].length) {
                    let alimentoActual = arrayFinal[i][j]

                    pr += alimentoActual.Proteinas;
                    ch += alimentoActual.Carbohidratos;
                    gr += alimentoActual.Grasas;
                    cals += alimentoActual.Calorias;
                    j++;
                }
                i++;
            }

            arrayFinal[3][0].Proteinas = pr;
            arrayFinal[3][0].Carbohidratos = ch;
            arrayFinal[3][0].Grasas = gr;
            arrayFinal[3][0].Calorias = pr * 4 + ch * 4 + gr * 9;




        }



        function modificarAlimento(alimentoAModificar, alimentoPorUnidad, cantidadARestar) {

            alimentoAModificar.Cantidad = alimentoAModificar.Cantidad - cantidadARestar;

            alimentoAModificar.Proteinas = alimentoPorUnidad.Proteinas * alimentoAModificar.Cantidad;
            alimentoAModificar.Carbohidratos = alimentoPorUnidad.Carbohidratos * alimentoAModificar.Cantidad;
            alimentoAModificar.Grasas = alimentoPorUnidad.Grasas * alimentoAModificar.Cantidad;
            alimentoAModificar.Calorias = alimentoAModificar.Carbohidratos * 4 + alimentoAModificar.Proteinas * 4 + alimentoAModificar.Grasas * 9;


        }


        function pushearEnArray(arrayPorcentajesReales, array, cantidadMacro) {
            for (let index = 0; index < arrayPorcentajesReales.length; index++) {
                array.push(cantidadMacro * arrayPorcentajesReales[index])

            }


        }


        function traerPorcentajesManual2() {
            let array = [];
            let combinaciones = [
                [0.1, 0.9],
                [0.2, 0.8],
                [0.3, 0.7],
                [0.4, 0.6],
                [0.5, 0.5],
                [0.6, 0.4],
                [0.7, 0.3],
                [0.8, 0.2],
                [0.9, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }

        function traerPorcentajesManual3() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.8],
                [0.1, 0.2, 0.7],
                [0.1, 0.3, 0.6],
                [0.1, 0.4, 0.5],
                [0.1, 0.5, 0.4],
                [0.1, 0.6, 0.3],
                [0.1, 0.7, 0.2],
                [0.1, 0.8, 0.1],
                [0.2, 0.1, 0.7],
                [0.2, 0.2, 0.6],
                [0.2, 0.3, 0.5],
                [0.2, 0.4, 0.4],
                [0.2, 0.5, 0.3],
                [0.2, 0.6, 0.2],
                [0.2, 0.7, 0.1],
                [0.3, 0.1, 0.6],
                [0.3, 0.2, 0.5],
                [0.3, 0.3, 0.4],
                [0.3, 0.4, 0.3],
                [0.3, 0.5, 0.2],
                [0.3, 0.6, 0.1],
                [0.4, 0.1, 0.5],
                [0.4, 0.2, 0.4],
                [0.4, 0.3, 0.3],
                [0.4, 0.4, 0.2],
                [0.4, 0.5, 0.1],
                [0.5, 0.1, 0.4],
                [0.5, 0.2, 0.3],
                [0.5, 0.3, 0.2],
                [0.5, 0.4, 0.1],
                [0.6, 0.1, 0.3],
                [0.6, 0.2, 0.2],
                [0.6, 0.3, 0.1],
                [0.7, 0.1, 0.2],
                [0.7, 0.2, 0.1],
                [0.8, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }


        function traerPorcentajesManual4() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.1, 0.7],
                [0.1, 0.1, 0.2, 0.6],
                [0.1, 0.1, 0.3, 0.5],
                [0.1, 0.1, 0.4, 0.4],
                [0.1, 0.1, 0.5, 0.3],
                [0.1, 0.1, 0.6, 0.2],
                [0.1, 0.1, 0.7, 0.1],
                [0.1, 0.2, 0.2, 0.5],
                [0.1, 0.2, 0.3, 0.4],
                [0.1, 0.2, 0.4, 0.3],
                [0.1, 0.2, 0.5, 0.2],
                [0.1, 0.2, 0.6, 0.1],
                [0.1, 0.3, 0.3, 0.3],
                [0.1, 0.3, 0.4, 0.2],
                [0.1, 0.3, 0.5, 0.1],
                [0.1, 0.4, 0.4, 0.1],
                [0.1, 0.4, 0.3, 0.2],
                [0.1, 0.5, 0.2, 0.2],
                [0.1, 0.6, 0.2, 0.1],
                [0.2, 0.2, 0.2, 0.4],
                [0.2, 0.2, 0.3, 0.3],
                [0.2, 0.2, 0.4, 0.2],
                [0.2, 0.2, 0.5, 0.1],
                [0.2, 0.3, 0.3, 0.2],
                [0.2, 0.3, 0.2, 0.3],
                [0.2, 0.3, 0.4, 0.1],
                [0.2, 0.4, 0.2, 0.2],
                [0.2, 0.4, 0.3, 0.1],
                [0.2, 0.5, 0.1, 0.2],
                [0.3, 0.3, 0.3, 0.1],
                [0.3, 0.3, 0.2, 0.2],
                [0.3, 0.4, 0.1, 0.2],
                [0.3, 0.2, 0.4, 0.1],
                [0.4, 0.4, 0.1, 0.1],
                [0.4, 0.3, 0.2, 0.1],
                [0.4, 0.2, 0.3, 0.1],
                [0.5, 0.2, 0.2, 0.1],
                [0.6, 0.2, 0.1, 0.1],
                [0.7, 0.1, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }


        function traerPorcentajesManual5() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.1, 0.1, 0.6],
                [0.1, 0.1, 0.1, 0.2, 0.5],
                [0.1, 0.1, 0.1, 0.3, 0.4],
                [0.1, 0.1, 0.1, 0.4, 0.3],
                [0.1, 0.1, 0.1, 0.5, 0.2],
                [0.1, 0.1, 0.1, 0.6, 0.1],
                [0.1, 0.1, 0.2, 0.2, 0.4],
                [0.1, 0.1, 0.2, 0.3, 0.3],
                [0.1, 0.1, 0.2, 0.4, 0.2],
                [0.1, 0.1, 0.2, 0.5, 0.1],
                [0.1, 0.1, 0.3, 0.3, 0.2],
                [0.1, 0.1, 0.3, 0.4, 0.1],
                [0.1, 0.1, 0.4, 0.3, 0.1],
                [0.1, 0.2, 0.2, 0.2, 0.3],
                [0.1, 0.2, 0.2, 0.3, 0.2],
                [0.1, 0.2, 0.3, 0.3, 0.1],
                [0.1, 0.3, 0.3, 0.2, 0.1],
                [0.1, 0.4, 0.2, 0.2, 0.1],
                [0.1, 0.5, 0.2, 0.1, 0.1],
                [0.2, 0.2, 0.2, 0.2, 0.2],
                [0.2, 0.2, 0.2, 0.3, 0.1],
                [0.2, 0.2, 0.3, 0.2, 0.1],
                [0.2, 0.3, 0.3, 0.1, 0.1],
                [0.2, 0.4, 0.2, 0.1, 0.1],
                [0.3, 0.3, 0.2, 0.1, 0.1],
                [0.3, 0.2, 0.3, 0.1, 0.1],
                [0.4, 0.2, 0.2, 0.1, 0.1],
                [0.5, 0.2, 0.1, 0.1, 0.1],
                [0.6, 0.1, 0.1, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }


        function hayAlimentosCantidadManual()  {
            console.log("VERIFICAMOS SI HAY ALIMENTOS CON CANTIDAD MANUAL ")
            let hay = false;
            if(cantidadManual1 > 0 || 
                cantidadManual2 > 0 || 
                cantidadManual3 > 0 || 
                cantidadManual4 > 0 || 
                cantidadManual5 > 0 || 
                cantidadManual6 > 0 || 
                cantidadManual7 > 0) {
                    hay = true
                }
    
            return hay;
        };



    compararEnArray(arrayFinal)



    if(hayAlimentosCantidadManual()) {

     ////Ejecutamos la lógica para devolver un array con las cantidades que el usuario nos pasa en cantidad Manual     
     console.log("El array final es + " )
     console.log(JSON.stringify(arrayFinal, null, 2));

     console.log("Y los alimentos manuales son : ")


     console.log(alimentoManual1+ "" + alimentoManual2 + "" + alimentoManual3)

     let arrayDeCantidadesManuales = [[],[],[]];
     await this.agregarEnArrayDeCantidadesManuales(arrayDeCantidadesManuales,alimentoManual1,alimentoManual2,alimentoManual3,alimentoManual4,alimentoManual5,alimentoManual6,alimentoManual7,cantidadManual1,
       cantidadManual2,cantidadManual3,cantidadManual4,cantidadManual5,cantidadManual6,cantidadManual7
    );
    
    console.log("Vamos a mostrar el array de cantidades manuales : ")

    console.log(JSON.stringify(arrayDeCantidadesManuales, null, 2));


     let arrayFinalModificado = [[],[],[],[]]
     arrayFinalModificado = await this.compararArrays(arrayFinal,arrayDeCantidadesManuales)
 

    
    

     console.log("VAMOS A VER COMO QUEDA EL ARRAY FINAL MODIFICADO")
     console.log(JSON.stringify(arrayFinalModificado, null, 2)); 
     
     return arrayFinalModificado;

    } 
    console.log("VAMOS A VER COMO QUEDA EL ARRAY FINAL")
    console.log(JSON.stringify(arrayFinal, null, 2)); 
 
        return arrayFinal;



    };


    compararArrays = async (arrayFinal, arrayDeCantidadesManuales) => {
        let arrayFinalModificado = [[],[],[],[]];
        let caloriasPorMacro = [];
        let caloriasTotalesPorMacro = 0;

      ////Primero crearmos el array de calorias totales por macro, del arrayFinal. Las calorias totales que hay en el array final
        let a = 0;
        while( a < 3) {
            let b = 0;
            while (b < arrayFinal[a].length) {
                caloriasTotalesPorMacro += arrayFinal[a][b].Calorias;
                
                b++;

            }
            //Cuando termina de recorrer todo el indice de alimentos de macronutriente, se setea el array
            caloriasPorMacro[a] = caloriasTotalesPorMacro;
            caloriasTotalesPorMacro = 0;
            a++;

        }

        console.log("VAAAMOS A VER EL ARRAY DE MACROSSS POR CANTIDAD TOTAL")
        console.log(caloriasPorMacro);
    
        // Copiar el contenido de arrayFinal a arrayFinalModificado
        for (let i = 0; i < arrayFinal.length; i++) {
            arrayFinalModificado[i] = [...arrayFinal[i]];
        }

        let x = 0;
        while (x < arrayFinalModificado.length-1) {
            let y = 0;
            while (y < arrayFinalModificado[x].length) {
                arrayFinalModificado[x][y].amodificar = false;
                y++; // Incrementar y para evitar un bucle infinito
            }
            x++; // Incrementar x para evitar un bucle infinito
        }




        // Recorrer y copiar el contenido de arrayDeCantidadesManuales a arrayFinalModificado
        for (let h = 0; h < 3; h++) {
            console.log("VUELTA DEL FOR NUMERO " + h)
            if (arrayDeCantidadesManuales[h].length > 0 && arrayDeCantidadesManuales[h].length < arrayFinalModificado[h].length) {
         

                ///Si el alimento de cantidades manuales es igual al alimento del array final, hacemos el cambio

                for (let j = 0; j < arrayDeCantidadesManuales[h].length; j++) {

                    for (let k = 0; k < arrayFinalModificado[h].length; k++) {


                    // Reemplazar en arrayFinalModificado los objetos correspondientes
                    console.log("ENTRAAAAAAAAAA LA COMPARACION PARA EL TRUE OR FALSEE")
                    console.log(arrayDeCantidadesManuales[h][j].Nombre);
                    console.log(arrayFinalModificado[h][k].Nombre);


                    if(arrayFinal[h][k].Nombre != arrayDeCantidadesManuales[h][j].Nombre) {
                    arrayFinalModificado[h][k].amodificar = true }

                    if(arrayFinal[h][k].Nombre == arrayDeCantidadesManuales[h][j].Nombre) {
                        console.log("SON IGUALES ASI QE PROCEDEMOS A HACER EL CAMBIO")
    
                    arrayFinalModificado[h][k] = arrayDeCantidadesManuales[h][j];
                    
                    caloriasPorMacro[h]-= arrayFinalModificado[h][k].Calorias;
                    arrayFinalModificado[h][k].amodificar = false; 

                } 
                    //Aca quedarian solo las calorias restantes por macro
                    //Ejemplo [500],[100],[20]
                  }




                }
            }

            console.log("Sale del for")
        }

 

        
        
        let i = 0;
        arrayFinalModificado[3][0].Proteinas = 0;
        arrayFinalModificado[3][0].Carbohidratos = 0;
        arrayFinalModificado[3][0].Grasas = 0;
        arrayFinalModificado[3][0].Calorias = 0;
        while(i < 3) {
            let j= 0;
            while (j < arrayFinalModificado[i].length) {
                console.log("Arrancamos por " + arrayFinalModificado[i][j].Nombre)
                arrayFinalModificado[3][0].Proteinas += arrayFinalModificado[i][j].Proteinas
                arrayFinalModificado[3][0].Carbohidratos += arrayFinalModificado[i][j].Carbohidratos
                arrayFinalModificado[3][0].Grasas += arrayFinalModificado[i][j].Grasas
                arrayFinalModificado[3][0].Calorias += arrayFinalModificado[i][j].Calorias
                console.log("Las proteinas luego del primer macro son " + arrayFinalModificado[3][0].Proteinas)
                console.log("lOS CH luego del primer macro son " + arrayFinalModificado[3][0].Carbohidratos)
                console.log("Las gr luego del primer macro son " + arrayFinalModificado[3][0].Grasas)
                console.log("Vuelta numero " + i+1)

           j++;
            }
         i++;

        }  

        console.log("Array final sin modificar del todo TRUE OR FALSEEE A VEEEEEEEEEEEEEEEER")
        console.log(JSON.stringify(arrayFinalModificado, null, 2));


            ///HASTA ACA VA TODO BIEN, HAY QUE VER EL REPARTO DE CALORIAS



         i = 0;


         function traerPorcentajesManual2() {
            let array = [];
            let combinaciones = [
                [0.1, 0.9],
                [0.2, 0.8],
                [0.3, 0.7],
                [0.4, 0.6],
                [0.5, 0.5],
                [0.6, 0.4],
                [0.7, 0.3],
                [0.8, 0.2],
                [0.9, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }

        function traerPorcentajesManual3() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.8],
                [0.1, 0.2, 0.7],
                [0.1, 0.3, 0.6],
                [0.1, 0.4, 0.5],
                [0.1, 0.5, 0.4],
                [0.1, 0.6, 0.3],
                [0.1, 0.7, 0.2],
                [0.1, 0.8, 0.1],
                [0.2, 0.1, 0.7],
                [0.2, 0.2, 0.6],
                [0.2, 0.3, 0.5],
                [0.2, 0.4, 0.4],
                [0.2, 0.5, 0.3],
                [0.2, 0.6, 0.2],
                [0.2, 0.7, 0.1],
                [0.3, 0.1, 0.6],
                [0.3, 0.2, 0.5],
                [0.3, 0.3, 0.4],
                [0.3, 0.4, 0.3],
                [0.3, 0.5, 0.2],
                [0.3, 0.6, 0.1],
                [0.4, 0.1, 0.5],
                [0.4, 0.2, 0.4],
                [0.4, 0.3, 0.3],
                [0.4, 0.4, 0.2],
                [0.4, 0.5, 0.1],
                [0.5, 0.1, 0.4],
                [0.5, 0.2, 0.3],
                [0.5, 0.3, 0.2],
                [0.5, 0.4, 0.1],
                [0.6, 0.1, 0.3],
                [0.6, 0.2, 0.2],
                [0.6, 0.3, 0.1],
                [0.7, 0.1, 0.2],
                [0.7, 0.2, 0.1],
                [0.8, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }


        function traerPorcentajesManual4() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.1, 0.7],
                [0.1, 0.1, 0.2, 0.6],
                [0.1, 0.1, 0.3, 0.5],
                [0.1, 0.1, 0.4, 0.4],
                [0.1, 0.1, 0.5, 0.3],
                [0.1, 0.1, 0.6, 0.2],
                [0.1, 0.1, 0.7, 0.1],
                [0.1, 0.2, 0.2, 0.5],
                [0.1, 0.2, 0.3, 0.4],
                [0.1, 0.2, 0.4, 0.3],
                [0.1, 0.2, 0.5, 0.2],
                [0.1, 0.2, 0.6, 0.1],
                [0.1, 0.3, 0.3, 0.3],
                [0.1, 0.3, 0.4, 0.2],
                [0.1, 0.3, 0.5, 0.1],
                [0.1, 0.4, 0.4, 0.1],
                [0.1, 0.4, 0.3, 0.2],
                [0.1, 0.5, 0.2, 0.2],
                [0.1, 0.6, 0.2, 0.1],
                [0.2, 0.2, 0.2, 0.4],
                [0.2, 0.2, 0.3, 0.3],
                [0.2, 0.2, 0.4, 0.2],
                [0.2, 0.2, 0.5, 0.1],
                [0.2, 0.3, 0.3, 0.2],
                [0.2, 0.3, 0.2, 0.3],
                [0.2, 0.3, 0.4, 0.1],
                [0.2, 0.4, 0.2, 0.2],
                [0.2, 0.4, 0.3, 0.1],
                [0.2, 0.5, 0.1, 0.2],
                [0.3, 0.3, 0.3, 0.1],
                [0.3, 0.3, 0.2, 0.2],
                [0.3, 0.4, 0.1, 0.2],
                [0.3, 0.2, 0.4, 0.1],
                [0.4, 0.4, 0.1, 0.1],
                [0.4, 0.3, 0.2, 0.1],
                [0.4, 0.2, 0.3, 0.1],
                [0.5, 0.2, 0.2, 0.1],
                [0.6, 0.2, 0.1, 0.1],
                [0.7, 0.1, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }


        function traerPorcentajesManual5() {
            let array = [];
            let combinaciones = [
                [0.1, 0.1, 0.1, 0.1, 0.6],
                [0.1, 0.1, 0.1, 0.2, 0.5],
                [0.1, 0.1, 0.1, 0.3, 0.4],
                [0.1, 0.1, 0.1, 0.4, 0.3],
                [0.1, 0.1, 0.1, 0.5, 0.2],
                [0.1, 0.1, 0.1, 0.6, 0.1],
                [0.1, 0.1, 0.2, 0.2, 0.4],
                [0.1, 0.1, 0.2, 0.3, 0.3],
                [0.1, 0.1, 0.2, 0.4, 0.2],
                [0.1, 0.1, 0.2, 0.5, 0.1],
                [0.1, 0.1, 0.3, 0.3, 0.2],
                [0.1, 0.1, 0.3, 0.4, 0.1],
                [0.1, 0.1, 0.4, 0.3, 0.1],
                [0.1, 0.2, 0.2, 0.2, 0.3],
                [0.1, 0.2, 0.2, 0.3, 0.2],
                [0.1, 0.2, 0.3, 0.3, 0.1],
                [0.1, 0.3, 0.3, 0.2, 0.1],
                [0.1, 0.4, 0.2, 0.2, 0.1],
                [0.1, 0.5, 0.2, 0.1, 0.1],
                [0.2, 0.2, 0.2, 0.2, 0.2],
                [0.2, 0.2, 0.2, 0.3, 0.1],
                [0.2, 0.2, 0.3, 0.2, 0.1],
                [0.2, 0.3, 0.3, 0.1, 0.1],
                [0.2, 0.4, 0.2, 0.1, 0.1],
                [0.3, 0.3, 0.2, 0.1, 0.1],
                [0.3, 0.2, 0.3, 0.1, 0.1],
                [0.4, 0.2, 0.2, 0.1, 0.1],
                [0.5, 0.2, 0.1, 0.1, 0.1],
                [0.6, 0.1, 0.1, 0.1, 0.1]
            ];
        
            let azar = Math.floor(Math.random() * combinaciones.length);
            array = combinaciones[azar];
        
            return array;
        }

        while (i < 3) {
          ///vemos cuantos alimentos a modificar hay en cada macro
          let cantidadAModificar = arrayFinalModificado[i].filter(alimento => alimento.amodificar === true).length;
          if(cantidadAModificar > 0)
             {
          let arrayDePorcentajes = [1];

          if(cantidadAModificar == 2) {
            arrayDePorcentajes = traerPorcentajesManual2();
          }
          if(cantidadAModificar == 3) {
            arrayDePorcentajes = traerPorcentajesManual3();
          }
          if(cantidadAModificar == 4) {
            arrayDePorcentajes = traerPorcentajesManual4();
          }

          if(cantidadAModificar == 5) {
            arrayDePorcentajes = traerPorcentajesManual5();
          }
         console.log("EL ARRAY DE PORCENTAJES ES " + arrayDePorcentajes)
           
           let cantModif = 0;
            let j = 0; 
            while (j < arrayFinalModificado[i].length) {
                let alimentoAModificar = arrayFinalModificado[i][j];

                if (alimentoAModificar.amodificar === true) {
                    console.log("");
                   ///Calculamos el total de calorias para ese alimento: 

                   let totalCaloricoAPasar = caloriasPorMacro[i] * arrayDePorcentajes[cantModif];
                   console.log("Las calorias a pasar son de " + totalCaloricoAPasar + " al alimento  "+ alimentoAModificar.Nombre);

                    alimentoAModificar = await this.generarNuevaCantidad(alimentoAModificar, totalCaloricoAPasar);
                    arrayFinalModificado[i][j] = alimentoAModificar; // Asegúrate de que el cambio se guarde en el array
                    cantModif++;
                }
                j++; // Incrementa j para avanzar al siguiente elemento en el array
            }

        }
            i++; // Incrementa i para avanzar al siguiente subarray
         
    }




    let m = 0;
    arrayFinalModificado[3][0].Proteinas = 0;
    arrayFinalModificado[3][0].Carbohidratos = 0;
    arrayFinalModificado[3][0].Grasas = 0;
    arrayFinalModificado[3][0].Calorias = 0;
    while(m < 3) {
        let j= 0;
        while (j < arrayFinalModificado[m].length) {
            console.log("Arrancamos por " + arrayFinalModificado[m][j].Nombre)
            arrayFinalModificado[3][0].Proteinas += arrayFinalModificado[m][j].Proteinas
            arrayFinalModificado[3][0].Carbohidratos += arrayFinalModificado[m][j].Carbohidratos
            arrayFinalModificado[3][0].Grasas += arrayFinalModificado[m][j].Grasas
            arrayFinalModificado[3][0].Calorias += arrayFinalModificado[m][j].Calorias

       j++;
        }
     m++;

    }  

    console.log("LAS CALORIAS TOTALES DEL ARRAY FINAL MODIFICADO SON ")
    console.log(arrayFinalModificado[3][0]);
    
   


        return arrayFinalModificado;
    }

    generarNuevaCantidad = async (alimentoAModificar, caloriasACubrir) => {
        console.log("El alimento a modificar es " + alimentoAModificar.Nombre)
        console.log("Las calorias a cubrir son " + caloriasACubrir)
    
        let objetoAlimento = await this.obtenerAlimentos(alimentoAModificar.Nombre);
        let protesAPasar = 0;
        let carbosAPasar = 0;
        let grasasAPasar = 0;
        let cantidadAPasar = 0;

        cantidadAPasar = caloriasACubrir / objetoAlimento.Calorias;
        protesAPasar = objetoAlimento.Proteinas * cantidadAPasar;
        carbosAPasar = objetoAlimento.Carbohidratos * cantidadAPasar;
        grasasAPasar = objetoAlimento.Grasas * cantidadAPasar;
     
        alimentoAModificar.Proteinas = protesAPasar;
        alimentoAModificar.Carbohidratos = carbosAPasar;
        alimentoAModificar.Grasas = grasasAPasar;
        alimentoAModificar.Cantidad = cantidadAPasar;
        alimentoAModificar.Calorias = protesAPasar*4 + carbosAPasar*4+ grasasAPasar*9;

        console.log("La cantidad del alimento a modificar es de " + alimentoAModificar.Cantidad)

        return alimentoAModificar;

    }

    agregarEnArrayDeCantidadesManuales = async (arrayDeCantidadesManuales,
        alimentoManual1, alimentoManual2, alimentoManual3, alimentoManual4, 
        alimentoManual5, alimentoManual6, alimentoManual7, 
        cantidadManual1, cantidadManual2, cantidadManual3, 
        cantidadManual4, cantidadManual5, cantidadManual6, cantidadManual7
    ) => {
        console.log("ENTRAMOS EN AGREGAR EN ARRAY DE CANTIDADES MANUALESSSSSSSSSSSSSSSSSS");
        console.log(alimentoManual1);
    
        // Crear un array con los alimentos manuales
        const alimentosManuales = [
            alimentoManual1, alimentoManual2, alimentoManual3, 
            alimentoManual4, alimentoManual5, alimentoManual6, 
            alimentoManual7
        ];

        const cantidadesManuales = [
            cantidadManual1, cantidadManual2, cantidadManual3, 
            cantidadManual4, cantidadManual5, cantidadManual6, 
            cantidadManual7
        ];
    
        // Calcular la cantidad de veces que los alimentos no son vacíos
        const cantidadARecorrer = alimentosManuales.filter(alimento => alimento !== "").length;
        console.log("Cantidad a recorrer " + cantidadARecorrer)

        const idxProte = 0;
        const idxCarbo = 1;
        const idxGrasas = 2;
    
        let i = 0;
        while (i < cantidadARecorrer) {
            let alimentoConCantidad = await this.obtenerObjetoAlimentoConCantidades(alimentosManuales[i],cantidadesManuales[i]);
            console.log("Alimento con cantidad " + alimentoConCantidad.Nombre)
            let objetoAlimento = await this.obtenerAlimentos(alimentosManuales[i])
            console.log("Objeto alimento" + objetoAlimento.Alimentos)
    
            if (objetoAlimento.Grasas >= objetoAlimento.Proteinas && objetoAlimento.Grasas > objetoAlimento.Carbohidratos) {
                arrayDeCantidadesManuales[idxGrasas].push(alimentoConCantidad)
            } else if (objetoAlimento.Proteinas > objetoAlimento.Carbohidratos && objetoAlimento.Proteinas > objetoAlimento.Grasas) {
                arrayDeCantidadesManuales[idxProte].push(alimentoConCantidad)
            } else {
                arrayDeCantidadesManuales[idxCarbo].push(alimentoConCantidad)
            }
    
    
            i++;
        }

        console.log("Vemos la cantidad de alimentos que hay en el array de cantidad manuales")
        console.log(arrayDeCantidadesManuales[0].length)
        console.log(arrayDeCantidadesManuales[1].length)
        console.log(arrayDeCantidadesManuales[2].length)
     
        console.log("Salimos del metodo")
    
        return arrayDeCantidadesManuales;
    }

    



 

    obtenerAleatorioGrasas = async () => {
        let alimentos = await this.obtenerAlimentos();
        let alimentosGrasas = alimentos.filter(alimento => alimento.Grasas > alimento.Carbohidratos && alimento.Grasas > alimento.Proteinas)
        let largo = alimentosGrasas.length;
        let numeroAleatorio = Math.floor(Math.random() * largo);
        return alimentosGrasas[numeroAleatorio]

    };

    obtenerAleatorioCarbo = async () => {
        let alimentos = await this.obtenerAlimentos();
        let alimentosGrasas = alimentos.filter(alimento => alimento.Carbohidratos > alimento.Grasas && alimento.Carbohidratos > alimento.Proteinas)
        let largo = alimentosGrasas.length;
        let numeroAleatorio = Math.floor(Math.random() * largo);
        return alimentosGrasas[numeroAleatorio]

    };

    obtenerAleatorioProte = async () => {
        let alimentos = await this.obtenerAlimentos();
        let alimentosGrasas = alimentos.filter(alimento => alimento.Proteinas > alimento.Carbohidratos && alimento.Proteinas > alimento.Grasas)
        let largo = alimentosGrasas.length;
        let numeroAleatorio = Math.floor(Math.random() * largo);
        return alimentosGrasas[numeroAleatorio]

    };










}

export default Servicio