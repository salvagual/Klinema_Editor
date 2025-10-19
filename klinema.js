var editor='SI';
var n_input_filtros=0;
var url_inicial;
var split_barra_url;
var parametros = [];
var parametro = [];
var parametro_filtros='NOB';
var Video = null;
var video_es_OK='NO';
var Video_OK = null;
var Mensaje = null;
var Logo_mensaje = null;
var Logo_espera = null;
var Logo_espera_activo = 0;
var Borroso = null;
var DivLogo = null;
var DivLogo2 = null;
var Editor = null;
var Logo_Editor = null;
var divfondo = null;
var cerrar = null;
var velocidad = 1;
var p1=null;
var p2=null;
var p3=null;
var prueba = [];
var mensaje_primevideo=null;
var nombre_fichero = '';
var plataforma='';
var nopreparada=0;
var okpreparada=0;
var anuncios=0;
var anuncioPrime=-1;
var duracion=0;
var titulo_pelicula='';
var titulo_ok=0;
var id_pelicula='';
var id_pelicula_actual='';
var id_pelicula_netflix='';
var imax=0;
var max=99999;
var chromecast=0;
var salto_a_comprobar=0;
var salto_disney=0;
var rapido=0;
var ultimo_salto=-1;
var hay_anuncio_netflix=0;
var opciones_tipo=['a','i','s','st','e'];
var opciones_tipo_texto=['audio','imagen','salto','subtítulos','escena'];
var tempcorte=0;
var resultado;
var K_roja='SI';
var salto_disney=0;
var escena_primera_vez=1;
var escena_inicio=0;
var filtros = [];
var duracion_disney=-1;
var ahora=0;
var longitud_salto=0;
var ultimo_volumen=1;

//Variables del editor
var url_sin_filtros='';
var url_con_filtros='';
var filtro='';
var prime_ok=0;
var nfiltros=null;
var nboton=17;
var br1 = "<br>";
var br3 = "<br><br><br>";
var peliculas_apple= [];
var peliculas_filmin= [];
var navegador_Firefox= chrome.runtime.getURL('').startsWith('moz-extension://');


function busca_estructura(nodo, profundidad = 0)
{
	console.log('busca_estructura');
	console.log(nodo.nodeName);
//	if (typeof(nodo)!='undefined')
//		console.log(nodo.getAttribute('tabindex'));
	nodo.childNodes.forEach(hijo => {
	busca_estructura(hijo, profundidad + 1);
	});
}



//Parte para filtrar subtítulos
var subtitulos='SI';
var subsClass = '';

var subsClasses = {
	youtube:'.caption-window',
	google:'.lava-timed-text-viewport',
	primevideo:'.atvwebplayersdk-captions-text',
	netflix:'.player-timedtext',
	hbomax:'ccs-1750i2r',
	disneyplus:'.dss-subtitle-renderer-cue',
	rakuten:'.subtitle',
	filmin:'.jw-captions',
};

function cambio_subs()
{
	if ((plataforma != 'movistarplus') && (plataforma != 'apple'))
		subs = document.querySelector(subsClass);		//special cases
	if ((plataforma == 'primevideo') || (plataforma == 'netflix') || (plataforma == 'disneyplus') || (plataforma == 'filmin') || (plataforma == 'google'))
	{
		if (subtitulos=='NO')
		{
			if (subs!=null)
		            subs.style.opacity = 0;
		}
	}

	if (plataforma == 'hbomax')
	{
		if (subtitulos=='NO')
		{
			divs[imax+1].style.opacity=0;
		}
		else
			if (divs[imax+1].style.opacity==0)
				divs[imax+1].style.opacity='';
	}

//	if (plataforma == 'apple')
//	{
//		subs3 = Video.nextSibling;
//		subs3.style.opacity=0;
//
//		if (subtitulos=='NO')
//		{
//			subs3.style.opacity=0;
//		}
//		else
//			if (subs3.style.opacity==0)
//				subs3.style.opacity='';
//	}
}
//Fin parte para filtrar subtítulos

function goToTime(time)
{
	if(plataforma == 'netflix')
	{
	        var script = document.createElement('script');
		if (navegador_Firefox)
	       		script.src = browser.runtime.getURL('go2netflix.js?') + new URLSearchParams({seconds: time});
		else
	       		script.src = chrome.runtime.getURL('go2netflix.js?') + new URLSearchParams({seconds: time});
		document.documentElement.appendChild(script);
        	script.remove();
	}
	if (plataforma == 'disneyplus')
	{
			Video.currentTime = time;
			salto_disney= time;
	}
	if ((plataforma != 'netflix') && (plataforma != 'disney'))
	{
		Video.currentTime = time;
	}
}

function tiempo_actual()
{ 
	var itiempo_actual=-1;
	if (plataforma!='disneyplus')
		itiempo_actual=Video.currentTime;
	else
	{
		var aa=document.getElementsByClassName('slider-container');
		if (aa!=undefined)
		{
//			console.log('aa: '+aa.length);
			if (aa.length>0)
			{
//				console.log('aa: '+aa.length+'-'+aa[aa.length-1].innerHTML);
				var duracion_disney=parseFloat(aa[aa.length-1].getAttribute('aria-valuemax'));
				console.log('duracion: '+duracion);
			}
		}
//		console.log('duracion: '+duracion_disney);
		var a=document.getElementsByClassName('slider-handle-container');
		if (a!=undefined)
		{
//			console.log('a: '+a.length);
			if (a.length>0)
			{
				console.log('a: '+a.length+'-'+a[a.length-1].innerHTML);
				var a1=a[a.length-1].style.width;
				itiempo_actual=duracion_disney*parseFloat(a1)/100;
			}
		}
//busca_estructura(document.documentElement);
		var pb=document.querySelector('progress-bar');
//		console.log('pb: '+pb.length);
		if (pb!=null)
//		if (pb.length>0)
		{
//			console.log('PB no null');
//			console.log(pb.innerHTML);
//			console.log(pb.textContent);
			pb1=pb.shadowRoot;
			const allElements = pb1.querySelectorAll('*');
			allElements.forEach(el => {
				if (el.getAttribute('aria-valuemax')!=null)
				{
//					console.log(el.getAttribute('aria-valuemax'));
//					console.log(el.getAttribute('aria-valuenow'));
					duracion_disney=el.getAttribute('aria-valuemax');
					s=el.style.left;
//					console.log('s: ',s);
					s1=s.substr(0,s.length-1);
//					console.log('s1: ',s1);
					s2=parseFloat(s1);
//					console.log('s2: ',s2);
					itiempo_actual=duracion_disney*s2/100;
					console.log('tiempo actual: ',itiempo_actual);
				}
			});
		}
//		console.log('pb1: '+pb1.length);

//		if (pb1!=null)
		if (pb1.length>0)
		{
			console.log('pb1 no null');
			console.log('pb1: '+pb1.length);
			pb2=pb1.querySelectorAll('.progress-bar__thumb');
			console.log('pb2: '+pb2.length);
			if (pb2!='undefined')
			{
				console.log('pb2: '+pb2.length);
				if (pb2.length>0)
				{
					console.log('pb2: '+pb2.length+'-'+pb2[pb2.length-1].innerHTML);
					duracion_disney=parseFloat(pb2[pb2.length-1].getAttribute('aria-valuemax'));
					console.log('duracion: '+duracion_disney);
				}
			}
		}

	}
//	console.log('tiempo_actual: '+itiempo_actual);
	return itiempo_actual;
}

function muestra_logo()
{
	if (!!Mensaje)
	{
		console.log('parametro_filtros: '+parametro_filtros+' video_es_OK: '+video_es_OK+' K_roja: '+K_roja)
		if ((parametro_filtros!='NOB') && (video_es_OK=='OK'))
		{
			Mensaje.textContent = 'Klinema activado';
			Logo_mensaje.src = chrome.runtime.getURL('/img/OK64.png');
			okpreparada++;
			nopreparada=0;
		}
		else
		{
			Mensaje.textContent = 'Klinema no activado';
			Logo_mensaje.src = chrome.runtime.getURL('/img/NO64.png');
			if (K_roja=='SI')
			{
				Mensaje.style.display = 'block';
				Logo_mensaje.style.display = 'block';
			}

			if (K_roja=='NO')
			{
				Mensaje.style.display='none';
				Logo_mensaje.style.display = 'none';
			}
		}

		if ((okpreparada>0) && (okpreparada<=30))
		{
			Mensaje.style.display = 'block';
			Logo_mensaje.style.display = 'block';
		}

		if (okpreparada>30)
		{
			Mensaje.style.display='none';
			Logo_mensaje.style.display = 'none';
		}

		if (chromecast==1)
		{
			Mensaje.textContent = 'Los filtros no funcionan con ChromeCast';
			Mensaje.style.display = 'block';
			Logo_mensaje.src = chrome.runtime.getURL('/img/NO64.png');
			Logo_mensaje.style.display = 'block';
		}
	}
//Prepara para comprobar si hay que aplicar un filtro cuando cambia de fotograma
//El if es sólo para cuando se edita
		Video.ontimeupdate = function(){
			console.log('ontimeupdate tiempo actual-anuncios=input_tiempo_actual: '+tiempo_actual()+'-'+anuncios+'='+(tiempo_actual()-anuncios)+'-->'+toHMS(tiempo_actual()-anuncios));
			if ((editor=='SI') && (!!(document.getElementById('input_tiempo_actual'))))
			{
				document.getElementById('input_tiempo_actual').value=toHMS(tiempo_actual()-anuncios);
			}
			comprueba_filtros();
		}
}

