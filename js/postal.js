/**
 * @description Clase principal de la aplicacion
 * @file app.js
 * @license GPL3 
 * @author Manuel Solís Gómez(masogo008@gmail.com)
 */
 'use strict'
 /**
  * Clase encargada de controlar los efectos de la pagina web
  */
 class App
 {
    /**
     * Constructor encargado de inicializar la vista, el modelo y el evento de inicio
     */
    constructor()
    {
        this.vista = new Vista(this);
        this.modelo = new Modelo();
        window.onload = this.iniciar.bind(this);
    }
     /**
      * Metodo encargado de poner en funcionamiento los metodos que no necesitan al usuario y se inician nada más cargar la pagina
      * Tambien se encarga de colocar los eventos que podra usar el usuario si lo busca
      */
    iniciar()
    {
        this.vista.cambiarImagen(this.modelo.fondoSeleccionado);
        this.vista.centrarPantalla(document.getElementsByTagName('main')[0]);
        this.vista.colocarFrase(this.modelo.de,this.modelo.para);
    }
 }
 /**
  * Clase encargada de la parte visual del programa
  */
 class Vista
 {
    /**
     * Constructor encargado de colocar los atributos necesarios de la vista
     */
    constructor(controlador)
    {
        this.controlador = controlador;
        this.imagen=document.getElementsByTagName('img')[0];
        this.frase=document.getElementsByTagName('p')[0];
    }
    /**
     * Metodo encargado de centrar vertical y horizontalemente un elemento en su contenedor
     * 
     * @param {elementoHTML} contenedor Elemento que contiene al alemento a centrar
     * @param {elementoHTML} elemento Elemento a centrar
     */
     centrarPantalla(elemento)
    {
        elemento.style.top = (window.screen.height/2)-(elemento.clientHeight/2) + 'px'; 
        elemento.style.left = (window.screen.width/2)-(elemento.clientWidth/2)  + 'px';
    }
    /**
     * Metodo encargado de cambiar la postal por defecto a la seleccionada 
     * @param {URL} ruta 
     */
    cambiarImagen(ruta)
    {
        this.imagen.attributes.src.textContent = '../'+ruta;
    }
    colocarFrase(de,para)
    {
        console.log(this.frase.childNodes[0].textContent);
        console.log(this.controlador.modelo.frase);
    }
 }
 /**
  * Clase encargada de los datos del programa 
  */
 class Modelo
 {
    /**
     * Constructor usado para inicializar los atributos que usaremos
     * Tambien llama a metodos para rellenar algunos atributos
     */
    constructor()
    {
        this.cargarJson('../recursos/archivos/datosFrases.json');
        this.tipoFrase=this.valorGet('tf');
        this.numeroFrase=this.valorGet('nf');
        this.fondoSeleccionado=this.valorGet('fondo');
        this.plantillaSeleccionada=this.valorGet('plan');
        this.de=this.valorGet('de');
        this.para=this.valorGet('para');
        this.frase=null;
        setTimeout(this.obtenerFrase,500);
    }
    /**
     * Metodo encargado de pasar el objeto de un atributo estatico a un atributo
     */
    pasarDatosFrases()
    {
        console.log(Object.keys(Modelo.datosAsincronos));
    }
    /**
     * Metodo usado para abrir un archivo json y guardarla en un atributo estatico 
     * @param {URL} ruta Ruta donde se encuentra el archivo json 
     */
    cargarJson(ruta)
    {
        fetch(ruta)
        .then(respuesta => respuesta.json())
        .then(function(objeto)
        {
            Modelo.datosAsincronos=objeto;
            console.log(Modelo.datosAsincronos);
        })
        .catch(error => console.log('hemos tenido el error '+error));

        setTimeout(this.pasarDatosFrases, 500);
    }
    /**
     * Metodo usado para devolver los valores de un determinado parametro pasado por el get
     * @param {String} nombreParametro nombre del parametro en el get 
     * @returns Valor de parametro 
     */
    valorGet(nombreParametro) 
    {
        nombreParametro = nombreParametro.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + nombreParametro + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    /**
     * Metodo que se encargada de trabajar con el json y los parametros del numero de frase y en tipo de frase para obtener la frase correspondiente
     */
    obtenerFrase()
    {
        let arrayTipos= '';
        console.log(Modelo.datosAsincronos); 
        arrayTipos = Object.keys(Modelo.datosAsincronos);

        let tipo = arrayTipos[aplicacion.modelo.tipoFrase]; //usar el tipo para elegir que array sera

        let arrayTipoEspecifico = null; //preguntar como corregir esto para que se obtenga en el modelo y que sea uno al azar

        for (let tiposFrases in Modelo.datosAsincronos) 
        {
            if (tiposFrases == tipo) 
            {
                arrayTipoEspecifico = Modelo.datosAsincronos[tiposFrases];
            }
        }
        aplicacion.modelo.frase=arrayTipoEspecifico[aplicacion.modelo.numeroFrase];
    }
 }
 Modelo.datosAsincronos;
 let aplicacion = new App();