<?php

	/*Variables*/
		$email  = $_POST['email'];
		$url	= $_POST['url'];
		$valid 	= validateEmail($email);
	
	/*Email Variables*/
		$subject 	= 'NarrativeTherapy.tv Guest Invitation'; 
		$message	= "

Hi,
		
Please click the below link to join the conversation on NarrativeTherapy.tv. Really looking forward to it!

$url

Many thanks,

The NarrativeTherapy.tv Team 
		
		";
		$headers = 'From: NarrativeTherapy.tv <admin@narrativetherapy.tv>' . "\r\n" .
				   'Reply-To: NarrativeTherapy.tv <admin@narrativetherapy.tv>' . "\r\n";
				   
	/*Mail*/
		if($valid == 0){
			
			
		}else{
			
			mail($email, $subject, $message, $headers);
			
		}
		

/*  Validate Email Address
/*---------------------------*/
/*  */	
	
	function validateEmail($email){
		return preg_match("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$^", $email);
	}


		