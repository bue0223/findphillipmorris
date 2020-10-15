
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let countdown_sfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/Countdown+Timer+Free+Sound+Effect+(Various+Versions!).mp3')
let tryagain_sfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/TimeUp.mp3')
let btnClickSound = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/click-buttons.mp3')
let won_sfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/Win+sound+effect+FREE.mp3')
let iconFoundSfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/Correct+Answer+SOUND+EFFECT.mp3')
let wrongIconSfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/Warning+Beep+Sound-Soft+Error+Effect.mp3')
let last10SecsSfx = new Audio('https://findphillipmorrisaudio.s3-ap-southeast-1.amazonaws.com/audio/Ticktock.mp3')
let idsromInterval = []
$(document).ready(function () {
    console.log('ready navjs') 
    let pathname = window.location.pathname
    if (pathname.trim().split("&")[0] == "/countdown") {
      let icon = pathname.trim().split("&")[1].split("=")[1];
      let week = pathname.trim().split("&")[2].split("=")[1];
      showGameImage(icon, week)
    }
    showGameContent();
    $('#go-to-step2-m').on('click', function(){
      history.pushState({}, null, '/step&step=2');
      showGameContent();
    })
    $('#go-to-step2-mb').on('click', function(){
      history.pushState({}, null, '/step&step=2');
      showGameContent();
    })
    $('#go-to-step2').on('click', function(){
      history.pushState({}, null, '/step&step=2');
      showGameContent();
    })
    $('#go-to-step3-m').on('click', function(){
      history.pushState({}, null, '/step&step=3');
      showGameContent();
    })
    $('#go-to-step3-mb').on('click', function(){
      history.pushState({}, null, '/step&step=3');
      showGameContent();
    })
    $('#go-to-step5-m').on('click', function(){
      last10SecsSfx.currentTime = 0;
      last10SecsSfx.muted = true;
      wrongSpotClicked = wrongSpotClicked - 1;
      $('.bgactive h5').removeClass('pulsate-css')
      $('.findpm-footer').removeClass('find-footer-wbg')
      $('.game-content--body').css('display', 'none')
      $('#step-5-end').css('display', 'flex')
    })
    $('.return-to-game').on('click', function(){
      let displayType = 'block'
      if(detectMob() || isIOS()){
        displayType = 'flex'
      }
      $('#step-5').css('display', displayType)
      $('#step-5-end').css('display', 'none')
    })
    $('#try-again-tu-m').on('click', function(){
      window.location.href = '/step&step=3'
    })
    $('#go-to-step3').on('click', function(){
      history.pushState({}, null, '/step&step=3');
      showGameContent();
    })
    $('#go-to-game').on('click', function(){
      countdown_sfx.muted = true;
      countdown_sfx.play();
      // wrongIconSfx.muted = true;
      // wrongIconSfx.loop = true;
      // wrongIconSfx.play();
      // iconFoundSfx.muted = true;
      // iconFoundSfx.loop = true;
      // iconFoundSfx.play();
      won_sfx.muted = true;
      won_sfx.loop = true;
      won_sfx.play();
      tryagain_sfx.muted = true;
      tryagain_sfx.play();
      last10SecsSfx.muted = true;
      last10SecsSfx.play();
      
      let urltoFind = $(this).attr('data-saved').split('++')[0]
      let week = $(this).attr('data-saved').split('++')[1]
      history.pushState({}, null, `/countdown&icon=${urltoFind}&week=${week}`);
      showGameContent();
      showGameImage(urltoFind, week)
    })
    $('#step-2-close').on('click', function(){
      history.pushState({}, null, '/step&step=2&show=modal');
      showGameContent();
    })
    $('#step-3-close').on('click', function(){
      history.pushState({}, null, '/step&step=3&show=modal');
      showGameContent();
    })

    $('.btn-no').on('click', function(){
      $('.modal').hide();
    })
    $('#try-again-step3').on('click', function(){
      history.pushState({}, null, '/step&step=3');
      showGameContent();
    })
    $('#back-to-step2').on('click', function(){
      history.pushState({}, null, '/step&step=2');
      showGameContent();
    })
});