function lee_filtros()
{
// Si no está el parámetro filtros, le añado uno que indica que falta, pero evita que dé errores por estar la variable indefinida
console.log('lee_filtros');
	if (editor=='SI')
	{
		filtros[0]={"tipo":'s', "inicio":0, "fin":0};
	}
	if ((plataforma=='apple') && (parametro_filtros==undefined))
	{
//		var peliculas_apple=localStorage.getItem('apple');
		encontrada=0;
		chrome.storage.local.get(['apple'], (result) => 
		{
			peliculas_apple = result.apple;
console.log('PPAAA: '+peliculas_apple);
			peliculas_apple.forEach(pelicula_filtro =>
			{
				console.log(pelicula_filtro.external_id);
				console.log('id_pelicula: '+id_pelicula);
				if (pelicula_filtro.external_id==id_pelicula)
				{
					encontrada=1;
					i=0;
					parametro_filtros='';
					filtros=pelicula_filtro.filters;
console.log('filtros: '+filtros);
					filtros.forEach(filtro =>
					{
						tipo=filtro.tipo;
						inicio=filtro.inicio;
						fin=filtro.fin;
						parametro_filtros=parametro_filtros+tipo+'A'+inicio+'A'+fin+'B';
						console.log('parametro: '+parametro_filtros);
						i++;
					});
				}
			});
console.log('i: '+i);
console.log('R.S: '+result.success)
			if ((encontrada==1) && (i==0))
				parametro_filtros='OKB';
			if (encontrada==0)
				parametro_filtros='NOB';
			if ((encontrada==1) && (i>0))
				parametro_filtros=i+'B'+parametro_filtros;
			console.log('FILTROS: '+parametro_filtros);
			var partes2=parametro_filtros.split("B");
			var partes3=partes2[0].split('A');
			nfiltros=partes3[0];
// Esta película no necesita filtros
			if (partes3[0]=='OK')
			{
				nfiltros=1;
				partes3[1]='0';
				partes3[2]='0';
			}

			console.log('nfiltros: '+nfiltros);
			for (i=1; i<=nfiltros;i++)
			{
				if (partes3[0]!='OK')
				{
					partes3=partes2[i].split('A');
				}
				filtros[i]={"tipo":partes3[0], "inicio":parseFloat(partes3[1]), "fin":parseFloat(partes3[2])};
				console.log('filtro (tipo, inicio, fin)'+i+partes3[0]+'-'+partes3[1]+'-'+partes3[2]);
			}

			console.log('nfiltros: '+nfiltros);
  			console.log('Datos apple:', peliculas_apple);
	
		});
		console.log('APPLE: '+peliculas_apple);

	}

	if ((plataforma=='filmin') && (parametro_filtros==undefined))
	{
//		var peliculas_filmin=localStorage.getItem('filmin');
		encontrada=0;
		chrome.storage.local.get(['filmin'], (result) => 
		{
			peliculas_filmin = result.filmin;
console.log('PPAAA: '+peliculas_filmin);
			peliculas_filmin.forEach(pelicula_filtro =>
			{
//				console.log(pelicula_filtro.external_id);
//				console.log('id_pelicula: '+id_pelicula);
				if (pelicula_filtro.external_id==id_pelicula)
				{
					encontrada=1;
					i=0;
					parametro_filtros='';
					filtros=pelicula_filtro.filters;
console.log('filtros: '+filtros);
					filtros.forEach(filtro =>
					{
						tipo=filtro.tipo;
						inicio=filtro.inicio;
						fin=filtro.fin;
						parametro_filtros=parametro_filtros+tipo+'A'+inicio+'A'+fin+'B';
						console.log('parametro: '+parametro_filtros);
						i++;
					});
				}
			});
console.log('i: '+i);
console.log('R.S: '+result.success)
			if ((encontrada==1) && (i==0))
				parametro_filtros='OKB';
			if (encontrada==0)
				parametro_filtros='NOB';
			if ((encontrada==1) && (i>0))
				parametro_filtros=i+'B'+parametro_filtros;
			console.log('FILTROS: '+parametro_filtros);
			var partes2=parametro_filtros.split("B");
			var partes3=partes2[0].split('A');
			nfiltros=partes3[0];
// Esta película no necesita filtros
			if (partes3[0]=='OK')
			{
				nfiltros=1;
				partes3[1]='0';
				partes3[2]='0';
			}

			console.log('nfiltros: '+nfiltros);
			for (i=1; i<=nfiltros;i++)
			{
				if (partes3[0]!='OK')
				{
					partes3=partes2[i].split('A');
				}
				filtros[i]={"tipo":partes3[0], "inicio":parseFloat(partes3[1]), "fin":parseFloat(partes3[2])};
				console.log('filtro (tipo, inicio, fin)'+i+partes3[0]+'-'+partes3[1]+'-'+partes3[2]);
			}

			console.log('nfiltros: '+nfiltros);
  			console.log('Datos filmin:', peliculas_filmin);
	
		});
		console.log('filmin: '+peliculas_filmin);

	}


	if (parametro_filtros === undefined)
	{
		parametro_filtros='NOB';
	}

	var partes2=parametro_filtros.split("B");
	var partes3=partes2[0].split('A');

	if ((plataforma=='primevideo') || (plataforma=='rakuten'))
	{
		duracion=parseFloat(partes3[1]);
	}
	if (plataforma=='netflix')
	{
		id_pelicula_netflix=partes3[1];
	}

	nfiltros=partes3[0];
// Esta película no necesita filtros
	if (partes3[0]=='OK')
	{
		nfiltros=1;
		partes3[1]='0';
		partes3[2]='0';
	}

	console.log('nfiltros: '+nfiltros);
	for (i=1; i<=nfiltros;i++)
	{
		if (partes3[0]!='OK')
		{
			partes3=partes2[i].split('A');
		}
		filtros[i]={"tipo":partes3[0], "inicio":parseFloat(partes3[1]), "fin":parseFloat(partes3[2])};
		console.log('filtro (tipo, inicio, fin)'+i+partes3[0]+'-'+partes3[1]+'-'+partes3[2]);
	}
	console.log('nfiltros: '+nfiltros);
}

function es_visible(ele)
{
	return (ele.offsetWidth > 0 && ele.offsetHeight > 0) && (ele.style.visibility != 'hidden')
}

//Parte solo para Klinema editor
function download(data, name, type) {
    var a = document.createElement("a");
    var file = new Blob([data], {"type": type}),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
       document.body.removeChild(a);
       window.URL.revokeObjectURL(url);
    }, 0)
}

function grabar()
{
//busca_estructura(document.documentElement);
	nombre_fichero = prompt('Escriba el nombre del fichero. Se le dará extensión .txt');
	texto='';
	var url_grabar=window.location.href;
	var partes_url_grabar = url_grabar.split('?');
	if ((plataforma!='primevideo') && (plataforma!='movistarplus') && (plataforma!='filmin'))
	{
		texto=partes_url_grabar[0]+'\n';
	}	
	if (plataforma=='primevideo')
	{
		if (video_es_OK=='OK')
			texto=partes_url_grabar[0]+'\n';
		else
			texto='La url no corresponde al capítulo\n';
	}
	if (plataforma=='movistarplus')
	{
		if (video_es_OK=='OK')
			texto=partes_url_grabar[0]+'?id='+parametro['id']+'\n';
		else
			texto='La url no corresponde al capítulo\n';
	}
	if (plataforma=='filmin')
	{
		texto=url_grabar+'\n';
	}
	texto=texto + 'Duración: \t'+toHMS(Video.duration)+'\n';
	for (i=1; i<=n_input_filtros; i++)
	{
		texto=texto + document.getElementById('tipo'+i).value + '\t' + document.getElementById('inicio'+i).value + '\t' + document.getElementById('final'+i).value + '\n';
	}
console.log(texto);
console.log(nombre_fichero + '.txt');
	download(texto, nombre_fichero + '.txt', "text/plain");
}

