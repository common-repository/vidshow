

/* TALKSHOW APPLICATION FUNCTIONS */
	jQuery(document).ready(function (e) {
		jQuery('#start-broadcast').on('click', function (e) {
			e.preventDefault();
			var status = session.getStateManager();
			status.set('talkshow', 'start');
			session.createArchive(TALKSHOW_API_KEY, "perSession", TALKSHOW_DATE);
			jQuery('#start-broadcast').hide(function () {
				jQuery('#end-broadcast').show()
			})
		});
		jQuery('#end-broadcast').on('click', function (e) {
			e.preventDefault();
			var status = session.getStateManager();
			status.set('talkshow', 'waiting');
			session.stopRecording(archive);
			session.closeArchive(archive);
//			jQuery('.downloading').fadeIn();
			jQuery('#end-broadcast').hide(function () {
				jQuery('#start-broadcast').show()
			});
			jQuery.each(session.streams, function (i, stream) {
				var subscribers = session.getSubscribersForStream(stream);
				for (var i = 0; i < subscribers.length; i++) {
					session.unsubscribe(subscribers[i])
				}
			});
			jQuery('#talkshow-host').empty(); 
//			var i = 0;
//			var stitch = setInterval(function () {
//				jQuery.ajax({
//					url: TALKSHOW_STITCH_URL,
//					type: 'POST',
//					data: {
//						archive_id: archive_id,
//						upload_dir: TALKSHOW_UPLOAD_DIR,
//						upload_url: TALKSHOW_UPLOAD_URL,
//					},
//					dataType: "json",
//					success: function (data) {
//						if (parseInt(data.status) === 201) {
//							clearInterval(stitch);
//							if (i == 0) {
//								i++;
//								jQuery.ajax({
//									url: TALKSHOW_STITCH_URL,
//									type: 'POST',
//									data: {
//										archive_id: archive_id,
//										upload_dir: TALKSHOW_UPLOAD_DIR,
//										upload_url: TALKSHOW_UPLOAD_URL,
//										download: 'yes'
//									},
//									dataType: "json",
//									success: function (data) {
//										jQuery('.downloading').hide();
//										jQuery('.finished').fadeIn();
//									}
//								})
//							}
//						}
//					}
//				})
//			}, 5000);
		});
		jQuery('#both').click(function (e) { 
			e.preventDefault();
			var status = session.getStateManager();
			status.set('mode', 'both');
			jQuery('#both').addClass('btn-success');
			jQuery('#both').removeClass('btn-primary');
			
			jQuery('#host-only').removeClass('btn-success');
			jQuery('#guest-only').removeClass('btn-success'); 
			
		});
		jQuery('#guest-only').click(function (e) {
			e.preventDefault();
			var status = session.getStateManager();
			status.set('mode', 'guest');
			jQuery('#guest-only').addClass('btn-success');
			jQuery('#guest-only').removeClass('btn-primary');
			
			jQuery('#host-only').removeClass('btn-success');	
			jQuery('#both').removeClass('btn-success');
		});
		jQuery('#host-only').click(function (e) {
			e.preventDefault();
			var status = session.getStateManager();
			status.set('mode', 'host');
			jQuery('#host-only').addClass('btn-success');
			jQuery('#host-only').removeClass('btn-primary');
			
			jQuery('#guest-only').removeClass('btn-success');
			jQuery('#both').removeClass('btn-success');
		})
	});