// Modal

(function($){	
	$.fn.extend({
		leanModal:function(options){			
			var defaults={
				top:100,
				overlay:0.8,				
				conteudo:null,
				quem:null,
				largura:50,
				padding:3,
				closeButton:null
			};
			options=$.extend(defaults,options);
			var o=options;			
			return this.each(function(){					
				$(this).click(function(e){				
					var modal_id=$(this).attr("href");					
					var modal_height=$(modal_id).outerHeight();
					var modal_width=$(modal_id).outerWidth();
					$("#overlay").css({
						"display":"block",
						opacity:0
					});
					$("#overlay").fadeTo(200,o.overlay);
					$(modal_id).fadeTo(200,1);
					e.preventDefault();					
					if($('#conteudoModal') != null) {
						$('#conteudoModal').remove();
					}					
					$('#modal').append('<div id="conteudoModal"></div>');
					
					o.conteudo = o.conteudo.replace('ACDATA','<![CDATA[');
					o.conteudo = o.conteudo.replace('FCDATA',']]>');					
					
					if(o.conteudo.indexOf("<recursos>")==-1){
						o.conteudo = '<recursos>'+o.conteudo+'</recursos>';						
					}					
					
					var xmlRec = textToXML(o.conteudo);						
					for (i=0;i<xmlRec.documentElement.childNodes.length;i++){							
						if (xmlRec.documentElement.childNodes[i].nodeType!=3){							
							insereRecurso(xmlRec.documentElement.childNodes[i], '#conteudoModal');								
						}
					}						
					
					var marg = (100-(Number(o.largura)+(Number(o.padding)*2)))/2;
					$(modal_id).css({
						"padding": o.padding+"%",
						"width": o.largura+"%",
						"display":"block",
						"position":"fixed",
						"opacity":0,
						"z-index":11000,						
						"margin-left": marg+"%",
						"margin-right": marg+"%",						
					});
					
					var topPer = (100-(($("#modal").outerHeight(true)*100)/$(window).height()))/2;					
					$(modal_id).css({
						"top":(topPer*0.90)+"%"
					});					
				})
			});
		}
	})
})(jQuery);

