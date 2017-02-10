$(document).ready(function(){

  $('#slideshow img:gt(0)').hide();
  setInterval(function(){
    $('#slideshow :first-child').fadeOut(4000)
    .next('img').fadeIn(4000)
    .end().appendTo('#slideshow');
  }, 4000);

  $(".dropdown-button").dropdown();
  $('select').material_select();

  $('.risk-input').change(function(){
    var risk = $(this)[0].value;
    var odds = parseInt($(this).parent().prev()[0].innerHTML);
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
    var toWinEl = $(this).parent().prev()[0];
    var riskEl = $(this).parent().prevAll().eq(1).children()[0];
    var toWin = toWinEl.innerHTML;
    var risk = riskEl.value;
    var odds = parseInt($(this).parent().prevAll().eq(2)[0].innerHTML);
    var payout = 0;
    var wager = $(this).parent().prevAll().eq(3)[0].innerHTML;
    var type = $(this).parent().prevAll().eq(4)[0].innerHTML;
    var event = $(this).parent().prevAll().eq(5)[0].innerHTML;
    var user = $(this).parent().prevAll().eq(6)[0].innerHTML;
    var time = $(this).parent().prevAll().eq(7)[0].innerHTML;
    var api_id = $(this).parent().prevAll().eq(8)[0].innerHTML;
    if (bal - risk < 0) {
      Materialize.toast('Your balance of $' + bal + ' is insufficient for that wager!', 4000, 'bet-error');
      return;
    }
    if (moment(time).isBefore(moment())) {
      Materialize.toast('Sorry, this event has already started!', 4000, 'bet-error');
      return;
    };

    if (odds > 0) {
      payout = Math.round((risk * odds/100)*100)/100;
    } else {
      payout = Math.round((risk * 100/-odds)*100)/100;
    };
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
        api_id: api_id,
        event: event,
        user: user,
        time: time
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
        toWinEl.innerHTML = '';
        riskEl.value = '';
        if (res.asgBal >= 100) {
          $('#asgmin').text('').append('<span class="min-met"> YES </span>')
        };
        if (res.skillsBal >= 100) {
          $('#skillsmin').text('').append('<span class="min-met"> YES </span>')
        };
        if (res.dunkBal >= 100) {
          $('#dunkmin').text('').append('<span class="min-met"> YES </span>')
        };
        if (res.threeptBal >= 100) {
          $('#threeptmin').text('').append('<span class="min-met"> YES </span>')
        };
        Materialize.toast('Your ' + wager + ' ' + odds + ' bet was successfully placed!', 4000, 'toasted');
      }
    })
  })

  $('.add-btn').click(function(){
    var event = $('#ins-event')[0].value;
    var type = $('#ins-type')[0].value;
    var side = $('#ins-side')[0].value;
    var odds = parseInt($('#ins-odds')[0].value);
    var time;
    if (event === 'Rising Stars Game') {
      time = '2017-02-18T02:00:00'
    } else if (event === 'All-Star Game') {
      time = '2017-02-20T01:00:00'
    } else {
      time = '2017-02-19T01:00:00'
    };
    $.ajax({
      method: 'POST',
      url: '/editlines/add',
      data: {
        event: event,
        time: time,
        type: type,
        side: side,
        odds: odds
      },
      success: function(){
        $('#ins-event').val('');
        $('#ins-type').val('');
        $('#ins-side').val('');
        $('#ins-odds').val('');
        Materialize.toast('Event successfully added!', 4000, 'toasted');
      }
    })
  })

  $('.update-btn').click(function(){
    var id = $(this).parent().prevAll().eq(6)[0].innerHTML;
    var event = $(this).parent().prevAll().eq(5)[0].children[0].value;
    var type = $(this).parent().prevAll().eq(4)[0].children[0].value;
    var side = $(this).parent().prevAll().eq(3)[0].children[0].value;
    var odds = $(this).parent().prevAll().eq(2)[0].children[0].value;
    var time;
    if (event === 'Rising Stars Game') {
      time = '2017-02-18T02:00:00'
    } else {
      time = '2017-02-19T01:00:00'
    };
    $.ajax({
      method: 'PUT',
      url: '/editlines/update',
      data: {
        id: id,
        event: event,
        time: time,
        type: type,
        side: side,
        odds: odds
      },
      success: function(res){
        // console.log(res)
        Materialize.toast('Event updated!', 4000, 'toasted');
      }
    })
  })

  $('.win-btn').click(function(){
    var result = $(this).parent().prev();
    var id = $(this).parent().prevAll().eq(5)[0].innerHTML;
    $.ajax({
      method: 'POST',
      url: '/editlines/grade',
      data: {
        grade: 'win',
        id: id
      },
      success: function(){
        result.text('WIN');
      }
    })
  })

  $('.lose-btn').click(function(){
    var result = $(this).parent().prev();
    var id = $(this).parent().prevAll().eq(5)[0].innerHTML;
    $.ajax({
      method: 'POST',
      url: '/editlines/grade',
      data: {
        grade: 'loss',
        id: id
      },
      success: function(){
        result.text('LOSS');
      }
    })
  })

  $('.delete-btn').click(function(){
    var id = $(this).parent().prevAll().eq(6)[0].innerHTML;
    $.ajax({
      method: 'DELETE',
      url: '/editlines/delete',
      data: {
        id: id
      },
      success: function(){
        Materialize.toast('Event ' + id + ' has been deleted', 4000, 'bet-error');
      }
    })
  })

  $('#user-filter').change(function(){
    var user = $('#user-filter')[0].value;
    var table = $('#allPicksBody');
    $.ajax({
      method: 'GET',
      url: '/allpicks/user/' + user,
      success: function(bets){
        wagers = bets.wagers;
        table.empty();
        for (var i=0; i<wagers.length; i++) {
          wagers[i].result === null ? result = 0 : result = wagers.result;
          if (moment(wagers[i].start_time).isAfter(moment())) {
            table.append('<tr><td>' + wagers[i].username + '</td><td>' + wagers[i].event + '</td><td>' + wagers[i].type + '</td><td>' + wagers[i].wager + '</td><td>' + wagers[i].odds + '</td><td>' + wagers[i].risk + '</td><td>' + wagers[i].to_win + '</td><td>' + result + '</td></tr>');
          }
        }
      }
    })
  })

});
