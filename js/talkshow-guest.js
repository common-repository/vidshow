

	/* VARIABLES*/
		var prop		= { width: 420, height: 320 };
		var session		= ''; 
		var stream		= '';
		var status		= '';

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
			
			/* SESSION STATUS */
				status	= session.getStateManager(); 
			
			/*PUBLISH STREAM */	
				session.publish('guest', prop); 
			
			/* SUBSCRIBE TO STREAM */	
				subscribeToStreams(event.streams);
			  
		}	

	/* ON STREAM CREATION */
		function streamCreatedHandler(event) {
				
			/* SUBSCRIBE TO STREAM*/	
				subscribeToStreams(event.streams);

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
							
							session.subscribe(stream, 'host', prop);
								
						}

				}
		}
				
	/* STREAM DESTROYED */
		function streamDestroyedHandler(event){
			
			/*CHECK DESTROYED STREAM*/
				for (var i = 0; i < event.streams.length; i++) {
					
					/*VARIABLES*/
						var stream = event.streams[i];
					
					/*REMOVE OBJECT*/
						jQuery('#talkshow-host').empty();
						jQuery('#talkshow-guest').empty();
					
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

	/* SESSION DISCONNECTED */
		function sessionDisconnectedHandler(event){
			
			/*CHECK DESTROYED STREAM*/
				for (var i = 0; i < event.streams.length; i++) {
					
					/*VARIABLES*/
						var stream = event.streams[i];
					
					/*REMOVE OBJECT*/
						jQuery('#talkshow-host').empty();
						jQuery('#talkshow-guest').empty();
					
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
					

