define( function() {

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

return AlbumCover;

});