function lee_filtros_prueba()
{
console.log('lee_filtros_prueba n_input_filtros: '+n_input_filtros);
	i1=0;
	for (i=0;i<=n_input_filtros;i++)
	{
//console.log('inicio: '+i);
		inicio=document.getElementById('inicio'+i);
//console.log(' - '+inicio.value);
		if (inicio.value!='')
		{
			i1++;
			tipo=document.getElementById('tipo'+i);
			final=document.getElementById('final'+i);
			filtros[i1]={"tipo":tipo.value, "inicio":parseFloat(fromHMS(inicio.value)), "fin":parseFloat(fromHMS(final.value))};
console.log('filtro pruebas (tipo, inicio, fin)'+i1+':'+tipo.value+'-'+parseFloat(fromHMS(inicio.value))+'-'+parseFloat(fromHMS(final.value)));
		}
	}
	nfiltros=i1;
	console.log('nfiltros: '+nfiltros);
	console.log('n_input_filtros: '+n_input_filtros);
}

function crea_input(nombre, div)
{
	var inp=document.createElement('input');
	inp.id=nombre;
	div.appendChild(inp);
	inp.style.color='#000000';
	inp.type='text';
	inp.size=8;
	inp.style.height='20px';
}

function crea_boton(nombre, texto_inner, titul, div)
{
	var bot = document.createElement('button');
	bot.id = nombre;
	div.appendChild(bot);
	bot.innerHTML = texto_inner;
	bot.title=titul;
	bot.className='Boton';
}

function crea_select_tipo(nombre, div)
{
	tipo=document.createElement('select');
	tipo.style.color='#000000';
	div.appendChild(tipo);
	tipo.id=nombre;
	opcion1=document.createElement("option");
	opcion1.value='s';
	opcion1.text='salto';
	tipo.appendChild(opcion1);
	opcion2=document.createElement("option");
	opcion2.value='a';
	opcion2.text='audio';
	tipo.appendChild(opcion2);
	opcion3=document.createElement("option");
	opcion3.value='i';
	opcion3.text='imagen';
	tipo.appendChild(opcion3);
	opcion4=document.createElement("option");
	opcion4.value='st';
	opcion4.text='subtitulos';
	tipo.appendChild(opcion4);
	opcion5=document.createElement("option");
	opcion5.value='e';
	opcion5.text='escena';
	tipo.appendChild(opcion5);
}

function escribe_filtros()
{
//if (typeof(nfiltros)!== 'undefined')
if (nfiltros!== null)
{
	console.log('escribe_filtros '+nfiltros);
	for (i=1; i<=nfiltros; i++)
	{
		if (i>n_input_filtros)
		{
			crea_input('inicio'+i, divfiltros);
			crea_input('final'+i, divfiltros);
			crea_select_tipo('tipo'+i, divfiltros)
			crea_boton('copia'+i, 'copia', 'copia en filtro '+i, divfiltros);
			crea_boton('prueba'+i, 'prueba', 'prueba filtro '+i, divfiltros);
			divfiltros.insertAdjacentHTML('beforeend', br1);
			document.getElementById('copia'+i).onclick = function()
			{
				num_filtro=this.id.substr(5);
//				num_filtro=this.id.substr(6);
//console.log(num_filtro);
				document.getElementById('inicio'+num_filtro).value = document.getElementById('inicio0').value;
				document.getElementById('final'+num_filtro).value = document.getElementById('final0').value;
				document.getElementById('tipo'+num_filtro).value = document.getElementById('tipo0').value;
			}
			document.getElementById('prueba'+i).onclick = function()
			{
//				num_filtro=this.id.substr(5);
				num_filtro=this.id.substr(6);
//				console.log(num_filtro);
				lee_filtros_prueba();
				goToTime(fromHMS(document.getElementById('inicio'+num_filtro).value)-10+anuncios);
			}
			n_input_filtros=i;
		}
		document.getElementById('inicio'+i).value = toHMS(filtros[i].inicio);
		document.getElementById('final'+i).value = toHMS(filtros[i].fin);
		document.getElementById('tipo'+i).value = filtros[i].tipo;
	}
}
//console.log('escribe_filtros_fin');
}

