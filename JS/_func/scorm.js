// Scorm

var dadosSuspensos;
var score;
var lessonStatus;	
var posicao=1;
var posicaoVideo = new Array();

var finalizado = false;

function inicializa() {	
	doLMSInitialize();
	startTimer();		
	dadosSuspensos = doLMSGetValue( "cmi.suspend_data" );
	score = doLMSGetValue( "cmi.core.score.raw" );		
	lessonStatus = doLMSGetValue("cmi.core.lesson_status");



	 // dadosSuspensos = "posicao=2&atvRec2=3&atvRec3=4&atvRec4=3&atvRec5=1&atvRec6=2&tentativas=2";
	//dadosSuspensos = 'posicao=2&inputText1=Qualquer valor';
				
	var atv = [];

	nTentativas = 	variavelSuspensa("tentativas");
	if(nTentativas == undefined){
		nTentativas = 0;

	}else{
		nTentativas = Number(nTentativas);
	}
	console.log(nTentativas);
	for(var i=0; i<contAtv; i++){		
		var valor = variavelSuspensa("atv"+(i+1));
		if(valor!=undefined){					
			if(valor.indexOf(',')==-1){
				atv[i] = valor;

			}else{
				atv[i] = valor.split(',');

			}
		}		
		if(atv[i]!='' && atv[i]!=undefined){
			for(var j=0; j<atv[i].length; j++){				
				$('#atv'+(i+1)+' #alt'+(i+1)+atv[i][j]).attr('checked', true);
			}
			checaAtv(i);
			salvarAtv(i, false);
		}	
	}



	
	for(var i=0; i<contRec; i++){
		var valor = variavelSuspensa("atvRec"+(i+1));
		if(valor!=undefined){			
			var valorArray = valor.split(',');


			
			for(var j=0; j<valorArray.length; j++){			
				console.log(valorArray[j]);
				if(valorArray[j]==gabaritosRec[i]){					
					// desativaRec(i+1); ----------------------------- COMENTADO POIS ESTAVA SOBRESCREVENDO O RESULTADO DO ULTIMO ACESSO. TOGO
					insereMeleca((i+1), valorArray[j]);	
					$('#rec'+(i+1)+"bt"+valorArray[j]).click();
								
				}
				if(jQuery.inArray(gabaritosRec[i], valorArray)==-1 && j==(valorArray.length-1)){					
					// $('#atvRec'+(i+1)+'bt'+valorArray[j]).click();
					// console.log('clico', $('#atvRec'+(i+1)).show());
					$('#rec'+(i+1)+"bt"+valorArray[j]).click();
					$('#rec'+(i+1)+"bt"+valorArray[j]).show();

				
				}
				marcaAlt((i+1), valorArray[j]);
				insereResposta((i+1), valorArray[j]);								
			}
		}
	}

	
	for(var i=0; i<contInput; i++){
		var valor = variavelSuspensa("inputText"+(i+1));
		console.log(valor);		
		if(valor!=undefined){
			$('textarea[name="inputText'+(i+1)+'"]').val(valor);
			salvaInput(i+1);
		}
	}	
	
	if(lessonStatus != "completed"){
		doLMSSetValue("cmi.core.lesson_status","incomplete");
	};
}

function marcaFim(){	
	console.log('foi no marcafIM');
	finalizado=true;
	if(leScorm=='true'){
		doLMSSetValue("cmi.core.lesson_status","completed");
		//doLMSCommit(); ----------------------------------------------- Comentado para não finalizar o exercício antes de fechar a janela do navegador. TOGO
	}
}

function finaliza(){
	console.log('foi no finaliza');
	if(leScorm=='true'){
		var queryDados = serializeJSON(suspendObject);		
		//console.log('dados: '+ queryDados)

		if(gravaNota==true || gravaNota=='true'){
			doLMSSetValue( "cmi.core.score.raw", nota);	

		}

		doLMSSetValue("cmi.suspend_data",queryDados);
		if(!finalizado){		
			lessonStatus = doLMSGetValue("cmi.core.lesson_status");
			if(lessonStatus != "completed"){
				doLMSSetValue("cmi.core.lesson_status","incomplete");
			};			
			finalizado = true;
		}
		computeTime();
		doLMSCommit();
		doLMSFinish();
	}
}

function serializeJSON(obj) {
	var dados = '';
	$.each(obj, function(k, v) {    
	    dados += k+'='+v+'&';
	    console.log(dados);
	});
	return dados;
}

function variavelSuspensa(variable) {
	var query = dadosSuspensos;			
	var vars = query.split("&");
	
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
}