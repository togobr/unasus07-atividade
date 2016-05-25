// Maq Core

// --- VARIAVEIS ----------------
var descAulaXML = '';

var slider;
var travaAvanco; // TRAVA O AVANÇO APARTIR DO SLIDE INDICADO
var travaRetorno; // TRAVA O RETORNO APARTIR DO SLIDE INDICADO

var insert;
var insertAtvRec;
var insertBarraFixa;
var contSlide = 1;
var contModal = 1;
var contVideo = 0;

var suspendObject = {};

var ratio;
var contAtv = 0;
var contRec = 0;
var contInput = 0;
var feedbacks = [];
var gabaritos = [];
var atividades = [];
var gravaAtv = [];
var mostra = [];
var esconde = [];
var gabaritosRec = [];
var contaGrupo = 0;
var grudosRec = [];
var nota = 0;
var gravaNota;
var leScorm;
var imagens;
var videos = [
    [],
    []
];
var abreDiv = 0;
var interno = false;
var modaisCont = [];
var modaisLarg = [];
var visitadas = [];
var tentativas = 0;





function insereRecurso(y, onde) {
    if (onde != undefined) {
        insert = '';
    }
    if (y.nodeName == "botao") {
        if (y.attributes.getNamedItem("tipo").value == "link") {
            insert += '<a href="' + y.attributes.getNamedItem("url").value + '"';
            coletaAtributos(y);
            insert += '>' + y.childNodes[0].nodeValue + '</a>';
        } else if (y.attributes.getNamedItem("tipo").value == "navProx") {
            insert += '<a href="#" onclick="slider.next();return false;"';
            coletaAtributos(y);
            insert += '>' + y.childNodes[0].nodeValue + '</a>';
        } else if (y.attributes.getNamedItem("tipo").value == "navAnt") {
            insert += '<a href="#" onclick="slider.prev();return false;"';
            coletaAtributos(y);
            insert += '>' + y.childNodes[0].nodeValue + '</a>';
        } else if (y.attributes.getNamedItem("tipo").value == "modal") {
            insert += '<a id="go" rel="modal" name="modal' + contModal + '" href="#modal"';
            coletaAtributos(y);
            var label = y.getElementsByTagName("label")[0];
            var conteudo = y.getElementsByTagName("conteudo")[0];
            insert += '>' + label.childNodes[0].nodeValue + '</a>';
            modaisCont.push(conteudo.childNodes[0].nodeValue);
            modaisLarg.push(y.getAttribute("largura") ? y.getAttribute("largura") : 50);
        } else if (y.attributes.getNamedItem("tipo").value == "nav") {
            insert += '<a href="#" onclick="slider.slide(' + (Number(y.getAttribute("slide")) - 1) + ');return false;"';
            coletaAtributos(y);
            insert += '>' + y.childNodes[0].nodeValue + '</a>';
        } else if (y.attributes.getNamedItem("tipo").value == "fechaModal") {
            insert += '<a href="#" onclick="close_modal();return false;"';
            coletaAtributos(y);
            insert += '>' + y.childNodes[0].nodeValue + '</a>';
        }
    } else if (y.nodeName == "video") {
        contVideo++;
        var larg = y.getAttribute("largura") != null ? y.getAttribute("largura") : '50';
        insert += '<center><video id="video' + contVideo + '" preload="none" dim="' + y.getAttribute("largura") + '" controls="controls"';
        coletaAtributos(y);
        insert += '>';
        if (y.childNodes[0].nodeValue.indexOf("#V") == -1) {
            var tipo = y.childNodes[0].nodeValue.substr(y.childNodes[0].nodeValue.lastIndexOf('.') + 1, y.childNodes[0].nodeValue.length);
            var tipo2 = (tipo == 'ogv') ? 'ogg' : tipo;
            insert += '<source id="' + tipo + '"src="' + y.childNodes[0].nodeValue + '" type="video/' + tipo2 + '">';
        } else {
            var src = y.childNodes[0].nodeValue.split("#V");
            for (var i = 0; i < src.length; i++) {
                var tipo = src[i].substr(src[i].lastIndexOf('.') + 1, src[i].length);
                var tipo2 = (tipo == 'ogv') ? 'ogg' : tipo;
                insert += '<source id="' + tipo + '" src="' + src[i] + '" type="video/' + tipo + '">';
            }
        }
        insert += '<div class="erroVideo">Seu navegador não tem suporte para videos em HTML</div>';
        insert += '</video>';
        var video = "'#video" + String(contVideo) + "'";
        insert += '<a class="tocaVideo" id="playVideo' + contVideo + '" onclick="$(' + video + ').get(0).play()">PLAY</a>';
    } else if (y.nodeName == "atividade") {
        insert += '<form><div id="atv' + (contAtv + 1) + '"';
        coletaAtributos(y);
        insert += '>';

        if (y.getElementsByTagName("titulo")[0] != undefined) {
            insert += '<div class="titulo">' + y.getElementsByTagName("titulo")[0].childNodes[0].nodeValue + '</div>';
        }
        if (y.getElementsByTagName("questao")[0] != undefined) {
            insert += '<div class="questao">' + y.getElementsByTagName("questao")[0].childNodes[0].nodeValue + '</div>';
        }

        gabaritos[contAtv] = new Array();
        if (y.getElementsByTagName("gabarito")[0].childNodes[0].nodeValue.indexOf(',') == -1) {
            gabaritos[contAtv].push(y.getElementsByTagName("gabarito")[0].childNodes[0].nodeValue);
        } else {
            gabaritos[contAtv] = y.getElementsByTagName("gabarito")[0].childNodes[0].nodeValue.split(',');
        }
        var alts = y.getElementsByTagName("alt");
        var feeds = y.getElementsByTagName("feedback");

        var esc = (y.getAttribute("escolhas") == 'unica') ? 'radio' : 'checkbox';
        for (i = 0; i < alts.length; i++) {
            if (alts[i].nodeType != 3) {
                insert += '<div class="alternativa">';
                insert += '<input class="styled" type="' + esc + '" value="' + (i + 1) + '" name="atv' + (contAtv + 1) + '" id="alt' + (contAtv + 1) + (i + 1) + '" onclick="checaAtv(' + contAtv + ')">';
                insert += '<label for="alt' + (contAtv + 1) + (i + 1) + '">' + alts[i].childNodes[0].nodeValue + '</label>';
                insert += '</input></div>';
            }
        }
        insert += '<a id="atvBt' + (contAtv + 1) + '" class="botao" href="#" onClick="salvarAtv(' + contAtv + ', true)" style="visibility:hidden;">Salvar</a>';
        insert += '</div></form>';
        gravaAtv[contAtv] = y.getAttribute("gravaNota") ? y.getAttribute("gravaNota") : 'true';
        feedbacks[contAtv] = new Array();
        for (i = 0; i < feeds.length; i++) {
            if (feeds[i].nodeType != 3) {
                feedbacks[contAtv].push(feeds[i].childNodes[0].nodeValue);
            }
        }
        contAtv++;
    } else if (y.nodeName == "recBotoes") {
        contRec++;
        var divs = y.getElementsByTagName("divRec");
        var capa = y.getElementsByTagName("capa")[0];
        var selec = y.getAttribute("selecao") ? y.getAttribute("selecao") : 'unica';
        var trans = y.getAttribute("transicao") ? y.getAttribute("transicao") : 'slide';
        var tempo = y.getAttribute("tempo") ? y.getAttribute("tempo") : '500';
        var tipo = y.getAttribute("tipo") ? y.getAttribute("tipo") : 'normal';
        gabaritosRec.push(y.getAttribute("gabarito"));

        var cont = 1;
        var contBt = 1;
        var contCont = 1;

        if (tipo == 'atividade') {
            insertAtvRec += '<div class="quest" id="quest' + contRec + '"><div id="campoQest">' + (contRec) + '</div>';
            if (contRec != 1) {
                insertAtvRec += '<img class="questImg" id="questImg' + contRec + '"/>';
            }
            if (grudosRec[contSlide] == undefined) {
                contaGrupo++;
                grudosRec[contSlide] = contaGrupo;
            }
        }

        if (tipo == 'atividade') {
            insert += '<div id="atvRec' + contRec + '"';

        } else {
            insert += '<div id="rec' + contRec + '"';
        }
        coletaAtributos(y);
        insert += '>';

        for (m = 0; m < divs.length; m++) {
            insert += '<div';
            coletaAtributos(divs[m]);
            insert += '>';
            for (n = 0; n < divs[m].childNodes.length; n++) {
                if (divs[m].childNodes[n].nodeType != 3) {
                    if (divs[m].childNodes[n].nodeName == 'bt') {
                        insert += '<div selecao="' + selec + '" selecionado="false" class="btRec unselected normal" id="rec' + contRec + 'bt' + contBt + '"';
                        coletaAtributos(divs[m].childNodes[n]);
                        insert += '>' + divs[m].childNodes[n].childNodes[0].nodeValue;
                        if (tipo == 'atividade') {
                            if (contBt == gabaritosRec[(contRec - 1)]) {
                                insert += '<a class="bt expandirBt" href="javascript:void(0);" onclick="mostraFeed(' + contRec + ',' + contBt + ')" style="display: none">Expandir</a>';
                            }
                            insertAtvRec += '<div id="quest' + contRec + 'alt' + contBt + '" class="questAlt unselected"></div>';
                        }
                        insert += '</div>';
                        contBt++;
                    } else if (divs[m].childNodes[n].nodeName == 'cont') {
                        insert += '<div transicao="' + trans + '" tempo="' + tempo + '" class="contRec" id="rec' + contRec + 'cont' + contCont + '">' + divs[m].childNodes[n].childNodes[0].nodeValue;
                        if (tipo == 'atividade' && contCont == gabaritosRec[(contRec - 1)]) {
                            insert += '<a class="bt okBt" href="javascript:void(0);" onclick="desativaRec(' + contRec + ')"></a>';
                        }
                        insert += '</div>';
                        contCont++;
                    } else if (divs[m].childNodes[n].nodeName == 'texto') {
                        insert += '<div id="cabecalhoQest' + contRec + '"';
                        coletaAtributos(divs[m].childNodes[n]);
                        insert += '>' + divs[m].childNodes[n].childNodes[0].nodeValue + '</div>';
                    } else if (divs[m].childNodes[n].nodeName == 'capa') {
                        insert += '<div transicao="' + trans + '" tempo="' + tempo + '" class="contRec capa" id="capa' + contRec + '">' + capa.childNodes[0].nodeValue + '</div>';
                    }
                    cont++;
                }
            }
            insert += '</div>';
        }
        if (tipo == 'atividade') {
            insertAtvRec += '</div>';
        }
        insert += '</div>';
    } else if (y.nodeName == "abreDiv") {
        abreDiv++;
        insert += '<div id="abreDiv' + abreDiv + '"';
        coletaAtributos(y);
        insert += '>';
    } else if (y.nodeName == "fechaDiv") {
        insert += '</div>';
    } else if (y.nodeName == "insere") {
        $(y.getAttribute("onde")).append(y.childNodes[0].nodeValue);
    } else if (y.nodeName == "inputTexto") {
        contInput++;
        insert += '<div  id="labelText' + contInput + '">' + y.getElementsByTagName("label")[0].childNodes[0].nodeValue + '</div>';
        insert += '<textarea type="text" name="inputText' + contInput + '" />';
        insert += '<a class="botao" id="salvaText' + contInput + '" onclick="salvaInput(' + contInput + ')"></a>';
    } else if (y.nodeName == "limitador") {
        insert += '<div  class="limitador" data-erro="' + y.getElementsByTagName("mensagem")[0].childNodes[0].nodeValue + '" data-limite="' + y.getAttribute("limite") + '" data-mensagem="' + y.childNodes[0].nodeValue + '">';
        insert += y.childNodes[0].nodeValue.replace("/limite/", y.getAttribute("limite"));
        insert += '</div>';
    } else {
        insert += '<div';
        coletaAtributos(y);
        if (y.childNodes[0].nodeValue == 'VAZIO') {
            insert += '></div>';
        } else {
            insert += '>' + y.childNodes[0].nodeValue + '</div>';
        }
    }
    if (onde != undefined) {
        $(onde).append(insert);
    }
}



