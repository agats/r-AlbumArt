var a = {};
module("AlbumCover",{
	setup: function(){
		a = new AlbumCover({
			title: "The Gray Album",
			source: "http://www.dangermouse.com/",
			thumbnail: "http://www.danermouse.com/album/thegrayalbum/thumb.jpg",
			img: "http://www.danermouse.com/album/thegrayalbum/img.jpg",
			rId: "1234",
			rName: "t1234"
		});
	}
});
test("Constructor", 6, function() {
	ok(a.title);
	ok(a.source);
	ok(a.thumbnail);
	ok(a.img);
	ok(a.rId);
	ok(a.rName);
});
test("Get Methods", 6, function() {
	ok(a.title);
	ok(a.source);
	ok(a.thumbnail);
	ok(a.img);
	ok(a.rId);
	ok(a.rName);
});
test("Set Methods", 6, function() {
	ok(a.title = "The White Album");
	ok(a.source = "asdf");
	ok(a.thumbnail = "asdf");
	ok(a.img = "asdf");
	ok(a.rId = "asdf");
	ok(a.rName = "asdf");
});

module("albumCoverCollection",{
	setup: function(){
		
	}
});
test("Add album to collection", 1, function(){
	albumCoverCollection.push(new AlbumCover({
		title: "The Gray Album",
		source: "http://www.dangermouse.com/",
		thumbnail: "http://www.danermouse.com/album/thegrayalbum/thumb.jpg",
		img: "http://www.danermouse.com/album/thegrayalbum/img.jpg",
		rId: "1234",
		rName: "t1234"	
	}));
	equal(albumCoverCollection.length, 1, "album was added to the collection");
});
test("Get album by collection id", 3, function(){
	ok(albumCoverCollection.getAlbum(0), "valid id returned false");
	ok(albumCoverCollection.getAlbum(0) instanceof AlbumCover, "did not return an instance of AlbumCover");
	equal(albumCoverCollection.getAlbum("asdf"), false, "invalid id returned true");
});
asyncTest("Pull albums", 1, function(){
	var l = albumCoverCollection.length;
	albumCoverCollection.pullNext();
	setTimeout(function(){
		ok(albumCoverCollection.length > l);
		start();
	}, 2000);
});
asyncTest("Pull albums, callback", 1, function(){
	albumCoverCollection.pullNext(function(){
		ok(true);
		start();
	});
});

function testAfterDone(){
	
	return true;
}

QUnit.done(testAfterDone);