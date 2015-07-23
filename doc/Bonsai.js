// Bonsai.js


// Bonsai is a global function.
// Do not change the name, because Flash callbacks rely on it.
Bonsai = function() {

    // Main class.  Do not create this class directly.
    // Instead, use the Bonsai.createMyVideo() and Bonsai.createPeerVideo() functions.
    // This class is a thin wrapper over the Flash object.
    // The main advantage of using this class is that the events are handled
    // nicely.  Instead of responding to a global JavaScript function, you
    // add your own callbacks.
    function BonsaiVideo(isMyVideo, instanceId) {
        // Callbacks
        this.onStateChanged 		= function(sender, state, errorInfo	) {}
        this.onLog 					= function(sender, message			) {}
        this.onError 				= function(sender, errorInfo		) {}
        this.onBandwidthReady		= function(sender, bandwidth  		) {}

        this.isMyVideo 				= isMyVideo;
        this.swf 					= null;	 	// will hold the actual Flash <object> once it is constructed

        this.version 				= function() 	{ if (this.swf) return this.swf.version(); else return ''   ; }
        this.state 					= function() 	{ if (this.swf) return this.swf.state()  ; else return 'NEW'; }

        this.serverUrl 				= function() 	{ return this.swf.serverUrl			(); }
        this.conversationId 		= function() 	{ return this.swf.conversationId	(); }
        this.attendeeId 			= function() 	{ return this.swf.attendeeId		(); }
        this.peerId 				= function() 	{ return this.swf.peerId			(); }

        this.cameraSettings 		= function() 	{ return this.swf.cameraSettings	(); }
        this.microphoneSettings 	= function() 	{ return this.swf.microphoneSettings(); }
        this.qosInfo 				= function() 	{ return this.swf.qosInfo			(); }
        this.systemInfo 			= function() 	{ return this.swf.systemInfo		(); }
        this.peerInfo 				= function() 	{ return this.swf.peerInfo			(); }
        this.isVideoMuted 			= function() 	{ return this.swf.isVideoMuted		(); }
        this.isAudioMuted 			= function() 	{ return this.swf.isAudioMuted		(); }

        // return this so we can string along the 'set' functions
        // e.g.  setConversationId('a').setAttendeeId('b').setPeerId('c')
        this.setServerUrl	 		= function(val) { this.swf.setServerUrl				(val); return this; }
        this.setConversationId 		= function(val) { this.swf.setConversationId		(val); return this; }
        this.setAttendeeId 			= function(val) { this.swf.setAttendeeId			(val); return this; }
        this.setPeerId 				= function(val) { this.swf.setPeerId				(val); return this; }

        this.setPassword 			= function(val) { this.swf.setPassword				(val); return this; }
        this.setCameraSettings 		= function(val) { this.swf.setCameraSettings		(val); return this; }
        this.setMicrophoneSettings 	= function(val) { this.swf.setMicrophoneSettings	(val); return this; }
        this.muteVideo 				= function(val) { this.swf.muteVideo				(val); }
        this.muteAudio 				= function(val) { this.swf.muteAudio				(val); }

        this.testUserBandwidth 		= function() 	{ this.swf.testUserBandwidth(); }
        this.connect 				= function() 	{ this.swf.connect			(); }
        this.startStreaming 		= function() 	{ this.swf.startStreaming	(); }
        this.close 					= function() 	{ this.swf.close			(); }

        this.playSound				= function(soundUrl, loops) 	{ this.swf.playSound(soundUrl, loops); 	}
        this.stopSound 				= function() 					{ this.swf.stopSound(); 				}


        // The element Id of the actual Flash <object> in the DOM.
        // The instanceId ensures that all elementIds are unique.
        // Use a random number to minimize collision with user element IDs.
        this.elementId = "bonsai_" + instanceId + "_" + Math.floor(Math.random()*100000);

        this.init = function(replaceElementId) {

            if (!replaceElementId) {
                // Create a new <div> element which will be replaced with the Flash <object> element
                var div = document.createElement('div');
                replaceElementId = "bonsai_replace_" + instanceId;
                div.setAttribute('id', replaceElementId);
                document.body.appendChild(div);
            }

            var replaceElement = document.getElementById(replaceElementId);
            if(!replaceElement) {
                var errorMsg = "BonsaiVideo() replaceElementId '" + replaceElementId + "' does not exist in DOM.";
                throw new Error(errorMsg);
            }

            // Insert html to install Adobe Flash Player or upgrade to minimum version required
            html = '<p>To view this page ensure that Adobe Flash Player version 11.1.0 or greater is installed.</p>'
                + '<a href="http://www.adobe.com/go/getflashplayer">'
                + '<img src="' + document.location.protocol + '//www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />'
                + '</a>'
            ;
            //        document.getElementById( replaceElementId ).innerHTML = html;

            // Minimum Flash version
            var minFlashVersion = "11.1.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string.
            var xiSwfUrlStr = "../lib/Bonsai/playerProductInstall.swf";
            //var xiSwfUrlStr = "playerProductInstall.swf";
            var params = {};
            params.quality = "high";
            params.bgcolor = "#ffffff";
            params.wmode = "transparent";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            var flashvars = { "isMyVideo": isMyVideo };
            swfobject.embedSWF(
                "../lib/Bonsai/Bonsai.swf", replaceElementId,
                //"Bonsai.swf", replaceElementId,
                "100%", "100%", // width, height
                minFlashVersion, xiSwfUrlStr,
                flashvars, params, { id: this.elementId, name: this.elementId } );
        }

        //	if fps > 11, return green
        //  if fps >  7, return yellow
        //  else         return red
        this.qualityFPS = function() {
            var qos = this.swf.qosInfo();
            for (var propertyName in qos) {
                if( propertyName == 'currentFPS' ) {
                    var fps = qos[propertyName];
                    if( fps > 11 )     return "green";
                    else if( fps >  7 )     return "yellow";
                    else                    return "red";
                }
            }
            return "red";
        }
    }

    return {

        // Contains all BonsaiVideo objects created.
        // It is needed so that Flash callbacks can be routed to the correct object.
        instances: {},

        //--------------------------------------
        //  FLASH CALLBACK HANDLERS
        //--------------------------------------

        loadedHandler: function(senderId) {
            var instance = this.instances[senderId];
            if (instance) {
                instance.swf = document.getElementById(instance.elementId);
                if (instance.onLoaded)
                    instance.onLoaded(instance);
            }
        },

        stateChangeHandler: function(senderId, state, errorInfo) {
            var instance = this.instances[senderId];
            if (instance)
                instance.onStateChanged(instance, state, errorInfo);
        },

        logHandler: function(senderId, message) {
            var instance = this.instances[senderId];
            if (instance)
                instance.onLog(instance, message);
        },

        errorHandler: function(senderId, errorInfo) {
            var instance = this.instances[senderId];
            if (instance)
                instance.onError(instance, errorInfo);
        },

        bandwidthHandler: function(senderId, bandwidth) {
            var instance = this.instances[senderId];
            if (instance)
                instance.onBandwidthReady(instance, bandwidth);
        },

        //--------------------------------------
        //  FACTORY METHODS: Create MyVideo object or PeerVideo object
        //--------------------------------------

        createMyVideo: function() {
            var cnt = 0;
            for( var i in this.instances ) {
                cnt++;
            }

            var instance = new BonsaiVideo(true, cnt);
            this.instances[instance.elementId] = instance;
            return instance;
        },

        createPeerVideo: function() {
            var cnt = 0;
            for( var i in this.instances ) {
                cnt++;
            }

            var instance = new BonsaiVideo(false, cnt);
            this.instances[instance.elementId] = instance;
            return instance;
        }

    };
}();