function crea_divfondo()
{

console.log('divfondo');
	Borroso = document.createElement('div');
	Borroso.style.display = 'none'
	Borroso.style.position = 'absolute';
	Borroso.style.zIndex = 99999999;
	Borroso.style.border = "none";
	Borroso.style.borderRadius = "0px";
        Borroso.style.height = Video.clientHeight + 'px';
        Borroso.style.width = Video.clientWidth + 'px';
        Borroso.style.top = '0px';
        Borroso.style.left = '0px';
	if (navegador_Firefox || plataforma == 'amazon')
	{
		Borroso.style.filter = "blur(25px)";
		Borroso.style.backgroundColor = 'black'
	}
	else
	{
		Borroso.style.backdropFilter = "blur(20px)"
	}
	Video.parentNode.insertBefore(Borroso, Video);

	var css = '.Fondo_editor {border: none;max-width: 1000px;background-color: rgba(255, 0, 0, 0.35);padding-left: 10px;padding-right: 10px;font-size: 12px;position:absolute;top:0px}';
	css=css+' .Boton_cerrar {font-weight: bold; font-size: 2em; color: white;background-color: #ec0000;}';
	css=css+' .Boton {-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;font-family: Arial;font-size: 12px; padding-left: 3px; padding-rigth: 3px; padding-top: 0px; padding-bottom: 0px; text-decoration: none; border: 0px; color: #ffffff; background: #ec0000; height:20px}';
	css=css+' p {font-size: 12px; color: yellow;}';
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');

	head.appendChild(style);

	style.type = 'text/css';
	if (style.styleSheet)
	{
		style.styleSheet.cssText = css;
	}
	else
	{
		style.appendChild(document.createTextNode(css));
	}

	Editor = document.createElement('div');
	if (plataforma=='apple')
	{
		var clickable=document.getElementsByClassName('scrim__clickable');
		var clickable0=clickable[0];

		clickable0.parentNode.insertBefore(Editor, clickable0);
	}
	else
	{
console.log('else');
		document.body.appendChild(Editor);
	}
	Editor.style.position = 'fixed';
	Editor.style.top = '0px';
	Editor.style.left = Video.offsetWidth - 375 + 'px';
	Editor.style.zIndex = '10000000';
	Editor.style.width = '375px';
	Editor.style.height = '0px';
	Editor.style.fontSize = '12px';

	Logo_Editor = document.createElement('img');
	Editor.appendChild(Logo_Editor);
	Logo_Editor.src = chrome.runtime.getURL('/img/icon64.png');
	Logo_Editor.id = 'Logo_Editor';
	Logo_Editor.title = 'Abre el editor';
	Logo_Editor.style.display = 'none';
	Logo_Editor.style.position = 'absolute';
	Logo_Editor.style.top = '73px';
	Logo_Editor.style.left = '280px';
	Logo_Editor.style.height = 'auto';
	Logo_Editor.onclick = function()
	{
		Logo_Editor.style.display = 'none';
		divfondo.style.display = 'block'
	}


	divfondo=document.createElement("div");
	Editor.appendChild(divfondo);
	divfondo.id='fondo';
	divfondo.className='Fondo_editor';

	cerrar = document.createElement("button");
	divfondo.appendChild(cerrar);
	cerrar.id = 'cerrar';
	cerrar.title = 'cerrar la ventana';
	cerrar.innerHTML = 'X';
	cerrar.className='Boton_cerrar';
	cerrar.onclick = function()
	{
		Logo_Editor.style.display = 'block'
		divfondo.style.display = 'none';
	}

	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_input('input_tiempo_actual', divfondo);

	crea_boton('salta', 'Salta', 'Ir al tiempo seleccionado', divfondo);
	document.getElementById('salta').onclick = function()
	{
	        goToTime(fromHMS(input_tiempo_actual.value));
	}
	crea_boton('pausa', 'Pause', 'Pause / Play', divfondo);
	document.getElementById('pausa').onclick = function()
	{
		if (Video.paused)
		{
			Video.play();
			document.getElementById('pausa').innerHTML='Pause';
		}
		else
		{
			Video.pause();
			document.getElementById('pausa').innerHTML='Play';
		}
	}

	crea_boton('uno', 'x1', 'x1', divfondo);
	document.getElementById('uno').onclick = function()
	{
		velocidad=1;
	}
	crea_boton('uno_medio', 'x1.5', 'x1.5', divfondo);
	document.getElementById('uno_medio').onclick = function()
	{
		velocidad=1.5;
	}
	crea_boton('dos', 'x2', 'x2', divfondo);
	document.getElementById('dos').onclick = function()
	{
		velocidad=2;
	}
	crea_boton('cuatro', 'x4', 'x4', divfondo);
	document.getElementById('cuatro').onclick = function()
	{
		velocidad=4;
	}

	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_boton('r10m', "-10'", 'retrasar diez minutos', divfondo);
	document.getElementById('r10m').onclick = function()
	{
		goToTime(tiempo_actual()-600);
	}
	crea_boton('r1m', "-1'", 'retrasar un minuto', divfondo);
	document.getElementById('r1m').onclick = function()
	{
		goToTime(tiempo_actual()-60);
	}
	crea_boton('r10s', '-10"', 'retrasar diez segundos', divfondo);
	document.getElementById('r10s').onclick = function()
	{
		goToTime(tiempo_actual()-10);
	}
	crea_boton('r1s', '-1"', 'retrasar un segundo', divfondo);
	document.getElementById('r1s').onclick = function()
	{
		goToTime(tiempo_actual()-1);
	}
	crea_boton('r1d', '-0.1"', 'retrasar una décima', divfondo);
	document.getElementById('r1d').onclick = function()
	{
		goToTime(tiempo_actual()-.1);
	}
	crea_boton('a1d', '+0,1"', 'adelantar una décima', divfondo);
	document.getElementById('a1d').onclick = function()
	{
		goToTime(tiempo_actual()+.1);
	}
	crea_boton('a1s', '+1"', 'adelantar un segundo', divfondo);
	document.getElementById('a1s').onclick = function()
	{
		goToTime(tiempo_actual()+1);
	}
	crea_boton('a10s', '+10"', 'adelantar diez segundos', divfondo);
	document.getElementById('a10s').onclick = function()
	{
		goToTime(tiempo_actual()+10);
	}
	crea_boton('a1m', "+1'", 'adelantar un minuto', divfondo);
	document.getElementById('a1m').onclick = function()
	{
		goToTime(tiempo_actual()+60);
	}
	crea_boton('a10m', "+10'", 'adelantar diez minutos', divfondo);
	document.getElementById('a10m').onclick = function()
	{
		goToTime(tiempo_actual()+600);
	}


	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_input('inicio0', divfondo);
	crea_boton('icopia', "copia inicio", 'copia tiempo', divfondo);
	document.getElementById('icopia').onclick = function()
	{
		document.getElementById('inicio0').value=input_tiempo_actual.value;
	}
	crea_boton('ri1s', '-1"', 'retrasar un segundo', divfondo);
	document.getElementById('ri1s').onclick = function()
	{
		document.getElementById('inicio0').value=toHMS(fromHMS(inicio0.value)-1);
	}
	crea_boton('ri1d', '-0,1"', 'retrasar una décima', divfondo);
	document.getElementById('ri1d').onclick = function()
	{
		document.getElementById('inicio0').value=toHMS(fromHMS(inicio0.value)-.1);
	}
	crea_boton('ai1d', '+0,1"', 'adelantar una décima', divfondo);
	document.getElementById('ai1d').onclick = function()
	{
		document.getElementById('inicio0').value=toHMS(fromHMS(inicio0.value)+.1);
	}
	crea_boton('ai1s', '+1"', 'adelantar un segundo', divfondo);
	document.getElementById('ai1s').onclick = function()
	{
		document.getElementById('inicio0').value=toHMS(fromHMS(inicio0.value)+1);
	}

	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_input('final0', divfondo);
	crea_boton('fcopia', "copia final", 'copia tiempo', divfondo);
	document.getElementById('fcopia').onclick = function()
	{
		document.getElementById('final0').value=input_tiempo_actual.value;
	}
	crea_boton('rf1s', '-1"', 'retrasar un segundo', divfondo);
	document.getElementById('rf1s').onclick = function()
	{
		document.getElementById('final0').value=toHMS(fromHMS(final0.value)-1);
	}
	crea_boton('rf1d', '-0,1"', 'retrasar una décima', divfondo);
	document.getElementById('rf1d').onclick = function()
	{
		document.getElementById('final0').value=toHMS(fromHMS(final0.value)-.1);
	}
	crea_boton('af1d', '+0,1"', 'adelantar una décima', divfondo);
	document.getElementById('af1d').onclick = function()
	{
		document.getElementById('final0').value=toHMS(fromHMS(final0.value)+.1);
	}
	crea_boton('af1s', '+1"', 'adelantar un segundo', divfondo);
	document.getElementById('af1s').onclick = function()
	{
		document.getElementById('final0').value=toHMS(fromHMS(final0.value)+1);
	}

	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_boton('borroso100', 'borroso', 'borroso', divfondo);
	document.getElementById('borroso100').onclick = function()
	{
		Borroso.style.display = '';
		Borroso.style.opacity = 0.99;
	}

	crea_boton('borroso75', 'borroso 75%', 'borroso 75%', divfondo);
	document.getElementById('borroso75').onclick = function()
	{
		Borroso.style.display = '';
		Borroso.style.opacity = 0.966;
	}

	crea_boton('borroso50', 'borroso 50%', 'borroso 50%', divfondo);
	document.getElementById('borroso50').onclick = function()
	{
		Borroso.style.display = '';
		Borroso.style.opacity = 0.9;
	}

	crea_boton('borroso25', 'borroso 25%', 'borroso 25%', divfondo);
	document.getElementById('borroso25').onclick = function()
	{
		Borroso.style.display = '';
		Borroso.style.opacity = 0.8;
	}


	crea_boton('claro', 'claro', 'claro', divfondo);
	document.getElementById('claro').onclick = function()
	{
		Borroso.style.display = 'none';
	}

	divfondo.insertAdjacentHTML('beforeend', br1);

	crea_select_tipo('tipo0', divfondo)
	crea_boton('prueba0', 'prueba', 'prueba', divfondo);
	document.getElementById('prueba0').onclick = function()
	{
		lee_filtros_prueba();
		goToTime(fromHMS(document.getElementById('inicio0').value)-10+anuncios);
	}

	crea_boton('graba', 'graba', 'graba los filtros en un fichero', divfondo);
	document.getElementById('graba').onclick = function()
	{
		grabar();
	}
	divfondo.appendChild(graba);

	divfondo.insertAdjacentHTML('beforeend', br1);

	divfiltros=document.createElement("div");
	divfondo.appendChild(divfiltros);
	divfiltros.id='divfiltros';
	divfiltros.style.height='15em';
	divfiltros.style.overflowY='scroll';


	crea_boton('anade_filtro', 'Añade un filtro', 'Añade una linea de filtro vacia', divfondo);
	document.getElementById('anade_filtro').onclick = function()
	{
		if (nfiltros=='NO')
		{
			nfiltros=1;
		}
		else
		{
			nfiltros++;
		}
		n_input_filtros++;
console.log('n_input_filtros añade'+n_input_filtros);
		crea_input('inicio'+n_input_filtros, divfiltros);
		crea_input('final'+n_input_filtros, divfiltros);
		crea_select_tipo('tipo'+n_input_filtros, divfiltros)
		crea_boton('copia'+n_input_filtros, 'copia', 'copia en filtro '+n_input_filtros, divfiltros);
		crea_boton('prueba'+n_input_filtros, 'prueba', 'prueba filtro '+n_input_filtros, divfiltros);
		filtros[nfiltros]={"tipo":'salto', "inicio": 0, "fin": 0};
//console.log('inicio: '+filtros[nfiltros].inicio);
		divfiltros.insertAdjacentHTML('beforeend', br1);
		document.getElementById('copia'+n_input_filtros).onclick = function()
		{
//			console.log('id: '+this.id);
			num_filtro=this.id.substr(5);
//			console.log('num: '+num_filtro);
			document.getElementById('inicio'+num_filtro).value = document.getElementById('inicio0').value;
			document.getElementById('final'+num_filtro).value = document.getElementById('final0').value;
			document.getElementById('tipo'+num_filtro).value = document.getElementById('tipo0').value;
		}
		document.getElementById('prueba'+n_input_filtros).onclick = function()
		{
			num_filtro=this.id.substr(6);
			lee_filtros_prueba();
			goToTime(fromHMS(document.getElementById('inicio'+num_filtro).value)-10+anuncios);
		}
//		console.log('n_input_filtros: '+n_input_filtros);
	}
	

	crea_boton('copia_url_klinema', 'Copia url Klinema', 'Copia url para entrarla en Klinema', divfondo);
	document.getElementById('copia_url_klinema').onclick = function()
	{
	        copia_url_klinema();
	}
	crea_boton('copia_url_filtros', 'Copia url con filtros', 'Copia url con los filtros', divfondo);
	document.getElementById('copia_url_filtros').onclick = function()
	{
	        copia_url_filtros();
	}
	crea_input('url', divfondo);
//	document.getElementById('url').type = 'hidden';
	escribe_filtros();
}

