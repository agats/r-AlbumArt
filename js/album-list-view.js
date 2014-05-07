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

      // FIXME this doesn't make sense, how the length currentAlbum?
      currentAlbum = albumCovers.length;

    };


    $( window ).on( 'covers-pulled', function ( event, data ) {
      console.log( 'new event from album-list-view' );
      updateListPane( data.allAlbums, data.currentAlbum );
    } );

} );
