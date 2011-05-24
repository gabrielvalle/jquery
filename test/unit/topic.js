module("topic", { teardown: moduleTeardown });

test( "jQuery.Topic - Anonymous Topic", function() {

	expect( 4 );

	var topic = jQuery.Topic(),
		count = 0;

	function firstCallback( value ) {
		strictEqual( count, 1, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	}

	count++;
	topic.subscribe( firstCallback );
	topic.publish( "test" );
	topic.unsubscribe( firstCallback );
	count++;
	topic.subscribe(function( value ) {
		strictEqual( count, 2, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	});
	topic.publish( "test" );

});

test( "jQuery.Topic - Named Topic", function() {

	expect( 2 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.Topic( "test" ).subscribe( callback );
	jQuery.Topic( "test" ).publish( "test" );
	jQuery.Topic( "test" ).unsubscribe( callback );
	jQuery.Topic( "test" ).publish( "test" );
});

test( "jQuery.Topic - Helpers", function() {

	expect( 4 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.subscribe( "test", callback );
	jQuery.publish( "test" , "test" );
	jQuery.unsubscribe( "test", callback );
	jQuery.publish( "test" , "test" );


	var test = true,
		subscription = jQuery.subscribe( "test", function() {
			ok( test, "first callback called" );
		}, function() {
			ok( test, "second callback called" );
		});
	jQuery.publish( "test" );
	test = false;
	jQuery.unsubscribe( subscription );
	jQuery.publish( "test" );
});

test( "jQuery.Topic - Self Unsubscribing Callbacks", function() {

	var args = [ "string", "", 1, 0, true, false, null, undefined, {}, [], function() { return "win!" } ], 
		tests = [ "string", "empty", "one", "zero", "true", "false", "null", "undefined", "object", "array", "function" ], 
		counters = {};

	expect( args.length * 3 );

	function callback() {

		ok( true, "Topic: '" + arguments[0] + "' has published " );

		counters[arguments[0]]++;

		if ( counters[arguments[0]] === 1 ) {

			// unsubscribe this topic - CRUCIAL
			jQuery.unsubscribe( this );

			arguments[ 2 ].call( this, arguments[0], arguments[1], function( id, arg, idx ) {

				this.topic.publish();

				equal( counters[id], 1, "Callback for '"+ id +"' executed once; became unsubscribed; an attempted second publish was squashed" );
				same( arg, args[idx], "Argument '"+ id +"' survived inception" );
			});
		}
	}

	jQuery.each( args, function( idx, val ) {

		counters[ tests[idx] ] = 0;

		var subscription = jQuery.subscribe( tests[ idx ], function() {

			callback.apply( subscription, 
				[ 
					tests[ idx ], 
					val, 
					function( arg, id, lastCall ) {
						lastCall.call( this, arg, id, idx );
					}
				] 
			);
		});

		subscription.topic.publish();
	});
});
