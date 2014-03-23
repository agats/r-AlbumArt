/**
 *	Playing around with some jsonp from reddit.com and using RequireJS
 *	@author Andrew Gatlabayan
 */
require(
    [ 'js/libs/jquery-2.1.0.min.js', 'album-cover-collection', 'album-viewer' ],
    function( jQuery, albumCoverCollection, albumViewer ) {

    // Callback function used by JSONP request
    // This currently used in albumCoverCollection.pullNext
    window.saveJson = function ( json ) {
        albumCoverCollection.saveJson( json );
        albumViewer.updateListPane();
    };
    
    // Start Album Viewer app
    $(function() {
        albumViewer.init();
    } );

});