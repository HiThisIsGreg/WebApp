/***
	Author		: Greg Marusic
	Description	: Functions used by login page
***/

// Attach event listeners

var loginBtn = document.getElementById("loginBtn");
var resetBtn = document.getElementById("resetBtn");

// Register Event by calling addEvent function defined in main.js
// Refer to main.js for addEvent implementation
// addEvent is a function that attaches event listeners for all browsers
addEvent( loginBtn, 'click', login );
addEvent( resetBtn, 'click', reset );

// Create XMLHttpRequest object from main.js
var xhr = createRequest();


/**
	Function Name	: login
	Description		: Establishes connection with server, validates input fields, posts data to server and displays error messages
					  If login is successful, display a successful message and redirect 
**/
function login()
{
	// Assign input field to variables
	var emailField = document.getElementById("email");
	var passwordField = document.getElementById("password");
	
	// Assign span fields for error messages to variables
	var eError = document.getElementById("eError");
	var pError = document.getElementById("pError");
	
	
	// Client side checking
	
	
	// Check whether fields are empty
	// calls validateEmpty function expression in main.js
	// validateEmpty displays true if Empty, false if not
	// validateEmpty also outputs display errors 
	var eEmpty = validateEmpty(emailField, eError);
	var pEmpty = validateEmpty(passwordField, pError);
	
	
	// check whether it is all letters
	
	// check whether email address satisfies conditions
	
	// if client-side validation is OK, establish connection with server
	if(!eEmpty && !pEmpty){
		var params = "email=" + encodeURIComponent(emailField.value) + "&password=" + encodeURIComponent(passwordField.value);
		xhr.open("POST","login.php", true);
		
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
				message.innerHTML = "There was a problem with the login.<br/> The email or password is invalid!<br/>";
			}else if( serverText == '200' ){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				console.log( 'Server says ' + serverText);
				message.innerHTML = "Login was successful!You will be redirected in 5 seconds<br/>";
				
				setTimeout(redirect, 5000);
			}else{
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the login.<br/>The input fields were left empty!<br/>";
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

function redirect()
{
    window.location="bidding.htm";
}

