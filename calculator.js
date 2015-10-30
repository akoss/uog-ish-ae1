var mem = 0; 
var ans = 0;
var baseDate = 0;
var startTime = null;
var endTime = null;
var storage = [];
var backspaceUsage = [];
var questionLog = [];

/* getUrlParameter returns parameters included in the url. 
   e.g. in case of index.html?css=first.css, getUrlParameter('css') would return 'first.css'.
   This is from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery */ 
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

function generateExpression(){
	var numberOfParts = Math.floor(Math.random() * 1) + 1  ;
	var oper = ["^2","^3","×","÷","+","-","!+","^(1/2)*","^(-1)+","*sin(π)*","+log(2,2)-"];
	var buffer = ""; 
	for(i=0; i<=numberOfParts; i++){
		buffer = buffer + Math.floor(Math.random() * 200) + 1  ; 
		buffer = buffer + oper[Math.floor(Math.random() * oper.length)];
	}
	buffer = buffer + Math.floor(Math.random() * 200) + 1  ; 
	questionLog.push({date: new Date(), question: buffer});
	return buffer;
}

/* This function returns the content of the calculator's memory */
function memread(){
	return mem; 
}

/* This function clears the calculator's memory */
function memclear(){
	mem = 0; 
	$('#buttonmclear').css('visibility','hidden');
	$('#buttonmr').css('visibility','hidden');
	return mem;
}

/* This function adds 'a' to the calculator's memory content */
function memplus(a){
	mem = mem+a; 
	$('#buttonmclear').css('visibility','visible');
	$('#buttonmr').css('visibility','visible');
	return mem+a; 
}


/* This function returns a boolean value whether the content in defaultResult currently represents the results for the equation in defaultScreen. */
function isResultFresh(){
	return $('#defaultResult').hasClass('fresh');
}

/* This function sets looks of defaultScreen and defaultResult based on 'a'.*/
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

/* This function clears the current equation. */
function clear(){
	resultFresh(0); 
	resetLog();
	$('#defaultScreen').empty();
}

/* This function appends string to the currently displayed equation in defaultScreen. */
function appendToDisplay(string) {
	if(isResultFresh()){
		// If the user recently pressed '=', we can get rid of the old equation.
		$('#defaultScreen').empty();	
	}
	// Since we've edited the equation, the results are no longer fresh. 
	resultFresh(0); 
	$('#defaultScreen').append(string);
}

function appendOperatorToDisplay(string) {
	appendToDisplay(string);
}

/* This result gets rid of the previous result and copies string to defaultResult. */
function publishResult(string) {
	$('#defaultResult').empty();
	$('#defaultResult').append(string);
}

/*This is what happens when the user clicks on the delete button */
function backspaceButton() {
	// Results are no longer fresh
	if(isResultFresh()){
		resultFresh(0);
	}
	// We delete a single character
	var str = $('#defaultScreen').html();
	$('#defaultScreen').empty();
	$('#defaultScreen').append(str.substring(0, str.length - 1));
	backspaceUsage.push({date: new Date(),string: str}); 
}

/* When the user clicks on '=', we calculate the results and publish them.*/
function eqclicked(){
	result = equals($('#defaultScreen').html());
	publishResult(result); 
	// If there was an error, we leave the current equation in place for further editing
	if(result != "Error"){
		resultFresh(true); 
	}
}

/* This function removes certain characters and replaces them with those accepted by math.js */
function parseString(what){
	// Pi
	what = what.replace("π" ,"pi");
	// Division
	what = what.replace("÷" ,"/");
	// Multiplication
	what = what.replace("×" ,"*");
	// Squared
	what = what.replace("²" ,"^2"); 
	// On the third
	what = what.replace("³" ,"^3"); 
	// ANSWER button
	what = what.replace("ANS" ,ans); 
	return what;
}

/* This functon calculates the answer for what using math.js. */
function equals(what){
	try {
		ans = math.eval(parseString(what));
		// We only make the ANS button visible if we have a result
		$('#buttonans').css('visibility','visible');
		resetLog();
		return ans;
	}
	catch(e) {
		// In case of an exception we hide the ANS button 
		$('#buttonans').css('visibility','hidden');
		return "Error";
	}
}

/* This function resets the state of the buttons regarding Logarithm.
   See further down why this is neccessary */
function resetLog(){
	$('#buttonparleft').css('visibility','visible');
	$('#buttonlnbase').css('visibility','visible');
	$('#buttonln').show();
	$('#buttonlnbase').hide();
}

