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

    obtenerAlimentos = async id => {
        if (id) {
            return await this.model.obtenerAlimentos(id)
        } else {
            const alimentos = await this.model.obtenerAlimentos(id)
            return alimentos
        }
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
        console.log("Hasta aquí todo bien")
        console.log(alimento); // Me trae bien el alimento por parámetro
        console.log(cantidad); // Me trae bien la cantidad por parámetro

        const alimentos = await this.obtenerAlimentos();
        console.log(alimentos[0]); // Aquí me llega bien el alimento en esa posición

        const alimentoBuscado = alimentos.find(item => item.Alimentos === alimento); // Usamos find en lugar de filter
        console.log(alimentoBuscado); // Imprimimos el alimento buscado

        if (alimentorBuscado) {
            const calorias = alimentoBuscado.Calorias * cantidad;
            return calorias;
        } else {
            throw new Error('El alimento especificado no se encontró en la base de datos');
        }
    };

    obtenerCombinacion2 = async (primerAlim, segundoAlim, calorias) => {

        console.log("Vamos con la capa de servicio")
        console.log(primerAlim)
        console.log(segundoAlim)
        console.log(calorias)

        const mitadCalorias = calorias / 2
        console.log(mitadCalorias)

        const alimentos = await this.obtenerAlimentos();

        const alimento1 = alimentos.find(item => item.Alimentos === primerAlim)
        console.log(alimento1.Alimentos)
        const alimento2 = alimentos.find(item => item.Alimentos === segundoAlim)
        console.log(alimento2.Alimentos)


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


    obtenerDistribuciones = async (nombreAlim1, nombreAlim2, nombreAlim3, nombreAlim4, nombreAlim5, nombreAlim6, nombreAlim7, proteinas, carbohidratos, grasas, calorias) => {
        console.log("Hasta aquí todo bien")
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
                console.log(objetoAlimento.Alimentos)


                if (objetoAlimento.Grasas >= objetoAlimento.Proteinas && objetoAlimento.Grasas > objetoAlimento.Carbohidratos) {
                    objetoAlimento.Fuente = "Grasas"
                }
                else if (objetoAlimento.Proteinas > objetoAlimento.Carbohidratos && objetoAlimento.Proteinas > objetoAlimento.Grasas) {
                    objetoAlimento.Fuente = "Proteinas"
                }
                else {
                    objetoAlimento.Fuente = "Carbohidratos"
                }

                console.log(objetoAlimento.Fuente)


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
                    console.log("Hola soy proteina")

                    if (j == 0) {
                        arrayPorcentajes = traerArrayPorcentajes(proteinas, cantidadAlimentosPorMacro)

                    }


                    let cantidadMacroAlimActual = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadMacroAlimActual / alimentoActual.Proteinas);
                    let objetoMacroProte = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4, "Unidad" : alimentoActual.Unidad }
                    totalPr += alimentoActual.Proteinas * cantidadAlimento;
                    totalGr += alimentoActual.Grasas * cantidadAlimento;
                    totalCh += alimentoActual.Carbohidratos * cantidadAlimento;
                
                    //Actualizamos los carbohidratos y grasas restantes deacuerdo a las proteinas usasdas
                    carbohidratosRestantes = carbohidratosRestantes - (cantidadAlimento * alimentoActual.Carbohidratos)
                    grasasRestantes = grasasRestantes - (cantidadAlimento * alimentoActual.Grasas)


                    arrayFinal[i].push(objetoMacroProte)




                }
                else if (alimentoActual.Fuente == "Carbohidratos" && carbohidratosRestantes > 0) {
                    console.log("Hola soy carbo")

                    if (j == 0) {
                        console.log("Por aca paso solo una vez")
                        arrayPorcentajes = traerArrayPorcentajes(carbohidratosRestantes, cantidadAlimentosPorMacro)

                    }


                    let cantidadACalcular = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadACalcular / alimentoActual.Carbohidratos);
                    let objetoMacroCarbo = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4, "Unidad" : alimentoActual.Unidad }
                    totalPr += alimentoActual.Proteinas * cantidadAlimento;
                    totalGr += alimentoActual.Grasas * cantidadAlimento;
                    totalCh += alimentoActual.Carbohidratos * cantidadAlimento;
              

                    grasasRestantes = grasasRestantes - (cantidadAlimento * alimentoActual.Grasas)


                    arrayFinal[i].push(objetoMacroCarbo)

                }

                else if (alimentoActual.Fuente == "Grasas" && grasasRestantes > 0) {
                    console.log("Grasas")
                    if (j == 0) {
                        console.log("Por aca paso solo una vez")
                        arrayPorcentajes = traerArrayPorcentajes(grasasRestantes, cantidadAlimentosPorMacro)

                    }

                    let cantidadACalcular = arrayPorcentajes[j]
                    let cantidadAlimento = Math.round(cantidadACalcular / alimentoActual.Grasas);
                    let objetoMacroGrasas = { "Nombre": alimentoActual.Alimentos, "Cantidad": cantidadAlimento, "Carbohidratos": alimentoActual.Carbohidratos * cantidadAlimento, "Proteinas": alimentoActual.Proteinas * cantidadAlimento, "Grasas": alimentoActual.Grasas * cantidadAlimento, "Calorias": (alimentoActual.Proteinas * cantidadAlimento) * 4 + (alimentoActual.Grasas * cantidadAlimento) * 9 + (alimentoActual.Carbohidratos * cantidadAlimento) * 4,  "Unidad" : alimentoActual.Unidad }
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

        console.log("Van los alimentoss");
        let ix = 0;

        while (ix < arrayFinal.length) {
            let jx = 0;
            console.log("Cambiamos de macronutriente")

            while (jx < arrayFinal[ix].length) {
                console.log("Alimento")
                console.log(arrayFinal[ix][jx].Nombre)
                console.log(arrayFinal[ix][jx].Cantidad)
                jx++;
            }
            ix++;
        }






        const diferenciaCalorica = totalCals - calorias

        const diferenciaProteica = totalPr - proteinas

        console.log("A ver")
        console.log(diferenciaCalorica)
        console.log(diferenciaProteica)


        console.log("La diferencia calorica es de " + diferenciaCalorica)

        if (diferenciaCalorica >= diferenciaLimite) {
            if (diferenciaProteica > 3) {
                actualizarCantidadMacro()

            } 

            //Ahora debo fijarme cual es el excedente de calorías y equiparar
            //Tambien debo saber cuantas calorías faltan y de que son.




           //Por ultimo actualizamos array
            actualizarArrayFinal();

        }



        function actualizarCantidadMacro() {
            const idxProteMenosPura = buscarIdxMacrosMenosPuro(idxProteinas); //Me devuelve el indice de un alimento
            console.log("A ver")
            console.log(diferenciaCalorica)
            console.log(diferenciaProteica)


            const alimentoAModificar = arrayFinal[idxProteinas][idxProteMenosPura] //Tengo el alimento mas puro
            let caloriasDeAlimentoPorUnidad = listaAlimentosPorMacros[idxProteinas][idxProteMenosPura].Calorias;
            let cantidadASacarPorTodasCalorias = diferenciaCalorica / caloriasDeAlimentoPorUnidad; //Esto esta bien
            let cantidadASacarPorProteina = (diferenciaProteica * 4) / caloriasDeAlimentoPorUnidad
            console.log("Aca se viene la cuenta")
            console.log(cantidadASacarPorTodasCalorias)
            console.log(cantidadASacarPorProteina)

            if (cantidadASacarPorTodasCalorias > cantidadASacarPorProteina) {
                //Resto la cantidad de proteinas de diferencia entre proteinas

                restarProteinas(cantidadASacarPorProteina, alimentoAModificar, idxProteinas, idxProteMenosPura)

                let diferenciaDeCalorias = diferenciaCalorica - (diferenciaProteica * 4);

                restarCarbohidratos(diferenciaDeCalorias)
            }


            else {
                console.log("Viene por acaaaaaaaaaaaaaaaaaaa")
                console.log(cantidadASacarPorTodasCalorias)
                restarProteinas(cantidadASacarPorTodasCalorias, alimentoAModificar, idxProteinas, idxProteMenosPura)
            }

        }


        function restarProteinas(cantidadASacarPorProteina, alimentoAModificar, idxMacro, idxMacroMenosPuro) {
            const alimentoPorUnidad = listaAlimentosPorMacros[idxMacro][idxMacroMenosPuro];




            let cantidadARestar = cantidadASacarPorProteina;

            console.log("ACA VIENE LA MAGIA PAPAAAA")
            console.log("Esta es la cantidad de antes " + alimentoAModificar.Cantidad)
            console.log("Esta es la cantidad a restar " + cantidadARestar)
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
            console.log("HOLAAAAAA MCFLY")
            let arrayADevolver = [];
            let arrayDePorcentajesReales = []

            let numeroAzar = Math.floor(Math.random() * 4);
            console.log("EL NUMERO AL AZAR ES " + numeroAzar)

            if (numeroAzar == 0 || numeroAzar == 1 || numeroAzar == 2) {
                console.log("SALIO NUMERO AL AZAR PARA PORCENTAJES MANUALESSSSS")
                console.log(cantidadAlimentosPorMacro)

                if (cantidadAlimentosPorMacro == 1) {
                    arrayADevolver = [cantidadMacros]

                }
                if (cantidadAlimentosPorMacro == 2) {
                    console.log("Y SON DOS ALIMENTOSS, VAMOS CON LOS METODOS")
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
            let azar = Math.floor(Math.random() * 7);
            console.log("Salio el numero " + azar)
            if (azar == 0 || azar == 1) {
            array = [0.2, 0.8]

            }

            if (azar == 2) {
                array = [0.5, 0.5]

            }
            if (azar == 3) {
                array = [0.4, 0.6]

            }
            if (azar == 4) {
                array = [0.3, 0.7]

            }
            if (azar == 5) {
                array = [0.6, 0.4]

            }
            if (azar == 6) {
                array = [0.7, 0.3]

            }

            console.log("Retornamos el array : " +array[0] +"" + array[1])

            return array;
        }






        return arrayFinal;



    };










}

export default Servicio