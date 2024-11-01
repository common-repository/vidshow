

		/* VARIABLES*/
			var prop			= { width: 420, height: 320 };
			var session			= ''; 
			var stream			= '';
			var status			= '';
			var archive			= '';
			var archiveCreated	= '';
			var archive_id 		= '';
			var connections		= 0;
			
		/* DEBUG LOG */	
			TB.setLogLevel(TB.DEBUG); 
		
		/* INTIALIZE SESSION */
			session = TB.initSession(TALKSHOW_SESSION_ID);
		
		/* EVENT LISTENERS */
			session.addEventListener("sessionConnected", sessionConnectedHandler);
			session.addEventListener("streamCreated", streamCreatedHandler);
			session.addEventListener("streamDestroyed", streamDestroyedHandler);
			session.addEventListener("archiveCreated", archiveCreatedHandler);
			session.addEventListener("archiveClosed", archiveClosedHandler);
			session.addEventListener("sessionDisconnected", sessionDisconnectedHandler);
			session.addEventListener("connectionCreated", connectionCreatedHandler);
			session.addEventListener("connectionDestroyed", connectionDestroyedHandler);
		
		/* CONNECT TO SESSION */
			session.connect(TALKSHOW_API_KEY, TALKSHOW_TOKEN);
			
		/* SESSION CONNECTED TO TOKBOX */ 
			function sessionConnectedHandler(event) {
				
				/* CHECK IF CURRENT ARCHIVE */							
					if(event.archives[0]){ 
						
						session.closeArchive(event.archives[0]);
						
					}
				
				/* SESSION STATUS */
					var status	= session.getStateManager(); 
					status.set('mode', 'both'); 
					
				/*PUBLISH STREAM */	
					session.publish('host', prop); 
				
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
								
								session.subscribe(stream, 'guest', prop);
									
							}
	
					}
			}

					
		/* STREAM DESTROYED */
			function streamDestroyedHandler(event){
				
				/*CHECK DESTROYED STREAM*/
					for (var i = 0; i < event.streams.length; i++) {
						
						/*VARIABLES*/
							var stream = event.streams[i];
						
						/*HOST*/
							if(stream.connection.data === 'host'){
								
								/*APPPEND HOLDER*/
									jQuery('#talkshow-host').append('<div data-stream-id="host" id="host"></div>');	 
									
							}
						
						/*GUEST*/
							if(stream.connection.data === 'guest'){
								
								/*APPPEND HOLDER*/
									jQuery('#talkshow-guest').append('<div data-stream-id="guest" id="guest"></div>');
									
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

		/* ARCHIVE CREATED */
			function archiveCreatedHandler(event) {
				
				/* VARIABLES */
					archive 			= event.archives[0];
					archiveCreated 		= true;			
					archive_id 			= event.archives[0].archiveId;
					
				/* START RECORDING SESSION */
					session.startRecording(archive);
				
			
			}
		
		/* ARCHIVE CLOSED*/
			function archiveClosedHandler(event){
				

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

		/* Connection Created */
			function connectionCreatedHandler(event) {

				if(event.target.connection.data !== 'guest'){
				
					/*Variables*/
						connections++;	
			
					/*Show Connections*/	
						document.getElementById('connections').innerHTML = connections;
					
				}
					
			}
			
		
		/* Connection Destroyed */
			function connectionDestroyedHandler(event){
				
				/* Variables */
					connections--;
		
				/*Show Connections*/	
					if(connections < 0) { 
						
						/*Variables*/
							connections = 0; 
						
						/*Display Count*/
							document.getElementById('connections').innerHTML = connections;
						 
					}else{
						
						/*Display Count*/
							document.getElementById('connections').innerHTML = connections;
						
					}
		
			}






	