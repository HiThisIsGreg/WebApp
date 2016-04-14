<?php

// Description	: popUpBid.php - Server side processing for popup bidding page
// Author		: Greg Marusic
// Date			: 10/05/2015
session_start();
header('Content-Type: text/xml');	
	// Check if auction file exists
	if(isset($_POST['itemID']) && isset($_POST['newBid'])){
		// assign values from post to variables
		$bidItemId = $_POST['itemID'];
		$newBidPrice = $_POST['newBid'];
		$title = "../../data/auction.xml";
		
		$doc = new DomDocument("1.0");
		
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
					if( $newBidPrice > $curBid){
						if( $status == "in_progress"){
							// update values in the xml document
							$auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("custID")->item(0)->nodeValue = $_SESSION['custID'];
							$auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("bidPrice")->item(0)->nodeValue = $newBidPrice;
							
							// save changes to file
							$doc->save($title);
							echo "200";
						}else{
							// if item has already been sold!
							echo "300";
						}
					}else{
						// if newBidPrice is not higher than the current bid price
						echo "400";
					}
					$found = true;
					break;
				}
			}
			// if the itemID is not found, echo 500 , which will be received from the client side
			if(!$found){
				echo "500";
			}
		}else{
			echo "100";
		}
	}
?>