function coletaAtributos(y) {
    var checa = 0;
    for (var k = 0; k < y.attributes.length; k++) {
        if (y.attributes[k].name == 'class') {
            insert += ' class="' + y.nodeName;
            var n = y.attributes[k].value.split(" ");
            for (var l = 0; l < n.length; l++) {
                checa++;
                insert += " " + n[l];
            }
            insert += '"';
        } else if (y.attributes[k].name == 'tipo' || y.attributes[k].name == 'url' || y.attributes[k].name == 'largura' || y.attributes[k].name == 'slide') {

        }
        if (y.attributes[k].name == 'data-params') {
            insert += " " + y.attributes[k].name + "='" + y.attributes[k].value + "'";
        } else {
            insert += ' ' + y.attributes[k].name + '="' + y.attributes[k].value + '"';
        }
    }
    if (checa == 0) {
        insert += ' class="' + y.nodeName + '"';
    }
}

// --- FUNÇÃO DE SALVAMENTO DA POSIÇÂO DOS VIDEOS --------------
var quemVid;
var inter;

function vidPlayHandler() {
    var quem = Number($(this).attr("id").substr(5, $(this).attr("id").length)) - 1;
    if (videos[0].indexOf($(this).attr("id")) == -1) {
        videos[0].push($(this).attr("id"));
        videos[1].push($(this).get(0).currentTime);
    } else {
        videos[1][videos[0].indexOf($(this).attr("id"))] = $(this).get(0).currentTime;
    }
    quemVid = $(this).attr("id");
}

