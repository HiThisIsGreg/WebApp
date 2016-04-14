<?
// Description	: listing.php - Server side processing for listing form
// Author		: Greg Marusic
// Date			: 10/05/2015


// check whether customer has already logged in

// check if auction.xml exists
//    if exists, add input data to the xml document
// 	  if auction.xml does not exist, create the xml document in /www/data folder
//       add input data into the xml document

session_start();

header('Content-Type: text/xml');
date_default_timezone_set('Australia/Melbourne');

if( isset($_SESSION['custID'])){
	// Check if input fields are set and NOT NULL
	if( isset($_POST['item']) && isset($_POST['category']) && isset($_POST['description']) && isset($_POST['startPrice']) 
	&& isset($_POST['reservePrice'])&& isset($_POST['buyPrice'])&& isset($_POST['day'])&& isset($_POST['hour'])	&& isset($_POST['min'])){
		
		// check if input fields are NOT empty
		if(!empty($_POST['item']) && !empty($_POST['description']) &&  !empty($_POST['startPrice']) && !empty($_POST['reservePrice']) && !empty($_POST['buyPrice'])){
			
			// If there is no problem with the validation
			// Assign values to variables
			$item = $_POST['item'];
			$category = $_POST['category'];
			$description = $_POST['description'];
			$startPrice = $_POST['startPrice'];
			$reservePrice = $_POST['reservePrice'];
			$buyPrice = $_POST['buyPrice'];
			$day = $_POST['day'];
			$hour = $_POST['hour'];
			$min = $_POST['min'];
			
			
			$title = '../../data/auction.xml';
			// Creates a Dom document and assigns it to variable $doc
			$doc = new DomDocument('1.0');
			$doc->preserveWhiteSpace = false;
			$doc->formatOutput = true;
			
			
			$tempItem = preg_replace('/\s+/','',$item);
			// Generate item number
			// unique item number is a the current time concatenated with the item name
			$itemID = date("dHis",time()) . substr($tempItem,0,10);
			$itemID = str_shuffle($itemID);
			// start date and start time
			$startDate = date("Y-m-d",time());
			$startTime = date("H:i:s",time());
			
			// customerID of seller
			$custID = $_SESSION['custID'];
			// seller inputs to the XML document
			
			if( file_exists($title)){
				
				// if file exists, load xml
				$doc->load($title);
				$root = $doc->firstChild;
				
			}else{
				$root = $doc->createElement('auctions');
				// appends root to the doc element
				$doc->appendChild($root);
									
			}
			$auction = $root->appendChild($doc->createElement('auction'));
							
			$customerID = $auction->appendChild($doc->createElement('customerID'));
			$customerID->appendChild($doc->createTextNode($custID));
			
			$itemGenID = $auction->appendChild($doc->createElement('itemID'));
			$itemGenID->appendChild($doc->createTextNode($itemID));
			
			$startDateXML = $auction->appendChild($doc->createElement('startDate'));
			$startDateXML->appendChild($doc->createTextNode($startDate));
			
			$startTimeXML = $auction->appendChild($doc->createElement('startTime'));
			$startTimeXML->appendChild($doc->createTextNode($startTime));
			
			$status = $auction->appendChild($doc->createElement('status'));
			$status->appendChild($doc->createTextNode('in_progress'));
			
			$itemName = $auction->appendChild($doc->createElement('item'));
			$itemName->appendChild($doc->createTextNode($item));
			
			$categoryXML = $auction->appendChild($doc->createElement('category'));
			$categoryXML->appendChild($doc->createTextNode($category));
			
			$descriptionXML = $auction->appendChild($doc->createElement('description'));
			$descriptionXML->appendChild($doc->createTextNode($description));
			
			$startPriceXML = $auction->appendChild($doc->createElement('startPrice'));
			$startPriceXML->appendChild($doc->createTextNode($startPrice));
			$rPriceXML = $auction->appendChild($doc->createElement('reservePrice'));
			$rPriceXML->appendChild($doc->createTextNode($reservePrice));
			$bPriceXML = $auction->appendChild($doc->createElement('buyPrice'));
			$bPriceXML->appendChild($doc->createTextNode($buyPrice));
			
			// duration has 3 children, day, hour and min
			$duration = $auction->appendChild($doc->createElement('duration'));
			
			$dayXML = $duration->appendChild($doc->createElement('day'));
			$dayXML->appendChild($doc->createTextNode($day));
			
			$hourXML = $duration->appendChild($doc->createElement('hour'));
			$hourXML->appendChild($doc->createTextNode($hour));
			
			$minXML = $duration->appendChild($doc->createElement('min'));
			$minXML->appendChild($doc->createTextNode($min));
			// create the latest bids
			// bid has two children, bid customer ID and bid price (which is initialized to the start price of the auction )
			$bid = $auction->appendChild($doc->createElement('bid'));
			
			$bidCustID = $bid->appendChild($doc->createElement('custID'));
			$bidCustID->appendChild($doc->createTextNode(''));
			
			$bidPrice = $bid->appendChild($doc->createElement('bidPrice'));
			$bidPrice->appendChild($doc->createTextNode($startPrice));
			// set status to in-progress
			// Return generated item number, start date and start time to the client and display under the inputted data
			
			
			$doc->save($title);
			echo "Thank you! Your item has been listed in ShopOnline. The item number is $itemID, and the bidding starts now: $startDate on $startTime";
		
							
							
			
		}else{
			// return an error message
			echo "300"; // is empty
		}
	}else{
		// return an error message
		echo "400"; // is not set
	}
	
}else{
	// send 100 which means the customer has not yet logged in
	echo "100";
}
?>