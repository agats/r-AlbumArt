define(
	[ 'js/libs/jquery-2.1.0.min.js', './album-cover' ],
	function( jQuery, albumCover ) {

var albumCoverCollection = [];


albumCoverCollection.addAlbum = function ( options ) {

		var newAlbum = Object.create ( albumCover );

    if ( !options ) {
        console.error( 'Cannot add an empty album' );
    }

    // Force extenstion
    if ( options.url.indexOf( 'jpg' ) === -1 ) {
        options.url = options.url + '.jpg';
    }

		for( var prop in options ) {
				newAlbum[ prop ] = options[ prop ]
		}

		// Create and update names for `albumCover` API
		newAlbum.source	= 'http://www.reddit.com' + options.permalink;
		newAlbum.img 		= options.url;
		newAlbum.rId 		= options.subreddit_id;
		newAlbum.rName 	= options.name;

    return this.push( newAlbum );

};

// TODO move this to album-viewer
albumCoverCollection.saveJson = function( json ) {

    var results		= json.data.children;
    var list			 = json;

    for (var i = 0; i < results.length; i++) {
        var albumData = results[i].data || null;

        if ( !albumData ) {
            continue;
        }

        albumCoverCollection.addAlbum( albumData );

    }

};


albumCoverCollection.getAlbum = function( index ) {
    return this[ index ] || false;
};


// TODO move this album-viewer
albumCoverCollection.pullNext = function ( options ) {

    var lastAlbum = this.getAlbum(this.length - 1);
    // FIXME this code is confusing, refactor to clearly build the url string
    var rName = ( lastAlbum ) ? '&after=' + lastAlbum.rName : '';

    options.beforeSend = options.beforeSend || null;
    options.complete = options.complete || null;

    $.ajax( {
        url: 'http://www.reddit.com/r/AlbumArtPorn/.json?limit=15' + rName + '&jsonp=saveJson',
        async: true,
        dataType: 'jsonp',
        crossDomain: true,
        beforeSend: function() {
            if ( typeof options.beforeSend === 'function' ) {
                options.beforeSend();
            }
        },
        complete: function() {
            if ( typeof options.complete === 'function' ) {
                options.complete();
            }
        }
    } );

};

return albumCoverCollection;

} );
