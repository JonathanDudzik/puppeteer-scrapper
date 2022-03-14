// JavaScript Document

//Sticky Navbar load/apply and destroy/remove conditions

//on document load apply sticky nav only if viewport width greater than specific width
$(document).ready(function () {
	var viewportWidth=window.innerWidth;
	//viewportResize();
	if(viewportWidth >= 1000){
	$('#nav').affix({
      offset: {
        top: $('header').height()
      }
	});	
	}
	//this condition will not work if data-spy is applied to HTML element
	//destroy methods from github affix destroy method #5870
	if(viewportWidth < 1000){
	//alert("smaller than 1000");
	$(window).off('.affix')
	$('#nav').removeData('bs.affix').removeClass('affix affix-top affix-bottom')	
}
});	

//remove and reapply sticky nav on window resize
//nav toggles to collapsed view at approx 985px
//collapsed view of nav does not scroll
$(window).resize(function(){
	var resizeWidth=window.innerWidth;
	//alert("resizing");	
	if(resizeWidth < 1000){
	//alert("smaller than 1000");
	$(window).off('.affix')
	$('#nav').removeData('bs.affix').removeClass('affix affix-top affix-bottom')	
	}
	if(resizeWidth >= 1000){
	$('#nav').affix({
      offset: {
        top: $('header').height()
      }
	});	
		
	}

});
