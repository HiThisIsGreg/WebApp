<?php

// Description	: bidding.php - Server side processing for bidding page
// Author		: Greg Marusic
// Date			: 10/05/2015

session_start();
header('Content-Type: text/xml');	
	
	
	// Check if bidding file exists
	$title = "../../data/auction.xml";
	
	$doc = new DomDocument("1.0");
	
	// check if file exists
	if( file_exists($title) ){
		$doc->load($title);
		$root = $doc->documentElement;
		$auctions = $root->getElementsByTagName("auction");
		
		// create a new responseXML document to send to javascript
		$responseXMLDoc = new DomDocument("1.0");
		// for testing purposes on the browser
		$responseXMLDoc->preserveWhiteSpace = false;
		$responseXMLDoc->formatOutput = true;
		$responseRoot = $responseXMLDoc->createElement("auctions");
		$responseRoot = $responseXMLDoc->appendChild($responseRoot);
		
		
		
		foreach( $auctions as $auction){
			$itemID = $auction->getElementsByTagName("itemID")->item(0)->nodeValue;
			$item = $auction->getElementsByTagName("item")->item(0)->nodeValue;
			$category = $auction->getElementsByTagName("category")->item(0)->nodeValue;
			$description = $auction->getElementsByTagName("description")->item(0)->nodeValue;
			$buyPrice = $auction->getElementsByTagName("buyPrice")->item(0)->nodeValue;
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
			$endDiff = $endBidTime - strtotime("now");
			$remainTime = date("d H:i:s",$endDiff);

			// append all calculated values to responseDoc
			$auction = $responseRoot->appendChild($responseXMLDoc->createElement('auction'));
			$rItemID = $auction->appendChild($responseXMLDoc->createElement('itemID'));
			$rItemID->appendChild($responseXMLDoc->createTextNode($itemID));
			$rItem = $auction->appendChild($responseXMLDoc->createElement('item'));
			$rItem->appendChild($responseXMLDoc->createTextNode($item));
			$rCategory = $auction->appendChild($responseXMLDoc->createElement('category'));
			$rCategory->appendChild($responseXMLDoc->createTextNode($category));
			$rDesc = $auction->appendChild($responseXMLDoc->createElement('description'));
			$rDesc->appendChild($responseXMLDoc->createTextNode(substr($description,0,30)));
			$rCurBid = $auction->appendChild($responseXMLDoc->createElement('currentBid'));
			$rCurBid->appendChild($responseXMLDoc->createTextNode($curBid));
			// add duration left
			$rDur = $auction->appendChild($responseXMLDoc->createElement('duration'));
			
			
			// if difference between the time the bid ends and the current time is a positive value, 
			// this means there is still time remaining
			if( $endDiff > 0 ){
				// set attribute for checking in javascript file later
				$rDur->setAttribute("remain","yes");
				$rDay = floor($endDiff / 86400);
				$dayRemainder = ($endDiff % 86400);
				$rHour = floor($dayRemainder / 3600);
				$hourRemainder = $dayRemainder % 3600;
				$rMin = floor($hourRemainder / 60);
				$rSec = floor($hourRemainder % 60);
				
			}else{
				$rDur->setAttribute("remain","no");
				$rDay = 0;
				$rHour = 0;
				$rMin = 0;
				$rSec = 0;

			}
			
			$reDay = $rDur->appendChild($responseXMLDoc->createElement('day'));
			$reDay->appendChild($responseXMLDoc->createTextNode($rDay));
			$reHour = $rDur->appendChild($responseXMLDoc->createElement('hour'));
			$reHour->appendChild($responseXMLDoc->createTextNode($rHour));
			$reMin = $rDur->appendChild($responseXMLDoc->createElement('minutes'));
			$reMin->appendChild($responseXMLDoc->createTextNode($rMin));
			$reSec = $rDur->appendChild($responseXMLDoc->createElement('seconds'));
			$reSec->appendChild($responseXMLDoc->createTextNode($rSec));
		}
		$strXML = $responseXMLDoc->saveXML();
		echo $strXML;
	}else{
		echo "100";
	}
	
	
	
	// $xslDoc = new DomDocument("1.0");
	// $xslDoc->load($xslTitle);
	
	// $proc = new XSLTProcessor();
	// $proc->importStyleSheet($xslDoc);
	
	// echo $proc->transformToXML($doc); 
	
?>