var quemVid2;

function vidMetaHandler() {
    var quem = Number($(this).attr("id").substr(5, $(this).attr("id").length)) - 1;
    resizeGeral();
    $(this).get(0).pause();

    quemVid2 = $(this).attr("id");
    var inter2 = window.setInterval(function() {
        $('#' + quemVid2).get(0).currentTime = Number(posicaoVideo[quem]);
        resizeGeral();
        $('#' + quemVid2).get(0).play();
        window.clearInterval(inter2);
    }, 1500);
}


function vidPauseHandler() {
    window.clearInterval(inter);
    videos[1][videos[0].indexOf($(this).attr("id"))] = $(this).get(0).currentTime;
}



function salvaInput(quem) {
    salvaSuspendObject("inputText" + quem, $('textarea[name="inputText' + quem + '"]').val());
}


function salvaSuspendObject(key, val) {

    // console.log('foo salvaSuspendObject', key, val);
    suspendObject[key] = val;
    var dados = '';
    $.each(suspendObject, function(k, v) {
        dados += k + '=' + v + '&';
    });
    if ($('.limitador').data('limite') != undefined) {
        var caracRest = Number($('.limitador').data('limite')) - dados.length;
        if ((caracRest - dados.length) <= 0) {
            $('.limitador').html($('.limitador').data('erro'));
            $('textarea[name*="inputText"]').prop('disabled', true);
            alert($('.limitador').data('erro'));
        } else {
            $('.limitador').html($('.limitador').data('mensagem').replace('/limite/', caracRest));
        }
    }
}
// --- FUNÇÃO DE SALVAMENTO DAS ATIVIDADES --------------
function salvarAtv(atv, chamaFeedback) {
    var checa = 0;
    var marcadas = '';
    $('input[name=atv' + (atv + 1) + ']').each(function(index) {
        if ($(this).is(':checked')) {
            if (marcadas == '') {
                marcadas = $(this).val();
            } else {
                marcadas = marcadas + ',' + $(this).val();
            }

            if (gabaritos[atv].indexOf($(this).val()) != -1) {
                checa++;
            } else {
                checa = 0;
            }
        }
    });

    console.log('foo scorm', atv, marcadas);

    salvaSuspendObject('atv' + (atv + 1), marcadas);

    if (checa == gabaritos[atv].length) {
        if (gravaAtv[atv] == 'true') {
            atividades[atv] = true;
        }
        if (feedbacks[atv].length == 2) {
            //chamaModal(feedbacks[atv][0]);
        } else {
            var textoAlerta;
            for (var i = 0; i < marcadas.length; i++) {
                textoAlerta += feedbacks[atv][marcadas[i] - 1];
            }
            if (chamaFeedback) {
                //chamaModal(textoAlerta);
            }
        }
    } else {
        if (gravaAtv[atv] == 'true') {
            atividades[atv] = false;
        }
        if (feedbacks[atv].length == 2) {
            //chamaModal(feedbacks[atv][1]);
        } else {
            var textoAlerta;
            for (var i = 0; i < marcadas.length; i++) {
                textoAlerta += feedbacks[atv][marcadas[i] - 1];
            }
            if (chamaFeedback) {
                //chamaModal(textoAlerta);
            }
        }
    }

    var checaCertas = 0;
    var checaTotal = 0;
    for (var i = 0; i < atividades.length; i++) {
        if (atividades[i] == true || atividades[i] == false) {
            if (atividades[i] == true) {
                checaCertas++;
            }
            checaTotal++;
        }
    }
    nota = (checaCertas * 100) / checaTotal;
}