function prepara_filtros()
{
	console.log('prepara_filtros');
	nfiltros=0;
	filtro='';
	for (i=1;i<=filtros;i++)
	{
		if ((document.getElementById('inicio'+i).value != '') && (document.getElementById('final'+i).value != ''))
		{
			filtro=filtro+document.getElementById('tipo'+i).value+'A'+fromHMS(document.getElementById('inicio'+i).value)+'A'+fromHMS(document.getElementById('final'+i).value)+'B';
			nfiltros++;
		}
	}
	switch (plataforma)
	{
		case 'netflix':
			filtro=nfiltros+'A'+id_pelicula+'B'+filtro;
			break;
		case 'primevideo':		
			filtro=nfiltros+'A'+Video.duration+'B'+filtro;
			break;
		default:
			filtro=nfiltros+'B'+filtro;
	}
//	console.log(plataforma+'--->'+filtro);
}

function prepara_url()
{
	console.log('prepara_url');
	url=document.getElementById('url');
	url.value=url_actual;
	url_actual=window.location.href;
	busca_id_pelicula();
	var partes_url_actual = url_actual.split('?');
	url_sin_filtros=partes_url_actual[0];
	prepara_filtros();
	url_con_filtros=partes_url_actual[0]+'?filtros='+filtro;
	if (plataforma=='movistarplus')
	{
		url_sin_filtros=partes_url_actual[0]+'?id='+id_pelicula;
		url_con_filtros=partes_url_actual[0]+'?id='+id_pelicula+'&filtros='+filtro;
	}
	if (plataforma=='filmin')
	{
		var type=parametro['type'];
		console.log('filmin: '+type);
		url_sin_filtros=partes_url_actual[0]+'?type='+type+'&mediaId='+id_pelicula;
		url_con_filtros=partes_url_actual[0]+'?type='+type+'&mediaId='+id_pelicula+'&filtros='+filtro;
	}
console.log(plataforma+'--'+url_sin_filtros);
console.log(plataforma+'--'+url_con_filtros);
}
//Fin parte de klinema editor


function copia_url_klinema()
{
	prepara_url();
	url.value=url_sin_filtros;
	url.select();
	document.execCommand("copy");	
}

function copia_url_filtros()
{
	prepara_url();
	url.value=url_con_filtros;
console.log('==>'+url_con_filtros);
	url.select();
	document.execCommand("copy");	
}
//Fin parte de klinema editor

function crea_mensaje_logo()
{
	DivLogo = document.createElement('div');
	document.body.appendChild(DivLogo);
	DivLogo.style.position = 'fixed';
	DivLogo.style.top = '0px';
	DivLogo.style.left = '0px';
	DivLogo.style.zIndex = '10000000';
	DivLogo.style.width = '375px';
	DivLogo.style.height = '0px';
	DivLogo.style.fontSize = '12px';

	Mensaje = document.createElement('span');
	Mensaje.style.position = 'absolute';
	Mensaje.style.zIndex = 1000000;
	Mensaje.textContent = '';
	Mensaje.style.fontSize = "xx-large";
	Mensaje.style.color = "white";
	Mensaje.style.fontFamily = "sans-serif";
	Mensaje.style.backgroundColor = "rgba(0, 0, 0, 0.33)";
	Mensaje.onclick = function()
	{
		K_roja='NO';
	}

	DivLogo.appendChild(Mensaje);
	Logo_mensaje = document.createElement('img');
	Logo_mensaje.style.position = 'absolute';
	Logo_mensaje.style.top = '73px';
	Logo_mensaje.style.left = '75px';
	Logo_mensaje.style.zIndex = 1000001;
	Logo_mensaje.style.height = 'auto';
	Logo_mensaje.onclick = function()
	{
		console.log('Logo_mensaje.onclick');
		K_roja='NO';
	}
	DivLogo.appendChild(Logo_mensaje);
}

function crea_logo_espera()
{
	DivLogo2 = document.createElement('div');
	document.body.appendChild(DivLogo2);
	DivLogo2.style.position = 'fixed';
	var coords=Video.getBoundingClientRect();
	var w=coords.left+Math.trunc(coords.width/2)-75;
	var h=Math.trunc(coords.top+coords.height/2)-75;
	DivLogo2.style.top = h+'px';
	DivLogo2.style.left = w+'px';
//console.log('COOORDS: '+coords.width+' h'+coords.height+' w'+w+'h'+h);
	DivLogo2.style.zIndex = '10000000';
	DivLogo2.style.width = '75px';
	DivLogo2.style.height = '75px';
	var coords2=DivLogo2.getBoundingClientRect();

	Logo_espera = document.createElement('img');
	Logo_espera.style.position = 'relative';
	Logo_espera.style.top = '0px';
	Logo_espera.style.left = '0px';
	Logo_espera.style.zIndex = 1000001;
	Logo_espera.style.height = '75px';
	Logo_espera.style.height = '75px';
	Logo_espera.onclick = function()
	{
		console.log('Logo_espera.onclick');
		K_roja='NO';
	}
	DivLogo2.appendChild(Logo_espera);
	Logo_espera.style.display = 'none';
	Logo_espera.src = chrome.runtime.getURL('/img/cargando.gif');
}

function busca_id_pelicula()
{
	var partes_url_actual = url_actual.split('?');
	if (partes_url_actual[1]==undefined)
		partes_url_actual[1]='';
	var partes_actual=partes_url_actual[0].split('/');
	id_pelicula_actual='';

	parametro_mediaId='';
	parametro_id='';
	var parametros_todos_actual=partes_url_actual[1].split('&');
	for (var [key, value] of Object.entries(parametros_todos)) 
	{
		nombres_parametros=value.split('=');
		if (nombres_parametros[0]=='mediaId')
			parametro_mediaId=nombres_parametros[1];
		if (nombres_parametros[0]=='id')
			parametro_id=nombres_parametros[1];
	}

	if (plataforma=='apple')
	{
		id_pelicula_actual=partes_actual[6];
console.log('id:'+id_pelicula_actual);
	}
	if (plataforma=='hbomax')
	{
		var partes_hbo=partes_actual[4].split(':');
		id_pelicula_actual=partes_hbo[3];
	}

	if (plataforma=='disneyplus')
	{
		if (partes_actual[4]=='video')
			id_pelicula_actual=partes_actual[5];
		if (partes_actual[3]=='video')
			id_pelicula_actual=partes_actual[4];
	}
	if (plataforma=='netflix')
	{
		id_pelicula_actual = partes_actual[4];
	}

	if (plataforma=='filmin')
	{
		id_pelicula_actual=parametro_mediaId;
	}

	if (plataforma=='google')
	{
		var partes_google = partes_actual[7].split(':');
		id_pelicula_actual = partes_google[2];
	}


	if (plataforma=='primevideo')
	{
		if (partes_actual[3]=='detail')
		{
			id_pelicula_actual = partes_actual[4].split('?');
		}
		if (partes_actual[4]=='detail')
		{
			id_pelicula_actual = partes_actual[5].split('?');
		}
		if (partes_actual[5]=='detail')
		{
			id_pelicula_actual = partes_actual[6].split('?');
		}
	}

	if (plataforma=='movistarplus')
	{
		id_pelicula_actual = parametro['id'];
	}

	if (plataforma=='disneyplus')
	{
		if (partes_actual[4]=='video')
			id_pelicula_actual = partes_actual[5];
		if (partes_actual[3]=='video')
			id_pelicula_actual = partes_actual[4];
	}
}

function toHMS(seconds) 
{
	var hours = Math.floor(seconds / 3600);
	seconds -= hours * 3600;
	var minutes = Math.floor(seconds / 60);
	minutes = (minutes >= 10) ? minutes : "0" + minutes;
	seconds = Math.floor((seconds % 60) * 100) / 100;
	seconds = (seconds >= 10) ? seconds : "0" + seconds;
	return hours + ":" + minutes + ":" + seconds;
}

