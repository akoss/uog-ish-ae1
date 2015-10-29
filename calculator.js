var mem = 0; 
var ans = 0;
var baseDate = 0;

/* This is from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery */ 
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function memread(){
	return mem; 
}

function memclear(){
	mem = 0; 
	$('#buttonmclear').css('visibility','hidden');
	$('#buttonmr').css('visibility','hidden');
	return mem;
}

function memplus(a){
	mem = mem+a; 
	$('#buttonmclear').css('visibility','visible');
	$('#buttonmr').css('visibility','visible');
	return mem+a; 
}

function isResultFresh(){
	return $('#defaultResult').hasClass('fresh');
}

function resultFresh(a){
	if(a){
		$('#defaultScreen').removeClass('fresh');
		$('#defaultScreen').addClass('notfresh');
		$('#defaultResult').addClass('fresh');
		$('#defaultResult').removeClass('notfresh');
	} else {
		$('#defaultScreen').addClass('fresh');
		$('#defaultScreen').removeClass('notfresh');
		$('#defaultResult').removeClass('fresh');
		$('#defaultResult').addClass('notfresh');
	}
}

function clear(){
	resultFresh(0); 
	resetLog();
	$('#defaultScreen').empty();
}

function appendToDisplay(string) {
	if(isResultFresh()){
		$('#defaultScreen').empty();	
	}
	resultFresh(0); 
	$('#defaultScreen').append(string);
}

function appendOperatorToDisplay(string) {
	appendToDisplay(string);
}

function publishResult(string) {
	$('#defaultResult').empty();
	$('#defaultResult').append(string);
}

function backspaceButton() {
	if(isResultFresh()){
		resultFresh(0);
	}
	var str = $('#defaultScreen').html();
	$('#defaultScreen').empty();
	$('#defaultScreen').append(str.substring(0, str.length - 1));
}

function eqclicked(){
	result = equals($('#defaultScreen').html());
	publishResult(result); 
	if(result != "Error"){
		resultFresh(true); 
	}
}

function parseString(what){
	what = what.replace("π" ,"pi");
	what = what.replace("÷" ,"/");
	what = what.replace("×" ,"*");
	what = what.replace("²" ,"^2"); 
	what = what.replace("³" ,"^3"); 
	what = what.replace("ANS" ,ans); 
	return what;
}

function equals(what){
	try {
		//console.log(what);
		//console.log(parseString(what));
		ans = math.eval(parseString(what));
		$('#buttonans').css('visibility','visible');
		resetLog();
		return ans;
	}
	catch(e) {
		$('#buttonans').css('visibility','hidden');
		return "Error";
	}
}

function resetLog(){
	$('#buttonparleft').css('visibility','visible');
	$('#buttonlnbase').css('visibility','visible');
	$('#buttonln').show();
	$('#buttonlnbase').hide();
}

$(document).ready(function() {
	var stylesheetName = getUrlParameter('css');
	if(!stylesheetName){
		stylesheetName = "calculator.css";
	}
	$("head").append($("<link rel='stylesheet' type='text/css' href='"+stylesheetName+"'>")); 
	$("head").append($("<title>Calculator - Using " + stylesheetName + " - Akos Szente - 2094613</title>")); 


	$('#buttonmclear').css('visibility','hidden');
	$('#buttonmr').css('visibility','hidden');
	$('#buttonans').css('visibility','hidden');
	$('#buttonlnbase').hide();


	$('#buttonone').click(function(event) {
  		appendToDisplay("1");
	});
	$('#buttontwo').click(function(event) {
		appendToDisplay("2");
	});
	$('#buttonthree').click(function(event) {
		appendToDisplay("3");
	});
	$('#buttonfour').click(function(event) {
		appendToDisplay("4");
	});
	$('#buttonfive').click(function(event) {
		appendToDisplay("5");
	});
	$('#buttonsix').click(function(event) {
		appendToDisplay("6");
	});
	$('#buttonseven').click(function(event) {
		appendToDisplay("7");
	});
	$('#buttoneight').click(function(event) {
		appendToDisplay("8");
	});
	$('#buttonnine').click(function(event) {
		appendToDisplay("9");
	});
	$('#buttonzero').click(function(event) {
		appendToDisplay("0");
	});
	$('#buttonpoint').click(function(event) {
		appendToDisplay(",");
	});
	$('#buttonpi').click(function(event) {
		appendToDisplay("π");
	});
	$('#buttonplus').click(function(event) {
		appendOperatorToDisplay("+");
	});
	$('#buttonminus').click(function(event) {
		appendOperatorToDisplay("-");
	});
	$('#buttontimes').click(function(event) {
		appendOperatorToDisplay("×");
	});
	$('#buttondivide').click(function(event) {
		appendOperatorToDisplay("÷");
	});
	$('#buttonsquared').click(function(event) {
		appendOperatorToDisplay("&sup2;");
	});
	$('#buttonthird').click(function(event) {
		appendOperatorToDisplay("&sup3;");
	});
	$('#buttonfactorial').click(function(event) {
		appendOperatorToDisplay("!");
	});
	$('#buttonnth').click(function(event) {
		appendOperatorToDisplay("^");
	});
	$('#buttonroot').click(function(event) {
		appendOperatorToDisplay("^(1/2)");
	});
	$('#buttoneq').click(function(event) {
		eqclicked();
	});
	$('#buttonclear').click(function(event) {
		clear();
	});
	$('#buttonmplus').click(function(event) {
		if(!isResultFresh()){
			eqclicked(); 
		}
		memplus(ans);
	});
	$('#buttonmr').click(function(event) {
		appendToDisplay(memread());
	});
	$('#buttonmclear').click(function(event) {
		memclear();
	});
	$('#buttonbackspace').click(function(event) {
		backspaceButton();
	});
	$('#buttonans').click(function(event) {
		appendToDisplay("ANS");
	});
	$('#buttonsin').click(function(event) {
		appendToDisplay("sin(");
	});
	$('#buttoncos').click(function(event) {
		appendToDisplay("cos(");
	});
	$('#buttontan').click(function(event) {
		appendToDisplay("tan(");
	});
	$('#buttonparleft').click(function(event) {
		appendToDisplay("(");
	});

	$('#buttonparright').click(function(event) {
		appendToDisplay(")");
		resetLog();
	});
	$('#buttonreciprocal').click(function(event) {
		appendToDisplay("^(-1)");
	});
	$('#buttonln').click(function(event) {
		appendToDisplay("log(");
		$('#buttonln').hide();
		$('#buttonlnbase').show();
		$('#buttonparleft').css('visibility','hidden');
		$('#buttonlnbase').css('visibility','visible');
	});
	$('#buttonlnbase').click(function(event) {
		appendToDisplay(",");
		$('#buttonlnbase').css('visibility','hidden');
	});

	$( '#calculator' ).click(function( event ) {
		   var parentOffset = $(this).parent().offset(); 
   			//or $(this).offset(); if you really just want the current element's offset
   			var relX = event.pageX - parentOffset.left;
   			var relY = event.pageY - parentOffset.top;


	  		console.log( "x=" + relX + ";y=" + relY );
	});


});