// --- FUNÇÃO QUE CHECA AS ATIVIDADES -----------------
function checaAtv(atv) {
    var checa = 0;
    $('input[name=atv' + (atv + 1) + ']').each(function(index) {
        if ($(this).is(':checked')) {
            checa++;

        }
    });
    if (checa == 0) {
        $('#atvBt' + (atv + 1)).attr('style', 'visibility:block');
        //$('#atvBt'+(atv+1)).hide();
    } else {
        //$('#atvBt'+(atv+1)).show();
        $('#atvBt' + (atv + 1)).attr('style', 'visibility:block');
    }
}


// --- FUNÇÃO DE LEITURA DO XML --------------
function loadXMLDoc(dname) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send();
    return xhttp.responseXML;
}

// --- MAQUINA --------------       
function inicializaMaq() {
    if (interno) {
        xmlDoc = loadXMLDoc(aula + "/aula.xml");
    } else {
        xmlDoc = textToXML(descAulaXML);
    }
    suspendObject.posicao = 1;
    leScorm = xmlDoc.documentElement.getAttribute("scorm") ? xmlDoc.documentElement.getAttribute("scorm") : 'true';
    gravaNota = xmlDoc.documentElement.getAttribute("gravaNota") ? xmlDoc.documentElement.getAttribute("gravaNota") : false;
    $('h1').text(xmlDoc.documentElement.childNodes[0].nodeValue);
    y = xmlDoc.documentElement.childNodes;

    fechamentoModal();
    insert = "";
    insertAtvRec = '<div class="divSuspenca direita limitaAltura barraFixa" id="caminho">';
    var header;
    var footer;
    for (i = 0; i < y.length; i++) {
        contModal = 1;
        if (y[i].nodeType != 3) {
            if (y[i].nodeName == 'insercao') {
                for (j = 0; j < y[i].childNodes.length; j++) {
                    if (y[i].childNodes[j].nodeType != 3) {
                        if (y[i].childNodes[j].nodeName == 'header') {
                            header = y[i].childNodes[j].childNodes[0].nodeValue;
                        } else if (y[i].childNodes[j].nodeName == 'footer') {
                            footer = y[i].childNodes[j].childNodes[0].nodeValue;
                        }
                    }
                }
            } else if (y[i].nodeName == 'slide') {
                if (contSlide == 1) {
                    insert += '<div class="slide" id="item' + contSlide + '">';
                } else {
                    insert += '<div class="slide" id="item' + contSlide + '">';
                }
                if (header != undefined) {
                    insert += header;
                }
                for (j = 0; j < y[i].childNodes.length; j++) {
                    if (y[i].childNodes[j].nodeType != 3) {
                        if (y[i].getAttribute("mostra") != undefined) {
                            mostra[contSlide] = y[i].getAttribute("mostra");
                        }
                        if (y[i].getAttribute("esconde") != undefined) {
                            esconde[contSlide] = y[i].getAttribute("esconde");
                        }
                        insereRecurso(y[i].childNodes[j]);
                        contModal++;
                    }
                }
                contSlide++;
                if (footer != undefined) {
                    insert += footer;
                }
                insert += '</div>';
            }
        }
    }
    insertAtvRec += '</div>';

    $('.aula').append(insert);

    if (insertAtvRec != '<div class="divSuspenca direita limitaAltura barraFixa" id="caminho"></div>') {
        insertAtvRec += '</div>';
        $('body').append(insertAtvRec);
    }
    if (insertBarraFixa != "") {
        $('body').append(insertBarraFixa);
        fixaBarraTop($('#barraFixa'));
    }
    inicializaRecursos();

    $(window).bind('orientationchange', resizeGeral);
    $('.slide').resize(resizeGeral);


    slider = new Swipe(document.getElementById('slider'), {
        startSlide: initSlide ? initSlide : suspendObject.posicao - 1,
        speed: 500,
        callback: function(event, index, elem, trocou) {
            resizeGeral();
            salvaSuspendObject('posicao', index + 1);

            if (trocou) {
                checaVisibilidade(suspendObject.posicao);
            }
            if (suspendObject.posicao == slider.length && !finalizado) {
                // console.log(suspendObject);
                marcaFim();
            }
        }
    });

    $("#rodape").append('<div class="desktop botao"><a href="#" onclick="slider.prev();return false;">prev</a></div>');
    $("#rodape").append('<div class="desktop botao"><a href="#" onclick="slider.next();return false;">next</a><div>');
    atividades = new Array(contAtv);
    Custom.init();
    $('.conter').parent().css({
        'margin-left': '9.7%',
        'margin-right': '11.3%'
    });
    $('#rec1bt1').on({
        click: function(e) {
            $(this).css('background', '#e8e8e8');
        }

    })

    if (leScorm == 'true') {
        inicializa();
    }

    $("img").bind("load", resizeGeral);
    $(".slide").resize(function(e) {
        resizeGeral();
    });
    resizeGeral();
    checaVisibilidade((slider.index + 1));
    tentativas = nTentativas;
    if (tentativas >= 3) {
        $('.refazerAtv').hide();

    } else {
        $('.refazerAtv').show();
    }
};