function fromHMS(timeString)
{
	timeString = timeString.replace(/,/,".");
	var time = timeString.split(":");
	if(time.length == 3)
	{
		return parseInt(time[0])*3600 + parseInt(time[1])*60 + parseFloat(time[2])
	}
	else
		if(time.length == 2)
		{
			return parseInt(time[0])*60 + parseFloat(time[1])
		}
		else
		{
			return parseFloat(time[0])
		}
}

function busca_video()
{
console.log('busca_video');
	var Videos = new Array;
	Videos.push(document.querySelectorAll("yomvi"));
	Videos.push(document.querySelectorAll("video"));
	var iframes = document.querySelectorAll("iframe");
	for (var i = 0; i < iframes.length; i++)
	{
		try
		{
			Videos.push(iframes[i].contentWindow.document.querySelectorAll('video'))
		}catch(err){}
	}

	var e=document.querySelector("disney-web-player");
	if (e!=null)
	{
		f=e.shadowRoot
		if (f!=null)
		{
			f1=f.querySelectorAll('video');
			Videos.push(f1);
		}
		g=e.querySelectorAll('video');
		if (g!=null)
			Videos.push(g);
	}

	var Videos_visibles = new Array;
	for (var i = 0; i < Videos.length; i++)
	{
		for (var j = 0; j < Videos[i].length; j++)
		{
			if (es_visible(Videos[i][j]))
			{
				Videos_visibles.push(Videos[i][j]);
			}
		}
	}

//	console.log('videos visibles length: '+Videos_visibles.length)
	if (Videos_visibles.length > 0) 
		Video_OK = Videos_visibles[Videos_visibles.length-1];
	if ((Videos_visibles.length > 1) && (plataforma=='disney'))
		Video_OK = Videos_visibles[Videos_visibles.length-2];

	if ((Video_OK!=null) && (plataforma=='primevideo'))
	if (Video_OK.currentSrc.substr(0,5)!='blob:')
	{
		Video_OK=null;
		video_es_OK='NO';
		console.log('Video es OK pasa a NO');
	}

	if (Video!=Video_OK)
	{
		Video=Video_OK;

		if (DivLogo==null)
		{
			crea_mensaje_logo();
			crea_logo_espera();
		}
//Parte para Klinema editor
		if (editor=='SI')
		if (divfondo==null)
		{
// En Filmin en la pantalla inicial aparece a la derecha fuera de pantalla y no se puede cerrar
			if (Video.offsetWidth>375)
				crea_divfondo();
		}
		else
		{
			escribe_filtros();
		}
//Fin parte de Klinema editor
		console.log('Video es OK pasa a OKKKK');

		video_es_OK='OK';
		muestra_logo();

// Compruebo que los filtros corresponden a la película. Cada plataforma requiere su método.
		if ((plataforma=='netflix') || (plataforma=='disneyplus') || (plataforma=='filmin'))
		{
//console.log('busca_video Netflix disney filmin');

			url_actual=window.location.href;
			busca_id_pelicula();
			if (id_pelicula=='')
				id_pelicula=id_pelicula_actual;
			if ((id_pelicula_netflix!=id_pelicula_actual) && (plataforma=='netflix'))
			{
				console.log('Video es OK pasa a NO '+id_pelicula_netflix+' '+id_pelicula_actual);
				video_es_OK='NO';
			}
			if ((id_pelicula!=id_pelicula_actual) && (plataforma!='netflix'))
			{
				console.log('Video es OK pasa a NO');
				video_es_OK='NO';
			}
		}
//console.log('busca_video muestra logo');

//Prepara para comprobar si hay que aplicar un filtro cuando cambia de fotograma
//El if es sólo para el editor
//		Video.ontimeupdate = function(){
//console.log('ontime2');
//			if (!!(document.getElementById('tiempo_actual')))
//			{
//				document.getElementById('tiempo_actual').value=toHMS(tiempo_actual()-anuncios);
//			}
//			comprueba_filtros();
//		}
		muestra_logo();
	}

	if (video_es_OK=='OK')
	{
//coloco en su lugar la rueda cuando hace un salto Disney y se ha cambiado el ancho del video
		var coords=Video.getBoundingClientRect();
		var w=coords.left+Math.trunc(coords.width/2)-75;
		var h=Math.trunc(coords.top+coords.height/2)-75;
//console.log('cw: '+coords.width+' ch: '+coords.height+' w: '+w+'h: '+h);
		DivLogo2.style.top = h+'px';
		DivLogo2.style.left = w+'px';
//esta parte solo es para Klinema editor.
		if (editor=='SI')
		{
			var v2=coords.width - 375;
			Editor.style.left = v2 + 'px';
		}

//compruebo si ha cambiado la película o el episodio, pero mantiene la misma url
		if (plataforma=='primevideo')
		{
			var h2_prime=document.querySelectorAll('h2');
			for (zz=0;zz<h2_prime.length;zz++)
			{
				if(h2_prime[zz] != null)
				{
					if (h2_prime[zz].className.substr(0,29)=='atvwebplayersdk-subtitle-text')
					{
						if (titulo_ok==0)
						{
							titulo_pelicula=h2_prime[zz].innerHTML;
							if (h2_prime[zz].innerHTML.length>0)
								titulo_ok=1;
						}
						else
						{
							if (titulo_pelicula!=h2_prime[zz].innerHTML)
							{
		console.log('Video es OK pasa a NO');
								video_es_OK='NO';
							}
						}
					}
				}
			}
		}

		if (plataforma=='movistarplus')
		{
			var tit_HTML=document.getElementById('pyr-tv-button');
			if (tit_HTML!=null)
			{
				var n1=tit_HTML.innerHTML.search('>');
				var tit1=tit_HTML.innerHTML.substr(n1+1);
				var n2=tit1.search('<');
				var tit=tit1.substr(0, n2-1);
				if (titulo_ok==0)
				{
					titulo_pelicula=tit;
					titulo_ok=1;
				}
				else
				{
					if (titulo_pelicula!=tit)
					{
		console.log('Video es OK pasa a NO');
						video_es_OK='NO';
					}
				}
			}
		}
		if (plataforma=='apple')
		{
			var spans=document.querySelectorAll('span');
			for (zz=0;zz<spans.length;zz++)
			{
				if (spans[zz].className.substr(0,5)=='scrim')
				{
					if (titulo_ok==0)
					{
						if (spans[zz].innerHTML.length>0)
						{
							titulo_pelicula=spans[zz].innerHTML;
							titulo_ok=1;
						}
					}
					else
					{
						if (titulo_pelicula!=spans[zz].innerHTML)
						{
		console.log('Video es OK pasa a NO');
							video_es_OK='NO';
						}
					}
				}
			}
		}
		if (plataforma=='hbomax')
		{
			url_actual=window.location.href;
			busca_id_pelicula();
			if (id_pelicula=='')
				id_pelicula=id_pelicula_actual;
			if ((id_pelicula_netflix!=id_pelicula_actual) && (plataforma=='netflix'))
			{
		console.log('Video es OK pasa a NO');
				video_es_OK='NO';
			}
			if ((id_pelicula!=id_pelicula_actual) && (plataforma!='netflix'))
			{
		console.log('Video es OK pasa a NO');
				video_es_OK='NO';
			}
		}
		if (plataforma=='filmin')
		{
			url_actual=window.location.href;
			busca_id_pelicula();
			if (id_pelicula_filmin!=id_pelicula_actual)
				video_es_OK='NO';
		}

//Disney Si se envia por cast no funciona, esta parte no está comprobada, parece que en algunos casos sí funciona.
		var cast=document.querySelector("control-icon-btn chromecast chromecast-connected-icon tooltip__bottom tooltip__center");
		var casts=document.getElementsByClassName("control-icon-btn chromecast chromecast-connected-icon tooltip__bottom tooltip__center");
		if (casts.length>0)
		{
		console.log('Video es OK pasa a NO');
			video_es_OK='NO';
			chromecast=1;
		}
	}

//Parte solo si se aplican filtros a los subtítulos
	if (Video!=null)
	{
//Parte que busca los subtítulos y crea una llamada a cambio_subs cuando cambian
// cada plataforma tiene su manera de mostrar los subtítulos
// Creo que solo hace falta ejecutarla con un video nuevo, no cada 3 segundos
		for(var name in subsClasses)
		{
			if(plataforma.includes(name))
			{
				subsClass = subsClasses[name];
				if (plataforma=='hbomax')
				{
					if (imax==0)
					{
						max=99999;
						for (i=0;i<divs.length;i++)
						{
							if ((divs[i].innerHTML.indexOf('video>')>0) && (divs[i].innerHTML.indexOf('video>')<max))
							{
								imax=i;
								max=divs[i].innerHTML.indexOf('video>');
							}
						}
						observer = new MutationObserver(cambio_subs);
						observer.observe(divs[imax+1], {characterData: true, childList: true, attributes: false});
					}
				}

				if (plataforma=='apple')
				{
					subs3 = Video.nextSibling;
				}

				if ((plataforma=='primevideo') || (plataforma=='netflix') || (plataforma=='google') || (plataforma=='rakuten'))
				{
				        subs = document.querySelector(subsClass);		//special cases
					if (subs!=null)
					{
						observer = new MutationObserver(cambio_subs);
						observer.observe(subs, {characterData: true, childList: true, attributes: false});
//						if ((subtitulos=='NO') && (subs!=null))
//						{
//							subs.style.opacity = 0;
//						}
					}
				}

				if (plataforma == 'disneyplus')
				{
//				        subs2 = document.querySelector('.dss-hls-subtitle-overlay');
//					if (subs2==null)
//					{
//						observer = new MutationObserver(cambio_subs);
//						observer.observe(subs2, {characterData: true, childList: true, attributes: false});
		        			subs = document.querySelector(subsClass);
//console.log('subs: '+subs);
//						if ((subtitulos=='NO') && (subs!=null))
//						{
//							subs.style.opacity = 0;
//						}
//					}
				}
			}
		}
	}
}
//fin busca video

