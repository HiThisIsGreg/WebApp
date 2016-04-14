<?
// Description	: login.php - Server side processing for login form
// Author		: Greg Marusic
// Date			: 10/05/2015



/**
	    Function of login.php:
		Validation:
		1. Check whether input fields are set and NOT NULL
		2. Check whether input fields are not empty [ Note: Step 1 and 2 are different as there are cases where a field could be set but still empty ]
		3. Check whether email address entered exists
		4. Check whether email address and password are valid
		
		Additional:
		1. Display successful login information
	**/
session_start();
header('Content-Type: text/xml');
date_default_timezone_set('Australia/Melbourne');

	// Check if input fields are set and NOT NULL
	if( isset($_POST['email']) && isset($_POST['password']) ){
		
		// check if input fields are NOT empty
		if(!empty($_POST['email']) && !empty($_POST['password']) ){
			
			$email = $_POST['email'];
			$password = $_POST['password'];
			
			$title = '../../data/customer.xml';
			// Creates a Dom document and assigns it to variable $doc
			$doc = new DomDocument('1.0');
			
			// Check whether customer.xml document exists
			if( file_exists($title) ){
				// if file exists, load xml
				$doc->load($title);
				
				$root = $doc->firstChild;
				
				// Check if email address is unique - is done if the customer.xml document exists
				$customers = $root->getElementsByTagName('customer');
				$found = false;
				foreach( $customers as $cust){
					$checkEmail = $cust->getElementsByTagName('email')->item(0)->nodeValue;
					
					if($checkEmail == $email){
						$checkPass = $cust->getElementsByTagName('password')->item(0)->nodeValue;
						if( $checkPass == $password ){
							// save customerID as session ID
							$_SESSION['custID'] = $cust->getElementsByTagName('customerID')->item(0)->nodeValue;
							$found = true;
						}
						break; // break out of the foreach
					}
				}
				// if there is an existing matching 
				if($found){
					// send 100 to the client side - this means that it will display the correct message accordingly
					echo "200";
				}else{
					// if email does not exist, or password does not match return 100
					// We do not want to specify whether the email is wrong, or the password is wrong because 
					// of security concerns. Specifying that username is correct but password is wrong could lead to hackers misusing
					// this flaw and hack for emails
					echo "100";
				}
				
			}else{
				
				// if file does not exist, there are no email records to compare to
				echo "100";
				
			}
			
			
		}else{
			// return an error message
			echo "300";
		}
	}else{
		// return an error message
		echo "300";
	}
	

?>