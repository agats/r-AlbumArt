/**
 *	Playing around with some jsonp from reddit.com and using RequireJS
 *	@author Andrew Gatlabayan
 */
require(
    [ 'js/libs/jquery-2.1.0.min.js', 'album-cover-collection', 'album-viewer', 'album-list-view' ],
    function( jQuery, albumCoverCollection, albumViewer, albumListView ) {

var myAlbums     = Object.create( albumCoverCollection );
var currentAlbumId = 1;

// Callback function used by JSONP request
// This currently used in albumCoverCollection.pullNext
window.saveJson = function ( json ) {
    myAlbums.saveJson( json );
};

function requestCovers ( ) {

  myAlbums.pullNext( {
    complete: function ( ) {
      $( window ).trigger(
        'covers-received',
        {
          allAlbums: myAlbums,
          currentAlbumId: currentAlbumId
        }
      );
    }
  } );

};

// Model Events
// ============
$( window ).on( 'request-covers', requestCovers );

$( window ).on( 'covers-received', function ( event, data ) {
  console.log( data.currentAlbumId );

} );

$( window ).on( 'update-current-cover', function ( event, data ) {
  currentAlbumId = data.albumId;
  console.log( currentAlbumId );
} );


// Controller Events
// =================
$( '#results-list-anchor' ).on( 'click', function ( e ) {
  e.preventDefault();
  $( window ).trigger( 'request-covers' );
} );

$( '#results-list' ).on( 'click', 'li', function ( e ) {
  var albumId = $(this).find( 'img' ).attr( 'data-album-id' );
  $( window ).trigger( 'update-current-cover', { albumId: albumId } )
} );


// Start Album View New
$( document ).ready( function ( ) {

  currentAlbumId = 1;

  $( window ).trigger( 'request-covers' );

  $( window ).one( 'covers-received', function ( ) {
    $( window ).trigger( 'update-current-cover', { albumId: currentAlbumId } );
  } );

} );

});
