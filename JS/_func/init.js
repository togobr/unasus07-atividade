// Init

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

var aula = getQueryVariable('aula');
var cod = getQueryVariable('cod');
var initSlide = parseInt(getQueryVariable('slide'));

var senha = 'mobPass';
var decoded ='';

$(document).ready(function() {	
	$('.wrapper').css('opacity', '0');
	if(cod){
		interno=false;
		$.get(aula+'/config.dll', function(data) {				
				var decode = base64_decode(data);				
				for(var i=0; i<decode.length; i++){
					var chr = decode.substr(i,1);
					var mod = i%senha.length;
					var passChr = senha.substr(mod,1);
					decoded += String.fromCharCode(chr.charCodeAt(0)-passChr.charCodeAt(0));
				}		
				decoded = unescape(decoded);				
				descAulaXML = decoded;
				inicializaMaq();
		});
	}else{
		interno=true;
		inicializaMaq();
	}
});