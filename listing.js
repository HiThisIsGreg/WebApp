/***
	Author		: Greg Marusic
	Description	: Functions used by listing page
***/

// Attach event listeners

var listBtn = document.getElementById("listBtn");
var resetBtn = document.getElementById("resetBtn");
var categorySelect = document.getElementById("category");

// Register Event by calling addEvent function defined in main.js
// Refer to main.js for addEvent implementation
// addEvent is a function that attaches event listeners for all browsers
addEvent( listBtn, 'click', listing );
addEvent( resetBtn, 'click', reset );
// Attach onload event to window
addEvent(window, 'load', loadCategories);
addEvent(categorySelect, 'change', checkSelect);

// Create XMLHttpRequest object from main.js
var xhr = createRequest();
var xhr2 = createRequest();


// dynamically load listing categories to select list
function loadCategories()
{
	console.log("I was called");
	xhr2.open("GET", "loadCategories.php", true);
	// adds a custom HTTP header to the request
	xhr2.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr2.onreadystatechange = loadNow;
	xhr2.send(null);
}

/**
	Name: loadNow
	Description: getValues from server and load them into the categories
**/
function loadNow()
{
	if( xhr2.readyState == 4 ){
		var message = document.getElementById("message");
		
		if( xhr2.status == 200 ){
			
			//bidBody.innerHTML = xhr.responseText;
			
			var load = xhr2.responseText;
			var options = load.split(",");
			for(var i = 0; i < options.length; i++){
				var option = document.createElement("option");
				
				option.text= options[i];
				option.value= options[i];
				try
				  {
					// for IE earlier than version 8
					categorySelect.add(option,x.options[null]);
				  }
				catch (e)
				  {
					categorySelect.add(option,null);
				  }
			}
			console.log(load);
			
		}
	}
}

