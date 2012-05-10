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
			//$("#exploreList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
			$("#searchList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		
		if(activePageId=="searchPage"){
			$("#searchList").listview('refresh');
		} else if (activePageId = "explorePage") {
			//$("#exploreList").listview('refresh');
			showRandomRecommendation();
		}
	});
	
	// Attach event handlers
	$("#nextRecommendation").click(showRandomRecommendation);
	
})

$( document ).delegate("#explorePage", "pageshow", function() {
	console.log('explorePage pageinit');
	//$("#exploreList").listview('refresh');
	showRandomRecommendation();
	
});

function showRandomRecommendation(){
	var random = Math.floor(Math.random()*itemData.length);
	showRecommendation(random);
}

function showRecommendation(i){
	var item = itemData[i];
	if (item){
		$("#exploreItem").html("<h3>"+item.fields.name+"</h3><p>"+item.fields.description+"</p>");
	}
	
	
}

$( document ).delegate("#searchPage", "pageinit", function() {
	console.log('searchPage pageinit');
	$("#searchList").listview('refresh');
	
});