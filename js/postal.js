/**
 * @description Clase principal de la aplicacion
 * @file postal.js
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
        this.vista = new Vista();
        this.modelo = new Modelo();
        window.onload = this.iniciar.bind(this);
        this.vista.cambiarImagen(this.modelo.fondoSeleccionado); //llamamos al metodo antes de que se coloque la frase para tomar bien la medida de la postal
        document.getElementsByTagName('button')[0].onclick = this.copiarPostal.bind(this);
    }
    /**
     * Metodo encargado de poner en funcionamiento el programa una vez que ya se han acabado las llamadas asincronas
     */
    iniciar()
    {
        setTimeout(this.motrarCargado,800,this);
    }
    /**
     * Metodo encargado de copiar la ruta en el portapapeles
     */
    copiarPostal()
    {
        let aux = document.createElement("input");
        aux.setAttribute("value",window.location.href);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);

        this.vista.alerta('🤖: Ya lo tienes copiado, ahora compartelo :D ');
    }
    /**
     * Metodo encargado de personalizar la postal como el editor lo pidio
     * @param {object} contructor 
     */
    motrarCargado(contructor)
    {
        document.getElementsByTagName('header')[0].remove();
        contructor.vista.centrarPantalla(document.getElementsByTagName('main')[0]);
        contructor.vista.colocarFrase(contructor.modelo.frase,contructor.modelo.de,contructor.modelo.para);
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
    constructor()
    {
        this.imagen=document.getElementById('postal');
        this.frase=document.getElementsByTagName('p')[0];
    }
    /**
     * Metodo encargado de centrar vertical y horizontalemente un elemento en su contenedor
     * 
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
    /**
     * Metodo encargado de mostrar un mensaje por pantalla
     * @param {string} mensaje Frase que queremos que vea el usuario
     */
    alerta(mensaje)
    {
        let divAlerta= document.createElement('div');
        divAlerta.setAttribute('id','alerta');
        let pAlerta = document.createElement('p');
        pAlerta.appendChild(document.createTextNode(mensaje));
        let botonAlerta = document.createElement('button');
        botonAlerta.appendChild(document.createTextNode('Gracias, Robot'));
        botonAlerta.onclick = this.borrarAlerta.bind(this);
        divAlerta.appendChild(pAlerta);
        divAlerta.appendChild(botonAlerta);
        document.getElementsByTagName('body')[0].appendChild(divAlerta);

        divAlerta.style.top= (document.getElementsByTagName('main')[0].clientHeight - (divAlerta.clientHeight)) +'px';
        divAlerta.style.left= (document.getElementsByTagName('main')[0].clientWidth - (divAlerta.clientWidth*1.2)) +'px';
    }
    /**
     * Metodo encargado de borrar la alerta
     */
    borrarAlerta()
    {
        document.getElementById('alerta').remove();
    }
    /**
     * Metodo encargado de colocar la informacion de la postal con las selecciones marcadas anteriormente
     * @param {string} frase Frase que selecciono el editor
     * @param {string} de Persona que hace la postal
     * @param {string} para Persona o grupo de personal que recibe la postal
     */
    colocarFrase(frase,de,para)
    {
        document.getElementById('frase').textContent = frase;
        document.getElementById('de').textContent = ' '+de;
        document.getElementById('para').textContent = ' '+para;

        document.getElementById('frase').style.fontSize = ((document.getElementsByTagName('main')[0].clientWidth/2)/frase.length*10)+'px';
        document.getElementById('dedicatoria').style.fontSize = ((document.getElementsByTagName('main')[0].clientWidth/2)/frase.length*10)+'px';

        document.getElementById('dedicatoria').style.paddingBottom = document.getElementsByTagName('main')[0].clientHeight*0.09+'px';
        document.getElementById('dedicatoria').style.top = (document.getElementsByTagName('main')[0].clientHeight - (document.getElementById('dedicatoria').clientHeight))+'px';
      
        document.getElementById('frase').style.paddingTop = document.getElementsByTagName('main')[0].clientHeight*0.12+'px';
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
        setTimeout(this.obtenerFrase,800,this); //set timout con parametros, le paso el this o trabajara con window
    }
    /**
     * Metodo usado para abrir un archivo json y guardarla en un atributo estatico 
     * @param {URL} ruta Ruta donde se encuentra el archivo json 
     */
    cargarJson(ruta)
    {
        console.log(this);
        fetch(ruta)
        .then(respuesta => respuesta.json())
        .then(function(objeto)
        {
            Modelo.datosAsincronos=objeto;
        })
        .catch(error => alert('🤖: Lo sentimos, el bicho( '+error+' ) se coló en nuestro sistema y estamos peleando contra el, por favor pruebe mas tarde '));
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
    obtenerFrase(modelo)
    {
        let arrayTipos= null;
        console.log(Modelo.datosAsincronos);
        arrayTipos = Object.keys(Modelo.datosAsincronos);

        let tipo = arrayTipos[modelo.tipoFrase]; //usar el tipo para elegir que array sera

        let arrayTipoEspecifico = null; //preguntar como corregir esto para que se obtenga en el modelo y que sea uno al azar

        for (let tiposFrases in Modelo.datosAsincronos) 
        {
            if (tiposFrases == tipo) 
            {
                arrayTipoEspecifico = Modelo.datosAsincronos[tiposFrases];
            }
        }
        modelo.frase=arrayTipoEspecifico[modelo.numeroFrase];
    }
 }
 Modelo.datosAsincronos;
 let aplicacion = new App();