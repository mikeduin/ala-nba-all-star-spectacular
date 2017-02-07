console.log('sanity check')

$(document).ready(function(){

  $('#slideshow img:gt(0)').hide();
  setInterval(function(){
    $('#slideshow :first-child').fadeOut(5000)
    .next('img').fadeIn(5000)
    .end().appendTo('#slideshow');
  }, 5000)

  $('.risk-input').change(function(){
    var wager = $(this)[0].value;
    var odds = $(this).parent().prev()[0].innerHTML;
    var toWin = $(this).parent().next();
    var payout = 0;
    if (odds > 0) {
      payout = Math.round((wager * parseInt(odds)/100)*100)/100;
    } else {
      payout = Math.round((wager * 100/-parseInt(odds))*100)/100;
    };
    console.log('payout is ', payout);
    toWin.text(payout);
  });

  $('.pick-btn').click(function(){
    var toWin = $(this).parent().prev()[0].innerHTML
    var risk = $(this).parent().prev().prev().children()[0].value;
    var odds = $(this).parent().prev().prev().prev()[0].innerHTML;
    if (odds > 0) {
      payout = Math.round((wager * parseInt(odds)/100)*100)/100;
    } else {
      payout = Math.round((wager * 100/-parseInt(odds))*100)/100;
    };
    var wager = $(this).parent().prev().prev().prev().prev()[0].innerHTML;
    var type = $(this).parent().prev().prev().prev().prev().prev()[0].innerHTML;
    var event = $(this).parent().prev().prev().prev().prev().prev().prev()[0].innerHTML;
    var user = $(this).parent().prev().prev().prev().prev().prev().prev().prev()[0].innerHTML;

  })

});
