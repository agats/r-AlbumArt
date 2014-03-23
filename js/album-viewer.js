/**
 *  Album Viewer
 *  @requires   jQuery, albumCoverCollection
 *  @module     albumViewer
 */
define(
    [ 'js/libs/jquery-2.1.0.min.js', 'album-cover-collection' ],
    function( jQuery, albumCoverCollection ) {

    // Header's container
    var _viewHeader = $( 'header' );
    
    // Main View
    var _viewPane = $('#view');

    // Main View's Image
    var _viewImg = _viewPane.find('#view-img');

    // Main View's Title
    var _viewTitle = _viewPane.find('#view-title');

    // List View
    var _listPane = $('#results').find('ul');

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
            albumCoverCollection.pullNext( {
                beforeSend: function () {
                    _viewHeader.trigger( 'interactive' );
                },
                complete: function () {
                    _viewHeader.trigger( 'ready' );
                }
            } );
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
    _viewHeader
        .bind( 'interactive.album', function ( e ) {
            $( this ).find( 'h1' ).append(" | LOADING!");
        })
        .bind( 'ready.album', function ( e ) {
            var titleEl = $( this ).find( 'h1' );
            titleEl.text( titleEl.text().replace(' | LOADING!', '') );
        });


    return {
        init: function() {
            albumCoverCollection.pullNext( {
                beforeSend: function () {
                    _viewHeader.trigger( 'interactive' );
                },
                complete: function () {
                    _viewHeader.trigger( 'ready' );
                }
            } );
            _viewImg.show();
        },
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

} );