var apiUrl = "http://foodscouts.dy.fi/";

$( document ).delegate("#page1", "pageinit", function() {
	console.log('page1 pageinit');
	
	$.getJSON(apiUrl,function(data){
		console.log(data);
		$(data).each(function(i,item){
			var name = item.fields.name;
			var description = item.fields.description;
			$("#exploreList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		$("#exploreList").listview('refresh');
	})
	
});