/***
	Author		: Greg Marusic
	Version		: 1.0
	Description	: Functions used by popUp Window to place bid
***/

// Attach event listeners

var newBidBtn = document.getElementById("newBidBtn");

// Register Event by calling addEvent function defined in main.js
// Refer to main.js for addEvent implementation
// addEvent is a function that attaches event listeners for all browsers

// Attach onload event to window
addEvent(newBidBtn, "click", bidProcess);

// Create XMLHttpRequest object from main.js
var xhr = createRequest();


/**
	Function Name: 	bidProcess
	Description		: 	Establishes connection with server, validates input fields, posts data to server and displays error messages
								the bid request with the inputs (new bid price and the item number) will be sent for processing
								Check if the new bid for the item is acceptable - new bid price > current bid price && item status is not sold
								if true, update the xml document with the new bid price and the new bidder's customer id
								send back an acknowledgement
**/
function bidProcess()
{
	console.log("bid process is called");
	
	// Declare variables and assign input fields
	var bidField = document.getElementById("bid");
	var itemID = document.getElementById("itemID");
	// Assign span fields for error messages to variables
	var bError = document.getElementById("bError");
	
	// ****************Client side checking
	
	
	// calls validateEmpty function expression in main.js
	// validateEmpty displays true if Empty, false if not
	// validateEmpty also outputs display errors
	
	
	
	// Check whether fields are empty
	var bEmpty = validateEmpty(bidField, bError);

	if(!bEmpty){
		// check whether digits
		var bDigit = validateDigit(bidField, bError);
		
		// if input field is digit
		if(bDigit){
			console.log("it is working");
			// if everything is valid , send values to the server via AJAX
			var params = "itemID=" + encodeURIComponent(itemID.value) + "&newBid=" + encodeURIComponent(bidField.value);
					
			xhr.open("POST","popUpBid.php", true);
					
			// adds a custom HTTP header to the request
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			xhr.onreadystatechange = getData;
			// send request to the server
			xhr.send(params);
			
		}
	}
}

function getData()
{
	if( xhr.readyState == 4 ){
		var message = document.getElementById("message");
		if( xhr.status == 200 ){
			var serverText = xhr.responseText;
			console.log("server says " + serverText);
			if(serverText == '100'){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				
				message.innerHTML = "Unable to continue placing bid<br/>Auction Record does not exist!<br/>";
			}else if( serverText == '200' ){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Thank you! Your bid was recorded ShopOnline<br/>";
			}else if( serverText == '300'){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				
				message.innerHTML = "Item has already been sold!";
				
			}else if(serverText == '400'){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				
				message.innerHTML = "Sorry, your bid is not valid!";
				
			}else{
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				
				message.innerHTML = "Item no longer exists!";
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
				message.innerHTML = "There was a problem with the listing.<br/>Something went wrong with the data transmission<br/>";
		 }	
	}
}