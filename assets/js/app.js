/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
let intervals;
let interval;
let popupwoninternvals;
let counter;
let counters;
let hasWon = false;
let foundIds = [];
let wrongSpotClicked = 0;
let noOfMisClicked = 5
$(document).ready(function () {
  window.scrollTo(0, 1);
  paceOptions = {
    ajax: true, 
    document: true, 
    eventLag: false
  };
  Pace.on("start", function(){
    $('.game-content').css('opacity', '0.1')
  });
  Pace.on('done',function(){
  $("#preloader").css('display', 'none');
  $('.game-content').css('opacity', '1')
  $('.game-content').css('display', '')
  });
  $('.btn').on('click', function(){
    console.log('CLICK_INFO_A')
    btnClickSound.play()
  })
  $("#open_modal").trigger("click");
  $(".modal").modal({
    backdrop: "static",
    keyboard: false,
    show: false,
  });
  var isMobile = navigator.userAgent.match(
    /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i
  );
  console.log(isMobile);
  if (isMobile != null) {
    $("body").height(window.innerHeight);
    $("body").width(window.innerWidth);
    console.log(window.innerHeight);
    console.log(window.innerWidth);
  }

  let pathname = window.location.pathname;
  console.log(pathname);

  $(".return-to-game").on("click", function () {
    console.log("Continue playing");
    wrongSpotClicked = wrongSpotClicked - 1;
    counters = $("#second_timer").text().trim();
    intervals = setInterval(function () {
      counters--;
      $("#second_timer").text(counters);
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
  });

  $(".gameContent-close").on("click", function () {
    console.log("Pause or play");
    console.log($("#second_timer").text().trim());
    clearInterval(intervals);
    $(".pause_icon").text("play_arrow");
    $("#modal_pause").modal("show");
  });
  $('area').on("click" , async function(e){
    e.preventDefault();
    var data = $(this).mouseout().data('maphilight') || {};
    console.log('AASDASDASD', data)
    data.alwaysOn = !data.alwaysOn;
    if(data.alwaysOn !== undefined && data.alwaysOn !== false){
      $(this).data('maphilight', data).trigger('alwaysOn.maphilight');
    }
    wrongSpotClicked = 0;
      let toFindCount = 0;
      $('.bgactive h5').removeClass('pulsate-css')
      $('.findpm-footer').removeClass('find-footer-wbg')
      let week = window.location.pathname.split('&')[2].split('=')[1]
      toFindCount = parseInt(week) + 2;
      if (!foundIds.includes($(this).attr("id"))) {
        foundIds.push($(this).attr("id"));
        iconFoundSfx.currentTime = 1.5
        iconFoundSfx.play();
        // iconFoundSfx.muted = false;
        // setTimeout(() => {
        //   iconFoundSfx.muted = true;
        // }, 1000);
      }
      $(".image-count").text(`${foundIds.length}/${toFindCount}`);
      if (foundIds.length == toFindCount) {
        try {
          $(".popup-won").css("display", "none");
          last10SecsSfx.currentTime = 6;
          last10SecsSfx.pause();
          clearInterval(intervals);
          won_sfx.currentTime = 0;
          won_sfx.muted = false;
          setTimeout(() => {
            won_sfx.muted = true;
          }, 1000);
          if(won_sfx.paused == false){
            let restore = $("meta[name=viewport]")[0];
            if (restore) {
              restore = restore.outerHTML;
            }
            $("meta[name=viewport]").remove();
            $("head").append(
              '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">'
            );
            if (restore) {
              setTimeout(() => {
                $("meta[name=viewport]").remove();
                $("head").append(restore);
              }, 100); // On Firefox it needs a delay > 0 to work
            }
            let env = await axios.get('/api/env');
            console.log('Env', env)
            let authData;
            let paramGetToken;
            authData = await fetch(env.data.authApi, {
            credentials: 'include',
            method : 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            })
            .then(res => res.json())
            .then(data => authData = data)
            .then(async function(){
                console.log(authData)
                if(authData.message == 'Unauthenticated.'){
                    alert('User unauthenticated')
                }
                else{
                    paramGetToken = {
                        grant_type: "password",
                        client_id: env.data.client_id,
                        client_secret: env.data.client_secret,
                        username: env.data.username,
                        password: env.data.password,
                        scope: ""
                    }
                    let addRewardsParams = {
                        game_reference_id: "16",
                        amount: "50",
                        spice_person_id: authData.data.spice_person_id
                    }
                    let params = {
                        addRewardsParams : addRewardsParams,
                        getTokenParams : paramGetToken
                    }
                    console.log(addRewardsParams)
                    let addRewards = await axios.post(env.data.addRewardApi, params);
                    console.log('Add rewards response :', addRewards)
                    if(addRewards.data.message == 'Success'){
                        hasWon = true;
                        $('#step-5').css('display', 'none')
                        $('#step-6').css('display', 'flex')
                        clearInterval(intervals);
                    }
                }
            })
          } 
        } catch (err) {
          console.log(err);
        }
      }
  });

  let timeOutPulsate;

  $('body').on('click', function(){
    console.log($(this).attr('class'))
    console.log(window.location.pathname.split('&')[0])
    if(window.location.pathname.split('&')[0] == '/countdown' && parseInt(counters = $("#second_timer").text().trim()) <= 44 && !$(this).hasClass('btn') && $('#step-5').css('display') != 'none'){ 
        wrongIconSfx.currentTime = 1.5
        wrongIconSfx.play();
        // setTimeout(() => {
        //   wrongIconSfx.muted = true;
        // }, 1000); 
      console.log('WRONG SPOT')
      wrongSpotClicked +=1
      console.log('wrongSpotClicked',wrongSpotClicked)
      if(wrongSpotClicked == noOfMisClicked){
        clearTimeout(timeOutPulsate)
        $('.bgactive h5').removeClass('pulsate-css')
        $('.findpm-footer').removeClass('find-footer-wbg')
        if(detectMob() == false ){
          $('.findpm-footer').css('height', '')
          $('.timer-bg').css('height', '')
          if(isIOS() == false){
            setTimeout(() => {
              $('.findpm').css('display', 'block')
            }, 100); 
          }
        }
        setTimeout(function(){
          $('.bgactive h5').addClass('pulsate-css')
          $('.findpm-footer').addClass('find-footer-wbg')
          if(detectMob() == false && isIOS() == false){
            $('.findpm').css('display', 'flex')
            let ua = navigator.userAgent.toLowerCase(); 
            if (ua.indexOf('safari') != -1) { 
              if (ua.indexOf('chrome') > -1) {
              } else {
                $('.findpm-footer').css('height', '110px')
                $('.timer-bg').css('height', '160px')
              }
            }
          }
          noOfMisClicked = 5
          wrongSpotClicked = 0;
        }, 500)
        timeOutPulsate = setTimeout(function(){
          $('.bgactive h5').removeClass('pulsate-css')
          $('.findpm-footer').removeClass('find-footer-wbg')
          if(detectMob() == false && isIOS() == false){
            $('.findpm-footer').css('height', '')
            $('.timer-bg').css('height', '')
            if(isIOS() == false && $('#step-5').css('display') != 'none'){
              setTimeout(() => {
                $('.findpm').css('display', 'block')
              }, 100); 
            }
          }
        }, 5500)
        console.log('TRACE')
      }
    }
  })
  let firstUnmute = 0;

  $('#unmute-audio-homepage').on('click', function(){
    console.log($('.bg-music').prop('muted'))
    $('.bg-music').get(0).play()
    if(firstUnmute == 0){
      $('.bg-music').prop('muted', false);
      $('#play').removeClass('fas fa-volume-mute')
      $('#play').addClass('fas fa-volume-up')
      firstUnmute = 1;
    }
    else{
      if($('.bg-music').prop('muted')){
        $('.bg-music').prop('muted', false);
        $('#play').removeClass('fas fa-volume-mute')
        $('#play').addClass('fas fa-volume-up')
      }
      else{
        $('.bg-music').prop('muted', true);
        $('#play').removeClass('fas fa-volume-up')
        $('#play').addClass('fas fa-volume-mute')
      }
    }

    
  })
});

if(localStorage.getItem('before_path') !== null){
  let beforePath = localStorage.getItem('before_path')
  let pathname = window.location.pathname
  console.log('beforePath', beforePath)
  if(beforePath.trim().split("&")[0] == '/countdown' && pathname.trim().split("&")[0] == '/countdown'){
    if(beforePath.trim().split("&") !== pathname.trim().split("&")){
      localStorage.removeItem('before_path')
      window.location.href = '/'
    }
  }
  if(pathname != '/' && pathname != '/step&step=3' && pathname != '/home'){
    console.log('trace')
    localStorage.removeItem('before_path')
    window.location.href = '/'
  }
  else if(pathname == '/step&step=3' && beforePath == '/step&step=3'){
    console.log('trace')
    localStorage.removeItem('before_path')
    window.location.href = '/'
  }
}

$(document).ready(function () {
  $(".btn-wifi").click(function () {
    $(".wifi-message").show();
  });

  $(".wifi-close").click(function () {
    $(".wifi-message").hide();
  });
});

$(document).ready(function () {
  $(".popup-countdown").click(function () {
    $(".popup-countdown").hide();
  });
});

$(window).blur(function(){
  console.log('PAGE_BLUR')
  $('.bg-music').get(0).muted = true
})
.focus(function(){
  console.log('PAGE_FOCUS')
  $('.bg-music').get(0).muted = false
});

$(window).bind('beforeunload', function(event) {
  let pathname = window.location.pathname;
  localStorage.setItem('before_path', pathname)
  console.log('Event before loading page', pathname)
});

function toggleZoomDefault() {
  document.body.style.zoom = "100%";
} 


function doOnOrientationChange(){
  switch(window.orientation) {  
      case -90:                 
        $('#landscape').css('display', 'block')
        $('body').css('overflow' , 'hidden')
        $('main').css('display', 'none')
        break;
      case 90:              
        $('#landscape').css('display', 'block')
        $('body').css('overflow' , 'hidden')
        $('main').css('display', 'none')                 
        break;
      default:                   
        $('#landscape').css('display', 'none')
        $('body').css('overflow' , 'visible')
        $('main').css('display', '')
        break;                            
  }
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function detectMob() {
  const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}

function isIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  } else {
    return navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2 &&
      /MacIntel/.test(navigator.platform);
  }
}

window.addEventListener('orientationchange', doOnOrientationChange);
