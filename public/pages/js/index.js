$(document).ready(function(){
  if($(window).width() < 992){
    $(".category-scroll").mCustomScrollbar({
      setWidth: false
    });
  }
});

$(window).on('load',function() {
    $('.loading').hide();
});