function checaVisibilidade(posicao) {
    if (mostra[posicao] != undefined) {
        var split = mostra[posicao].split(' ');
        for (i = 0; i < split.length; i++) {
            $(split[i]).fadeIn(200);

        }

    }
    if (esconde[posicao] != undefined) {
        var split = esconde[posicao].split(' ');
        for (i = 0; i < split.length; i++) {
            $(split[i]).fadeOut(200);

        }
    }

    if (posicao == 1) {
        $('#volta').hide();
        $('#avanca').show();


    } else if (posicao == 3) {
        $('#volta').show();
        $('#avanca').hide();

    } else {
        $('#avanca').show();
        $('#volta').show();


    }



}

function inicializaRecursos() {
    $('.contRec').css({
        "display": "none"
    });
    $('.capa').css({
        "display": "block"
    });

    $('video').bind({
        play: vidPlayHandler,
        pause: vidPauseHandler,
        loadeddata: vidMetaHandler
    });

    for (var i = 0; i < grudosRec.length; i++) {
        $('#item' + (i + 1) + ' div[id^="atvRec"]').each(function(index, value) {
            if (index != 0) {
                $(this).hide();
            }
        });
    }
    $('div[data-params], g[data-params]').each(function(index, value) {
        var acao = $(this).data('params').acao;
        var quem = $(this).data('params').quem;
        if (acao == 'mostra' || acao == 'mostraEsconde') {
            $(quem).hide();
        }

        $(this).click($(this).data('params'), animaElemento)

    });

    $('.btRec').bind({
        mousedown: btMouseDownHandler,
        mouseenter: btMouseOverHandler,
        mouseleave: btMouseOutHandler,
        click: btMouseClickHandler,
    });

    $('.refazerAtv').bind({
        click: btMouseClickHandler,
    });

    $('.wrapper').css('opacity', '1');
    $('#preloader').css('display', 'none');

    // $("#quest7").remove();

    // $("#rec6cont4").find('.okBt').css({'background':'url(imgs/finalizar.png)','padding':'7px 40px','margin-left':'417px'});

    $(".botaoVideo").on({
        click: function(e) {

            

            $(".iframeModal").attr("src",$(this).children("a").attr("href"));



            $(".modalFundo").fadeIn("fast")
            $(".iframeModal").css("height",$(".modal").height()+"px")
    
        }

    });

    $(".botaoFecharModal").on({
        click: function(e) {

             $(".modalFundo").fadeOut("fast")

        }

    })

    

    $("#livroCurso").on({
        click: function(e) {

            window.open("pdf/livro_do_curso.pdf?forcedownload=1", '', 'height= 500, width=' + largura + ', top=100,  left=' + esquerda + ', toolbar=no, location=no, status=no, maximized= yes, menubar=no, scrollbars=yes, resizable=no');
        }



    })
}


function animaElemento(event) {
    var infoObject = event.data;

    if (infoObject.acao == 'mostra') {
        if ($(infoObject.quem).css('display') == 'none') {
            if (infoObject.trans == 'slide') {
                $(infoObject.quem).slideToggle(Number(infoObject.tempo), scrollDiv);
            } else if (infoObject.trans == 'fade') {
                $(infoObject.quem).fadeToggle(Number(infoObject.tempo), scrollDiv);
            }
            $(this).unbind('click');
        }
    } else if (infoObject.acao == 'esconde') {
        if ($(infoObject.quem).css('display') != 'none') {
            if (infoObject.trans == 'slide') {
                (infoObject.quem).slideToggle(Number(infoObject.tempo), scrollDiv);
            } else if (infoObject.trans == 'fade') {
                $(infoObject.quem).fadeToggle(Number(infoObject.tempo), scrollDiv);
            }
            $(this).unbind('click');
        }
    } else if (infoObject.acao == 'mostraEsconde') {
        if (infoObject.trans == 'slide') {
            $(infoObject.quem).slideToggle(Number(infoObject.tempo), scrollDiv);
        } else if (infoObject.trans == 'fade') {
            $(infoObject.quem).fadeToggle(Number(infoObject.tempo), scrollDiv);
        }
    }

    function scrollDiv() {
        if (infoObject.scroll) {
            $(infoObject.scroll).animate({
                scrollTop: $(infoObject.quem).position().top + $(infoObject.scroll).scrollTop() - 15
            }, infoObject.tempo);
        }
    }
}



function btMouseDownHandler() {
    adicionaClasse($(this), 2, 'press');
}

function btMouseOverHandler() {
    adicionaClasse($(this), 2, 'over');
}

function btMouseOutHandler() {
    adicionaClasse($(this), 2, 'normal');
}

