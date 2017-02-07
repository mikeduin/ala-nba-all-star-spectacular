console.log('sanity check')

$(document).ready(function(){

  $('#slideshow img:gt(0)').hide();
  setInterval(function(){
    $('#slideshow :first-child').fadeOut(5000)
    .next('img').fadeIn(5000)
    .end().appendTo('#slideshow');
  }, 5000)

  $('.risk-input').change(function(){
    var risk = $(this)[0].value;
    var odds = $(this).parent().prev()[0].innerHTML;
    var toWin = $(this).parent().next();
    var payout = 0;
    if (odds > 0) {
      payout = Math.round((risk * parseInt(odds)/100)*100)/100;
    } else {
      payout = Math.round((risk * 100/-parseInt(odds))*100)/100;
    };
    toWin.text(payout);
  });

  $('.pick-btn').click(function(){
    var bal = parseInt($('#balance').text().substring(1));
    console.log('bal is ', bal);
    var toWinEl = $(this).parent().prev()[0];
    var riskEl = $(this).parent().prev().prev().children()[0];
    var toWin = toWinEl.innerHTML;
    var risk = riskEl.value;
    var odds = parseInt($(this).parent().prev().prev().prev()[0].innerHTML);
    var payout = 0;
    var wager = $(this).parent().prev().prev().prev().prev()[0].innerHTML;
    var type = $(this).parent().prev().prev().prev().prev().prev()[0].innerHTML;
    var event = $(this).parent().prev().prev().prev().prev().prev().prev()[0].innerHTML;
    var user = $(this).parent().prev().prev().prev().prev().prev().prev().prev()[0].innerHTML;
    if (bal - risk < 0) {
      Materialize.toast('Your balance of $' + bal + ' is insufficient for that wager!', 4000, 'bet-error');
      return;
    }

    if (odds > 0) {
      payout = Math.round((risk * odds/100)*100)/100;
    } else {
      payout = Math.round((risk * 100/-odds)*100)/100;
    };
    console.log('payout is ', payout);
    $.ajax({
      method: 'POST',
      url: '/picks/submit',
      data: {
        toWin: toWin,
        risk: risk,
        odds: odds,
        wager: wager,
        payout: payout,
        type: type,
        event: event,
        user: user
      },
      success: function(res){
        $('#balance').text('$' + res.newBal);
        var eventAbbrev;
        if (event === 'Rising Stars Game') {
          eventAbbrev = 'RisingStars'
        } else if (event === 'Three-Point Contest') {
          eventAbbrev = '3PT'
        } else if (event === 'Dunk Contest') {
          eventAbbrev = 'Dunk'
        } else if (event === 'Skills Challenge') {
          eventAbbrev = 'Skills'
        } else {
          eventAbbrev = 'ASG'
        };
        odds > 0 ? odds = '+' + odds : odds = odds;
        $('#ticket-rows').append('<tr><td>' + eventAbbrev + '</td><td>' + wager + '</td><td>' + odds + '</td><td> $' + risk + '</td></tr>');
        console.log('res is ', res);
        console.log('event is ', event);
        toWinEl.innerHTML = '';
        riskEl.value = '';
        Materialize.toast('Your ' + wager + ' ' + odds + ' bet was successfully placed!', 4000, 'toasted');
      }
    })

  })

});