$(document).ready(function() {

	// Selecting the correct stylesheet based on the css url parameter
	var stylesheetName = getUrlParameter('css');
	if(!stylesheetName){
		// Using calculator.css if no parameter was given 
		stylesheetName = "calculator3.css";
	}
	$("head").append($("<link rel='stylesheet' type='text/css' href='"+stylesheetName+"'>")); 
	$("head").append($("<title>Calculator - Using " + stylesheetName + " - Akos Szente - 2094613</title>")); 

	// Setting up button layout on load
	$('#buttonmclear').css('visibility','hidden');
	$('#buttonmr').css('visibility','hidden');
	$('#buttonans').css('visibility','hidden');
	$('#buttonlnbase').hide();
	$("#endbutton").hide();
	$("#nextexpressionbutton").hide();
	$("#beginbutton").show();
	$("#svgcontainer").hide();

	// Event handling for buttons
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
		// If results have not been counted for the current equation yet, we need to do that first 
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
		// Once the user closes the log('s parenthesis, we can return the log buttons to the original state
		resetLog();
	});
	$('#buttonreciprocal').click(function(event) {
		appendToDisplay("^(-1)");
	});
	$('#buttonln').click(function(event) {
		appendToDisplay("log(");
		// Replacing  log( button with a button for the base of the logarithm 
		$('#buttonln').hide();
		$('#buttonlnbase').show();
		// Hiding left parenthesis so that the user won't write a complex expression for the log's base
		$('#buttonparleft').css('visibility','hidden');
		$('#buttonlnbase').css('visibility','visible');
	});
	$('#buttonlnbase').click(function(event) {
		// Form for this: log(2,2)=1
		appendToDisplay(",");
		$('#buttonlnbase').css('visibility','hidden');
	});

	/* Clicking on Begin Survey starts a timer and empties survey data arrays */
	$('#beginbutton').click(function(event) {
		startTime = new Date(); 
		endTime = null;
		storage = [];
		backspaceUsage = [];
		$("#endbutton").show();
		$("#nextexpressionbutton").show();
		$("#beginbutton").hide();
		$('#expression').empty(); 
		$('#expression').append(generateExpression());
		// New test -- emptying and hiding old results
		$("#svgcontainer").empty();
		$("#svgcontainer").hide();
	});

	/* Clicking on End Survey displays a message, stops the timer and logs data */
	$('#endbutton').click(function(event) {
		endTime = new Date(); 
		alert("Thanks for your contribution");
		console.log(storage); 
		console.log(backspaceUsage); 
		console.log(questionLog); 
		console.log(endTime-startTime + " ms"); 
		$("#endbutton").hide();
		$("#nextexpressionbutton").hide();
		$("#beginbutton").show();
		// Show test results
		$("#svgcontainer").show();

		var clicks = [];
		for(each in storage){
			clicks.push({x:storage[each]["x"],y:storage[each]["y"]});
		}

		//clicks = [{x:"20",y:"20"},{x:"50",y:"50"},{x:"100",y:"100"},{x:"200",y:"200"}]

		console.log(clicks);

		var svgContainer = d3.select("#svgcontainer").insert("svg", ":first-child")
		                                    .attr("width", $("#calculator").width())
		                                    .attr("height", $("#calculator").height());

		var circles = svgContainer.selectAll("circle")
		                          .data(clicks)
		                          .enter()
		                          .append("circle");

		var circleAttributes = circles
		                       .attr("cx", function (d) { return d["x"]; })
		                       .attr("cy", function (d) { return d["y"]; })
		                       .attr("r", 20 );



	});

	/*  Gets expressions for the survey */
	$('#nextexpressionbutton').click(function(event) {
		$('#expression').empty(); 
		$('#expression').append(generateExpression());
	}); 

	// Stuff for performance analysis
	$( '#calculator' ).mousedown(function( event ) {
		   var parentOffset = $(this).parent().offset(); 
   			//or $(this).offset(); if you really just want the current element's offset
   			var relX = event.pageX - parentOffset.left;
   			var relY = event.pageY - parentOffset.top;


	  		console.log( "x=" + relX + ";y=" + relY );
	  		storage.push({date: new Date(), event:"mousedown", x:relX, y:relY});
	});
	$( '#calculator' ).mouseup(function( event ) {
		   var parentOffset = $(this).parent().offset(); 
   			//or $(this).offset(); if you really just want the current element's offset
   			var relX = event.pageX - parentOffset.left;
   			var relY = event.pageY - parentOffset.top;

   			console.log(parentOffset.left + " --- " + parentOffset.top);
	  		console.log( "x=" + relX + ";y=" + relY );
	  		storage.push({date: new Date(), event:"mouseup", x:relX, y:relY});
	});

});