/**
	Name: checkSelect
	Description: Check whether the selected value  is others, if others, show a hidden input field
**/
function checkSelect()
{
	var specialField = document.getElementById("specialCat");
	var specialLabel = document.getElementById("specialLabel");
	if(categorySelect.value == "other"){
		
		specialField.style.visibility ="visible";
		specialLabel.style.visibility ="visible";
		
	}

}
/**
	Function Name	: listing
	Description		: Establishes connection with server, validates input fields, posts data to server and displays error messages
					  If listing is successful, display a successful message
**/
function listing()
{
	// Assign input field to variables
	var itemField = document.getElementById("item");
	
	var descField = document.getElementById("description");
	var sprice1Field =  document.getElementById("sprice1");
	var sprice2Field =  document.getElementById("sprice2");
	var rprice1Field =  document.getElementById("rprice1");
	var rprice2Field =  document.getElementById("rprice2");
	var bprice1Field =  document.getElementById("bprice1");
	var bprice2Field =  document.getElementById("bprice2");
	var daySelect = document.getElementById("day");
	var hourSelect = document.getElementById("hour");
	var minSelect = document.getElementById("min");
	
	
	// Assign span fields for error messages to variables
	var iError = document.getElementById("iError");
	var cError = document.getElementById("cError");
	var dError = document.getElementById("dError");
	var sError = document.getElementById("sError");
	var rError = document.getElementById("rError");
	var bError = document.getElementById("bError");
	var durationError = document.getElementById("durationError");
	
	// Client side checking
	
	// Check whether fields are empty
	// calls validateEmpty function expression in main.js
	// validateEmpty displays true if Empty, false if not
	// validateEmpty also outputs display errors 
	var iEmpty = validateEmpty(itemField, iError);
	var dEmpty = validateEmpty(descField, dError);
	var s1Empty = validateEmpty(sprice1Field, s1Error);
	var r1Empty = validateEmpty(rprice1Field, r1Error);
	var b1Empty = validateEmpty(bprice1Field, b1Error);
	// same as well
	var s2Empty = validateEmpty(sprice2Field, s2Error);

	
	var r2Empty = validateEmpty(rprice2Field, r2Error);
	
	
	
	var b2Empty = validateEmpty(bprice2Field, b2Error);
	
	
	
	// validate select elements to see if they are not selected (or still selecting the default values)
	// validateSelectEmpty function is specific to listing page
	var cEmpty = validateSelectEmpty(categorySelect, cError);
	var dayEmpty = validateSelectEmpty( daySelect, durationError);
	var hourEmpty = validateSelectEmpty( hourSelect, durationError);
	var minEmpty = validateSelectEmpty( minSelect, durationError);
	
	
	// If all fields are not empty, proceed with further client-side validation
	if(!iEmpty && !dEmpty && !s1Empty && !s2Empty && !r1Empty && !r2Empty && !b1Empty && !b2Empty && !cEmpty && !dayEmpty && !hourEmpty && !minEmpty){
		
		// check whether it is all letters, digits or spaces ( item numbers and digits could consist of numbers and digits )
		var iLetter = validateWordnSpace( itemField, iError);
		var dLetter = validateWordnSpace( descField, dError);
		
		// check whether digits
		var s1Digit = validateDigit( sprice1Field, s1Error);
		var r1Digit = validateDigit( rprice1Field, r1Error);
		var b1Digit = validateDigit( bprice1Field, b1Error);
		var s2Digit = validateDigit( sprice2Field, s2Error);
		var r2Digit = validateDigit( rprice2Field, r2Error);
		var b2Digit = validateDigit( bprice2Field, b2Error);
	
		
		// check whether email address satisfies conditions
		
		// if all are validated to be true
		if( iLetter && dLetter && s1Digit && s2Digit && b1Digit && b2Digit && r1Digit && r2Digit ){
			
			// combine starting price fields, buy it now price fields and reserve price fields
			var startPrice = sprice1Field.value+ "." + sprice2Field.value;
			var reservePrice = rprice1Field.value + "." + rprice2Field.value;
			var buyPrice = bprice1Field.value + "." + bprice2Field.value;
			
			// Comparing prices hasCLass and toggleClass are defined in main.js
			// start price <= reserve price
			if( parseFloat(startPrice) <= parseFloat(reservePrice)){
				s1Error.innerHTML = "";
				if(hasClass(sprice1Field,'invalid_field')){
					toggleClass(sprice1Field,'invalid_field');
				}
				// reserve price  < buy price 
				if( parseFloat(reservePrice) < parseFloat(buyPrice)){
					r1Error.innerHTML = "";
					if(hasClass(rprice1Field,'invalid_field')){
						toggleClass(rprice1Field,'invalid_field');
					}
					var sCatField = document.getElementById("specialCat");
					var newCat;
					if(categorySelect.value == "other"){
						newCat = sCatField.value;
					}else{
						newCat = categorySelect.value;
					}
					// if all prices are valid , send values to the server via AJAX
					// send others if category select is under "others.."
					var params = "item=" + encodeURIComponent(itemField.value) + "&category=" + encodeURIComponent(newCat) 
					+ "&description=" + encodeURIComponent(descField.value) + "&startPrice=" + encodeURIComponent(startPrice) 
					+ "&reservePrice=" + encodeURIComponent(reservePrice) + "&buyPrice=" + encodeURIComponent(buyPrice) + "&day=" 
					+ encodeURIComponent(daySelect.value) + "&hour=" + encodeURIComponent(hourSelect.value)
					+ "&min=" + encodeURIComponent(minSelect.value);
					
					xhr.open("POST","listing.php", true);
					
					// adds a custom HTTP header to the request
					 xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					 xhr.onreadystatechange = getData;
					// send request to the server
					xhr.send(params);
					
					
				}else{
					r1Error.innerHTML = "Oops! Reserve price must be less than buy-it-now price!";
					if(hasClass(rprice1Field,'invalid_field')){
						toggleClass(rprice1Field,'invalid_field');
					}
				}
			}else{
				s1Error.innerHTML = "Oops! Start price must be no more than the reserve price!";
				if(!hasClass(sprice1Field,'invalid_field')){
					toggleClass(sprice1Field,'invalid_field');
				}
			}
			
			
		}
		
	}
	
}

/**
	Function Name	: validateSelect
	Description		: validate the select boxes [ function not in main.js because it is specific only to listing page ] 
	Return			: True if select options were selected, false if otherwise (if default values of "category", "min", "hour", "day", 
						return false)
**/
function validateSelectEmpty( el, error )
{
	if( el.value == "category" || el.value == "other" ){
		var sCField = document.getElementById("specialCat");
		var sCEmpty = validateEmpty(sCField, error);
		if( sCEmpty || el.value == "category"){
			error.innerHTML = "Oops! You have to pick a category value or fill in a category [if you chose Other...]!";
			if(!hasClass(el,'invalid_field')){
				toggleClass(el,'invalid_field');
			}
			return true;
		}else{
			if(hasClass(el,'invalid_field')){
				toggleClass(el,'invalid_field');
			}
			return false;
		}
	}else if( el.value == "day" || el.value == "hour" || el.value == "min" ){
		if(error.innerHTML == ""){
			error.innerHTML = "Oops! You have to pick a value for " + el.value + " ";
		}else{
			error.innerHTML += el.value + " ";
		}
		
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
				
				message.innerHTML = "Unable to continue listing page<br/> Please make sure you have logged in!<br/>";
			}else if( serverText == '200' ){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Login was successful!<br/>";
			}else{
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = serverText + "<br/>";
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
				message.innerHTML = "There was a problem with the listing.<br/>Something went wrong with the data transmission<br/>";
		 }	
	}
}