function showGameContent(){
  console.log('trace')
  let ua = navigator.userAgent.toLowerCase(); 
  countdown_sfx.muted = true;
  tryagain_sfx.muted = true;
  counter = 3;
  counters = 45;
  foundIds = [];
  $("#overlay").css('display', '')
  $("#overlay").html(`<h2>3</h2>`);
  $(".timer-badge").html(`<h4 id="second_timer">45</h4><p>SEC</p>`);
  $(".popup-won").hide();
  $('.game-content--body').css('display', 'none')
  let path = window.location.pathname
  Pace.stop();
  if(path == '/home'){
    Pace.start();
  }
  switch(path) {
    case '/home':
      console.log('trace')
      $('#home-game-content').css('display', '')
      break;
    case '/step&step=2':
      console.log('trace')
      $('#step2-game-content').css('display', '')
      $('#unmute-audio-homepage').css('display', 'none')

      break;
    case '/step&step=2&show=modal':
      console.log('trace')
      $('#step-2-end').css('display', 'flex')
      $('#unmute-audio-homepage').css('display', 'none')
      break;
    case '/step&step=3':
      console.log('trace')
      $('#step3-game-content').css('display', '')
      $('#unmute-audio-homepage').css('display', 'none')
      break;
    case '/step&step=3&show=modal':
      console.log('trace')
      $('#step-3-end').css('display', 'flex')
      $('#unmute-audio-homepage').css('display', 'none')
      break;
    default:
      console.log('trace')
      let displayType = 'block'
      if(detectMob() || isIOS()){
        displayType = 'flex'
      }
      $('#step-5').css('display', displayType)
      $('#unmute-audio-homepage').css('display', 'none')
  }
}

