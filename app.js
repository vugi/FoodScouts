var apiRoot = "http://foodscouts.dy.fi/";
var userID = 7;
var recommendationsData = [];
var searchData = [];
var bookmarksData = [];
var reviewsData = [];
var currentDetailItem = null;

$(document).ready(function(){
	console.log('document ready');
	
	var activePageId = $.mobile.activePage.prop("id");
	console.log("activePageId: "+activePageId);
	
	$(".review").click(function(){
		$.mobile.changePage("#ratingPage", {role: 'dialog'});
	});
	
	initRatingStars();
	
	$(".bookmarkStar").click(addBookmark);
})

$( document ).delegate("#explorePage", "pageinit", function() {
	console.log('explorePage pageinit');
	
	$.getJSON(apiRoot+"my_recommendations/"+userID+"/",function(data){
		console.log("Loaded recommendations:",data);
		recommendationsData = data;
		$(data).each(function(i,item){
			var name = item.fields.name;
			var description = item.fields.description;
			$("#coverflow").append("<img src='mockup_assets/"+item.pk+".jpg' data-i='"+i+"'/>");
		});
		
		$('#coverflow').coverFlow();
		$('#recommendationDetails').show();
		$('#recommendationsLoading').hide();
	});
});

function showRecommendationDetails(i){
	showDetails(recommendationsData[i],$("#recommendationDetails"));
}

function showDetails(item,$element){
	console.log("showDetails",item,$element)
	
	currentDetailItem = item;
	
	$element.find(".title").text(item.fields.name);
	$element.find(".description").text(item.fields.description);
	
	// Clear old comments
	$element.find(".comments").html("");
	
	// Load comments
	$.getJSON(apiRoot + "reviews/"+item.pk+"/",function(data){
		console.log("Loaded reviews",item.pk,data);
		var sum = 0;
		$(data).each(function(i,item){
			var rating = item.fields.rating;
			sum += rating;
			var comment = item.fields.comment;
			var location = item.fields.location;
			var date = item.fields.pub_date;
			var user = item.fields.user.fields.username;
			
			var html = "<div class='comment'>";
			for(i=0;i<5;i++){
				if(i<rating){
					html += "<div class='star' />";
				} else {
					html += "<div class='star grey' />";
				}
			}
			html += "<span class='user'>"+user + "</span> <span class='date'>" + $.timeago(date) +"</span>";
			html += "<p>"+comment+"</p>";
			html += "<p class='location'>"+location+"</p>";
			html += "</div>";
			$element.find(".comments").append(html)
		});
		
		// Calculate and print average rating
		var reviewers = data.length;
		var average;
		if (reviewers > 0){
			average = sum/reviewers;
		} else {
			average = 0;
		}
		var html = "";
		console.log("average",average)
		for(i=0;i<5;i++){
			if(i<average){
				html += "<div class='star' />";
			} else {
				html += "<div class='star grey' />";
			}
		}
		$element.find(".averageStars").html(html);
		$element.find(".reviewers").html(reviewers);
	});
}

$( document ).delegate("#myFoodPage", "pageinit", function() {
	console.log('myFoodPage pageinit');
	
	// Load bookmarked products
	$.getJSON(apiRoot + "my_bookmarks/"+userID+"/",function(data){
		console.log("Loaded my bookmarks:",data);
		// Merge arrays so that locally added bookmarks will be kept as well
		$.merge(bookmarksData,data);
		updateBookmarks();
	});
	// Load reviewed products
	$.getJSON(apiRoot + "my_reviews/"+userID+"/",function(data){
		console.log("Loaded my reviews:",data);
		reviewsData = data;
		$("#reviewedList").html('<li data-role="list-divider" role="heading">Reviewed</li>');
		$(data).each(function(i,item){
			var id = item.fields.item.pk;
			var name = item.fields.item.fields.name;
			var description = item.fields.item.fields.description;
			var comment = item.fields.comment;
			var location = item.fields.location;
			$("#reviewedList").append("<li><a href='#detailPage?type=reviews&i="+i+"' data-rel='dialog'><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p><i>Sighted at: "+location+"</i></p><p>Your comment: "+comment+"</p></li>");
		});
		
		$("#reviewedList").listview('refresh');
	});
});

$( document ).delegate("#searchPage", "pageinit", function() {
	console.log('searchPage pageinit');
	
	$.getJSON(apiRoot,function(data){
		console.log("Loaded search items:",data);
		searchData = data;
		$(data).each(function(i,item){
			var id = item.pk;
			var name = item.fields.name;
			var description = item.fields.description;
			$("#searchList").append("<li><a href='#detailPage?type=search&i="+i+"' data-rel='dialog'><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>"+description+"</p></a></li>");
		});
		
		$("#searchList").listview('refresh');
	});	
});

$( document ).delegate("#detailPage", "pagebeforeshow", function(e,data) {
	console.log('detailPage pagebeforeshow',e,data);
	
	var url = $(e.target).attr("data-url");
	// http://xkcd.com/208/
	var type = url.replace(/.*type=/, "").replace(/&i=.*/,"");
	var itemI = url.replace(/.*i=/, "");
	console.log(url,"type:",type,"i:",itemI);
	
	var item;
	if(type=="search"){
		item = searchData[itemI];
	} else if (type="bookmark"){
		item = bookmarksData[itemI].fields.item;
	} else if (type="reviews"){
		item = reviewsData[itemI].fields.item;
	}
	
	$("#itemDetailImg").attr("src","mockup_assets/"+item.pk+".jpg");
	showDetails(item,$("#itemDetails"));
});

$( document ).delegate("#ratingPage", "pageinit", function() {
	console.log('ratingPage pageinit');
	
});

function initRatingStars(){
	$(".ratingStars .star").click(function(e){
		var $target = $(e.target);
		
		// Remove old rating status
		$(".ratingStars .star").removeClass("selected");
	
		// Mark this one as selected
		$target.addClass("selected");
		
		// Mark the ones before this selected as well
		$target.prevUntil().addClass("selected");
	});
}

function addBookmark(){
	currentDetailItem;
	console.log(this,currentDetailItem);
	
	var bookMarkItem = {
		fields: {
			item: currentDetailItem
		}
	};
	// Add as first item to bookmarksData
	bookmarksData.splice(0,0,bookMarkItem);
	
	console.log("Added new bookMarkItem:",bookMarkItem);

	updateBookmarks();
	
	$(this).toggleClass("selected");
}

function updateBookmarks(){
	$("#bookmarkedList").html('<li data-role="list-divider" role="heading">Bookmarked</li>');
	
	$(bookmarksData).each(function(i,item){
		var id = item.fields.item.pk;
		var name = item.fields.item.fields.name;
		var description = item.fields.item.fields.description;
		$("#bookmarkedList").append("<li><a href='#detailPage?type=bookmark&i="+i+"' data-rel='dialog'><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>"+description+"</p></a></li>");
	});
	
	if ($("#bookmarkedList").hasClass('ui-listview')) {
		$("#bookmarkedList").listview('refresh');
	}
}