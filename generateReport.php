<?php

// Description	: process.php - Server side processing for processing auction items
// Author		: Greg Marusic
// Date			: 10/05/2015


header('Content-Type: text/xml');	
	
	
	// Check if auction file exists
	$title = "../../data/auction.xml";
	$xslTitle = "generateReport.xsl";
	$doc = new DomDocument("1.0");
	$doc->load($title);
	
	$xslDoc = new DomDocument("1.0");
	$xslDoc->load($xslTitle);
	
	$proc = new XSLTProcessor();
	$proc->importStyleSheet($xslDoc);
	
	echo $proc->transformToXML($doc); 
	// check if file exists
	
	$root = $doc->documentElement;
	$auctions = $root->getElementsByTagName("auction");
		
	foreach( $auctions as $auction){
		$status = $auction->getElementsByTagName("status")->item(0)->nodeValue;
		if( $status == "failed" || $status == "sold"){
				$root->removeChild($auction);
		}
	}
		// save changes to the XML file
		$doc->save($title);
	

?>