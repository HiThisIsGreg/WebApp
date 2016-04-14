<?
// Description	: listing.php - Server side processing for listing form
// Author		: Greg Marusic
// Date			: 10/05/2015


// check whether customer has already logged in

// check if auction.xml exists
//    if exists, add input data to the xml document
// 	  if auction.xml does not exist, create the xml document in /www/data folder
//       add input data into the xml document
// once buy it now button is clicked, the buy-it-now request will be sent for processing with the customer id as input
// update the XML document by changing the current bid price by the buy-it-now price, the bid by the customer id, set the 
// status to "sold"
session_start();

header('Content-Type: text/xml');
date_default_timezone_set('Australia/Melbourne');

	if( isset($_SESSION['custID'])){
		// Check if bidding file exists
		$title = "../../data/auction.xml";
		
		$doc = new DomDocument("1.0");
		if(isset($_GET['itemID'])){
			$bidItemId = $_GET['itemID'];
			// check if file exists
			if( file_exists($title) ){
				$doc->load($title);
				$root = $doc->documentElement;
				$auctions = $root->getElementsByTagName("auction");
				$found = false;
				// loop through auctions and search for the itemID
				// when it matches, check if new bid price > current bid price AND whether the status is in_progress
				foreach( $auctions as $auction){
					$itemID = $auction->getElementsByTagName("itemID")->item(0)->nodeValue;
					$curBid = $auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("bidPrice")->item(0)->nodeValue;
					if( $bidItemId == $itemID ){
						$status = $auction->getElementsByTagName("status")->item(0)->nodeValue;
						$buyPrice = $auction->getElementsByTagName("buyPrice")->item(0)->nodeValue;
							if( $status == "in_progress"){
								// update values in the xml document
								$auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("custID")->item(0)->nodeValue = $_SESSION['custID'];
								$auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("bidPrice")->item(0)->nodeValue = $buyPrice;
								$auction->getElementsByTagName("status")->item(0)->nodeValue = "sold";
								// save changes to file
								$doc->save($title);
								echo "200";
							}else{
								// if item has already been sold!
								echo "300";
							}
						
						$found = true;
						break;
					}
				}
				// if the itemID is not found, echo 400 , which will be received from the client side
				if(!$found){
					echo "400";
				}
			}
		}else{
			echo "400";
		}
	}else{
		// send 100 which means the customer has not yet logged in
		echo "100";
	}

?>