function showGameImage(icon, week){
  let src;
  console.log('ICON', icon)
  console.log('WEEK', week)
  clearInterval(interval)
  clearInterval(intervals)
  clearTimeout(popupwoninternvals)
  $('.playgame-content img').css('display', 'none')
  $('.playgame-content img').removeClass('to-find-shown')
  $('map').imageMapResize();
  switch (icon.trim()) {
    case "signature":
      console.log('TRACE')
      src = $(`.signature_tofind_week${week}`).attr('src')
      $(`.signature_tofind_week${week}`).attr('src', src)
      $(`.signature_tofind_week${week}`).css("display", "");
      $(`.signature_tofind_week${week}`).addClass('to-find-shown')
      $("#iconstofind-PMSignature").css("display", "");
      $(`.signature_tofind_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
    case "logo":
      console.log('TRACE')
      src = $(`.logo_week${week}`).attr('src')
      $(`.logo_week${week}`).attr('src', src)
      $(`.logo_week${week}`).css("display", "");
      $(`.logo_week${week}`).addClass('to-find-shown')
      $("#iconstofind-PMlogo").css("display", "");
      $(`.logo_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
    case "crest":
      console.log('TRACE')
      src = $(`.circular_icon_week${week}`).attr('src')
      $(`.circular_icon_week${week}`).attr('src', src)
      $(`.circular_icon_week${week}`).css("display", "");
      $(`.circular_icon_week${week}`).addClass('to-find-shown')
      $("#iconstofind-crest").css("display", "");
      $(`.circular_icon_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
    case "100sPack":
      console.log('TRACE')
      src = $(`.cigar_box_week${week}`).attr('src')
      $(`.cigar_box_week${week}`).attr('src', src)
      $(`.cigar_box_week${week}`).css("display", "");
      $(`.cigar_box_week${week}`).addClass('to-find-shown')
      $("#iconstofind-RedPack").css("display", "");
      $(`.cigar_box_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
    case "TheGentleman":
      console.log('TRACE')
      src = $(`.umbrella_man_week${week}`).attr('src')
      $(`.umbrella_man_week${week}`).attr('src', src)
      $(`.umbrella_man_week${week}`).css("display", "");
      $(`.umbrella_man_week${week}`).addClass('to-find-shown')
      $("#iconstofind-Gentleman").css("display", "");
      $(`.umbrella_man_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
    case "firmstick":
      console.log('TRACE')
      src = $(`.firmstick_week${week}`).attr('src')
      $(`.firmstick_week${week}`).attr('src', src)
      $(`.firmstick_week${week}`).css("display", "");
      $(`.firmstick_week${week}`).addClass('to-find-shown')
      $("#iconstofind-FirmStick").css("display", "");
      $(`.firmstick_week${week}`).maphilight({
        fillColor: 'FFFFFF'
      });
      break;
  }
  let pathname = window.location.pathname;
  console.log(pathname.trim().split("&")[0])
  if (pathname.trim().split("&")[0] == "/countdown") {
    let displayType = 'block'
    if(detectMob() || isIOS()){
      displayType = 'flex'
    }
    $('#step-5').css('display', displayType)
    let icon = pathname.trim().split("&")[1].split("=")[1];
    let week = pathname.trim().split("&")[2].split("=")[1];
    $('.image-count').text(`0/${parseInt(week)+2}`)
      console.log('SRC_INFO', $("img.to-find-shown").attr('src'))
      console.log("image loaded correctly")
      $(".popup-tryagain").css("display", "none");
      counter = 3;
      if(!countdown_sfx.muted){
        countdown_sfx.play();
      }
      else{
        countdown_sfx.currentTime = 0;
        countdown_sfx.muted = false;
      }
      if(countdown_sfx.paused == false){
        console.log(interval)
        interval = setInterval(function () {
          console.log(counter)
          counter--;
          $("#overlay").html(`<h2>${counter}</h2>`);
          if (counter == 0) {
            $("#overlay").html(`<h2 class="start">START!</h2>`);
          }
          if (counter == -1) {
            countdown_sfx.pause();
            countdown_sfx.currentTime = 0;
            console.log('trace')
            let displayType = 'block'
            if(detectMob() || isIOS()){
              displayType = 'flex'
            }
            $('#step-5').css('display', displayType)
            $("#overlay").css('display', 'none')
            clearInterval(interval);
            counters = 45;
            intervals = setInterval(function () {
              counters--;
              $(".timer-badge").html(`<h4 id="second_timer">${counters}</h4><p>SEC</p>`);
              if(counters <= 10 && counters != 0){
                if(!last10SecsSfx.muted){
                  last10SecsSfx.play();
                }
                else{
                  last10SecsSfx.currentTime = 0;
                  last10SecsSfx.muted = false;
                }
              }
              if (counters == 0) {
                if(!last10SecsSfx.muted){
                  last10SecsSfx.pause();
                }
                else{
                  last10SecsSfx.currentTime = 0;
                  last10SecsSfx.muted = true;
                }
                clearInterval(intervals);
                console.log(hasWon);
                if (!hasWon) {
                  if(!tryagain_sfx.muted || tryagain_sfx.paused){
                    tryagain_sfx.muted = false;
                    tryagain_sfx.play();
                  }
                  else{
                    tryagain_sfx.currentTime = 0;
                    tryagain_sfx.muted = false;
                    setTimeout(() => {
                      tryagain_sfx.muted = true;
                    }, 1000); 
                  }
                  $('.game-content--body').css('display', 'none')
                  $('#step-7').css('display', 'flex')
                }
              }
            }, 1000);
          }
        }, 1000);
      }
  }
}
window.goIndex = function(){
  $('.modal').modal('hide');
  window.location.href = '/'
}
window.goHome = function(){
  $('.modal').modal('hide');
  window.location.href = '/home'
}