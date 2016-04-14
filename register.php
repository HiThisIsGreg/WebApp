<?
// Description	: register.php - Server side processing for registration form
// Author		: Greg Marusic :: 9724605
// Date			: 10/05/2015



/**
	    Function of register.php:
		Validation:
		1. Check whether input fields are set and NOT NULL
		2. Check whether input fields are not empty [ Note: Step 1 and 2 are different as there are cases where a field could be set but still empty ]
		3. Check whether email address entered during registration already exists
		4. Check whether email address is a valid email address, by using PHP regular expressions
		5. Send Email using mail() function and set bounceback to 9724605@student.swin.edu.au
		6. Test if xml document exists, create otherwise
		
		Additional:
		1. Create customer id and password
		2. Display successful registration information
	**/
	
	
session_start();
header('Content-Type: text/xml');
date_default_timezone_set('Australia/Melbourne');

	// Check if input fields are set and NOT NULL
	if( isset($_POST['fname']) && isset($_POST['sname']) && isset($_POST['email']) ){
		
		// check if input fields are NOT empty
		if(!empty($_POST['fname']) && !empty($_POST['sname']) && !empty($_POST['email']) ){
			$fName = $_POST['fname'];
			$sName = $_POST['sname'];
			$email = $_POST['email'];
			
			$title = '../../data/customer.xml';
			// Creates a Dom document and assigns it to variable $doc
			$doc = new DomDocument('1.0');
			$doc->preserveWhiteSpace = false;
			$doc->formatOutput = true;
			
			// Generate customer ID and password
			// remove all whitespace from names
			$tempIDName = preg_replace('/\s+/','',$fName);
			$tempPassName = preg_replace('/\s+/','',$sName);
			$genID = date("dHis",time()) . substr($tempIDName,0,10) ;
			
			$genPassword = date("dHis",time()) . substr($tempPassName,0,1);
			// shuffle password for extra security
			$genPassword = str_shufflestr_shuffle($genPassword);
			
			// Check whether customer.xml document exists
			if( file_exists($title) ){
				// if file exists, load xml
				$doc->load($title);
				
				$root = $doc->firstChild;		//The first child of this node. If there is no such node, this returns NULL.
				
				// Check if email address is unique - is done if the customer.xml document exists
				$customers = $root->getElementsByTagName('customer');
				$found = false;
				foreach( $customers as $cust){
					$checkEmail = $cust->getElementsByTagName('email')->item(0)->nodeValue;
					if($checkEmail == $email){
						$found = true;
						break; // break out of the foreach
					}
				}
				// if there is an existing matching 
				if($found){
					// send 100 to the client side - this means that it will display the correct message accordingly
					echo "100";
				}else{
					// If there is no match
					// Check if email address is valid - using regular expression magic
					if(preg_match("/^[a-zA-Z0-9!#$%&'*+-=?\/^_`{|}~]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/",$email)){ 
						// send email with username and password
						$sent = mail($email,"Welcome to ShopOnline","Dear $fName, welcome to use shopOnline! Your customer id is $genID and the password is $genPassword","From registration@shoponline.com.au", "-r 9724605@student.swin.edu.au");
						
								if($sent){
									// store generated customer ID as session variable 
									
									// create new entry
									$customer = $root->appendChild($doc->createElement('customer'));
									
									$custID = $customer->appendChild($doc->createElement('customerID'));
									$custID->appendChild($doc->createTextNode($genID));
									
									
									// save customer ID as session variable
									$_SESSION['custID'] = $genID;
									
									$custPass = $customer->appendChild($doc->createElement('password'));
									$custPass->appendChild($doc->createTextNode($genPassword));
									
									$firstName = $customer->appendChild($doc->createElement('firstName'));
									$firstName->appendChild($doc->createTextNode($fName));
									
									$surName = $customer->appendChild($doc->createElement('surName'));
									$surName->appendChild($doc->createTextNode($sName));
									
									$nEmail = $customer->appendChild($doc->createElement('email'));
									$nEmail->appendChild($doc->createTextNode($email));
									
									$doc->save($title);
									echo "200"; // successful registration
						}else{
							echo "300";
						}
						
					}else{
						echo "300"; // it is not a valid email address
					}
				}
				
			}else{
				
				
				// Check if email address is valid - using regular expressions
			
				if(preg_match("/^[a-zA-Z0-9!#$%&'*+-=?\/^_`{|}~]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/",$email)){ 
						// send email with username and password
						$sent = mail($email,"Welcome to ShopOnline","Dear $fName, welcome to use shopOnline! Your customer id is $genID and the password is $genPassword","From registration@shoponline.com.au", "-r 9724605@student.swin.edu.au");
						
						if($sent){
							// create new entry
						
							// create xsl link
							// create elements
							$doc->formatOutput = true;
							$root = $doc->createElement('customers');
							// appends root to the doc element
							$doc->appendChild($root);
							
							$customer = $root->appendChild($doc->createElement('customer'));
							
							$custID = $customer->appendChild($doc->createElement('customerID'));
							$custID->appendChild($doc->createTextNode($genID));
							
							// save customer ID as session variable
							$_SESSION['custID'] = $genID;
							
							$custPass = $customer->appendChild($doc->createElement('password'));
							$custPass->appendChild($doc->createTextNode($genPassword));
							
							$firstName = $customer->appendChild($doc->createElement('firstName'));
							$firstName->appendChild($doc->createTextNode($fName));
							
							$surName = $customer->appendChild($doc->createElement('surName'));
							$surName->appendChild($doc->createTextNode($sName));
							
							$nEmail = $customer->appendChild($doc->createElement('email'));
							$nEmail->appendChild($doc->createTextNode($email));
							
							$doc->save($title);
							echo "200"; // successful registration
						}else{
							echo "300";
						}
						
					}else{
						echo "300"; // it is not a valid email address
					}
				
			}
			
			
			// Show successful registration information
		}else{
			// return an error message
			echo "400";
		}
	}else{
		// return an error message
		echo "400";
	}
	

?>