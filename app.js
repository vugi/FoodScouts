var apiRoot = "http://foodscouts.dy.fi/";
var userID = 1;

$(document).ready(function(){
	console.log('document ready');
	
	var activePageId = $.mobile.activePage.prop("id");
	console.log("activePageId: "+activePageId);
})

$( document ).delegate("#explorePage", "pageinit", function() {
	console.log('explorePage pageinit');
	
	$.getJSON(apiRoot+"recommendations/",function(data){
		console.log("Loaded recommendations:",data);
		$(data).each(function(i,item){
			var name = item.fields.name;
			var description = item.fields.description;
			$("#coverflow").append("<img src='mockup_assets/"+item.pk+".jpg' alt='"+name+"' data-description='"+description+"'/>");
		});
		
		$('#coverflow').coverFlow();
	});
});

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
			$("#searchList").append("<li><img src='mockup_assets/"+id+".jpg' /><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		
		$("#searchList").listview('refresh');
	});	
});