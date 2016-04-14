/***
	Author		: Greg Marusic
	Version		: 1.0
	Description	: Functions used by all pages
***/

/***
	Function: addEvent
	Description: Uses memoization and closure design patterns to set event listeners, without incurring too much cost
				 Memoization pattern's power lies with its optimization. If an operation
				 has already been detected, the stored result can be returned instead of repeating the operation again.
				 Closure is a protected variable space, created by using nested functions. 
				 A closure in JavaScript is like keeping a copy of the all the local variables, just as they were when a function exited
	Parameters : el - element
				 ev - event, for example : 'click'
				 fn - function to execute
***/
var addEvent = (function(){
	var setEventListener = function( el, ev, fn ){
	if( el.addEventListener ){
		setEventListener = function ( el, ev , fn ){
			el.addEventListener(ev, fn, false);
		};
	}else if ( el.attachEvent ){
		setEventListener = function ( el, ev , fn ){
			el.attachEvent('on' + ev, fn);
		};
	}else{
		setEventListener = function ( el, ev , fn ){
			el['on' + ev ] = fn;
		};
	}
	setEventListener( el, ev, fn );
	};
	
	return function( el, ev, fn ){
		setEventListener( el, ev, fn);
	};
}());

/***

***/

/***
	Function: hasClass
	Description: if className exists, return true. If it does not, return false.
				This is done with Javascript regular expressions
	Parameters : el - element
				 className - name of the class you are searching for
***/
var hasClass = function( el, className ){
	return new RegExp(' ' + className + ' ').test(' ' + el.className + ' ');
};


/***
	Function: toggleClass
	Description: if className exists, remove. If it does not, add it to the element's classList.
	Parameters : el - element
				 className - name of class to be toggled
***/
var toggleClass = function( el , className){
	// get className from elements and remove any tabs or carriage returns
	var newClass = ' ' + el.className.replace(/[\t\r\n]/g, " ") + ' ';
	// test to see if there is a class
	if( hasClass( el, className) ){
		// remove class
		while( newClass.indexOf( ' ' + className + ' ' ) >= 0 ){
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		// remove trailing whitespace
		el.className = newClass.replace(/^\s+|\s+$/g, '');
	}else{
		// if it does not exist, add className
		el.className += ' ' + className;
	}
	
};


/**
	Function Name	: validateEmpty
	Description		: returns true if field value is an empty string, false otherwise
					  Also displays the error message
	Parameters		: el -  element	
					  error -  span tag that is used to display the error message
**/
var validateEmpty = function( el , error){
	if( el.value == '' ){
		error.innerHTML = "Oops! You have left your field blank. Please fill it in!";
		if(!hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return true;
	}else{
		error.innerHTML = "";
		if(hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return false;
	}
};

/**
	Function Name : validateWordnSpace
	Description : return true if it is letter, digit or a whitespace character
				  return false otherwise, also displays error message in the given error element
**/
var validateWordnSpace = function( el , error){
	var word = el.value;
	var myRe = new RegExp('^[\\w\\s\.,]+$');
	// if false , display message
	if( myRe.test(word) ){
		error.innerHTML = "";
		if(hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return true;
	}else{
		error.innerHTML = "Oops! We only allow letters a-z or A-Z (and spaces )!";
		if(!hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return false;
	}
};

/**
	Function Name : validateDigit
	Description : return true if it is digit 
			      return false otherwise, also displays error message in the given error element
**/
var validateDigit = function( el, error){
	var digit = el.value;
	var myRe = new RegExp('^[0-9\\s]+$');
	if( myRe.test(digit) ){
		error.innerHTML = "";
		if(hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return true;
	}else{
		error.innerHTML = "Oops! We only allow numbers, ie 0-9!";
		if(!hasClass(el,'invalid_field')){
			toggleClass(el,'invalid_field');
		}
		return false;
	}
	
};

/**
	Function Name	: reset
	Description		: Resets all the input fields of type 'text' or 'password'
**/
var reset = function(){
	// Access forms through HTML DOM Document Forms Collection
	// Get all input elements
	var input = document.forms[0].getElementsByTagName('input');
	// loop through all input elements 
	
	// Clear all input forms if type is equal to text or password
	for(var i = 0; i < input.length; i++){
		if(input[i].type == "text" || input[i].type == "password"){
			input[i].value = "";
		}
	}
};// end Reset function

/**
	Function Name	: createRequest
	Description		: Creates XMLHttpRequestObject [For Mozilla Firefox and Chrome and IE7+ ] , or ActiveXObject for old versions of IE
	Return			: XHR Object
**/
var createRequest = function(){
	var xhr = false;
	
	if( window.XMLHttpRequest ){
		xhr = new XMLHttpRequest();
	}else if( window.ActiveXObject ){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	return xhr;
};// End CreateRequest()

// Create string trim function to be made available for all browsers
// if(!String.prototype.trim) {
  // String.prototype.trim = function () {
    // return this.replace(/^\s+|\s+$/g,'');
  // };
// }
