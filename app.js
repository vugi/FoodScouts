var apiRoot = "http://foodscouts.dy.fi/";

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

$( document ).delegate("#searchPage", "pageinit", function() {
	console.log('searchPage pageinit');
	
	$.getJSON(apiRoot,function(data){
		console.log("Loaded search items:",data);
		$(data).each(function(i,item){
			var name = item.fields.name;
			var description = item.fields.description;
			$("#searchList").append("<li><h4>"+name+"</h4><p>"+description+"</p></li>");
		});
		
		$("#searchList").listview('refresh');
	});	
});