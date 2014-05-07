/**
 *  Album List View
 *  @requires   jQuery
 *  @module     album-list-view
 */
define(
    [ 'js/libs/jquery-2.1.0.min.js', 'album-cover-collection' ],
    function( jQuery, albumCoverCollection ) {

var listPane = $('#results').find('ul');


function updateListPane ( albumCovers, currentAlbum ) {

  for (var i = currentAlbum; i < albumCovers.length; i++) {
    var currAlbum = albumCovers.getAlbum( i );
    var thumbnail = currAlbum.thumbnail;

    if ( thumbnail === 'nsfw' ) {
        thumbnail = '';
    }

    listPane.append(
        '<li><img width="70" src="' + thumbnail + '" data-album-id="' + i + '" alt="' + currAlbum.title + '"/>' + currAlbum.title + '</li>'
    );
  }

};


$( window ).on( 'update-current-cover', function ( event, data ) {

  var albumId = data.albumId;

  listPane.find( '.result-active' ).removeClass( 'result-active' );

  listPane.find( '[data-album-id=' + albumId + ']').parent().addClass( 'result-active' );

} );

$( window ).on( 'covers-received', function ( event, data ) {
  console.log( 'new event from album-list-view' );
  updateListPane( data.allAlbums, data.currentAlbumId );
} );

} );
