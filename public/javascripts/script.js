console.log('sanity check')

$(document).ready(function(){

  $('#slideshow img:gt(0)').hide();
  setInterval(function(){
    $('#slideshow :first-child').fadeOut(5000)
    .next('img').fadeIn(5000)
    .end().appendTo('#slideshow');
  }, 5000)

  $('.risk-input').on("change", function(){
    console.log($(this)[0].value);
    console.log('odds are ', $(this).parent().prev()[0].innerHTML);
  });

});