function btMouseClickHandler() {
        var $id = $(this).attr('id');

    if (!$(this).hasClass('refazerAtv')) {
        var conteudoRef = $(this).attr('id').substr(0, $(this).attr('id').indexOf('bt')) + 'cont' + $(this).attr('id').substr($(this).attr('id').indexOf('bt') + 2, $(this).attr('id').indexOf('bt').length);

        var btPref = $(this).attr('id').substr(0, $(this).attr('id').indexOf('bt') + 2);
        // var recNum = $(this).attr('id').substr($(this).attr('id').indexOf('rec') + 3, 1);
        var recNum = $id.substring($id.lastIndexOf("rec")+3, $id.lastIndexOf("bt"));
        var btNum = $(this).attr('id').substr($(this).attr('id').indexOf('bt') + 2, 1);
        // var contRef = $(this).attr('id').substr(0, 4) + 'cont' + $(this).attr('id').substr($(this).attr('id').indexOf('bt') + 2, 1);
        var contRef = $id.substr(0, $id.indexOf('b')) + 'cont' + $(this).attr('id').substr($(this).attr('id').indexOf('bt') + 2, 1);
        var gabarito = gabaritosRec[parseInt(recNum) - 1];
        var numberOfRealrecs = 0;

        // mostraFeed(recNum,btNum);
        // var recNum = $id.substring($id.lastIndexOf("rec")+1, $id.lastIndexOf("bt"));



        for (var i = gabaritosRec.length - 1; i >= 0; i--) {
            if (gabaritosRec[i] !== null) {
                numberOfRealrecs++;
            }
        }

        // console.log('click alternativa', gabarito, btNum, recNum, gabaritosRec, numberOfRealrecs);

        var cont = 0;
        // var rec = $(this).attr('id')[3];
        var rec = $id.substring($id.lastIndexOf("rec")+3, $id.lastIndexOf("bt"));

        console.log('foo recNum, numberOfRealrecs',parseInt(recNum), numberOfRealrecs);

        if (parseInt(recNum) === numberOfRealrecs) {
            // console.log('ULTIMA!!!! ');
            $('#atvRec' + (parseInt(recNum) + 1)).show();
            // console.log(tentativas);
            if (tentativas + 1 >= 3) {
                $('.refazerAtv').hide();

            } else {
                $('.refazerAtv').show();
            }

        }








        // console.log('cont', $('.btRec[id*="'+btPref+'"]'));






        insereMeleca(recNum, btNum);

        if ($(this).attr('selecao') == 'unica') {
            $('.btRec[id*="' + btPref + '"]').each(function(index, value) {
                if ($(value).attr('selecionado') == 'true') {
                    var contRef2 = $(value).attr('id').substr(0, 4) + 'cont' + $(value).attr('id').substr($(value).attr('id').indexOf('bt') + 2, 1);
                    cont++;
                    if (contRef == contRef2) {
                        if ($('#capa' + recNum).attr('id') != undefined) {
                            saiElemento($('#' + contRef2), $('#capa' + recNum));
                        } else {
                            saiElemento($('#' + contRef2));
                        }
                    } else {
                        saiElemento($('#' + contRef2), $('#' + contRef));
                    }
                }
            });
            if (cont == 0) {
                if ($('#capa' + recNum).attr('id') != undefined) {
                    saiElemento($('#capa' + recNum), $('#' + contRef));
                } else {
                    entraElemento($('#' + contRef));
                }
            }
        } else {
            entraElemento($('#' + contRef));
        }

        // console.log('foo rec', rec);
        desativaRec(Number(rec));



    } else {




        if (tentativas <= 2 || tentativas == undefined) {
            suspendObject = {}
            nota = 0;
            inicializa();




            $(".questBox").parent().parent().parent().each(function(index) {
                if (index != 0) {
                    $(this).css("display", "none");
                }
            });

            $(".contRec").slideUp();
            // $("#atvRec7").hide();
            $(".questBox").removeClass("errado").removeClass("certo");
            $(".questAlt").removeClass("wrong").removeClass("right");
            $(".questAlt").addClass("unselected");

            $(".questBox").parent().css('display', 'block')
            $(".questBox").parent().attr('selecionado', 'false');
            $(".questBox").parent().removeClass("selected").removeClass("marcouNota").removeClass("press").removeClass("normal");

            $(".questBox").parent().addClass("unselected");
            $(".questBox").parent().addClass("normal");

            $(".questBox").parent().css('cursor', 'pointer')

            $(".questBox").parent().bind({
                mousedown: btMouseDownHandler,
                mouseenter: btMouseOverHandler,
                mouseleave: btMouseOutHandler,
                click: btMouseClickHandler,
            });


        } else {

        }
    }


}

function insereMeleca(recNum, btNum, quem) {
    if (gabaritosRec[recNum - 1] == btNum) {

        $('#rec' + recNum + 'bt' + btNum + ' .questBox').addClass('certo');
        if (recNum > 1) {
            var dist = gabaritosRec[recNum - 1] - gabaritosRec[recNum - 2];
            var distVet = dist > 0 ? dist : -(dist);
            if (dist > 0) {
                dist = "+" + dist;
            }





            // $('#questImg'+recNum).attr('src', 'imgs/lig_'+dist+'.png');
            // $('#questImg'+recNum).css('top', '-'+((distVet*4)+34)+'px');

            if (dist == 0) {
                $('#questImg' + recNum).css('left', (36 + (52 * gabaritosRec[recNum - 1])) + 'px');
            } else if (distVet == 1) {
                if (gabaritosRec[recNum - 1] == 1 || gabaritosRec[recNum - 2] == 1) {
                    $('#questImg' + recNum).css('left', '95px');
                } else if (gabaritosRec[recNum - 1] == 3 || gabaritosRec[recNum - 2] == 3) {
                    $('#questImg' + recNum).css('left', '148px');
                }
            } else if (distVet == 2) {
                if (gabaritosRec[recNum - 1] == 1 || gabaritosRec[recNum - 2] == 1) {
                    $('#questImg' + recNum).css('left', '100px');
                } else if (gabaritosRec[recNum - 1] == 4 || gabaritosRec[recNum - 2] == 4) {
                    $('#questImg' + recNum).css('left', '150px');
                }
            } else if (distVet == 3) {
                $('#questImg' + recNum).css('left', '95px');
            }
        }
    } else {
        // console.log('foo insere meleca erado', '#rec' + recNum + 'bt' + btNum + ' .questBox');
        $('#rec' + recNum + 'bt' + btNum + ' .questBox').addClass('errado');
    }


}

