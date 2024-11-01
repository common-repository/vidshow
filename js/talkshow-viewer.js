	
	
	/* VARIABLES*/
		var prop			= { width: 420, height: 320 };
		var session			= ''; 
		var stream			= '';
		var streamStatus	= false;
	
	/* DEBUG LOG */	
		TB.setLogLevel(TB.DEBUG); 
	
	/* INTIALIZE SESSION */
		session = TB.initSession(TALKSHOW_SESSION_ID);
	
	/* EVENT LISTENERS */
		session.addEventListener("sessionConnected", sessionConnectedHandler);
		session.addEventListener("streamCreated", streamCreatedHandler);
		session.addEventListener("streamDestroyed", streamDestroyedHandler);
		session.addEventListener("sessionDisconnected", sessionDisconnectedHandler);
	
	/* CONNECT TO SESSION */
		session.connect(TALKSHOW_API_KEY, TALKSHOW_TOKEN);
	
	/* SESSION CONNECTED TO TOKBOX */
		function sessionConnectedHandler(event) {
			
			/* STATE MANAGER*/
				var status	= session.getStateManager(); 
				status.addEventListener("changed", statusChangedHandler);
			  
		}	
	
	/* ON STREAM CREATION */
		function streamCreatedHandler(event) {
			
			/*CHECK IF BROADCASTING*/
				if(streamStatus == true){
					
					/*SUBSCRIBE TO ALL STREAMS*/
						jQuery.each(session.streams, function(i, stream) {
							
							/*Variables*/
								var streamObject = jQuery.parseJSON('[' + JSON.stringify(stream, null, 4) + ']');
								
							/*Subscribe*/
								subscribeToStreams(streamObject);
									
						});
				
				}
	
		}
		
	/* SUBSCRIBE TO THE STREAMS IN THE SESSION */
		function subscribeToStreams(streams) {
	
			/* NOT STARTED YET */
				if(streams.length == 0){
					
					
	
				}
			
			/*CONNECT TO THE STREAM */
				for (i = 0; i < streams.length; i++) {
	
					/* VARIABLES */
						stream = streams[i];
					
					/* CHECK MAKE SURE NOT SUBSCIBING TO OWN STREAM */
						if(stream.connection.connectionId != session.connection.connectionId) {
							
							/*HIDE MESSAGE*/
								jQuery('#waiting-msg').fadeOut();
							
							/*HOST STREAM*/
								if(stream.connection.data === "host"){
								
									session.subscribe(stream, 'host', prop);
								
								}
							
							/*GUEST STREAM*/
								if(stream.connection.data === "guest"){
									
									session.subscribe(stream, 'guest', prop);
									
								}
								
						}  
	
				}
				
		}
	
	/* SESSION DISCONNECTED */
		function sessionDisconnectedHandler(event){
			
			/*CHECK DESTROYED STREAM*/
				for (var i = 0; i < event.streams.length; i++) {
					
					/*VARIABLES*/
						var stream = event.streams[i];
					
					/*SHOW MESSAGE*/
						jQuery('#waiting-msg').fadeIn();
					
					/*HOST*/
						if(stream.connection.data === 'host'){ 
							
							/*APPPEND HOLDER*/
								$('#talkshow-host').append('<div data-stream-id="host" id="host"></div>');	 
								
						}
					
					/*GUEST*/
						if(stream.connection.data === 'guest'){
							
							/*APPPEND HOLDER*/
								$('#talkshow-guest').append('<div data-stream-id="guest" id="guest"></div>');
								
						}
					
					/*UNSUBSCRIBE STREAM*/						
						unsubscribe(stream);
					
				}				
			
		}
		
				
	/* STREAM DESTROYED */
		function streamDestroyedHandler(event){
			
			/*CHECK DESTROYED STREAM*/
				for (var i = 0; i < event.streams.length; i++) {
					
					/*VARIABLES*/
						var stream = event.streams[i];
					
					/*SHOW MESSAGE*/
						jQuery('#waiting-msg').fadeIn();
					
					/*HOST*/
						if(stream.connection.data === 'host'){
							
							/*APPPEND HOLDER*/
								$('#talkshow-host').append('<div data-stream-id="host" id="host"></div>');	 
								
						}
					
					/*GUEST*/
						if(stream.connection.data === 'guest'){
							
							/*APPPEND HOLDER*/
								$('#talkshow-guest').append('<div data-stream-id="guest" id="guest"></div>');
								
						}
					
					/*UNSUBSCRIBE STREAM*/						
						unsubscribe(stream);
					
				}		
			
		}
		
	/* UNSUBSCRIBE FROM STREAM */	
		function unsubscribe(stream) {
			
			/* VARIABLES */
				var subscribers = session.getSubscribersForStream(stream);
			
			/* UNSUBSCRIBE ALL */
				for (var i = 0; i < subscribers.length; i++) {
					
					session.unsubscribe(subscribers[i]); 
					
				}
			
		}

	/* SESSION STATUS CHANGED*/
		function statusChangedHandler(event){ 
		
			/*CHECK STATUS OF SESSION*/
				/*WAITING*/
					if(event.changedValues["talkshow"] === 'waiting'){
						
						/*VARIABLES*/
							streamStatus = false;
						
						/*SHOW MESSAGE*/
							jQuery('#waiting-msg').fadeIn();  

						/**/
							jQuery.each(session.streams, function(i, stream) {
								
								/* VARIABLES */
									var subscribers = session.getSubscribersForStream(stream);
								
								/* UNSUBSCRIBE ALL */
									for (var i = 0; i < subscribers.length; i++) {
										
										session.unsubscribe(subscribers[i]); 
										
									}
										
							});
							
					}
				
				/*STARTED*/
					if(event.changedValues["talkshow"] === 'start'){
						
						/*VARIABLES*/
							streamStatus = true;
						
						/*SUBSCRIBE TO ALL STREAMS*/	
							jQuery.each(session.streams, function(i, stream) {
					
								/*Variables*/
									var streamObject = jQuery.parseJSON('[' + JSON.stringify(stream, null, 4) + ']');
									
								/*Subscribe*/
									subscribeToStreams(streamObject); 
										
							});
							
							
					}
				
				/*VIEW MODE*/
					/*BOTH HOST AND GUEST*/
						if(event.changedValues["mode"] === 'both'){
							
							jQuery('#talkshow-host').css({ 
							
								height			: '320px',
								width			: '420px',
								'margin-left'	: '10px'
							
							});
							
							jQuery('#talkshow-host').children('object').css({ 
							
								height			: '320px',
								width			: '420px'
							
							});
							
							jQuery('#talkshow-guest').css({ 
							
								height			: '320px',
								width			: '420px',
								'margin-left'	: '10px'
							
							});
							
							jQuery('#talkshow-guest').children('object').css({ 
							
								height			: '320px',
								width			: '420px'
							
							});
							
							
						}
					
					/*GUEST*/
						if(event.changedValues["mode"] === 'guest'){
							
							jQuery('#talkshow-host').css({ 
							
								height			: '1px',
								width			: '1px',
								'margin-left'	: '0px'
							
							});
							
							jQuery('#talkshow-host').children('object').css({ 
							
								height			: '1px',
								width			: '1px'
							
							});
							
							jQuery('#talkshow-guest').css({ 
							
								width 			: '640px',
								height			: '480px',
								'margin-left'	: '120px'
							
							});
							
							jQuery('#talkshow-guest').children('object').css({ 
							
								width 			: '640px',
								height			: '480px',
							
							});
							
						}
						
					/*HOST*/
						if(event.changedValues["mode"] === 'host'){
							
							jQuery('#talkshow-guest').css({ 
							
								height			: '1px',
								width			: '1px',
								'margin-left'	: '0px'
							
							});
							
							jQuery('#talkshow-guest').children('object').css({ 
							
								height			: '1px',
								width			: '1px'
							
							});
							
							jQuery('#talkshow-host').css({ 
							
								width 			: '640px',
								height			: '480px',
								'margin-left'	: '120px'
							
							});
							
							jQuery('#talkshow-host').children('object').css({ 
							
								width 			: '640px',
								height			: '480px',
							
							});
							
							
						}


	
		}
		