/**
 *	Playing around with some jsonp from reddit.com
 *	@author Andrew Gatlabayan
 *
 */
require(["jquery.jsonp-2.1.4.min.js","sprintf-0.7-beta1.js"],function(){
	var list;
	var albumViewer;
	var i = 0;
	var albumCoverCollection = [];
	

	/**
	 *  Album Cover Object Type
	 *	@class
	 *	@returns	{object|AlbumCover}
	 */
	function AlbumCover(o){
		
		/** Title of Album */
		this.title;
		
		/** Source FIXME comment is incomplete */
		this.source;
		
		/** Thumbnail image */
		this.thumbnail;
		
		/** Fully qualified image url */
		this.img;
		
		/** Reddit post id */
		this.rId;
		
		/** Reddit post name */
		this.rName;
		
		
		// leave if we cannot populate the object
        if (typeof o !== "object") {
        	return;
        }
        
        this.title = o.title || null;
        this.source = o.source || null;
        this.thumbnail = o.thumbnail || null;
        this.img = o.img || null;
        this.rId = o.rId || null;
        this.rName = o.rName || null;
	}

	albumCoverCollection.saveJson = function(json){
		var results = json.data.children;
		list = json;
		for(var i = 0; i < results.length; i++){
			(function(index){
				var _this = results[index].data;
				albumCoverCollection.push(new AlbumCover({
					title: _this.title,
					source: 'http://www.reddit.com' + _this.permalink,
					thumbnail: _this.thumbnail,
					img: _this.url,
					rId: _this.subreddit_id,
					rName: _this.name
				}));
			})(i);
		}
		albumViewer.updateListPane();
	};
	albumCoverCollection.getAlbum = function(i){
		return this[i] || false;
	};
	albumCoverCollection.pullNext = function(callBack){
		var lastAlbum = this.getAlbum(this.length - 1),
		rName = (lastAlbum) ? '&after='+lastAlbum.rName : '';
		$.jsonp({
			url: 'http://www.reddit.com/r/AlbumArtPorn/.json?limit=15'+rName+'&jsonp=albumCoverCollection.saveJson',
			callbackParameter: '',
			beforeSend: function(){
				$("#albums h1:first").append(" | LOADING!");
			},
			complete: function(){
				$("#albums h1:first").text($("#albums h1:first").text().replace(" | LOADING!",""));
				if(typeof callBack === "function"){
					callBack();
				}
			}
		});
	};

	$(document).ready(function(){
		albumViewer = (function(){
			var _listPane = $(document.getElementById("results")).find("ul"),
				_viewPane = $(document.getElementById("view")),
				_viewImg = _viewPane.find("#view-img"),
				_viewTitle = _viewPane.find("#view-title"),
				_currentAlbum = 0;
			
			albumCoverCollection.pullNext();

			_listPane
				.bind("click.album",function(e){
					var $this = $(e.target), album;
					if($this.attr("acc-id")){
						_viewPane.trigger("interactive.album");
						album = albumCoverCollection.getAlbum($this.attr("acc-id"));
						_viewImg.attr("src", album.img);
						_viewTitle.text(album.title);
						$this.parent().siblings(".result-active").removeClass("result-active").end().addClass("result-active");
					}else if(e.target.tagName == "LI"){
						$this.find("img").trigger("click.album");
					}
				})
				.end().find("#results-list-anchor").bind("click.album",function(e){
					e.preventDefault();
					albumCoverCollection.pullNext();
				});

			_viewImg.bind("load.album",function(e){
				_viewPane.trigger("ready.album");
			});

			_viewPane
				.bind("interactive.album",function(e){
					$(this).children().hide().filter("#view-loading-spinner").show();
				})
				.bind("ready.album",function(e){
					$(this).children().show().filter("#view-loading-spinner").hide()
				})
				.append('<span id="view-loading-spinner">Loading</span>');

			_viewImg.show();

			return {
				updateListPane: function(){
					for(i = _currentAlbum; i < albumCoverCollection.length; i++){
						(function(index){
							_listPane.append(
								sprintf('<li><img src="%(thumbnail)s" acc-id="'+index+'" alt="%(title)s"/>%(title)s</li>', albumCoverCollection.getAlbum(index))
							);
						})(i);
					}
					if(_currentAlbum === 0){
						_listPane.find("img:first").trigger("click");
					}
					_currentAlbum = albumCoverCollection.length;
				},
				getCurrentId: function(){
					return _currentAlbum;
				},
				changeView: function(url){
					_viewImg.attr("src", url);
				}
			};
		})();

	});
});
