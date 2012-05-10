var apiUrl = "http://foodscouts.dy.fi/";
var itemData = [];

$(document).ready(function(){
	console.log('document ready');
	
	var activePageId = $.mobile.activePage.prop("id");
	console.log("activePageId: "+activePageId);
	
	console.log('Loading data');
	$.getJSON(apiUrl,function(data){
		console.log(data);
		itemData = data;
		$(data).each(function(i,item){
			var name = item.fields.name;
			var description = item.fields.description;
			$("#exploreList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
			$("#searchList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		
		if(activePageId=="searchPage"){
			$("#searchList").listview('refresh');
		} else if (activePageId = "explorePage") {
			$("#exploreList").listview('refresh');
		}
	});
	
})

$( document ).delegate("#explorePage", "pageinit", function() {
	console.log('explorePage pageinit');
	$("#exploreList").listview('refresh');
	
});

$( document ).delegate("#searchPage", "pageinit", function() {
	console.log('searchPage pageinit');
	$("#searchList").listview('refresh');
	
});