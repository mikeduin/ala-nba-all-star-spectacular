console.log('sanity check')

$(document).ready(function(){
  $('#slideshow img:gt(0)').hide();
  setInterval(function(){
    $('#slideshow :first-child').fadeOut(5000)
    .next('img').fadeIn(5000)
    .end().appendTo('#slideshow');
  }, 5000)

  // $('#background-rotate img:gt(0)').hide();
  // setInterval(function(){
  //   $('#background-rotate :first-child').fadeOut(10000)
  //   .next('img').fadeIn(10000)
  //   .end().appendTo('#background-rotate');
  // }, 10000)

});
