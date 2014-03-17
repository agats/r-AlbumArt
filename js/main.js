/**
 *	Playing around with some jsonp from reddit.com
 *	@author Andrew Gatlabayan
 */
require(['js/libs/jquery-2.1.0.min.js'], function() {

var list;
var albumCoverCollection = [];

/**
 *  Album Cover Object Type
 *	@class
 *	@param		{object} options
 *	@returns	{object|AlbumCover}
 */
function AlbumCover(options) {

    // leave if we cannot populate the object
    if (typeof options !== 'object') {
        console.error('No data to create an album cover from');
        return null;
    }

    /** Title of Album */
    this.title = options.title || null;

    /** Source FIXME comment is incomplete */
    this.source = options.source || null;

    /** Thumbnail image */
    this.thumbnail = options.thumbnail || null;

    /** Fully qualified image url */
    this.img = options.img || null;

    /** Reddit post id */
    this.rId = options.rId || null;

    /** Reddit post name */
    this.rName = options.rName || null;

}


albumCoverCollection.addAlbum = function ( options ) {

    if ( !options ) {
        console.error( 'Cannot add an empty album' );
    }

    if ( options.url.indexOf( 'jpg' ) === -1 ) {
        options.url = options.url + '.jpg';
    }

    return this.push(new AlbumCover({
        title: options.title,
        source: 'http://www.reddit.com' + options.permalink,
        thumbnail: options.thumbnail,
        img: options.url,
        rId: options.subreddit_id,
        rName: options.name
    }));

};


albumCoverCollection.saveJson = function(json) {

    var results = json.data.children;

    list = json;

    for (var i = 0; i < results.length; i++) {
        var albumData = results[i].data || null;

        if (!albumData) {
            continue;
        }

        albumCoverCollection.addAlbum(albumData);

    }

};


albumCoverCollection.getAlbum = function(index) {
    return this[index] || false;
};


albumCoverCollection.pullNext = function ( options ) {

    var lastAlbum = this.getAlbum(this.length - 1);
    // FIXME this code is confusing, refactor to clearly build the url string
    var rName = (lastAlbum) ? '&after=' + lastAlbum.rName : '';

    $.ajax({
        url: 'http://www.reddit.com/r/AlbumArtPorn/.json?limit=15' + rName + '&jsonp=saveJson',
        async: true,
        dataType: 'jsonp',
        crossDomain: true,
        beforeSend: function() {
            if ( typeof options.beforeSend === 'function' ) {
                options.beforeSend();
            }
            // FIXME this should be in the View
            $("#albums h1:first").append(" | LOADING!");
        },
        complete: function() {
            if ( typeof options.complete === 'function' ) {
                options.complete();
            }
            // FIXME this should be in the View
            $("#albums h1:first").text($("#albums h1:first").text().replace(" | LOADING!", ""));
        }
    });

};

// TODO move to another file
$(document).ready(function() {

    // Callback function used by JSONP request
    window.saveJson = function ( json ) {
        albumCoverCollection.saveJson( json );
        albumViewer.updateListPane();
    };

    // Module for application's view
    // @requires albumCoverCollection
    var albumViewer = (function() {

        // List View
        var _listPane = $('#results').find('ul');

        // Main View
        var _viewPane = $('#view');

        // Main View's Image
        var _viewImg = _viewPane.find('#view-img');

        // Main View's Title
        var _viewTitle = _viewPane.find('#view-title');

        // Header's container
        var _viewHeader = $( '$album' );

        // Current Album ID
        var _currentAlbum = 0;


        // List View's Events
        // ==================
        _listPane
            .bind('click.album', function(e) {

                var $this = $(e.target),
                    album;

                if ($this.attr('acc-id')) {
                    _viewPane.trigger('interactive.album ');

                    album = albumCoverCollection.getAlbum($this.attr('acc-id'));

                    _viewImg.attr('src', album.img);

                    _viewTitle.text(album.title);

                    $this.parent().siblings('.result-active')
                        .removeClass('result-active')
                        .end().addClass('result-active');

                } else if (e.target.tagName === 'LI') {

                    $this.find('img').trigger('click.album');

                }

            })
            .end().find('#results-list-anchor').bind('click.album', function(e) {
                e.preventDefault();
                albumCoverCollection.pullNext();
            });


        // Main View Image's Events
        // ==================
        _viewImg.bind('load.album', function(e) {
            _viewPane.trigger('ready.album');
        });


        // Main View's Events
        // ==================
        _viewPane
            .bind('interactive.album', function(e) {
                $(this)
                    .children().hide()
                    .filter('#view-loading-spinner').show();
            })
            .bind('ready.album', function(e) {
                $(this)
                    .children().show()
                    .filter('#view-loading-spinner').hide();
            })
            .append('<span id="view-loading-spinner">Loading</span>');


        // Header View's Events
        // ====================

        // Init
        albumCoverCollection.pullNext();
        _viewImg.show();

        return {
            updateListPane: function() {

                for (var i = _currentAlbum; i < albumCoverCollection.length; i++) {
                    var currAlbum = albumCoverCollection.getAlbum( i );

                    _listPane.append(
                        '<li><img src="' + currAlbum.thumbnail + '" acc-id="' + i + '" alt="' + currAlbum.title + '"/>' + currAlbum.title + '</li>'
                    );
                }

                if (_currentAlbum === 0) {
                    _listPane.find('img:first').trigger('click');
                }

                // FIXME this doesn't make sense, how the length _currentAlbum?
                _currentAlbum = albumCoverCollection.length;

            },
            getCurrentId: function() {
                return _currentAlbum;
            },
            changeView: function(url) {
                _viewImg.attr("src", url);
            }
        };
    })();

});

});