function insereResposta(quemRec, quemCont) {
    salvaSuspendObject('atvRec' + quemRec, quemCont);
}

function entraElemento(quem, quemSai) {
    var recID = quem.attr('id');

    // recID.substr(0, recID.indexOf('cont'))


    // console.log('foo entraElemento quem', quem);


    if (quem.attr('id').indexOf('capa') == -1) {
        var id = quem.attr('id');
        // var quemRec = quem.attr('id').substr(quem.attr('id').indexOf('rec') + 3, 1);
        var quemRec = id.substring(id.lastIndexOf("rec")+3,id.lastIndexOf("cont"));
        var quemCont = quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1);

        insereResposta(quemRec, quemCont);
    }

    if (quem.attr('id').indexOf('capa') == -1) {
        // var btRef = quem.attr('id').substr(0, 4) + 'bt' + quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1);
        var btRef = recID.substr(0, recID.indexOf('cont')) + 'bt' + quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1);
        adicionaClasse($('#' + btRef), 1, 'selected');
        $('#' + btRef).attr('selecionado', 'true');
    }

    if (quem.attr('transicao') == 'fade') {
        quem.fadeIn(Number(quem.attr('tempo')), function() {
            if (quemSai != undefined) {
                saiElemento(quemSai);
            }
        });
    } else if (quem.attr('transicao') == 'slide') {
        quem.slideToggle(Number(quem.attr('tempo')), function() {
            if (quemSai != undefined) {
                saiElemento(quemSai);
            }
        });
    }

    if (quem.parent().parent().attr('id') == 'atvRec' + quemRec) {
        // marcaAlt(quem.attr('id').substr(quem.attr('id').indexOf('rec') + 3, 1), quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1));
        marcaAlt(recID.substring(recID.lastIndexOf("rec")+3, recID.lastIndexOf("cont")), quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1));
    }

}

function saiElemento(quem, quemEntra) {

    if (quem.attr('id').indexOf('capa') == -1) {
        var btRef = quem.attr('id').substr(0, 4) + 'bt' + quem.attr('id').substr(quem.attr('id').indexOf('cont') + 4, 1);
        adicionaClasse($('#' + btRef), 1, 'unselected');
        $('#' + btRef).attr('selecionado', 'false');

    }

    if (quem.attr('transicao') == 'fade') {
        quem.fadeOut(Number(quem.attr('tempo')), function() {
            if (quemEntra != undefined) {
                entraElemento(quemEntra);
            }
        });
    } else if (quem.attr('transicao') == 'slide') {
        quem.slideToggle(Number(quem.attr('tempo')), function() {
            if (quemEntra != undefined) {
                entraElemento(quemEntra);
            }
        });
    }
}


function desativaRec(quem) {
    $('#atvRec' + quem + ' div').each(function(index, value) {


        if ($(this).attr('id') != undefined) {
            if ($(this).attr('id').indexOf('cont') != -1) {

                if ($(this).css('display') != 'none') {

                    // $(this).slideToggle(Number($(this).attr('tempo')));  



                }
                if (gabaritosRec[(quem - 1)] != $(this).attr('id').substr($(this).attr('id').indexOf('cont') + 3, 1)) {
                    $(this).children('a').css('display', 'none');




                }
            } else if ($(this).attr('id').indexOf('bt') != -1) {
                if (!$(this).hasClass('selected')) {
                    $(this).slideToggle($('rec' + quem + 'cont1').attr('tempo'));



                }
                // console.log("passou", $(this).css("display"));



                $(this).unbind({
                    mousedown: btMouseDownHandler,
                    mouseenter: btMouseOverHandler,
                    mouseleave: btMouseOutHandler,
                    click: btMouseClickHandler,
                });

                $(this).css('cursor', 'default');
                if (gabaritosRec[(quem - 1)] == $(this).attr('id').substr($(this).attr('id').indexOf('bt') + 2, 1)) {
                    // $(this).children('a').css('display', 'block');
                    // adicionaClasse($(this), 1, 'selected');
                    // console.log($("#"+alt).addClass('selected'));

                }
            }


        }


    });

    $(".questBox").parent().each(function(index) {
        if ($(this).hasClass("press")) {
            $(this).css("display", "block");
           $(this).next(".contRec");



        }
    });




    $('#atvRec' + (quem + 1)).slideDown();



    // console.log(suspendObject);


    if (quem == contRec) {
        salvaSuspendObject("tentativas", tentativas)
        marcaFim();
        finaliza();
    }



}


function mostraFeed(quemRec, quemBt) {
    $('#rec' + quemRec + 'cont' + quemBt).slideToggle(Number($('#rec' + quemRec + 'cont' + quemBt).attr('tempo')));

}

