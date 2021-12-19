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
        this.vista = new Vista();
        this.modelo = new Modelo();
        window.onload = this.iniciar.bind(this);
    }
    /**
     * Metodo encargado de poner en funcionamiento los metodos que no necesitan al usuario y se inician nada más cargar la pagina
     * Tambien se encarga de colocar los eventos que podra usar el usuario si lo busca
     */
    iniciar()
    {
        this.vista.centrarElemento(document.getElementsByTagName('header')[0], document.getElementsByTagName('h1')[0]);
        this.vista.copiaProporcion(document.getElementsByTagName('video')[0], document.getElementsByTagName('iframe')[0]);

        document.getElementById('desplegable').getElementsByTagName('div')[0].onclick = this.controlDesplegable.bind(this);
    }
    /**
     * Metodo encargado de colocar los eventos y llamar a las funciones necesarias para formar la parte del editor
     */
    controlDesplegable()
    {
        if (document.getElementById('editor').getElementsByTagName('section').length > 1) 
        {
            this.vista.borrarEditor();
        }
        else
        {
            // this.vista.desplegarEditor(this.modelo.frases);
            this.vista.desplegarEditor();
            console.log(this.modelo);

            this.vista.centrarVertical(document.getElementById('slider'), document.getElementsByClassName('desl')[0]);
            this.vista.centrarVertical(document.getElementById('slider'), document.getElementsByClassName('desl')[1]);
            document.getElementsByClassName('desl')[0].onclick = this.moverIzq.bind(this);
            document.getElementsByClassName('desl')[1].onclick = this.moverDer.bind(this);
            document.getElementsByTagName('select')[0].onchange = this.colocarFrase.bind(this);
            document.getElementById('redireccion').onclick = this.redirigir.bind(this);

            //añadimos el evento de click cada vez que se clickee le pondra la parte visual y colocara que plantilla es guardada
            let arrayPlantillas = document.getElementById('plantilla').getElementsByTagName('div');
            for (let indice = 0; indice < arrayPlantillas.length; indice++) 
            {
                arrayPlantillas[indice].onclick = this.vista.plantillaSeleccionada.bind(this); //se usa this y no this.vista ya que necesito que su this sea el controlador
            }

            //añadimos el evento de click cada vez que se clickee le pondra la parte visual y colocara que fondo guardamos
            let arrayFondos = document.getElementById('fondos').getElementsByTagName('div');
            for (let indice = 0; indice < arrayFondos.length; indice++) 
            {
                arrayFondos[indice].onclick = this.vista.fondoSeleccionada.bind(this); //se usa this y no this.vista ya que necesito que su this sea el controlador
            }

            //añadimos el evento de click cada vez que se desenfoque los input para colocar quien eres y a quien lo dedicas
            let arrayText = document.getElementById('dedicar').getElementsByTagName('input');
            for (let indice = 0; indice < arrayText.length; indice++) 
            {
                arrayText[indice].onblur = this.verificarInput.bind(this); 
            }
        }
    }
    /**
     * Metodo usado para que el desplazamiento se realice hacia la derecha
     */
    moverDer()
    {
        this.vista.slider(true,this.modelo.fondos,this.modelo.maximoSlider, this.modelo.fondoSeleccionado);
    }
    /**
     * Metodo usado para que el desplazamiento se realice hacia la izquierda
     */
    moverIzq()
    {
        this.vista.slider(false,this.modelo.fondos,this.modelo.maximoSlider, this.modelo.fondoSeleccionado);
    }
    /**
     * Metodo que se encarga de colocar una frase al azar del tipo de frases seleccionadas
     * Ademas llamara al modelo para guardar los parametros util para mostrar la tarjeta
     */
    colocarFrase()
    {
        let valorSelect = document.getElementsByTagName('select')[0].value;
        this.modelo.tipoFrase=valorSelect;

        let arrayTipos= Object.keys(Modelo.datosAsincronos);

        let tipo = arrayTipos[valorSelect]; //usar el tipo para elegir que array sera
        let arrayTipoEspecifico = null; //preguntar como corregir esto para que se obtenga en el modelo y que sea uno al azar

        for (let tiposFrases in Modelo.datosAsincronos) 
        {
            if (tiposFrases == tipo) 
            {
                arrayTipoEspecifico = Modelo.datosAsincronos[tiposFrases];
            }
        }

        let cambio = Math.floor(Math.random() * (arrayTipoEspecifico.length - 0)) + 0;
        this.modelo.numeroFrase=cambio;
        document.getElementsByTagName('textarea')[0].textContent=arrayTipoEspecifico[cambio];
    }
    /**
     * Metodo encargado de verificar si se han quedado vacio o no la parte de formulario del editor y de a quien se envia para mostrar mediante un color de fondo si esta bien o no
     */
    verificarInput(evento)
    {
        console.log(evento.target);
        if (evento.target.value.length <= 0) 
        {
            evento.target.style.backgroundColor = '#FA8787';
        }
        else
        {
            evento.target.style.backgroundColor = '#EEEEEE';
            if (evento.target.attributes.name.textContent == 'de') 
            {
                this.modelo.de = evento.target.value;
            }
            else
            {
                this.modelo.para = evento.target.value;
            }
        }
    }
    /**
     * Metodo encargado de verificar si se ha completado todos los parametros necesarios para formar la tarjeta
     * Te mandara a la tarjeta si esta bien y si no lo esta te saldra una alerta
     */
    redirigir()
    {
        if (this.modelo.tipoFrase!=null&&this.modelo.numeroFrase!=null&&this.modelo.fondoSeleccionado!=null&&this.modelo.plantillaSeleccionada!=null&&this.modelo.de!=null&&this.modelo.para!=null) 
        {
            window.location.href = "html/postal.html?tf="+this.modelo.tipoFrase+"&nf="+this.modelo.numeroFrase+"&fondo="+this.modelo.fondoSeleccionado+"&plan="+this.modelo.plantillaSeleccionada+"&de="+this.modelo.de+"&para="+this.modelo.para+"#postal";
        }
        else
        {
            console.log('hola');
            this.vista.alerta('🤖: Lo siento, me faltan datos, ¿ Podías comprobarlos, por favor?');
        }
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
        this.indiceFondos = 0;
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
        
        divAlerta.style.top= (document.getElementsByTagName('body')[0].clientHeight - (divAlerta.clientHeight*2)) +'px';
    }
    /**
     * Metodo encargado de borrar la alerta
     */
    borrarAlerta()
    {
        document.getElementById('alerta').remove();
    }
    /**
     * Metodo encargado de borrar los elementos correspondientes al editor
     */
    borrarEditor()
    {
        for (let indice = 0; indice <= document.getElementById('editor').getElementsByTagName('section').length+1; indice++) 
        {
            document.getElementById('editor').lastChild.remove();
        }
    }
    /**
     * Metodo encargado de crear los elementos y los atributos correspondiente en la parte de editor
     */
    desplegarEditor()
    {
        let arrayTipos= Object.keys(Modelo.datosAsincronos);
        let articuloEditor = document.getElementById('editor'); //Articulo que contiene las partes del editor de tarjetas navideñas

        let sectionFrase = document.createElement('section');
        sectionFrase.setAttribute('id', 'frase');
        let formFrase = document.createElement('form');
        let selectFrase = document.createElement('select');
        selectFrase.setAttribute('name', 'selecionFrase');
        let oculto = document.createElement('option');
        oculto.setAttribute('value', 'vacio');
        oculto.setAttribute('selected', 'selected');
        oculto.setAttribute('hidden', 'hidden');
        oculto.appendChild(document.createTextNode(' Elija el tipo de frase que desea '));

        let textareaFrase = document.createElement('textarea');
        textareaFrase.setAttribute('id', 'mostrarFrase');
        textareaFrase.setAttribute('name', 'verFrase');
        textareaFrase.setAttribute('readonly', 'readonly');
        textareaFrase.appendChild(document.createTextNode(' Aquí se mostrará la frase seleccionada al azar de su categoria '));

        articuloEditor.appendChild(sectionFrase);
            sectionFrase.appendChild(formFrase);
            formFrase.appendChild(selectFrase);
                selectFrase.appendChild(oculto);
                for (let indice = 0; indice < arrayTipos.length; indice++) 
                {
                    let opcion = document.createElement('option');
                    opcion.setAttribute('value', indice);
                    opcion.appendChild(document.createTextNode(arrayTipos[indice]));
                    selectFrase.appendChild(opcion);
                }
            formFrase.appendChild(textareaFrase);
        

        let sectionSlider = document.createElement('section');
        sectionSlider.setAttribute('id', 'slider');
        let divDesl1 = document.createElement('div');
        divDesl1.setAttribute('class', 'desl');
        let imgDesl1 = document.createElement('img');
        imgDesl1.setAttribute('src', 'img/botonIzq.png');
        let divFondos = document.createElement('div');
        divFondos.setAttribute('id', 'fondos');
        let divFondosdiv1 = document.createElement('div');
        let divFondosimg1 = document.createElement('img');
        divFondosimg1.setAttribute('src', 'img/fondo1.png');
        let divFondosdiv2 = document.createElement('div');
        let divFondosimg2 = document.createElement('img');
        divFondosimg2.setAttribute('src', 'img/fondo2.png');
        let divFondosdiv3 = document.createElement('div');
        let divFondosimg3 = document.createElement('img');
        divFondosimg3.setAttribute('src', 'img/fondo3.png');
        let divFondosdiv4 = document.createElement('div');
        let divFondosimg4 = document.createElement('img');
        divFondosimg4.setAttribute('src', 'img/fondo4.png');
        let divFondosdiv5 = document.createElement('div');
        let divFondosimg5 = document.createElement('img');
        divFondosimg5.setAttribute('src', 'img/fondo5.png');
        let divDesl2 = document.createElement('div');
        divDesl2.setAttribute('class', 'desl');
        let imgDesl2 = document.createElement('img');
        imgDesl2.setAttribute('src', 'img/botonDer.png');

        articuloEditor.appendChild(sectionSlider);
            sectionSlider.appendChild(divDesl1);
                divDesl1.appendChild(imgDesl1); 
            sectionSlider.appendChild(divFondos);
                divFondos.appendChild(divFondosdiv1); 
                    divFondosdiv1.appendChild(divFondosimg1); 
                divFondos.appendChild(divFondosdiv2);
                    divFondosdiv2.appendChild(divFondosimg2);
                divFondos.appendChild(divFondosdiv3);
                    divFondosdiv3.appendChild(divFondosimg3);
                divFondos.appendChild(divFondosdiv4);
                    divFondosdiv4.appendChild(divFondosimg4);
                divFondos.appendChild(divFondosdiv5);
                    divFondosdiv5.appendChild(divFondosimg5);
            sectionSlider.appendChild(divDesl2);
                divDesl2.appendChild(imgDesl2); 

        let sectionPlantilla = document.createElement('section');
        sectionPlantilla.setAttribute('id', 'plantilla');
        let div1Plantilla = document.createElement('div');
        let img1Plantilla = document.createElement('img');
        img1Plantilla.setAttribute('src', 'img/padresPlantilla.png');
        img1Plantilla.setAttribute('title', 'Adultos');
        let div2Plantilla = document.createElement('div');
        let img2Plantilla = document.createElement('img');
        img2Plantilla.setAttribute('src', 'img/alumnosPlantilla.png');
        img2Plantilla.setAttribute('title', 'Alumnos');
        let div3Plantilla = document.createElement('div');
        let img3Plantilla = document.createElement('img');
        img3Plantilla.setAttribute('src', 'img/trabajadoresPlantilla.png');
        img3Plantilla.setAttribute('title', 'Miembros');

        articuloEditor.appendChild(sectionPlantilla);
            sectionPlantilla.appendChild(div1Plantilla);
                div1Plantilla.appendChild(img1Plantilla); 
            sectionPlantilla.appendChild(div2Plantilla);
                div2Plantilla.appendChild(img2Plantilla); 
            sectionPlantilla.appendChild(div3Plantilla);
                div3Plantilla.appendChild(img3Plantilla); 

        let sectionDedicar = document.createElement('section');
        sectionDedicar.setAttribute('id', 'dedicar');
        let formDedicar = document.createElement('form');
        let divFormDedicar = document.createElement('div');
        let labelDeDiv = document.createElement('label');
        labelDeDiv.appendChild(document.createTextNode(' DE '));
        let inputDeDiv = document.createElement('input');
        inputDeDiv.setAttribute('type', 'text');
        inputDeDiv.setAttribute('requered', 'requered');
        inputDeDiv.setAttribute('name', 'de');
        inputDeDiv.setAttribute('value', '');
        inputDeDiv.setAttribute('placeholder', 'Soy');
        let labelParaDiv = document.createElement('label');
        labelParaDiv.appendChild(document.createTextNode(' PARA '));
        let inputParaDiv = document.createElement('input');
        inputParaDiv.setAttribute('type', 'text');
        inputParaDiv.setAttribute('requered', 'requered');
        inputParaDiv.setAttribute('name', 'para');
        inputParaDiv.setAttribute('value', '');
        inputParaDiv.setAttribute('placeholder', 'A quien lo dedico');
        let botonDedicar = document.createElement('a');
        botonDedicar.setAttribute('id', 'redireccion');
        botonDedicar.appendChild(document.createTextNode(' CREAR TARJETA '));

        articuloEditor.appendChild(sectionDedicar);
            sectionDedicar.appendChild(formDedicar);
                formDedicar.appendChild(divFormDedicar);
                    divFormDedicar.appendChild(labelDeDiv);
                    divFormDedicar.appendChild(inputDeDiv);
                    divFormDedicar.appendChild(labelParaDiv);
                    divFormDedicar.appendChild(inputParaDiv);
                formDedicar.appendChild(botonDedicar);
    }
    /**
     * Metodo encargado de centrar vertical y horizontalemente un elemento en su contenedor
     * 
     * @param {elementoHTML} contenedor Elemento que contiene al alemento a centrar
     * @param {elementoHTML} elemento Elemento a centrar
     */
    centrarElemento(contenedor, elemento)
    {
        elemento.style.top = (contenedor.clientHeight/2)-(elemento.clientHeight/2) + 'px'; 
        elemento.style.left = (contenedor.clientWidth/2)-(elemento.clientWidth/2)  + 'px';
    }
    /**
     * Metodo encargado de centrar vertical un elemento en su contenedor
     * 
     * @param {elementoHTML} contenedor Elemento que contiene al alemento a centrar
     * @param {elementoHTML} elemento Elemento a centrar
     */
    centrarVertical(contenedor, elemento)
    {
        elemento.style.top = (contenedor.clientHeight/2)-(elemento.clientHeight/2) + 'px'; 
    }
    /**
     * Metodo encargado de copiar las proporciones de un elemento a otro elemento
     * 
     * @param {elementoHTML} elementoCopia Elemento del cual copiamos las proporciones
     * @param {elementoHTML} elementoDestino Elemento del cual destinamos las proporciones
     */
    copiaProporcion(elementoCopia, elementoDestino)
    {
        elementoDestino.style.width = elementoCopia.clientWidth+'px';
        elementoDestino.style.height = elementoCopia.clientHeight+'px';
    }
    /**
     * Metodo encargado de colocar la parte visual de la postal seleccionada
     * Tambien guarda la seleccion 
     */
    fondoSeleccionada(evento)
    {
        let arrayFondos = document.getElementById('fondos').getElementsByTagName('div');
        for (let indice = 0; indice < arrayFondos.length; indice++) 
        {
            console.log(arrayFondos[indice]);
            arrayFondos[indice].id='';
        }
        if (evento.target.tagName == 'IMG') 
        {
            evento.target.parentElement.id='fondoSeleccionado';
            this.modelo.fondoSeleccionado=evento.target.parentElement.firstElementChild.attributes.src.textContent;
        }
        else
        {
            evento.target.id='fondoSeleccionado';
            this.modelo.fondoSeleccionado=evento.target.firstElementChild.attributes.src.textContent;
        }
    }
    /**
     * Metodo destinado al cambio de las imagenes en la direccion puesta en el slider
     * @param {boolean} moverDer True si buscas que se desplace para la derecha, si es False es la izquierda
     * @param {array} fondos Array con la ruta de todas las fotos
     * @param {int} maximoSlider Guarda el numero maximo de div del slider
     * @param {string} seleccion Guarda la ruta de la imagen seleccionada
     */
    slider(moverDer, fondos, maximoSlider, seleccion=null)
    {
        let contador = 0;
        let contadorDos = 0;
        if (moverDer) 
        {
            this.indiceFondos += 1;
            if (this.indiceFondos > 9) 
            {
                this.indiceFondos = 0;
            }
        }
        else
        {
            this.indiceFondos -= 1;
            if (this.indiceFondos < 0) 
            {
                this.indiceFondos = 9;
            }
        }
        while (contador<maximoSlider) 
        {
            if (this.indiceFondos+contador > 9) 
            {
                console.log(contadorDos);
                document.getElementById('fondos').getElementsByTagName('img')[contador].setAttribute('src', 'img/'+fondos[(0+contadorDos)]);
                contadorDos = contadorDos + 1;
            }
            else
            {
                document.getElementById('fondos').getElementsByTagName('img')[contador].setAttribute('src', 'img/'+fondos[(this.indiceFondos+contador)]);
            }

            if (seleccion!=null) 
            {
                if (document.getElementById('fondos').getElementsByTagName('img')[contador].attributes.src.textContent == seleccion) 
                {
                    document.getElementById('fondos').getElementsByTagName('img')[contador].parentElement.id='fondoSeleccionado';
                }
                else
                {
                    document.getElementById('fondos').getElementsByTagName('img')[contador].parentElement.id='';
                }
            }

            contador += 1;
        }
    }
    /**
     * Metodo encargado de colocar la parte visual de la plantilla seleccionada
     * Tambien guarda la seleccion 
     */
    plantillaSeleccionada(evento)
    {
        let arrayPlantillas = document.getElementById('plantilla').getElementsByTagName('div');
        for (let indice = 0; indice < arrayPlantillas.length; indice++) 
        {
            arrayPlantillas[indice].id='';
        }
        if (evento.target.tagName == 'IMG') 
        {
            if (evento.target.parentElement.firstElementChild.attributes.title.textContent=='Alumnos') 
            {
                evento.target.parentElement.id='plantillaCentralSeleccionada';
            }
            else
            {
                evento.target.parentElement.id='plantillaSeleccionada';
            }
            this.modelo.plantillaSeleccionada=evento.target.parentElement.firstElementChild.attributes.title.textContent;
        }
        else
        {
            if (evento.target.firstElementChild.attributes.title.textContent=='Alumnos') 
            {
                evento.target.id='plantillaCentralSeleccionada';
            }
            else
            {
                evento.target.id='plantillaSeleccionada';
            }
            this.modelo.plantillaSeleccionada=evento.target.firstElementChild.attributes.title.textContent;
        }
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
        this.fondos = [];
        this.maximoSlider=5;
        this.arrayFondos();
        this.frases=null;
        this.cargarJson('recursos/archivos/datosFrases.json');
        this.tipoFrase=null;
        this.numeroFrase=null;
        this.fondoSeleccionado=null;
        this.plantillaSeleccionada=null;
        this.de=null;
        this.para=null;
    }
    /**
     * Metodo encargado de pasar el objeto de un atributo estatico a un atributo
     */
    pasarDatosFrases()
    {
        this.frases=Modelo.datosAsincronos;
        console.log(this.frases);
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
     * Metodo encargado de crear el array de los fondos de las postales
     */
    arrayFondos()
    {
        this.fondos = 
        [
            'fondo1.png',
            'fondo2.png',
            'fondo3.png',
            'fondo4.png',
            'fondo5.png',
            'fondo6.png',
            'fondo7.png',
            'fondo8.png',
            'fondo9.png',
            'fondo10.gif'
        ];
    }
}
Modelo.datosAsincronos;
let aplicacion = new App();