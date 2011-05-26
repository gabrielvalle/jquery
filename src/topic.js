(function( jQuery ) {

	var sliceTopic = [].slice;

	jQuery.Topic = function( name ) {

		// Localize refs for compression benefit
		var topicCache = jQuery.Topic.cache, 
			fromCache = topicCache[ name ];

		// If topic object exists, return it
		if ( fromCache ) {
			return fromCache;
		}

		// Create new topic object instance
		return new Topic( name );
	};

	jQuery.Topic.cache = {};
	jQuery.Topic.inherits = {
		"publish": "fire",
		"subscribe": "add",
		"unsubscribe": "remove"
	};

	function Topic( name ) {

		// Localize  refs for compression benefit
		var topicCache = jQuery.Topic.cache,
			inherits = jQuery.Topic.inherits,
			callbacks = jQuery.Callbacks(),
			selfObj = {};

		this.name = name;

		jQuery.each( inherits, function( method, inherit ) {
			selfObj[ method ] = callbacks[ inherit ];
		});

		jQuery.extend( this, selfObj );

		topicCache[ name ] = this;

		return this;
	}

	jQuery.extend({
		subscribe: function( name /*, callback */ ) {
			var topic = jQuery.Topic( name ),
				args = sliceTopic.call( arguments, 1 );

			topic.subscribe.apply( topic, args );

			return {
				topic: topic,
				args: args
			};
		},
		unsubscribe: function( name/*, callback */ ) {
			var topic = name && name.topic || jQuery.Topic( name );
			topic.unsubscribe.apply( topic, name && name.args ||
					sliceTopic.call( arguments, 1 ) );
		},
		publish: function( name ) {
			var topic = jQuery.Topic( name );
			topic.publish.apply( topic, sliceTopic.call( arguments, 1 ) );
		}
	});

})( jQuery );
