<?php

// Description	: loadCategories.php - Server side processing for processing listing categories
// Author		: Greg Marusic
// Date			: 10/05/2015


header('Content-Type: text/xml');	
	
	
	// Check if auction file exists
	$title = "../../data/auction.xml";
	
	$doc = new DomDocument("1.0");
	$doc->load($title);
	
	$cats = "";
	// check if file exists
	if( file_exists($title) ){
		$doc->load($title);
		$root = $doc->documentElement;
		$auctions = $root->getElementsByTagName("auction");
		$categories = array();
		foreach( $auctions as $auction){
			$category = $auction->getElementsByTagName("category")->item(0)->nodeValue;
			if($category != "other"){
				$categories[$category] = "";
			}
		}
		foreach($categories as $check=>$something){
			if($cats!=""){
				$cats = $cats . "," . $check;
			}else{
				$cats =  $check;
			}
		}
		// processing is complete
		echo $cats;
	}

?>