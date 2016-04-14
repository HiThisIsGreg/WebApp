/***
	Author		: Greg Marusic
	Description	: Functions used by logout page
***/

addEvent( window, 'load', logout );
// Create XMLHttpRequest object from main.js
var xhr = createRequest();

function logout()
{
	xhr.open("GET","logout.php", true);
					
	// adds a custom HTTP header to the request
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

	xhr.send(null);
}