/***
	Author		: Greg Marusic
	Version		: 1.0
	Description	: Functions used by maintenance page
***/

// Attach event listeners

var processBtn = document.getElementById("processBtn");
var generateBtn = document.getElementById("generateBtn");

// Register Event by calling addEvent function defined in main.js
// Refer to main.js for addEvent implementation
// addEvent is a function that attaches event listeners for all browsers
addEvent( processBtn, 'click', process );
addEvent( generateBtn, 'click', generate );

// Create XMLHttpRequest object from main.js
var xhr = createRequest();
var xhr2 = createRequest();


/**
	Function Name	: process
	Description		: Establishes connection with server for processing auction items
**/
function process()
{
	xhr.open("GET","processAuction.php", true);
					
	// adds a custom HTTP header to the request
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = getData;
	// send request to the server
	xhr.send(null);
}

/**
	Function Name	: generate
	Description		: Establishes connection with server for generating report
**/
function generate()
{
	xhr2.open("GET","generateReport.php", true);
					
	// adds a custom HTTP header to the request
	xhr2.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr2.onreadystatechange = displayData;
	// send request to the server
	xhr2.send(null);
}


/**
	Function Name	: displayData
	Description		: Gets response from server and displays the appropriate message
**/
function displayData()
{
	if( xhr2.readyState == 4 ){
		var message = document.getElementById("message");
		var displayReport = document.getElementById("displayReport");
		if( xhr2.status == 200 ){
			var bidBody = document.getElementById("bidBody");
			
			// clear the message body and bidBody divs
			message.innerHTML = "";
			//bidBody.innerHTML = xhr.responseText;
			
			displayReport.innerHTML = xhr2.responseText;
			
		}else{
		// Something went wrong with the data transmission
			// Output Error message
			if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the generation of the report.<br/>Something went wrong with the data transmission<br/>";
		 
		}	
			
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
			var bidBody = document.getElementById("bidBody");
			
			// clear the message body and bidBody divs
			message.innerHTML = "";
			//bidBody.innerHTML = xhr.responseText;
			
			var response = xhr.responseText;
			
			
			if(response == "100"){
				
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Oops! Auction file does not exist!<br/>";
			}else if(response == "200"){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Processing has been completed!<br/>";
			}else{
				// do nothing
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
				message.innerHTML = "There was a problem with the bidding.<br/>Something went wrong with the data transmission<br/>";
		 }	
	}
}