function comprueba_filtros()
{
	ahora=tiempo_actual();
	console.log('comprueba_filtros: '+nfiltros+' n_input_filtros: '+n_input_filtros+'  ahora...'+ahora);

	if (plataforma=='primevideo')
	{
		tiempo_ok=0;
		console.log('currentTime: '+ahora);
		var c=document.getElementsByClassName('atvwebplayersdk-timeindicator-text');
		if (c.length>0)
		{
			t=c[0].innerText;
			pt=t.indexOf("/");
			spt=fromHMS(t.substr(0,pt));
			anuncios=Math.trunc(ahora-spt);
			if (anuncios==undefined)
				anuncios=0;
			tiempo_ok=1;
			prime_ok=1;
		}
	}
console.log('anuncios: '+anuncios);

// Si hay un anuncio de netflix hay que volver atrás para que el tiempo sea el correcto
	if (plataforma=='netflix')
	{
		var anuncio_netflix=document.getElementsByClassName("ltr-m66rkx");
		if (anuncio_netflix.length>0)
		{
			if (hay_anuncio_netflix==0)
			{
				hay_anuncio_netflix=1;
				tiempo_anuncio=ahora-5;
			}
		}
		else
		{
			if (hay_anuncio_netflix==1)
			{
				hay_anuncio_netflix=0;
				goToTime(tiempo_anuncio);
			}
		}				
	}


//Los anuncios sólo se pueden quitar al editar, los usuarios de Klinema han de ver los anuncios
// Salto los anuncios de Movistar
	if (editor=='SI')
	if ((Video.duration<100) && (ahora<Video.duration-2) && (plataforma == 'movistarplus'))
	{
		console.log('salto anuncio Movistar');
		goToTime(Video.duration-1);
	}

//anuncios PrimeVideo
	if (editor=='SI')
	if (plataforma=='primevideo')
	{
		var c=document.getElementsByClassName('atvwebplayersdk-ad-timer-remaining-time');
		if (c.length>0)
		{
			console.log('salto anuncio primevideo');
			t=c[0].innerText;
			var tiempo_salta_anuncio=ahora+fromHMS(t)-2;
			console.log('salto de: '+ahora+ ' a '+tiempo_salta_anuncio);
			if (ahora<tiempo_salta_anuncio-1)
			{
				console.log('goto');
				goToTime(tiempo_salta_anuncio);
			}
			else
			{
				console.log('else');
				Video.play();
			}
		}
		var div_prime=document.querySelectorAll('div');

	}

// Compruebo los saltos de Netflix, en ocasiones salta a un punto anterior del que se le ha indicado.
// Con los de Disney también ocurre
	if (salto_a_comprobar==1)
	{
console.log('salto_a_comprobar: '+destino);
		if (ahora<origen)
		{
// En filtros muy cortos puede saltar a un punto anterior al origen
// Como siempre salta igual, lo cambio en el tipo de filtro
// 'n' no hace un salto, pone la pantalla negra, quita el sonido y avanza rápido
console.log('ha saltado a un punto anterior, pongo tipo de salto n');
			filtros[ultimo_salto].text='n';
		}
		console.log('longitud salto='+(ahora-origen));
		longitud_salto=ahora-origen;
//		if ((tiempo_actual()+10<destino))
//		{
//
//salta si ha de saltar más de 4 segundos y el último salto ha sido de más de un segundo.
//sino va rápido al final del filtro
//		if ((tiempo_actual()+4<destino) && (longitud_salto>1))
//		{
//			rapido=0;
//		}
//		else
//		{
//			rapido=1;
//		}
//		if (longitud_salto>1)
//		{
//			rapido=0;
//		}
//		else
//		{
//			rapido=1;
//		}
//hay que comprobar que los saltos largos de disney funcionan
		if ((plataforma=='disney') && (ahora+30<destino))
		{
//console.log('salto largo de Disney');
			rapido=1;
//			filtros[ultimo_salto].tipo='n';
		}
		if (ahora<destino)
		{
			rapido=1;
		}
		if (ahora>destino)
		{
			rapido=0;
			salto_a_comprobar=0;
			ultimo_salto=-1;
		}
console.log('salto_a_comprobar: '+destino+' rapido: '+rapido);
	}
	accion='';

	if (typeof(nfiltros)!== 'undefined')
 	{
	console.log('compruebo los filtros, hay: '+nfiltros);
	for(var i = 1; i <= nfiltros; i++)
	{
		inicio_i = filtros[i].inicio+anuncios;
		fin_i = filtros[i].fin+anuncios;
console.log(' filtro '+i+'. inicio: '+inicio_i);
		if (ahora > inicio_i && ahora < fin_i-.1)
		{
			accion_i = filtros[i].tipo;
console.log('dentro del filtro '+i+'inicio: '+inicio_i+' fin: '+fin_i+' accion: '+accion_i);

			if (accion_i == 's') //salto
			{
				accion = 's';
				tempcorte = i;
				fin=fin_i;
			}

			if(accion_i == 'i')	//imagen
			{
				if (accion != 's')
				{
					accion = 'i';
					tempcorte = i;
				}
			}

			if(accion_i == 'a')	//audio
			{
				if (accion != 's')
				{
					if (accion == 'i')
						accion = 'n';
					else
						accion='a';
					tempcorte = i;
				}
			}

			if(accion_i == 'n')	//audio e imagen, también irá rápido
			{
				accion = 'n'
				tempcorte = i;
			}
		}
	}
	}

	if (filtros[1]!==undefined)
	{
		if ((filtros[1].tipo=='e') && (escena_primera_vez==1))
		{
			accion='s';
			tempcorte=1;
			fin = filtros[1].inicio+anuncios;
			escena_primera_vez=0;
		}
		if ((filtros[1].tipo=='e') && (ahora.value < filtros[1].inicio))
		{
			accion='s';
			tempcorte=1;
			fin = filtros[1].inicio+anuncios;
			escena_primera_vez=0;
		}
		if ((filtros[1].tipo=='e') && (escena_inicio==0))
		{
			if (ahora.value < filtros[1].fin)
			{
				escena_inicio=1;
				Video.play();
			}
		}

		if ((filtros[1].tipo=='e') && (ahora.value > filtros[1].fin))
		{
			Video.pause();
		}
	}

	if ((accion=='') && (ultimo_salto==-1))
		rapido=0;
// Se quita el audio con el filtro a
	if ((accion=='a') && (!Video.muted))
	{
		ultimo_volumen=Video.volume;
		Video.muted = true;
console.log('quito volumen por accion a');
	}
// Se quita el audio cuando hay que quitar audio y vídeo
	if ((accion=='n') && (!Video.muted))
	{
		ultimo_volumen=Video.volume;
		Video.muted = true;
console.log('quito volumen por accion n');
	}

// Se quita el audio cuando hay que avanzar rápido
	if ((accion=='r') && (!Video.muted))
	{
		ultimo_volumen=Video.volume;
		Video.muted = true;
console.log('quito volumen por accion r');
	}
console.log('accion: '+accion+' # muted?'+Video.muted+' rápido: '+rapido+' volumen: '+Video.volume);

// Se pone la imagen negra con el filtro i
	if ((accion=='i') && (Video.style.opacity==''))
	{
		Video.style.opacity = 0;
console.log('quito imagen por accion i');
	}
// Se pone la imagen negra cuando hay que quitar audio y vídeo
	if ((accion=='n') && (Video.style.opacity==''))
	{
		Video.style.opacity = 0;
console.log('quito imagen por accion n');
	}

// Se pone la imagen negra cuando hay que quitar audio y vídeo
	if (rapido==1)
{
		Video.style.opacity = 0;
console.log('quito imagen porque rápido vale 1');
}

// Se pone la imagen negra cuando hay que avanzar rápido
	if ((accion=='r') && (Video.style.opacity==''))
	{
		Video.style.opacity = 0;
console.log('quito imagen por accion r');
	}
// Cuando hay que hacer un salto y es la primera vez que se prueba se salta y se guardan los datos para comprobar que ha saltado bien (en Netflix a veces falla)
	if ((accion == 's') && ((rapido==0) || (tempcorte!=ultimo_salto))) 
	{
		Video.muted = true;
		Video.style.opacity = 0;
		origen=ahora.value;
		destino=fin;
		goToTime(fin);
		salto_a_comprobar=1;
		ultimo_salto=tempcorte;
console.log('salto a: '+fin);
	}

// Cuando no está dentro de un filtro hay que asegurar que no esté quitado el audio ni la imagen
	if (accion=='')
	{
		if (Video.muted)
		{
			Video.muted = false;
			console.log('estaba callado y vuelve a hablar');
			Video.volume=ultimo_volumen;
		}
// Por si en alguna ocasión interesa cambiar a la velocidad de 25 frames por segundo.
//		Video.playbackRate = velocidad * 25/24;
		Video.playbackRate = velocidad;

		Video.style.opacity = '';
		Logo_espera.style.display = 'none';
		tempcorte=-1;
		rapido=0;
console.log('no hay que aplicar ningún filtro');
	}

// Si el salto no ha funcionado avanzo rápido a una velocidad variable, dependiendo del tiempo que falta para llegar al final del filtro
	if((accion=='n') || ((rapido==1) && (tempcorte==ultimo_salto)))
	{
		console.log('ACCION N!!!!'+Logo_espera_activo);
		vel=Math.trunc(Math.abs(fin-ahora)*2);
		if (vel<=1)
		{
			vel=1;
		}
		else if (vel<=2)
		{
			vel=2;
		}
		else if (vel<=4)
		{
			vel=4;
		}
		else if (vel<=8)
		{
			vel=8;
		}
		else
		{
			vel=8;
// La velocidad x16 no funcionaba bien, habría que hacer más pruebas para comprobar si puede funcionar bien
//				vel=16;
		}
		if (Video.playbackRate!=vel)
			Video.playbackRate = vel;
		Logo_espera.style.display = 'block';
		Logo_espera_activo=1;
console.log('avanzo rápido por accion n. vel: '+vel);
	}

	if ((salto_disney>0) && (salto_disney-ahora<10))
	{
		ahora=tiempo_actual();
		if (ahora<salto_disney)
		{
			rapido=32;
			vel=Math.trunc(Math.abs(salto_disney-ahora)*2);
			if (vel<=1)
			{
				vel=1;
			}
			else if (vel<=2)
			{
				vel=2;
			}
			else if (vel<=4)
			{
				vel=4;
			}
			else if (vel<=8)
			{
				vel=8;
			}
			else
			{
				vel=8;
// La velocidad x16 no funcionaba bien, habría que hacer más pruebas para comprobar si puede funcionar bien
//				vel=16;
			}
			Video.playbackRate = vel;
			Logo_espera.style.display = 'block';
			Logo_espera_activo=1;
console.log('avanzo rápido por salto de disney que ha quedado menos de 10 segundos del destino. vel: '+vel);
		}
		else
		{
			rapido=0;
			salto_disney=0;
			Logo_espera.style.display = 'none';
			Logo_espera_activo=0;
		}
	}


	muestra_logo();
}


