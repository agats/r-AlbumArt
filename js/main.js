/**
 *	Playing around with some jsonp from reddit.com and using RequireJS
 *	@author Andrew Gatlabayan
 */
require(
    [ 'js/libs/jquery-2.1.0.min.js', 'album-cover-collection', 'album-viewer', 'album-list-view' ],
    function( jQuery, albumCoverCollection, albumViewer, albumListView ) {

    var myAlbums     = Object.create( albumCoverCollection );
    var currentAlbum = 1;

    // Callback function used by JSONP request
    // This currently used in albumCoverCollection.pullNext
    window.saveJson = function ( json ) {
        // albumCoverCollection.saveJson( json );
        // albumViewer.updateListPane();

        myAlbums.saveJson( json );
    };

    // Start Album Viewer app
    // $(function() {
    //     albumViewer.init();
    // } );


    // Start Album View New
    $( function ( ) {

      $( window ).on( 'covers-pulled', function ( event, data ) {
        var albums = data.allAlbums;
        for ( var i = 0; i < albums.length; ++i ) {
          console.log ( albums[ i ] );
        }
      } );

      myAlbums.pullNext( {
        complete: function ( ) {
          $( window ).trigger(
            'covers-pulled',
            {
              allAlbums: myAlbums,
              currentAlbum: currentAlbum
            }
          );
        }
      } );

    } );

});