function marcaAlt(quemRec, quemBt) {
    if (gabaritosRec[quemRec - 1] == quemBt) {
        adicionaClasse($('#quest' + quemRec + 'alt' + quemBt), 1, 'right');
        if (!$('#rec' + quemRec + 'bt' + quemBt).hasClass('marcouNota')) {
            nota += 2;
            // console.log('aeaeaeaeae');
            // console.log(nota);
        }

        $('#rec' + quemRec + 'bt' + quemBt).addClass('marcouNota')

    } else {
        adicionaClasse($('#quest' + quemRec + 'alt' + quemBt), 1, 'wrong');
    }

    $('#caminho').animate({
        scrollTop: $('#quest' + quemRec).position().top + $('#caminho').scrollTop() + 15
    }, 300);
}

function adicionaClasse(quem, onde, valor) {
    if (quem.attr('class') != undefined) {
        var classes = quem.attr('class').split(" ");
        var novaClasse = '';

        for (var i = 0; i < classes.length; i++) {
            if (i == onde) {
                novaClasse += valor;
            } else {
                novaClasse += classes[i];
            }
            if (i != classes.length - 1) {
                novaClasse += ' ';
            }
        }
        quem.attr('class', novaClasse)
    }
}

function fechamentoModal() {
    $("#overlay").click(function() {
        close_modal();
    });

    $('.fechaModal').click(function() {
        close_modal();
    });
}

function close_modal() {
    if ($('#conteudoModal video').length > 0) {
        $('#conteudoModal video').get(0).pause();
    }
    $("#overlay").fadeOut(200, alertaCallBack());
    $('#modal').css({
        "display": "none"
    });
}

function alertaCallBack() {

}

// --- RESIZE --------------
function resizeGeral() {
    $("video").trigger('onresize');
    slider.resize();
    //console.log('resizeGeral');


    if ($("#item" + (slider.index + 1)).outerHeight() <= $(window).outerHeight()) {
        // $("#conteudo").css("height", $(window).outerHeight()+'px');
        $("#conteudo").css("height", ($("#item" + (slider.index + 1)).outerHeight() + 50) + 'px');
        $(".aula").css("height", $(window).outerHeight() + 'px');
    } else {
        $("#conteudo").css("height", $("#item" + (slider.index + 1)).css('height'));
    }

    ratio = $(window).width() / $(window).height();

    if ($('.barraFixa') != undefined) {
        $('.barraFixa').each(function() {
            //console.log($(this).attr('class'));
            fixaBarraTop($(this));
        });
    }

    if ($('.esquerda') != undefined) {
        $('.esquerda').each(function() {
            setaBarraEsquerda($(this));
        });
    }
    if ($('.direita') != undefined) {
        $('.direita').each(function() {
            setaBarraDireita($(this));
        });
    }
    if ($('.limitaAltura') != undefined) {
        $('.limitaAltura').each(function() {
            setaAltura($(this));
        });
    }
}

// Segundos para minutos/horas
function timeString(t) {
    var ret = [],
        t = {
            hora: parseInt(t / 3600),
            minuto: parseInt(t / 60 % 60),
            segundo: t % 60
        };

    for (var n in t)
        t[n] && ret.push(t[n], n + "s".substr(t[n] < 2));

    return ret.join(" ");
}

function fixaBarraTop(quem) {
    sticky_navigation(quem);
    $(window).scroll(function() {
        sticky_navigation(quem);
        if (quem.attr('class') != undefined && quem.attr('class').indexOf('limitaAltura') != -1) {
            setaAltura(quem);
        }
    });
}

function sticky_navigation(quem) {
    //console.log(quem.attr('class'));
    var scroll_top = $(window).scrollTop();
    if (quem.data('top') == undefined && quem.css('top') != undefined) {
        quem.data('top', quem.css('top').substr(0, quem.css('top').indexOf('px')));
    }

    //console.log(scroll_top, quem.css('top'), Number(quem.data('top')), Number(scroll_top));
    if (quem.css('top') != undefined) {
        if (quem.attr('id') == 'caminho') {
            var outerHeight = $('#barraTopo').outerHeight();



            $(quem).appendTo('#barraTopo');
            quem.css('position', 'relative');
            quem.css('top', '25px')
            quem.css('right', '35px')


            // if ((scroll_top+outerHeight) < quem.data('top')) {       
            //  quem.css('position', 'fixed');
            //  quem.css("top", (Number(quem.data('top'))-Number(scroll_top)+300)+"px");


            // }else{
            //  quem.css('position', 'fixed');
            //  quem.css("top", $("#livroCurso").offset().top-100+"px");
            // }


            if ($(window).scrollTop()) {

                $("#conteudo").css("margin-bottom", '100px')
                $("#slider").css("margin-bottom", '100px')

            } else {
                $("#conteudo").css("margin-bottom", '0px')
                $("#slider").css("margin-bottom", '0px')
            }
        } else {
            if (scroll_top < quem.data('top')) {
                quem.css('position', 'fixed');
                quem.css("top", (Number(quem.data('top')) - Number(scroll_top) + 20) + "px");

                console.log(quem.css("top", (Number(quem.data('top')) - Number(scroll_top) - 23) + "px"))

            } else {
                quem.css("top", "0px");
                quem.css({
                    'position': 'fixed'
                });
            }
        }
    }
};

function setaBarraEsquerda(quem) {
    quem.css("left", ($('.wrapper')[0].getBoundingClientRect().left) + 3);
}

function setaBarraDireita(quem) {
    quem.css("right", '35px');

}

function setaAltura(quem) {
    if (quem.html() != null) {
        var padding = parseInt(quem.css("padding-top")),
            top = parseInt(quem.css("top")),
            totalHeight = $(window).height(),
            footerHeight = 100,
            maxHeight = totalHeight - footerHeight - (padding * 2) - top;


        // quem.css("max-height", maxHeight);
        quem.css("overflow", "auto");

    }
}