url_inicial=window.location.href;
console.log('url inicial: '+url_inicial);
split_barra_url = url_inicial.split('/');
partes_plataforma= split_barra_url[2].split('.');
if ((partes_plataforma[1]=='com') || (partes_plataforma[1]=='es'))
	plataforma=partes_plataforma[0];
if ((partes_plataforma[2]=='com') || (partes_plataforma[2]=='es'))
	plataforma=partes_plataforma[1];

partes_url = url_inicial.split('?');
if (typeof(partes_url[1])=='undefined')
	partes_url[1]='';
if (partes_url[1]!=undefined)
{
	parametros_todos=partes_url[1].split('&');
	for (var [key, value] of Object.entries(parametros_todos)) 
	{
		nombres_parametros=value.split('=');
		parametro[nombres_parametros[0]]=nombres_parametros[1];
	}
}
parametro_filtros=parametro['filtros'];

url_actual=url_inicial;
busca_id_pelicula();
id_pelicula=id_pelicula_actual;
id_pelicula_filmin=id_pelicula_actual;

/*	if ((plataforma=='filmin') && (parametro_filtros==undefined))
	{
		busca_id_pelicula();

		var url_filmin='https://klinema.com/wp-json/klinema/v1/filtros/'+plataforma+'/?content_id='+id_pelicula;
		console.log('url consulta filtros: '+url_filmin);

		fetch(url_filmin)
			.then (response => response.json())
			.then (function(json) {
				if (json.success)
				{
				resultados=json.filters;
				i=0;
				parametro_filtros='';
					resultados.forEach(resultado =>
					{
						tipo=resultado.tipo;
						inicio=resultado.inicio;
						fin=resultado.fin;
						parametro_filtros=parametro_filtros+tipo+'A'+inicio+'A'+fin+'B';
					i++;
					});
				nfiltros=i;
				}
console.log('fora');
				if ((json.success) && (i==0))
					parametro_filtros='OKB';
				if (!json.success)
					parametro_filtros='NOB';
				if ((json.success) && (i>0))
					parametro_filtros=i+'B'+parametro_filtros;
console.log('parametro_filtros filmin: '+parametro_filtros+nfiltros);
				lee_filtros();
				id_pelicula_filmin=id_pelicula;
				escribe_filtros();
			})
			.catch(error => {console.log('ERROR '+error);	});

	}
else
{
*/
	lee_filtros();
//	escribe_filtros();
//}
//busco si ha cambiado de video cada 3 segundos
console.log('antes de intervalo');
intervalo_busca_video=setInterval(busca_video, 3000);
console.log('después de intervalo');

//para los subtítulos
divs=document.getElementsByTagName('div');


//cuando se mueve el ratón aparece el logo indicando si klinema está activo o no
document.onmousemove = function()
{
	if (nopreparada>15)
		nopreparada=15;
	if (okpreparada>15)
		okpreparada=15;
	muestra_logo();
}

var fecha='';
var dat=new Date();
var mes=dat.getMonth()+1;
if (mes<10)
	mess='0'+mes.toString();
else
	mess=mes.toString();
var dia=dat.getDate()
if (dia<10)
	dias='0'+dia.toString();
else
	dias=dia.toString();
var hoy=dat.getFullYear().toString()+'-'+mess+'-'+dias;
console.log('HOY: '+hoy);

chrome.storage.local.get('fecha', function(result) {
	fecha=result.fecha;

console.log('fecha: '+fecha);

if ((plataforma=='klinema') && ((editor=='SI') || ((editor=='NO') && (hoy!=fecha))))
{
	var url_apple='https://klinema.com/wp-json/klinema/v1/filtros/?platform=appletv';
	console.log('url consulta filtros: '+url_apple);

	fetch(url_apple)
		.then (response => response.json())
		.then (function(json) {
			if (json.success)
			{
				resultados=json.data;
				console.log(resultados);
				chrome.storage.local.set({fecha: hoy}, () => {console.log('grabo fecha: '+hoy)});
				chrome.storage.local.set({apple: resultados}, () => {console.log('Storage datos ok'+resultados)});
//				localStorage.setItem('apple', resultados);
			}
			})
		.catch(error => {console.log('ERROR '+error);	});

	var url_filmin='https://klinema.com/wp-json/klinema/v1/filtros/?platform=filmin';
	console.log('url consulta filtros: '+url_filmin);

	fetch(url_filmin)
		.then (response => response.json())
		.then (function(json) 
		{
			if (json.success)
			{
				resultados=json.data;
				console.log(resultados);
				chrome.storage.local.set({filmin: resultados}, () => {console.log('Storage datos ok'+resultados)});
			}
		})
		.catch(error => {console.log('ERROR '+error);	});

}



});

