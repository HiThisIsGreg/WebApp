/***
	Author		: Greg Marusic
	Description	: Functions used by bidding page
***/


// Register Event by calling addEvent function defined in main.js
// Refer to main.js for addEvent implementation
// addEvent is a function that attaches event listeners for all browsers

// Attach onload event to window
addEvent(window, 'load', bidList);
// Create XMLHttpRequest object from main.js
var xhr = createRequest();
var xhr2 = createRequest();




function bidList()
{
	
	// set Time Interval, call the function loadList every 5 seconds
	setInterval(loadList, 5000);
	
}


function loadList()
{
	// periodically retrieve all items in the XML documents and neatly diplay them
	
	// establish connection with server
	xhr.open("GET", "bidding.php", true);
	// adds a custom HTTP header to the request
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = getData;
	xhr.send(null);
}

function getData()
{
	
	if( xhr.readyState == 4 ){
		var message = document.getElementById("message");
		
		if( xhr.status == 200 ){
			var bidBody = document.getElementById("bidBody");
			
			
			//bidBody.innerHTML = xhr.responseText;
			
			var response = xhr.responseXML;
			
			
			if(response != "100"){
				bidBody.innerHTML = "";
				var auctions = response.documentElement;
				var auctionList = auctions.getElementsByTagName("auction");
				var buttonList = [];
				
				// Loop through the auction List
				for(var i = 0; i < auctionList.length; i++){
					var itemID = auctionList[i].getElementsByTagName("itemID")[0].firstChild.nodeValue;
					var item = auctionList[i].getElementsByTagName("item")[0].firstChild.nodeValue;
					var cat = auctionList[i].getElementsByTagName("category")[0].firstChild.nodeValue;
					var desc = auctionList[i].getElementsByTagName("description")[0].firstChild.nodeValue;
					var curBid = auctionList[i].getElementsByTagName("currentBid")[0].firstChild.nodeValue;
					var dur = auctionList[i].getElementsByTagName("duration")[0].getAttribute("remain");
					var day = auctionList[i].getElementsByTagName("duration")[0].getElementsByTagName("day")[0].firstChild.nodeValue;
					var hour = auctionList[i].getElementsByTagName("duration")[0].getElementsByTagName("hour")[0].firstChild.nodeValue;
					var min = auctionList[i].getElementsByTagName("duration")[0].getElementsByTagName("minutes")[0].firstChild.nodeValue;
					var sec = auctionList[i].getElementsByTagName("duration")[0].getElementsByTagName("seconds")[0].firstChild.nodeValue;
					bidBody.innerHTML += "<span class='c1'>Item No:</span><span class='c2'>" + itemID + "</span>";
					bidBody.innerHTML += "<span class='c1'>Item Name:</span><span class='c2'>" + item + "</span>";
					bidBody.innerHTML += "<span class='c1'>Category:</span><span class='c2'>" + cat + "</span>";
					bidBody.innerHTML += "<span class='c1'>Description:</span><span class='c2'>" + desc + "</span>";
					bidBody.innerHTML += "<span class='c1'>Current Bid:</span><span class='c2'>" + curBid + "</span>";
					bidBody.innerHTML += "<span class='clock'>" + day +  " days "+ hour +" hours " + min + " minutes " + sec + " seconds left</span>"
					
					
					if(dur == "yes"){
						var span1 = document.createElement("span");
						var span2 = document.createElement("span");
						
						toggleClass(span1,"c3");
						toggleClass(span2,"c3");
						
						var placeBtn = document.createElement("button");
						var buyBtn = document.createElement("button");
						
						placeBtn.value = itemID;
						buyBtn.value = itemID;
						
						var placeText = document.createTextNode("Place Bid");
						var bidText = document.createTextNode("Buy it now");
						toggleClass(placeBtn, "goldBtn");
						toggleClass(buyBtn, "blueBtn");
						// place text in the button
						placeBtn.appendChild(placeText);
						buyBtn.appendChild(bidText);
						// append buttons to span elements (for layout purposes)
						span1.appendChild(placeBtn);
						span2.appendChild(buyBtn);
						
						
						// append to the bidBody div
						bidBody.appendChild(span1);
						bidBody.appendChild(span2);
							
						
					}else{
						var span1 = document.createElement("span");
					
						
						toggleClass(span1,"c3");
						
						var expireBtn = document.createElement("button");
						var expireText = document.createTextNode("Time expired");
						toggleClass(expireBtn, "expireButton");
						expireBtn.appendChild(expireText);
						span1.appendChild(expireBtn);
						bidBody.appendChild(span1);
					}
				}
				
				// attach events to buttons 
				var buttons = bidBody.getElementsByTagName("button");
				for( var  i = 0; i < buttons.length; i++){
					if(hasClass(buttons[i],"goldBtn")){
						//buttons[i].onclick = placeBid;
						addEvent(buttons[i],"click",placeBid);
					}else if(hasClass(buttons[i],"blueBtn")){
						//buttons[i].onclick = buyNow;
						addEvent(buttons[i],"click",buyNow);
					}else{
						// do nothing
					}
				}
				
			}else{
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "There was a problem with the bidding.<br/>There are currently no bids!<br/>";
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

/** 
	Name: placeBid
	Description: Once the Place Bid button is clicked, a pop-up window will show up to take the new bid as input,

**/
function placeBid()
{
	//console.log("this value : " + this.value);
	var itemID = this.value;
	console.log("this value: " + itemID);
	var myWindow = window.open("popUpBid.htm","mywindow","menubar=1,resizable=1,width=450,height=350");
	addEvent(myWindow, "load", function(){
		myWindow.document.getElementById("itemID").value = itemID;
	});

}

/** 
	Name: buyNow
	Description:  Establish a connection the buyBid.php
**/
function buyNow()
{
	//console.log("this value : " + this.value);
	var itemID = this.value;
	// create another connection with PHP
	// periodically retrieve all items in the XML documents and neatly diplay them
	
	// establish connection with server
	xhr2.open("GET", "buyBid.php?itemID=" +encodeURIComponent(itemID), true);
	// adds a custom HTTP header to the request
	xhr2.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr2.onreadystatechange = buyResult;
	xhr2.send(null);
}

function buyResult()
{
	if( xhr2.readyState == 4 ){
		var message = document.getElementById("message");
		
		if( xhr2.status == 200 ){
			
			// clear the message body and bidBody divs
			message.innerHTML = "";
			//bidBody.innerHTML = xhr.responseText;
			
			var response = xhr2.responseText;
			
			
			if(response == "100"){
				
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Oops! We need you to login before buying any items!<br/>";
			}else if(response == "200"){
				if( hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( !hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Thank you for purchasing this item!<br/>";
			}else if(response == "300"){
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Oops! This item has already been sold!<br/>";
			}else{
				if( !hasClass(message,'error') ){
					toggleClass(message,'error');
				}
				if( hasClass(message,'success')){
					toggleClass(message,'success');
				}
				message.innerHTML = "Oops! Item could not be found!<br/>";
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












