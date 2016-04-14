/***
	Author		: Greg Marusic
	Description	: Functions used by registration page
***/

// Attach event listeners

var registerBtn = document.getElementById("registerBtn");
var resetBtn = document.getElementById("resetBtn");

//* Registers Event by calling addEvent function defined in main.js*

// addEvent -  function that attaches event listeners for all browsers
addEvent( registerBtn, 'click', register );
addEvent( resetBtn, 'click', reset );

// Create XMLHttpRequest object from main.js
var xhr = createRequest();

//*****************************************

/**
	Function Name	: register
	Description		: 	Establishes connection with server, validates input fields, posts data to server and displays error messages
								If registration is successful, display a success message
**/
function register()
{
	
	//declare variables and assign values
	var fNameField = document.getElementById("fname");
	var sNameField= document.getElementById("sname");
	var emailField = document.getElementById("email");
	
	//Error messages handled by spans - assigned now
	var fError = document.getElementById("fError");
	var sError = document.getElementById("sError");
	var eError = document.getElementById("eError");
	
	
	// ***************Client side checking follows::
	
	
	// Check whether fields are empty
	// calls validateEmpty function expression in main.js
	// validateEmpty displays true if Empty, false if not
	// validateEmpty also outputs display errors 
	var fEmpty = validateEmpty(fNameField, fError);
	var sEmpty = validateEmpty(sNameField, sError);
	var eEmpty = validateEmpty(emailField, eError);
	
	// check whether it is all letters
	
	// check whether email address satisfies conditions
	
	// if client-side validation is OK, establish connection with server
	if(!fEmpty && !sEmpty && !eEmpty){
		var params = "fname=" + encodeURIComponent(fNameField.value) + "&sname=" + encodeURIComponent(sNameField.value) + "&email=" + encodeURIComponent(emailField.value);
		xhr.open("POST","register.php", true);
		
		// adds a custom HTTP header to the request
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.onreadystatechange = getData;
		// send request to the server
		xhr.send(params);
	}
}

/**
	Function Name	: getData
	Description		: Gets response from server and displays the appropriate message
**/
function getData()
{

	if( xhr.readyState == 4 ){
	
		var message = document.getElementById("message");
		if( xhr.status == 200 ){
			var serverText = xhr.responseText;
			
			
			if(serverText == '100'){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				console.log( 'Server says ' + serverText);
				message.innerHTML = "There was a problem with the registration.<br/> The email has already been registered!<br/>";
			}else if( serverText == '200' ){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				console.log( 'Server says ' + serverText);
				message.innerHTML = "Registration was successful!<br/>An email will be sent to you shortly with your password!<br/>";
			}else if( serverText == '300' ){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the registration.<br/> The email address is not a valid address!<br/>";
				console.log( 'Server says ' + serverText);
			}else{
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the registration.<br/>Input fields were empty!<br/>";
				console.log( 'Server says ' + serverText);
			}
			
		}else{
			// Something went wrong with the data transmission
			// Output Error message
			if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the registration.<br/>Something went wrong with the data transmission<br/>";
		}	
	}
}