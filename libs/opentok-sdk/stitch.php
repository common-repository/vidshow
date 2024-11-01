<?php

	/*SET SERVER NEEDS*/
		ini_set("allow_url_fopen", true);
		ini_set("allow_url_include", true); 

	/*FIX WP LOAD ISSUE*/	
		$root = $_SERVER['DOCUMENT_ROOT'];	 
		require_once($root.'/wp-load.php');    

	/*VARIABLES*/
		$API_KEY 		= '23180362';
		$API_SECRET 	= 'b7d10b072efb13c39add9bb4e96ad0606bbcd21a';
		$archive_id 	= $_POST['archive_id'];       
		$stitchUrl 		= "https://api.opentok.com/hl/archive/$archive_id/stitch";  
		$stitch			= $_POST['stitch'];
		$download		= $_POST['download'];
		
		$uploads 		= wp_upload_dir();
		$base_dir 		= $uploads['basedir'];
		$base_url		= $uploads['baseurl'];
		$upload_path 	= $base_dir.'/talkshow/'; 
		$upload_url		= $base_url.'/talkshow/'; 
  
	/*CREATE FOLDER*/	
		if(!is_dir($upload_path)){
			
			mkdir($upload_path, 0777);	  
			chmod($upload_path, 0777);
			 
		} 
	
	
	/*CURL*/
		$ch = curl_init(); 
	
	/*CURL VARIABLES*/
		curl_setopt($ch, CURLOPT_URL, $stitchUrl);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/x-www-form-urlencoded', "X-TB-PARTNER-AUTH: $API_KEY:$API_SECRET", 'Content-length:0'));
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	
	/*CURL RESULT*/
		$res = curl_exec($ch);
	
	/*PROCESS RESULTS*/	 
		parse_results($res, $archive_id, $upload_path, $upload_url, $download); 

	/*CLOSE CURL*/
		curl_close($ch);
 
	/*PROCESS REQUEST TO STITCH*/
		function parse_results($res, $archive_id, $upload_path, $upload_url, $download){ 
			
			 /*VARIABLES*/
				 $lines 	= explode("\n", $res); 
			 	 $status 	= trim($lines[2]); 
				  
			 /*PRINT ALL*/
				 //echo '<pre>'.print_r($lines, TRUE). '</pre>';  
			 
			/*READ RESULT*/
				 if($status === 'HTTP/1.1 201 Created'){  
					
					/*VARIABLES*/
						$status = 201;
						$url	= str_replace('Location: ', '', trim($lines[7])); 
						
					/*OPENTOK DOWNLOAD VIDEO WORDPRESS HTTP_API*/		
						$file	= file_get_contents($url);
						
						file_put_contents($upload_path.$archive_id.'.mp4', $file);  
								 
						if($download == 'yes'){		
						
							/*VARIABLES*/
								$guid = $upload_url . basename($archive_id.'.mp4');
								
							/*INSERT INTO DATABASE*/		
								$wp_filetype = wp_check_filetype(basename($guid), null);  
						
								$attachment = array(
												   'guid' 			=> $guid,  
												   'post_mime_type' => $wp_filetype['type'], 
												   'post_title' 	=> preg_replace('/\.[^.]+$/', '', basename('Talkshow: '.date('F j Y H i'))), 
												   'post_content' 	=> '',
												   'post_status' 	=> 'inherit'
											  );
								
								wp_insert_attachment($attachment, 'talkshow/'.$archive_id.'.mp4');
						
						}
					
				 }
				 
				 if($status === 'HTTP/1.1 202 Accepted'){     
					
					$status = 202;
					$url	= '';  
					 
				 }
			   
			 /*JSON RESULTS*/
			 	echo json_encode(array('status' => $status, 'url' => $url, 'archive_id' => $archive_id, 'path' => $upload_path, 'guid' => $guid, 'file type' => $wp_filetype['type']));    
			 
		}
	