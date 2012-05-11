var apiRoot = "http://foodscouts.dy.fi/";
var userID = 1;
var recommendationsData = [];

$(document).ready(function(){
	console.log('document ready');
	
	var activePageId = $.mobile.activePage.prop("id");
	console.log("activePageId: "+activePageId);
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
			var date = new Date(item.fields.pub_date);
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
	
	// Load bookmarks
	$.getJSON(apiRoot + "my_bookmarks/"+userID+"/",function(data){
		console.log("Loaded my bookmarks:",data);
		$(data).each(function(i,item){
			var id = item.fields.item.pk;
			var name = item.fields.item.fields.name;
			var description = item.fields.item.fields.description;
			$("#bookmarkedList").append("<li><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		
		$("#bookmarkedList").listview('refresh');
	});
	// Load reviews
	$.getJSON(apiRoot + "my_reviews/"+userID+"/",function(data){
		console.log("Loaded my reviews:",data);
		$(data).each(function(i,item){
			var id = item.fields.item.pk;
			var name = item.fields.item.fields.name;
			var description = item.fields.item.fields.description;
			var comment = item.fields.comment;
			var location = item.fields.location;
			$("#reviewedList").append("<li><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>Sighted at: "+location+"</p><p>Your comment: "+comment+"</p></li>");
		});
		
		$("#reviewedList").listview('refresh');
	});
});

$( document ).delegate("#searchPage", "pageinit", function() {
	console.log('searchPage pageinit');
	
	$.getJSON(apiRoot,function(data){
		console.log("Loaded search items:",data);
		$(data).each(function(i,item){
			var id = item.pk;
			var name = item.fields.name;
			var description = item.fields.description;
			$("#searchList").append("<li><a href='#detailPage'><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>"+description+"</p></a></li>");
		});
		
		$("#searchList").listview('refresh');
	});	
});