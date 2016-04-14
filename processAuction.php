<?php

// Description	: process.php - Server side processing for processing auction items
// Author		: Greg Marusic
// Date			: 10/05/2015


header('Content-Type: text/xml');	
	
	
	// Check if auction file exists
	$title = "../../data/auction.xml";
	
	$doc = new DomDocument("1.0");
	
	// check if file exists
	if( file_exists($title) ){
		$doc->load($title);
		$root = $doc->documentElement;
		$auctions = $root->getElementsByTagName("auction");
		
		
	//where an auction exists ....::
		foreach( $auctions as $auction){
			$status = $auction->getElementsByTagName("status")->item(0)->nodeValue; 		
			
			if( $status == "in_progress" ){	//if the  listing is 'current' ....	:: retrieve unique item specifics from auction xml (XPATH)
			
					$reservePrice = $auction->getElementsByTagName("reservePrice")->item(0)->nodeValue;
					
					$startDate = $auction->getElementsByTagName("startDate")->item(0)->nodeValue;
					$startTime = $auction->getElementsByTagName("startTime")->item(0)->nodeValue;
					$durDay = $auction->getElementsByTagName("duration")->item(0)->getElementsByTagName("day")->item(0)->nodeValue;
					$durHour = $auction->getElementsByTagName("duration")->item(0)->getElementsByTagName("hour")->item(0)->nodeValue;
					$durMin = $auction->getElementsByTagName("duration")->item(0)->getElementsByTagName("min")->item(0)->nodeValue;
					$curBid = $auction->getElementsByTagName("bid")->item(0)->getElementsByTagName("bidPrice")->item(0)->nodeValue;
					
					$start = $startDate . " " . $startTime;
					$endBid = $start . " +" . $durDay . " days " . $durHour . " hours " . $durMin . " minutes";
					$endBidTime = strtotime($endBid);
					$endDate = date("Y-m-d H:i:s",$endBidTime);
					
							//small function to check if auction is still current
							$endDiff = $endBidTime - strtotime("now");
							$remainTime = date("d H:i:s",$endDiff);

				// if difference is positive <0 then auction is still available, less than and auction is over
				if( $endDiff <= 0 ){
					if( $curBid >= $reservePrice){
						$auction->getElementsByTagName("status")->item(0)->nodeValue = "sold";	//if current bid is larger than the reserve, change XML status to "sold"
					}else{
						$auction->getElementsByTagName("status")->item(0)->nodeValue = "failed";//if current bid is less than the reserve, change XML status to "failed"
					}
				}
			}
		}
		// save changes to the XML file
		$doc->save($title);
		// processing is complete
		echo "200";
	}else{
		echo "100";
	}

?>