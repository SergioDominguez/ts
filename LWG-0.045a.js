// ==UserScript==
// @name         LWG TS Player non-safe for test builds only not WEEKLY
// @namespace    http://tampermonkey.net/
// @version      0.045a-non-safe
// @description  custom LWG Script!
// @author       CRYPTODUDE + LWG DEVS - Modify from exisiting scripts + add different GUI
// @credits      Groovy and Mohkari and Kewlhwip
// @match        https://*.sandbox-games.com/*
// @resource     IMPORTED_CSS https://www.w3schools.com/w3css/4/w3.css
// @resource     REMOTE_CSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

// LWG TS PLAYER vers. 0.045a-non-safe for dev test builds only not WEEKLY
// changes
//  - Added Show/Hide GUI toggle under FPS meter
//  - Modified LWG TS Visualizer (added number values with up and down for toggle opacity)
//  - Dark Mode v.1 added (added dark mode for crafting window on buildings)
//  - Fix shatter via reducing the leaderboard ranking page (it was 5000 now its 500) and increasing timer to check rank from 5 secs to 30 secs and 60 secs
//  - added reset button on auto-sell log area
//  - added Current Server playing
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.044a-non-safe for dev test builds only not WEEKLY
// changes
//  - Modified LWG TS Visualizer (experimental build, there will be bugs)
//  - Dark Mode v.1 added (near 95% for everything is dark mode done, some things they weren't looking good when dark will need to think of good color scheme.)
//  - Alarm sound added on auto-sell fail window with restart timer
//  - Reverse Sell-Log
//  - added at end of script code - //end of lwg script code (if u don't see this than you don't have full code copied)

// LWG TS PLAYER vers. 0.043a-non-safe for test builds only not WEEKLY
// changes
//  - Fix for Dragon Auto-sell.
//  - Added Log tab for sales with timestamp.
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.042a-non-safe for test builds only not WEEKLY
// First time dragon sale implementation adding special toggle option

// LWG TS PLAYER vers. 0.041a-non-safe for test builds only not WEEKLY
// changes
//  - Fix for looking for connection cancel trade(if u encounter this it will use start auto-sell custom timer, and it will restart auto-sell after that amount of seconds pass). Still if u manually press to hide the stop auto-sell window it will not start auto-sell until you toggle it again form menu.
//  - Fixed css on Current rank for stars/h rightside tracker (now it should be shown on left correctly along with the /h).
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.040a-non-safe for test builds only not WEEKLY
// changes
//  - Fix for Cancel Trade (still experimental, now it should correctly track and remove the window on click).
//  - Added stars/h rightside tracker with reset button inside it(Special thanks to Thaimachine for allowing this to be used here, with some modifications).
//  - minor fixes on some other css/functions.

function GM_addStyle(style) {
    document.head.innerHTML += "\n<style>\n"+style+"\n</style>\n";
  }

(function() {
  'use strict';
    var versionLWG = "0.045a-non-safe";
    var strSellingData = "";
    var displayactivestatement = "";

    let getautoscriptload = 0;
    let loaded = 0;
    let leaderTracker = [];

    let apiTokenSet = false;
    let timeleft = 15;

    var crossClicked = false; 

// will auto populate/display while game is running
let lwglist = {};

// if true, you will get a onscreen "stop watch", otherwise set to false
let lwgtimeStart = true;

//adding data for selling
var aData = [];
var outputd = [];

$("html").css("overflow", "none!important");
    // Load remote CSS
    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);
      GM_addStyle("#toggle {z-index:9999!important;} ");
      GM_addStyle(".toggle {z-index:9999!important;} ");
      GM_addStyle(".w3-bar-item {text-align:right!important;}");
      GM_addStyle("input.lwg {width:55px!important;}");
      GM_addStyle("#box, #box_c, #box_d, #box_e {min-width:100%; height: 50vh; overflow-y: scroll;border:1px solid #2e435c; -webkit-border-top-left-radius: 20px;-webkit-border-bottom-left-radius: 20px;-moz-border-radius-topleft: 20px;-moz-border-radius-bottomleft: 20px;border-top-left-radius: 20px;border-bottom-left-radius: 20px;}");
      GM_addStyle("table {border-spacing: 0px;");
      GM_addStyle("ul {padding: 0;list-style-type: none;}");
      GM_addStyle("li {margin-top:10px;}");
      GM_addStyle("td.lwgbody {border-bottom: 1px solid #2e435c;padding-bottom:10px;margin-top:5px;}");
      GM_addStyle("th {border-bottom: 1px solid #2e435c;padding-bottom:10px;margin-top:5px;}");
      GM_addStyle("td.noborder {border:none!important;padding-bottom:10px;margin-top:5px;}");
      GM_addStyle(".orange {background:orange;margin-right:5px;padding:3px;}");
      GM_addStyle(".green {background:green;margin-right:5px;padding:3px;color:white}");
      GM_addStyle(".textgreen {font-size:16px; color:green;padding-left:40px;}");
      GM_addStyle(".textcraft {font-size:16px; color:green;font-style:italic;padding-left:40px;}");
      GM_addStyle(".textorange {font-size:12px; color:royalblue;font-style:italic;margin-right:10px;float:right;}");
      GM_addStyle(".bluecolor {background:#4a90e2; color:#FFF;}");
      GM_addStyle(".darkblue, .darkblue:hover {background:#2e435c; color:#FFF;}");
      GM_addStyle(".w3-button:hover {background:#2e435c!important; color:#FFF!important;}");
      GM_addStyle(".w3-button {-webkit-border-top-right-radius: 20px;-webkit-border-bottom-right-radius: 20px;-moz-border-radius-topright: 20px;-moz-border-radius-bottomright: 20px;border-top-right-radius: 20px; border-bottom-right-radius: 20px; }");
      GM_addStyle(".w3-container, .w3-panel {padding: 0.01em 10px!important; }");
      GM_addStyle(".w3-sidebar {-webkit-border-top-left-radius: 20px;-webkit-border-bottom-left-radius: 20px;-moz-border-radius-topleft: 20px;-moz-border-radius-bottomleft: 20px;border-top-left-radius: 20px;border-bottom-left-radius: 20px;}");
      GM_addStyle("h1 {margin-bottom: 10px;}");
//      GM_addStyle("html,body {-webkit-box-sizing: border-box;box-sizing: border-box;font-size: 10px;}");
//      GM_addStyle("body {font: 1.6rem Arial, Helvetica, sans-serif;margin: 0;}");
      GM_addStyle("#guiwindow {font: 1.6rem Arial, Helvetica, sans-serif!important;color: #fff!important;margin: 0;}");
      GM_addStyle("main {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: flex-start;-webkit-box-pack: center;-ms-flex-pack: center;width:890px;margin-top:-14px;padding-left:20px;}");
      GM_addStyle("h2,h3,p {margin: 0;}");
      GM_addStyle("h2 {font-size: 2.2rem;}");
      GM_addStyle("h3 {font-size: 2rem;}");
      GM_addStyle("img {max-width: 100%;height: auto;-o-object-fit: cover;object-fit: cover;}");
      GM_addStyle(".tabbed-window-list {display: grid;grid-template-columns: 1fr 3fr;width: 70vw;-webkit-mask-image: radial-gradient(circle 10px at 0 0, transparent 0, transparent 20px, black 21px);");
      GM_addStyle(".tabs {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-flow: column wrap;flex-flow: column wrap;text-align: center;border-right: 1px solid rgba(51, 51, 51, 0.5);background: #333333cc;max-height: 260px;}");
      GM_addStyle(".tab {display: -webkit-box;padding: 1rem;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;gap: 1rem;-webkit-box-flex: 1;-ms-flex: 1;flex: 1;-ms-flex-wrap: wrap;flex-wrap: wrap;cursor: pointer;-webkit-transition: all 300ms ease-in-out;transition: all 300ms ease-in-out;max-height:72px;}");
      GM_addStyle(".tab:focus,.tab:hover,.tab:active {background: #3333334d;}");
      GM_addStyle(".tab-active {background: #1a1a1a80;}");
      GM_addStyle(".content-pane {cursor: default;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-flow: column wrap;flex-flow: column wrap;padding-top: 1rem;padding-left: 1.5rem;padding-right:1.5rem;padding-bottom:0.5rem;max-height:95vh;background: #333333cc;}");
      GM_addStyle(".content-pane h2 {margin-bottom:5px;}");
      GM_addStyle(".tab-content {display: none;-webkit-animation: scaleUp 500ms ease-in-out;animation: scaleUp 500ms ease-in-out;}");
      GM_addStyle(".tab-content p {margin: 10px 0;}");
      GM_addStyle(".tab-content-active {display: block;}");
      GM_addStyle(".tab-content-white {background-color: rgba(255, 255, 255, 0.7);}");
      GM_addStyle(".rounded-button {width: 32px;height: 32px;background: #FFF;color: #ffffff;display: inline-flex;align-items: center;justify-content: center;cursor: pointer;border-radius: 50%;border: 1px solid rgba(0, 0, 0, 0.459);text-decoration: none;transition: background 0.2s;}");
      GM_addStyle(".switch {position: relative;display: inline-block;vertical-align: middle;width: 56px;height: 20px; padding: 3px;background-color: white;border-radius: 18px;box-shadow: inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05);cursor: pointer;background-image: -webkit-linear-gradient(top, #eeeeee, white 25px);background-image: -moz-linear-gradient(top, #eeeeee, white 25px);background-image: -o-linear-gradient(top, #eeeeee, white 25px);background-image: linear-gradient(to bottom, #eeeeee, white 25px);}");
      GM_addStyle(".switch-input {position: absolute;top: 0;left: 0;opacity: 0;}");
      GM_addStyle(".switch-label {position: relative;display: block;height: inherit;font-size: 10px;text-transform: uppercase;background: #eceeef;border-radius: inherit;box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);-webkit-transition: 0.15s ease-out;-moz-transition: 0.15s ease-out;-o-transition: 0.15s ease-out;transition: 0.15s ease-out;-webkit-transition-property: opacity background;-moz-transition-property: opacity background;-o-transition-property: opacity background;transition-property: opacity background;}");
      GM_addStyle(".switch-label:before, .switch-label:after {position: absolute;top: 50%;margin-top: -.5em;line-height: 1;-webkit-transition: inherit;-moz-transition: inherit;-o-transition: inherit;transition: inherit;}");
      GM_addStyle(".switch-label:before {content: attr(data-off);right: 11px;color: #aaa;text-shadow: 0 1px rgba(255, 255, 255, 0.5); }");
      GM_addStyle(".switch-label:after {content: attr(data-on);left: 11px;color: white;text-shadow: 0 1px rgba(0, 0, 0, 0.2);opacity: 0;}");
      GM_addStyle(".switch-input:checked ~ .switch-label {background: #47a8d8;box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);}");
      GM_addStyle(".switch-input:checked ~ .switch-label:before {opacity: 0;}");
      GM_addStyle(".switch-input:checked ~ .switch-label:after {opacity: 1;}");
      GM_addStyle(".switch-handle {position: absolute;top: 4px;left: 4px;width: 18px;height: 18px;background: white;border-radius: 10px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);background-image: -webkit-linear-gradient(top, white 40%, #f0f0f0);background-image: -moz-linear-gradient(top, white 40%, #f0f0f0);background-image: -o-linear-gradient(top, white 40%, #f0f0f0);background-image: linear-gradient(to bottom, white 40%, #f0f0f0);-webkit-transition: left 0.15s ease-out;-moz-transition: left 0.15s ease-out;-o-transition: left 0.15s ease-out;transition: left 0.15s ease-out;}");
      GM_addStyle(".switch-handle:before {content: '';position: absolute;top: 50%;left: 50%;margin: -6px 0 0 -6px;width: 12px;height: 12px;background: #f9f9f9;border-radius: 6px;box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);background-image: -webkit-linear-gradient(top, #eeeeee, white);background-image: -moz-linear-gradient(top, #eeeeee, white);background-image: -o-linear-gradient(top, #eeeeee, white);background-image: linear-gradient(to bottom, #eeeeee, white);}");
      GM_addStyle(".switch-input:checked ~ .switch-handle {left: 40px;box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);}");
      GM_addStyle(".switch-green > .switch-input:checked ~ .switch-label {background: #4fb845;}");
      GM_addStyle(".button-reset {appearance: none;backface-visibility: hidden;background-color: #27ae60;border-radius: 8px;border-style: none;box-shadow: rgba(39, 174, 96, .15) 0 4px 9px;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-block;font-size: 16px;font-weight: 600;letter-spacing: normal;line-height: 1.5;outline: none;overflow: hidden;padding: 13px 20px;position: relative;text-align: center;text-decoration: none;transform: translate3d(0, 0, 0);transition: all .3s;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: top;white-space: nowrap;}");
      GM_addStyle(".button-reset:hover {background-color: #1e8449;opacity: 1;transform: translateY(0);transition-duration: .35s;}");
      GM_addStyle(".button-reset:active {transform: translateY(2px);transition-duration: .35s;}");
      GM_addStyle(".button-reset:hover {box-shadow: rgba(39, 174, 96, .2) 0 6px 12px;}");
      GM_addStyle(".container {position: fixed;top: 0;left: 0;right: 0;bottom: 0;display: flex;");
      GM_addStyle(".container .fullscreen {width: 100%;height: 100%;");
//       GM_addStyle(".hud .contextual {height: 50px!important;line-height: 14px!important;}");
//       GM_addStyle(".hud .top .cell {width: 650px!important; }");
      GM_addStyle(".fiftypxclass {height: 50px!important;line-height: 14px!important;}");
      GM_addStyle(".pointerev {pointer-events: all!important;}");
      GM_addStyle(".pointerevnone {pointer-events: none!important;}");
      GM_addStyle(".wide30 {min-width: 30%!important;}");
      GM_addStyle(".showleft {text-align:left!important;}");
      GM_addStyle("#autoselltimerHelpBlock { font-size: x-small;display: block;}");
      GM_addStyle(".input-help {vertical-align: top;display: inline-block;}");
      GM_addStyle(".savelwgbutton {border: 1px solid #059862;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;margin: 4px 2px;cursor: pointer; background-color: #04AA6D;  color: white; font-size: 18px;  padding: 6px 25px;  margin-top: 4px;  border-radius: 5px;  word-spacing: 10px;}");
      GM_addStyle(".clearlwgbutton {border: 1px solid #2ea7ba;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;margin: 4px 2px;cursor: pointer; background-color: #4891eb;  color: white; font-size: 18px;  padding: 6px 25px;  margin-top: 4px;  border-radius: 5px;  word-spacing: 10px;}");
      GM_addStyle(".savelwgbutton:hover {background-color: #059862; color: white;}");
// overlay text
      GM_addStyle("#overlay {position: fixed;display: none;width: 100%;height: 100%;top: 0;left: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,0.5);z-index: 2;cursor: pointer;}");
      GM_addStyle("#calceltext{position: absolute;top: 50%;left: 50%;font-size: 32px;color: white;transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);text-align:center;}");
      GM_addStyle("input.nicetext{position: absolute;top: 50%;left: 50%;font-size: 50px;color: white;transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);}");
      GM_addStyle(".clearable{background: #fff url('http://i.stack.imgur.com/mJotv.gif') no-repeat right -10px center;border: 1px solid #999;padding: 3px 18px 3px 4px;border-radius: 3px;transition: background 0.4s;}");
      GM_addStyle(".clearable.x  { background-position: right 5px center; }");
      GM_addStyle(".clearable.onX{ cursor: pointer; }");
      GM_addStyle(".clearable::-ms-clear {display: none; width:0; height:0;}");
       //syncButton
      GM_addStyle(' #reset-scores.PSMbox1{  transform: rotate(0deg); background:url(https://img.icons8.com/ios-glyphs/90/000000/refresh--v1.png) !important; height: 26px !important; width: 27px !important; background-size: 65% !important; background-repeat:no-repeat !important; background-position:5px 5px !important}');
      GM_addStyle(' #reset-scores.PSMbox1:hover{ transition:1s ease-in-out; transform: rotate(-360deg); }')
      //syncButton
      // custom dragable window
      GM_addStyle('.show-btn{position: absolute;top: 0%;right: 10px;user-select: none;transform: translate(-0%, -0%);}')
      GM_addStyle('.show-btn.disabled{pointer-events: none;}')
      GM_addStyle('.lwgmodal{position: absolute;  top: 18%;  right: 70%;  height:720px;  width: 1000px;  background: #fff;  border-radius: 10px;  transform: translate(-0%, 30%);}')
      GM_addStyle('.lwgmodal.show{top: 0;opacity: 1;display:block;}')
      GM_addStyle('.lwgmodal.close{top: 0;opacity: 0;}')
      GM_addStyle('.lwgmodal .top-content{background: #34495e;width: 100%; }')
      GM_addStyle('.top-content .left-text{text-align: left;padding: 10px 15px;font-size: 18px;color: #f2f2f2;font-weight: 500;user-select: none; }')
      GM_addStyle('.top-content .close-icon{position: absolute;top: 10px;right: 20px;font-size: 23px;color: silver;cursor: pointer;}')
      GM_addStyle('.close-icon:hover{ color: #b6b6b6;}')
      GM_addStyle('.top-content .fa-camera-retro{ font-size: 80px; color: #f2f2f2;}')
      GM_addStyle('.lwgmodal .bottom-content{background: wheat;width: 100%;}')
      GM_addStyle('.bottom-content .text{font-size: 28px;font-weight: 600;color: #34495e; }')
      GM_addStyle('.bottom-content p{font-size: 18px;line-height: 27px;color: grey;}')
      GM_addStyle('.bottom-content .close-btn{padding: 15px 0;}')
      GM_addStyle('.show-btn button {cursor: pointer;}')
      GM_addStyle('.opacity-btn{padding: 5px 5px;background: #27ae60;border: none;outline: none;font-size: 12px;text-transform: uppercase;border-radius: 3px;color: #f2f2f2;font-weight: 600;cursor: pointer;transition: background 0.2s;}')
      GM_addStyle('.s-btn{padding: 5px 5px;background: #27ae60;border: none;outline: none;font-size: 12px;text-transform: uppercase;border-radius: 3px;color: #f2f2f2;font-weight: 600;cursor: pointer;transition: background 0.2s;}')
      GM_addStyle('.show-btn button{padding: 12px 15px;}')
      GM_addStyle('.opacity-btn button:hover{background: #26a65b;}')
      GM_addStyle('.lwgmodal header{font-size: 16px;font-weight: 500;}')
      GM_addStyle('.lwgmodal header.active{cursor: move;user-select: none;}')
      GM_addStyle('.zoom, .zoom-out, .zoom-init {cursor: pointer;}')
      GM_addStyle('.hud-fps {z-index:0!important;}')
// custom background and text color picker
//        GM_addStyle('input.picker{width: 60px;height: 30px;padding: 0px;border:none;vertical-align: middle;border-radius: none;}')       
//        GM_addStyle('input.picker[type="text"] {padding: 0px;margin-left:10px;width: 90px;border:1px solid black; border-radius: 12px!important;padding-left:5px;height: 18px; font-size: 16px; padding:5px; }')       
//        GM_addStyle('input[type="text"]:invalid{outline: 2px solid red;}')       
//        GM_addStyle('p.picker {font-size: 18px; padding: 5px;}')

// autoplay button for reload script + jimmy (which doesnt work)

async function getlwgGame() {
console.log("getGame");
while (typeof Game == 'undefined' || (Game && Game.gameData == null)) {
  console.log("undefined");
  await new Promise(r => setTimeout(r, 500));
}
}

new MutationObserver(async function(mutations) {
if (
  document.getElementById("playnow-container") && document.getElementById("playnow-container").style.visibility !== "hidden" && document.getElementById("playButton") && document.getElementById("playButton").style.visibility !== "hidden" &&
  getautoscriptload == 0
) {
  getautoscriptload = 1;
  await getlwgGame();
  document.getElementById("playButton").click();
  console.log(Date.now() + ' ---===ACTIVATING LWG TS PLAYER v.'+versionLWG+' ===---');
  ActivateGuiWindow();
  ActivateAutoSell();
  lwgActivateProductionMonitor();
  CheckDarkMode();
}
if (document.querySelector('.leaderboard') && loaded == 0) {
loaded = 1;
LoadLWGLeaderboard();
ActivateLeaderTracker();

//  AddLWGoptions();
}
}).observe(document, {childList: true, subtree: true});


async function ActivateGuiWindow() {

  //autoset default localstorage
  if(localStorage.getItem("LWGcraftingItems") === null){
    localStorage.setItem("LWGcraftingItems","[]")
  }
  if(localStorage.getItem("startSkins") === null){
    localStorage.setItem("startSkins",false)
  }
  if(localStorage.getItem("startComplete") === null){
    localStorage.setItem("startComplete",false)
  }
  if(localStorage.getItem("startSelling") === null){
    localStorage.setItem("startSelling",false)
  }
  if(localStorage.getItem("startPopupBox") === null){
    localStorage.setItem("startPopupBox",false)
  }
  if(localStorage.getItem("startSideProduction") === null){
    localStorage.setItem("startSideProduction",true)
  }
  if(localStorage.getItem("menucustomKey") === null){
    localStorage.setItem("menucustomKey","d")
  }
  if(localStorage.getItem("startSideProductionScrollbar") === null){
    localStorage.setItem("startSideProductionScrollbar",true)
  }
  if(localStorage.getItem("startLeftProdInfo") === null){
    localStorage.setItem("startLeftProdInfo",true)
  }
  if(localStorage.getItem("autosellTimerkey") === null){
    localStorage.setItem("autosellTimerkey","5")
  }
  if(localStorage.getItem("startDragon") === null){
    localStorage.setItem("startDragon",false)
  }
  if(localStorage.getItem("startDarkmode") === null){
    localStorage.setItem("startDarkmode",false)
  }
  if(localStorage.getItem("startAlarm") === null){
    localStorage.setItem("startAlarm",false)
  }

  
// color picker bkg
// if(localStorage.getItem("bkgcolor") === null){
// localStorage.setItem("bkgcolor","255,255,255,.63") //default game values
// }
// color picker txt
// if(localStorage.getItem("txtcolor") === null){
// localStorage.setItem("txtcolor","#555e65") // default game values
// }


  


      //add main GUI
      var nodegui = "<button type='button' class='rounded-button' title='Open Settings' id='toggle'><span><img loading='lazy'  src='https://img.icons8.com/material/50/000000/settings--v5.png' alt='main_settings_button' width='32' height='32'></span></button>";
      nodegui+="<div id='guiwindow' class='lwgbody avoid-clicks'><main id='gui' style='display:none'>";
      nodegui+="<section class='tabbed-window-list'>";

      nodegui+="<section class='tabs'>";
      nodegui+="<span style='padding:10px;font: 16px Arial, Helvetica, sans-serif;'>LWG TS v."+versionLWG+"</span>";
      nodegui+="<div class='tab tab-active' style='flex: 0;'>";
      nodegui+="<img loading='lazy' src='https://img.icons8.com/external-those-icons-fill-those-icons/24/ffffff/external-dollar-money-currency-those-icons-fill-those-icons-1.png' alt='auto-sell' width='32' height='32'>";
      nodegui+="<h2 style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Auto-Sell</h2>";
      nodegui+="</div>";

      nodegui+="<div class='tab' style='flex: 0;'>";
      nodegui+="<img loading='lazy' src='https://img.icons8.com/glyph-neue/64/ffffff/log.png' alt='auto-sell-log' width='32' height='32'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Sell-Log</h2>";
      nodegui+="</div>";

//      nodegui+="<div class='tab' style='flex: 0;'>";
//      nodegui+="<img loading='lazy' src='https://img.icons8.com/ios-filled/50/ffffff/hammer-and-anvil.png' alt='auto-build' width='32' height='32'>";
//      nodegui+="<h2>Auto-Build</h2>";
//      nodegui+="</div>";

      nodegui+="<div class='tab' style='flex: 0;'>";
      nodegui+="<img loading='lazy' src='https://img.icons8.com/ios-filled/50/ffffff/settings.png' alt='settings' width='32' height='32'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Settings</h2>";
      nodegui+="</div>";
      nodegui+="</section>";

      nodegui+="<section class='content-pane'>";
      nodegui+="<div class='tab-content tab-content-active'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Auto-Sell Options</h2>";
      nodegui+="<b style='font: 16px Arial, Helvetica, sans-serif;'>Filter-Search : </b></b><input type='text' class='lwg clearable' id='lwgsearch' placeholder='Example. Cake' autocomplete='off' style='width: 200px!important; height: 18px; font-size: 16px;margin-left:10px!important;margin-bottom:10px!important;border:1px solid #ddd;margin-right:120px;'></input>";

      nodegui+="<label class='switch switch-green'><input type='checkbox' class='lwg startDarkmode switch-input' id='start-dark-settings' name='start-dark-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Dark Mode</span>";


//      nodegui+="<label class='switch switch-green'><input type='checkbox' class='displayChecked switch-input' id='display-checked' name='display-checked'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 20px;padding-left:5px;font-size:18px;vertical-align: middle;'>Display only checked</span>";
      nodegui+="<div id='box' class='box tab-content-white'></div>";

// testing toggle switch
      nodegui+="<div style='float:left;'>";
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startSelling switch-input' id='auto-selling' name='auto-selling'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Start Auto-Sell</span>";
// check timer input for auto-sell
      nodegui+="<span style='line-height: 26px;padding-left:20px;font-size:18px;'>Custom Timer : </span> <span class='input-help'><input type='number' min='5' class='autosellTimerkey' id='autosell-timer-key' name='autosell-timer-key' style='width: 40px; height: 18px; font-size: 16px; border: 1px solid;' value=''></input><span style='line-height: 26px;padding-left:5px;font-size:18px;padding-right:5px'> Seconds</span><button class='savelwgbutton'>Save</button><small id='autoselltimerHelpBlock' class='form-text text-muted' style='padding-left:3px'>Min. 5 seconds</small> </span>";
      nodegui+="</p>";
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='startComplete switch-input' id='auto-complete' name='auto-complete'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;padding-right:25px;font-size:18px;'>Auto Complete Constructions</span>";
// dragon nft checkbox
      nodegui+="<label class='switch switch-green'><input type='checkbox' class='startDragon switch-input' id='auto-dragon' name='auto-dragon'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Use Dragon Auto-sell</span>";
      nodegui+="</p>";
      nodegui+="<iframe width='575' height='72' src='https://www.dnkdesign.com.mk/lwgscript/dude-donations-small.html' frameborder='0' scrolling='no' style='overflow: hidden;padding-left:10px;margin-top: 15px;'></iframe>";
      nodegui+="</div>";
//    nodegui+="<button class='button-reset resetTown'>New Town Reset Settings</button><p>testing-purpose";

      nodegui+="</div>";
      // Auto-sell Log
      nodegui+="<div class='tab-content'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Auto-Sell Log</h2>";
      nodegui+="<div id='box_c' class='tab-content-white'><div id ='saleLog' style='height: 100%;padding-left:10px;'></div></div>";
      nodegui+="<button class='clearlwgbutton' style='float:right;margin-right:5px;'>Clear Log</button></div>";
//      nodegui+="<div class='tab-content'>";
//      nodegui+="<h2 style='text-align:center;'>Auto-Build Options</h2>";
//      nodegui+="<div id='box_d' class='tab-content-white'>IN PROGRESS!</div>";
//      nodegui+="</div>";
      nodegui+="<div class='tab-content'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Settings Options</h2>";
      nodegui+="<div style='float:left;margin-top:13px;margin-right:10px'>";
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startDeveloper switch-input' id='developer-settings' name='developer-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Developer Settings</span></p>";
      // custom keybind area
      nodegui+="<p><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Custom Keybind for Menu</span> <input type='text' class='lwg menucustomKey' id='custom-key' name='custom-key' style='width: 24px; height: 18px; font-size: 16px; border: 1px solid;' value=''><button class='savelwgbutton'>Save</button><span style='color:orange;font-size:14px;padding-left:3px'> Use only a-z keys (1 key only)</span></p>";
      // leftsideproduction switch info
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startLeftProdInfo switch-input' id='side-production-left-info' name='side-production-left-info'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Display Left Sidebar Production Monitor Info</span></p>";
      // sideproduction switch
      nodegui+="<div id='production-settings-scrollbar' style='border: 1px solid #ddd;'><p><label class='switch switch-green'><input type='checkbox' class='lwg startSideProduction switch-input' id='side-production-settings' name='side-production-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Right Sidebar Production Monitor</span></p>";
//      nodegui+="</p>";
      // sideproduction switch scrollbar
      nodegui+="<p style='padding-left:20px;'><label class='switch switch-green'><input type='checkbox' class='lwg startSideProductionScrollbar switch-input' id='side-production-settings-scrollbar' name='side-production-settings-scrollbar'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Display Right Sidebar Production Monitor Scrollbar</span></p></div>";
      // earn box start switch
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startPopupBox switch-input' id='start-popup-settings' name='start-popup-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Display Start Popup Box - Introducing Play to Earn!</span></p>";
      // all skins start switch
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startSkins switch-input' id='start-skins-settings' name='start-skins-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Auto Apply All Skins</span></p>";
      // fail auto-sell alarm sound
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startAlarm switch-input' id='start-alarm-settings' name='start-alarm-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Enable alarm sound on fail auto-sell window</span></p>";
      // custom background and text colors
//      nodegui+="<div id='production-settings-scrollbar' style='border: 1px solid #ddd;'>";
//      nodegui+="<p class='picker'> <span>Re-Skin Background Color # </span><input class='picker' type='color' id='colorpicker' name='color' pattern='^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' value='#FFFFFF' title='Click to choose Custom Color' style='border-radius:4px;'> ";
//      nodegui+="<input class='picker' type='text' pattern='^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' value='#FFFFFF' id='hexcolor'></input><button class='savelwgbutton'>Save</button>";
//      nodegui+="<input class='picker' type='text' value=' id='rbga'></input>";
//      nodegui+="</p>";
//      nodegui+="<p class='picker'><span>Re-Skin Text Color # </span><input class='picker' type='color' id='colorpickerb' name='color' pattern='^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' value='#555e65' title='Click to choose Custom Color' style='border-radius:4px;'> ";
//      nodegui+="<input class='picker' type='text' pattern='^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' value='#555e65' id='hexcolorb'></input><button class='savelwgbutton'>Save</button>";
//      nodegui+="</p>";
//      nodegui+="</div>";
      // developer area json testing toggle
      nodegui+="<div id='developer-extra'><p><span style='line-height: 26px;padding-left:5px;font-size:18px;text-align:center;'>DEVELOPER AREA FOR TESTING JSON</span></p>";
//      nodegui+="<p><textarea id='configTxtleft' rows='1' cols='1' class='resettable' style='width: 590px; height: 200px;' readonly></textarea></p>";
      nodegui+="<p><textarea id='configTxt' rows='1' cols='1' class='resettable' style='width: 590px; height: 200px;' readonly></textarea></p></div>";
      nodegui+="</div>";
      nodegui+="</div>";
      nodegui+="</section>";
      nodegui+="</section>";
      nodegui+="</main></div>";

  let newNode = document.createElement("div");
    newNode.id = 'gui-status';
    newNode.style.cssText = 'overflow: none;pointer-events: all!important; position: fixed; left: 65px;top:0;z-index:9999;';
    newNode.innerHTML = nodegui;
    await WaitForElement('.hud');
    document.querySelector('.hud').prepend(newNode);

    // add button with listener
    await WaitForElement('.right-hud');
    $('.right-hud').before ( '      \
    <button type="button" class="show-btn rounded-button toggle" title="Open TS Visualiser"><span><img loading="lazy" src="https://img.icons8.com/ios-filled/50/000000/sign-language-v.png" alt="ts_visualiser_button" width="18" height="18"></span></button> \
    ' );

      // opening dialog
      $('.right-hud').before ( '                                                          \
   <div id="lwgmodal" class="lwgmodal toggle" style="display:none"> \
      <div class="top-content"> \
         <div class="left-text"> \
         <header><button class="opacity-btn">Togle Opacity</button><span style="padding-left:5px;"> \
         = <input id="opacityno" type="number" min="0.1" max="1.0" step="0.1" style="width: 40px; height: 18px; font-size: 16px; border: 1px solid;margin-right:20px;" value="0.5" title="Use up or down to increase/decrease opacity level."><button class="s-btn">Save</button><span style="padding-left:5px;"> \
         <a class="btn zoom" title="zoom in"><i class="fas fa-search-plus"></i> Zoom in</a> | \
         <a class="btn zoom-out" title="zoom out"><i class="fas fa-search-minus"></i> Zoom out</a> | \
         <a class="btn zoom-init" title="reset zoom"><i class="fas fa-recycle"></i> Reset Zoom</a> |</span></header> \
   </div> \
         <span class="close-icon"><i class="fas fa-times"></i></span> \
      </div> \
      <div class="bottom-content"> \
         <iframe id="main_iframe" width="978px" height="675px" src="https://www.dnkdesign.com.mk/lwgtsv/visualizer.html" frameborder="0" scrolling="no" style="overflow: none;"></iframe> \
      </div> \
   </div>   \                                                     \
      ' );


/* ADD CUSTOM DIALOG WINDOW */
/**
*/
await WaitForElement('.show-btn');
$('.show-btn').click(function(){
  var modaldiv = document.getElementById('lwgmodal');
  if (modaldiv.style.display !== "none") {
      modaldiv.style.display = "none";
  } else {
   modaldiv.style.display = "block";
   var zooms = 1.3;
   $('.lwgmodal').css('transform', 'scale(' + zooms + ')');
   $('.lwgmodal').css('-webkit-transform', 'scale(' + zooms + ')');
   
  }          
});
$('.close-icon').click(function(){
  var modaladiv = document.getElementById('lwgmodal');
  if (modaladiv.style.display !== "none") {
      modaladiv.style.display = "none";
  } else {
   modaladiv.style.display = "block";
  } 

});
$('.opacity-btn').click(function(){
  var div = document.getElementById('lwgmodal');
  if (div.style.opacity !== $('#opacityno').val()) {
  div.style.opacity = $('#opacityno').val();
  widthseven();
  }
  else {
      div.style.opacity = "1.0";
      widththousand();
  }
});


 function widthseven() {
  var d = document.getElementsByClassName('lwgmodal')
  for (var i = 0; i < d.length; i++)
  {
      d[i].style.width = "620px";
  }

}

function widththousand() {
  var d = document.getElementsByClassName('lwgmodal')
  for (var i = 0; i < d.length; i++)
  {
      d[i].style.width = "1000px";
  }

}

 //show hide lwgts on key v or V
 //document.getElementById("lwgmodal").style.display = "none";
 //const targetDivv = document.getElementById('lwgmodal');
 //document.onkeydown = function(e) { // or document.onkeypress
 //  e = e || window.event;

//   if (e.key == "v" || e.key == "V" ) {
//     if (targetDivv.style.display === "none") {
//       targetDivv.style.display = "block";
//   } else {
//       targetDivv.style.display = "none";
//   }
//   }
//
//};


  $('.lwgmodal').on('mousedown', function (e) {
    
    var $this = $(this);

    $this.addClass('active');

    
    
    var oTop = e.pageY - $('.active').offset().top;
    var oLeft = e.pageX - $('.active').offset().left;
    
    $(this).parents().on('mousemove', function (e) {

        $('.active').offset({

            top: e.pageY - oTop,
            left: e.pageX - oLeft

        })
             
    });
    
    $('body').on('mouseup', function () {

        $this.removeClass('active');
        $('body').unbind('mouseup');

    });
    $('#opacityno').on('mousedown', function () {

      $this.removeClass('active');
      $('.lwgmodal').unbind('mousedown');
    
    });
    
    $('#opacityno').focusout(function() {
    
      $this.addClass('active');
      $('body').on('mouseup', function () {
    
        $this.removeClass('active');
        $('body').unbind('mouseup');

    });

      $('.lwgmodal').on('mousedown', function (e) {
    
        var $this = $(this);
    
        $this.addClass('active');
    
        
        
        var oTop = e.pageY - $('.active').offset().top;
        var oLeft = e.pageX - $('.active').offset().left;
        
        $(this).parents().on('mousemove', function (e) {
    
            $('.active').offset({
    
                top: e.pageY - oTop,
                left: e.pageX - oLeft
    
            })
                 
        });
        
        $('body').on('mouseup', function () {
    
            $this.removeClass('active');
            $('body').unbind('mouseup');
    
        });
      });
    
    });
    
    return false;    
});




  const foozyv = document.querySelector('#lwgmodal')
  foozyv.addEventListener('wheel', (event) => { event.stopPropagation();});
 
// zoom in zoom out

var zoom = 1.3;
		
$('.zoom').on('click', function(){
  zoom += 0.1;
  $('.lwgmodal').css('transform', 'scale(' + zoom + ')');
  $('.lwgmodal').css('-webkit-transform', 'scale(' + zoom + ')');
});
$('.zoom-init').on('click', function(){
  zoom = 1.3;
  $('.lwgmodal').css('transform', 'scale(' + zoom + ')');
  $('.lwgmodal').css('-webkit-transform', 'scale(' + zoom + ')');
});
$('.zoom-out').on('click', function(){
  zoom -= 0.1;
  $('.lwgmodal').css('transform', 'scale(' + zoom + ')');
  $('.lwgmodal').css('-webkit-transform', 'scale(' + zoom + ')');
});


    // function for GUI tabs
  const tab = document.querySelectorAll("div.tab");
  const tabContent = document.querySelectorAll("div.tab-content");

  for (let i = 0; i < tab.length; i++) {
    tab[i].onclick = tabActive;
  }

  function tabActive() {
    for (let i = 0; i < tab.length; i++) {
      this.classList.add("tab-active");

      if (tab[i] !== this) {
        tab[i].classList.remove("tab-active");
      }
    }

    for (let i = 0; i < tabContent.length; i++) {
      tabContent[i].classList.add("tab-content-active");

      if (tab[i] !== this) {
        tabContent[i].classList.remove("tab-content-active");
      }
    }
  }


  //show hide options on key D or D
  document.getElementById("gui").style.display = "none";

  document.onkeydown = function(e) { // or document.onkeypress
    e = e || window.event;
    var hasFocus = $('#lwgsearch').is(':focus');
    if(hasFocus){
      targetDiv.style.display = "flex";
    }else {
    if (e.key == localStorage.getItem("menucustomKey").toLowerCase() || e.key == localStorage.getItem("menucustomKey").toUpperCase()) {
      if (targetDiv.style.display === "none") {
        targetDiv.style.display = "flex";
    } else {
        targetDiv.style.display = "none";
    }
    }
  }
};

  //show hide options
  document.getElementById("gui").style.display = "none";
  const targetDiv = document.getElementById("gui");
  const btn = document.getElementById("toggle");
  btn.onclick = function () {
  if (targetDiv.style.display === "none") {
      targetDiv.style.display = "flex";
  } else {
      targetDiv.style.display = "none";
  }
  };

    //start show/hide main area
    // add button with listener
    await WaitForElement('.hud-fps');
    $('.hud-fps').after ( '      \
    <div id="main-show-on-off" style="padding: 5px; min-width: 95px; height: 30px; line-height: 30px; text-align: right; color: rgb(255, 255, 255);position: absolute;inset: 45px auto auto 50%; margin: 0px; cursor: pointer; visibility: visible;text-shadow: rgb(34, 34, 34) 1px 1px 0px; background: rgb(34, 34, 34); color: rgb(255, 255, 255); border: 1px solid rgb(26, 26, 26);transform: scale(0.8);"><label class="switch switch-green"><input type="checkbox" class="lwg showUI switch-input" id="show-ui-settings" name="show-ui-settings" enabled><span class="switch-label" data-on="On" data-off="Off"></span><span class="switch-handle"></span></label><span style="line-height: 26px;padding-left:5px;font-size:18px;">GUI</span></div> \
    ' );
    $('.showUI').prop('checked', true);
    $(".showUI").click(function() {
      $(".top.hud-player-stats").toggle();
      $("#autosell-status").toggle();
      $("#gui-status").toggle();
      $(".right").toggle();
    });
    // end of show/hide main area

// reset button auto-log
    $('.clearlwgbutton').click(function(){
      $("#saleLog").empty();
    
    });

// color picker area
//  $('#colorpicker').on('input', function() {
//    $('#hexcolor').val(this.value);
//  });
//  $('#hexcolor').on('input', function() {
//    $('#colorpicker').val(this.value);
//  });
//  $('#colorpickerb').on('input', function() {
//    $('#hexcolorb').val(this.value);
//  });
//  $('#hexcolorb').on('input', function() {
//    $('#colorpickerb').val(this.value);
//  });

//  function hexToRgb(hex) {
//    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//    if(result){
//     var r= parseInt(result[1], 16);
//     var g= parseInt(result[2], 16);
//     var b= parseInt(result[3], 16);
//     return r+","+g+","+b;//return 23,14,45 -> reformat if needed 
//    } 
//    return null;
//  }
//  var hexcolor = $('#hexcolor').val();
//  $('#rbga').val("("+hexToRgb(hexcolor)+",.63)");
//  console.log(hexToRgb(hexcolor));//"10,54,120"


// general auto-sell area (JSON values will be removed later due to we want to grab them auto from the game or by some JSON file (due to different metas))
var rows =   [
{id : 1, name : "Blue Steel",	id_name : "Blue_Steel",	price : "270950",	stars : "6800"},
{id : 2, name : "Cake",	id_name : "Cake",	price : "178050",	stars : "4475"},
{id : 3, name : "Baguette",	id_name : "Baguette",	price : "91300",	stars : "1472"},
{id : 4, name : "Pinot Noir",	id_name : "Pinot_Noir",	price : "57200",	stars : "1008"},
{id : 5, name : "Pumpkin Pie",	id_name : "Pumpkin_Pie",	price : "49750",	stars : "816"},
{id : 6, name : "Batter",	id_name : "Batter",	price : "48700",	stars : "450"},
{id : 7, name : "Steel",	id_name : "Steel",	price : "47000",	stars : "768"},
{id : 8, name : "Cabernet Sauvignon",	id_name : "Cabernet_Sauvignon",	price : "42000",	stars : "688"},
{id : 9, name : "Uniforms",	id_name : "Uniforms",	price : "34450",	stars : "560"},
{id : 10, name : "Candy Canes",	id_name : "Candy_Canes",	price : "34000",	stars : "315"},
{id : 11, name : "Dough",	id_name : "Dough",	price : "29150",	stars : "270"},
{id : 12, name : "Chardonnay",	id_name : "Chardonnay",	price : "27950",	stars : "464"},
{id : 13, name : "Wool Yarn",	id_name : "Wool_Yarn",	price : "24250",	stars : "225"},
{id : 14, name : "Butter",	id_name : "Butter",	price : "16250",	stars : "153"},
{id : 15, name : "Wine Bottle",	id_name : "Wine_Bottle",	price : "12800",	stars : "126"},
{id : 16, name : "Oak Barrel",	id_name : "Oak_Barrel",	price : "5500",	stars : "63"},
{id : 17, name : "Chromium",	id_name : "Chromium",	price : "4600",	stars : "54"},
{id : 18, name : "Iron",	id_name : "Iron",	price : "4600",	stars : "54"},
{id : 19, name : "Limestone",	id_name : "Limestone",	price : "4600",	stars : "54"},
{id : 20, name : "Wool",	id_name : "Wool",	price : "4550",	stars : "24"},
{id : 21, name : "Milk",	id_name : "Milk",	price : "4000",	stars : "20"},
{id : 22, name : "Cotton Yarn",	id_name : "Cotton_Yarn",	price : "3250",	stars : "16"},
{id : 23, name : "Sugar",	id_name : "Sugar",	price : "3150",	stars : "16"},
{id : 24, name : "Pinot Noir Grapes",	id_name : "Pinot_Noir_Grapes",	price : "2670",	stars : "20"},
{id : 25, name : "Salt",	id_name : "Salt",	price : "2550",	stars : "16"},
{id : 26, name : "Flour",	id_name : "Flour",	price : "2250",	stars : "12"},
{id : 27, name : "Jet Fuel",	id_name : "Jet_Fuel",	price : "1900",	stars : "27"},
{id : 28, name : "Cabernet Grapes",	id_name : "Cabernet_Grapes",	price : "1820",	stars : "16"},
{id : 29, name : "Eggs",	id_name : "Eggs",	price : "1650",	stars : "12"},
{id : 30, name : "Gasoline",	id_name : "Gasoline",	price : "1450",	stars : "8"},
{id : 31, name : "Lumber",	id_name : "Lumber",	price : "1350",	stars : "8"},
{id : 32, name : "Pumpkin",	id_name : "Pumpkin",	price : "1000",	stars : "2"},
{id : 33, name : "Silica",	id_name : "Silica",	price : "1000",	stars : "2"},
{id : 34, name : "Chardonnay Grapes",	id_name : "Chardonnay_Grapes",	price : "810",	stars : "8"},
{id : 35, name : "Peppermint",	id_name : "Peppermint",	price : "800",	stars : "8"},
{id : 36, name : "Petroleum",	id_name : "Petroleum",	price : "450",	stars : "4"},
{id : 37, name : "Sugarcane",	id_name : "Sugarcane",	price : "400",	stars : "1"},
{id : 38, name : "Cotton",	id_name : "Cotton",	price : "350",	stars : "1"},
{id : 39, name : "Feed",	id_name : "Feed",	price : "340",	stars : "1"},
{id : 40, name : "Brine",	id_name : "Brine",	price : "300",	stars : "1"},
{id : 41, name : "Wheat",	id_name : "Wheat",	price : "300",	stars : "1"},
{id : 42, name : "Oak Wood",	id_name : "Oak_Wood",	price : "250",	stars : "1"},
{id : 43, name : "Wood",	id_name : "Wood",	price : "250",	stars : "1"},
{id : 44, name : "Energy",	id_name : "Energy",	price : "150",	stars : "1"},
{id : 45, name : "Crude Oil",	id_name : "Crude_Oil",	price : "50",	stars : "1"},
{id : 46, name : "Water Drum",	id_name : "Water_Drum",	price : "50",	stars : "1"},
{id : 47, name : "Chocolate Bar",	id_name : "Chocolate_Bar",	price : "50",	stars : "1"},
{id : 48, name : "Fancy Cake",	id_name : "Fancy_Cake",	price : "50",	stars : "1"},
{id : 49, name : "Decorated Cake",	id_name : "Decorated_Cake",	price : "50",	stars : "1"},
{id : 50, name : "Strawberries",	id_name : "Strawberries",	price : "50",	stars : "1"},
{id : 51, name : "Chocolate Covered Strawberries",	id_name : "Chocolate_Covered_Strawberries",	price : "50",	stars : "1"},
{id : 52, name : "Cocoa",	id_name : "Cocoa",	price : "50",	stars : "1"}
              ];

              var model = "ts_crafts";
              var asell = "<ul class='border_bottom' style='margin-top:0px;'>";
              for (var i = 0; i < rows.length; i++) {

                asell+="<li style='margin-top: 5px; border-bottom: 1px solid #444;margin-bottom: 5px;padding-bottom: 5px;'><table id='"+rows[i].id_name+"'><tr><span class='textgreen' style='padding-left:15px;'><b>"+rows[i].name+" ("+Game.craftData[rows[i].id_name].CityPoints+" points and $"+Game.craftData[rows[i].id_name].CityPrice+" per item)</b></span>";
//                    asell+="</li>";
//                    asell+="<li>";
                asell+="<td style='width:215px;color:#000;'>";
                asell+="<label for='"+rows[i].id+"' style='font-size: 16px;line-height:22px;'>";
                asell+="<input type='checkbox' id='"+rows[i].id+"' name='"+model+"' class='lwg resettable saveButton' style='width: 18px; height: 18px;'>"+rows[i].name+"</label></td>";
                asell+="<td><span class='orange' style='font: 16px Arial, Helvetica, sans-serif;'>Sell When >= :</span><input type='number' min='0' class='lwg resettable sell-input' title='Sell when the ammount of the item is above or equal the value you enter.' style='width: 64px; height: 18px; font-size: 16px; border: 1px solid;'></td>";
                asell+="<td><span class='green' style='font: 16px Arial, Helvetica, sans-serif;'>and if gas >=:</span><input type='number' min='0' class='lwg resettable gas-input' title='Sell when the ammount of gas is above or equal the value you enter.' style='width: 64px; height: 18px; font-size: 16px; border: 1px solid;'></td></li>";
                asell+="</tr></table>";

            }
            asell+="</ul>";
            document.getElementById("box").innerHTML = asell;


            
// LOCALSTORAGE SAVING JSON

const saveCrafts = (ev) => {
let craftss = [];
let fields = document.querySelectorAll(
  "#Blue_Steel, #Cake, #Baguette, #Pinot_Noir, #Pumpkin_Pie, #Batter, #Steel, #Cabernet_Sauvignon, #Uniforms, #Candy_Canes, #Dough, #Chardonnay, #Wool_Yarn, #Butter, #Wine_Bottle, #Oak_Barrel, #Chromium, #Iron, #Limestone, #Wool, #Milk, #Cotton_Yarn, #Sugar, #Pinot_Noir_Grapes, #Salt, #Flour, #Jet_Fuel, #Cabernet_Grapes, #Eggs, #Gasoline, #Lumber, #Pumpkin, #Silica, #Chardonnay_Grapes, #Peppermint, #Petroleum, #Sugarcane, #Cotton, #Feed, #Brine, #Wheat, #Oak_Wood, #Wood, #Energy, #Crude_Oil, #Water_Drum, #Chocolate_Bar, #Fancy_Cake, #Decorated_Cake, #Strawberries, #Chocolate_Covered_Strawberries, #Cocoa"
);
fields.forEach(function (element) {
    if (element.querySelector(".sell-input") != null) {
        var sell = element.querySelector(".sell-input").value;
         }

    if (element.querySelector(".gas-input") != null) {
        var gaslink = element.querySelector(".gas-input");
        var gaslinkset = gaslink.setAttribute('value',0);
//            var gaszero = 0;
        var gas = gaslink.value;
        }else {var gas = gaslinkset.value;}

    if (element.querySelector(".saveButton") != null) {
        var chk =  element.querySelector(".saveButton").checked;
         }
    craftss.push({
      item: element.id,
      sellMin: parseInt(sell),
      gasMin: parseInt(gas),
      checked: chk
    });
  });
//    console.log(craftss);
  localStorage.setItem("LWGcraftingItems", JSON.stringify(craftss));



// json parse in textarea box for testing purposes
var arr = JSON.parse(JSON.stringify(craftss));
var filtered = arr.filter(a => a.checked == true);
document.getElementById("configTxt").value = JSON.stringify(filtered);
console.log(filtered);


};

document.querySelectorAll(".saveButton").forEach(function (btn) {
  btn.addEventListener("click", saveCrafts);
});
document.querySelectorAll(".sell-input").forEach(function (btn) {
  btn.addEventListener("change", saveCrafts);
});
document.querySelectorAll(".gas-input").forEach(function (btn) {
  btn.addEventListener("change", saveCrafts);
});

// on page load
let stored = JSON.parse(localStorage.getItem("LWGcraftingItems"));
var arrs = JSON.parse(localStorage.getItem("LWGcraftingItems"));
var filtereds = arrs.filter(a => a.checked == true);
document.getElementById("configTxt").value = JSON.stringify(filtereds);
  //console.log(filtered);

if (stored) {
//      console.log(stored);
  stored.forEach(function (itemz) {
    document
      .querySelector("#" + itemz.item)
      .querySelector(".sell-input").value = itemz.sellMin;
    document
      .querySelector("#" + itemz.item)
      .querySelector(".gas-input").value = itemz.gasMin;
    document
      .querySelector("#" + itemz.item)
      .querySelector(".saveButton").checked = itemz.checked;

  });
}

// StartSelling checkbox
function savess() {
var checkbox = document.getElementById("auto-selling");
localStorage.setItem("startSelling", checkbox.checked);
}

document.querySelectorAll(".startSelling").forEach(function (btn) {
btn.addEventListener("click", savess);
});

var checked = JSON.parse(localStorage.getItem("startSelling"));
document.getElementById("auto-selling").checked = checked;

// StartComplete checkbox
function savecomplete() {
var checkboxs = document.getElementById("auto-complete");
localStorage.setItem("startComplete", checkboxs.checked);
}

document.querySelectorAll(".startComplete").forEach(function (btn) {
btn.addEventListener("click", savecomplete);
});

var checkeds = JSON.parse(localStorage.getItem("startComplete"));
document.getElementById("auto-complete").checked = checkeds;

// startDragon checkbox
function savedragonprod() {
	var checkboxdr = document.getElementById("auto-dragon");
    localStorage.setItem("startDragon", checkboxdr.checked);
}

document.querySelectorAll(".startDragon").forEach(function (btn) {
    btn.addEventListener("click", savedragonprod);
});

var checkedsds = JSON.parse(localStorage.getItem("startDragon"));
    document.getElementById("auto-dragon").checked = checkedsds;


// startSideProduction checkbox
function saverightprod() {
var checkboxs = document.getElementById("side-production-settings");
localStorage.setItem("startSideProduction", checkboxs.checked);
}

document.querySelectorAll(".startSideProduction").forEach(function (btn) {
btn.addEventListener("click", saverightprod);
});

var checkedss = JSON.parse(localStorage.getItem("startSideProduction"));
document.getElementById("side-production-settings").checked = checkedss;


// startSideProductionScrollbar checkbox
function saverightprodscrollbar() {
var checkboxscrollbar = document.getElementById("side-production-settings-scrollbar");
localStorage.setItem("startSideProductionScrollbar", checkboxscrollbar.checked);
}

document.querySelectorAll(".startSideProductionScrollbar").forEach(function (btn) {
btn.addEventListener("click", saverightprodscrollbar);
});

var checkedsscrollbar = JSON.parse(localStorage.getItem("startSideProductionScrollbar"));
document.getElementById("side-production-settings-scrollbar").checked = checkedsscrollbar;


// startLeftProdInfo checkbox
function saveleftprodinfo() {
var checkboxleftinfo = document.getElementById("side-production-left-info");
localStorage.setItem("startLeftProdInfo", checkboxleftinfo.checked);
}

document.querySelectorAll(".startLeftProdInfo").forEach(function (btn) {
btn.addEventListener("click", saveleftprodinfo);
});

var checkboxsleftinfo = JSON.parse(localStorage.getItem("startLeftProdInfo"));
document.getElementById("side-production-left-info").checked = checkboxsleftinfo;


// startPopupbox checkbox
function savestartPopup() {
var checkboxs = document.getElementById("start-popup-settings");
localStorage.setItem("startPopupBox", checkboxs.checked);
}

document.querySelectorAll(".startPopupBox").forEach(function (btn) {
btn.addEventListener("click", savestartPopup);
});

var checkedsss = JSON.parse(localStorage.getItem("startPopupBox"));
document.getElementById("start-popup-settings").checked = checkedsss;


// startSkins checkbox
function saveallskins() {
var checkboxs = document.getElementById("start-skins-settings");
localStorage.setItem("startSkins", checkboxs.checked);
}

document.querySelectorAll(".startSkins").forEach(function (btn) {
btn.addEventListener("click", saveallskins);
});

var checkedssss = JSON.parse(localStorage.getItem("startSkins"));
document.getElementById("start-skins-settings").checked = checkedssss;

// startDarkmode checkbox
function darkmode() {
  var checkboxsdd = document.getElementById("start-dark-settings");
  localStorage.setItem("startDarkmode", checkboxsdd.checked);
  }
  
  document.querySelectorAll(".startDarkmode").forEach(function (btn) {
  btn.addEventListener("click", function() {
    darkmode();
    CheckDarkMode();  
    });
  });

  var checkedssssddd = JSON.parse(localStorage.getItem("startDarkmode"));
  document.getElementById("start-dark-settings").checked = checkedssssddd;


// startAlarm checkbox
function alarmmode() {
  var checkboxalarm = document.getElementById("start-alarm-settings");
  localStorage.setItem("startAlarm", checkboxalarm.checked);
  }
  
  document.querySelectorAll(".startAlarm").forEach(function (btn) {
  btn.addEventListener("click", alarmmode);
  });
  
  var checkboxalarma = JSON.parse(localStorage.getItem("startAlarm"));
  document.getElementById("start-alarm-settings").checked = checkboxalarma;

  //Show hide dev area
  var develem = document.getElementById('developer-extra'),
  devcheckBox = document.getElementById('developer-settings');
  devcheckBox.checked = false;
  devcheckBox.onchange = function developc() {
    develem.style.display = this.checked ? 'block' : 'none';
  };
  devcheckBox.onchange();


  //Show StartBox
  let startPopupBox = JSON.parse(localStorage.getItem("startPopupBox"));
  if(startPopupBox === false){
    CloseWindows(document.querySelectorAll('body > .container > .player-confirm .dialog-cell'), false);
    CloseWindows(document.querySelectorAll('.container > div:not(.hud):not(.player-confirm)'), true);
  }



// search crafts
$(function(){

$('#lwgsearch').keyup(function(){

    var searchText = $(this).val().toUpperCase();

    $('ul.border_bottom > li').each(function(){

      if ($(this).text().toUpperCase().search(searchText) > -1) {
        $(this).show();
    }
    else {
         $(this).hide();
    }
    });
});

});

/**
* Clearable text inputs
*/
function tog(v){return v ? "addClass" : "removeClass";}
$(document).on("input", ".clearable", function(){
   $(this)[tog(this.value)]("x");
}).on("mousemove", ".x", function( e ){
   $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]("onX");
}).on("touchstart click", ".onX", function( ev ){
   ev.preventDefault();
   $(this).removeClass("x onX").val("").change();
   $(this).attr("placeholder", "Example. Cake");
   $('ul.border_bottom > li').each(function(){
    $(this).show();
   })
});


// menucustomKey input


function savecustomKey() {
var checkboxsx = document.getElementById("custom-key");
  localStorage.setItem("menucustomKey", checkboxsx.value);
}

document.querySelectorAll(".menucustomKey").forEach(function (btn) {
  btn.addEventListener("change", savecustomKey);
});

var checkedsssss = localStorage.getItem("menucustomKey");
  document.getElementById("custom-key").value = checkedsssss;


// menuautosellTimerkey input
function autosellTimerkey() {
var timerkey = document.getElementById("autosell-timer-key");
localStorage.setItem("autosellTimerkey", timerkey.value);
}

document.querySelectorAll(".autosellTimerkey").forEach(function (btn) {
btn.addEventListener("change", autosellTimerkey);
});

var timerkeys = localStorage.getItem("autosellTimerkey");
document.getElementById("autosell-timer-key").value = timerkeys;





// clear on focus
$('#custom-key').focus(function() {
$(this).val('');
});

$('#custom-key').attr('maxlength', '1');

// fix for zoom in out on scroll
await WaitForElement('#gui-status');
const fooz = document.querySelector('#gui-status')
fooz.addEventListener('wheel', (event) => { event.stopPropagation();});
fooz.addEventListener('mousedown', (event) => { event.stopPropagation();});
fooz.addEventListener('mouseup', (event) => { event.stopPropagation();});
}

async function WaitForElement(selector) {
while (document.querySelector(selector) === null) {
  await new Promise( resolve => requestAnimationFrame(resolve) )
}
await new Promise(resolve => setTimeout(resolve, 1000));
return document.querySelector(selector);
}



// trade options
function GetAvailableTradeObject(capacity) {
  return Object.values(Game.town.objectDict).filter(tradeObj => tradeObj.logicType === 'Trade')
      .find(tradeObj =>
            Game.unitsData[tradeObj.objData.UnitType].Capacity == capacity
            && !Game.town.tradesList.find(activeTrade => activeTrade.source.x == tradeObj.townX && activeTrade.source.z == tradeObj.townZ)
           )
}

function CloseWindows(elements, checkParent) {
  for (let i=0, n=elements.length; i < n; i++) {
      let el = checkParent ? elements[i].closest('.container') : elements[i];
      let elVis = el.currentStyle ? el.currentStyle.visibility : getComputedStyle(el, null).visibility;
      let elDis = el.currentStyle ? el.currentStyle.display : getComputedStyle(el, null).display;
      if (!(elVis === 'hidden' || elDis === 'none')) {
          el.querySelector('.close-button') && el.querySelector('.close-button').click();
      }
  }
}

async function WaitForCompletion(selector) {
  while (document.querySelector(selector) !== null) {
      await new Promise( resolve => requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector);
}

async function WaitForTradeLoad(targetTradeObj) {
  return await new Promise(resolve => {
      const waitForUpdate = setInterval(() => {
          let tradeUiObj = Game.app.root.findByName('TradeUi').script.trade.townObject;
          if (tradeUiObj && tradeUiObj.townX == targetTradeObj.townX && tradeUiObj.townZ == targetTradeObj.townZ && Game.app.root.findByName('TradeUi').script.trade.cityPaths[0].gasCost) {
              resolve('Loaded');
              clearInterval(waitForUpdate);
          };
      }, 1000);
  });
}

async function WaitForTradeLoadd(targetTradeObjd) {

    return await new Promise(resolve => {

        const waitForUpdate = setInterval(() => {

            let tradeUiObj = Game.app.root.findByName('TradeUi').script.trade.townObject;

            if (tradeUiObj && tradeUiObj.townX == targetTradeObjd.townX && tradeUiObj.townZ == targetTradeObjd.townZ && Game.app.root.findByName('TradeUi').script.trade.cityPaths[0]) {

                resolve('Loaded');

                clearInterval(waitForUpdate);

            };

        }, 1000);

    });
  }

  function play() {
    var AlarmCheckBox = document.getElementById("start-alarm-settings");
    if (AlarmCheckBox.checked == true) { 
    var audio = new Audio('https://www.dnkdesign.com.mk/lwgscript/dj-air-fail.mp3');
    audio.play();
    }
  }  

//auto sell options
async function CheckCrafts() {
var getautoselltime = parseInt(localStorage.getItem("autosellTimerkey"));

let allTradeObjects = Object.values(Game.town.objectDict).filter(tradeObj => tradeObj.logicType === 'Trade');
for (let i=0, n=allTradeObjects.length; i < n; i++) {
  if (allTradeObjects[i].logicObject.tapToCollectEntity.enabled) {
      allTradeObjects[i].logicObject.OnTapped();
  }
}

if (document.getElementById("auto-selling").checked == true && $('.store').length <= 0 && $('.confirmdialogui-container').css('display') == 'none' && $(".playerconfirm-container").next(".container").css('display') == 'none') {

// dragon only sale
if (document.getElementById("auto-dragon").checked == true) {
    var craftedItems =JSON.parse(document.getElementById("configTxt").value);
      for (let i=0, n=craftedItems.length; i < n; i++) {
        //experimental break action
        if(document.getElementById("auto-selling").checked == false){
          break;
        } else {

//          if(Game.town.GetStoredCrafts()['Gasoline'] >= craftedItems[i].gasMin){
          if (Game.town.GetStoredCrafts()[craftedItems[i].item] >= craftedItems[i].sellMin) {
              let targetTradeObjd;
              if (!targetTradeObjd && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 25 && craftedItems[i].sellMin >= 25){
                targetTradeObjd = GetAvailableTradeObject(25);
                var loadeditems = '25';
              }
              if (targetTradeObjd){
                  CloseWindows(document.querySelectorAll('body > .container > .player-confirm .dialog-cell'), false);
                  CloseWindows(document.querySelectorAll('.container > div:not(.hud):not(.player-confirm)'), true);




                  Game.town.selectObject(targetTradeObjd);
                  Game.app.fire('SellClicked', {x: targetTradeObjd.townX, z: targetTradeObjd.townZ});
                  await WaitForCompletion('.LoadingOrders');
                  document.querySelector('#trade-craft-target [data-name="' + craftedItems[i].item + '"]').click();
                  // seling log
                  if(strSellingData.length > 0){
                  strSellingData = "";
                  }
//                  strSellingData += "SELLING ("+loadeditems+") " + craftedItems[i].item + "! \n" ;
//                  console.log(strSellingData);


              await WaitForTradeLoadd(targetTradeObjd);

//if (Game.town.GetStoredCrafts()['Gasoline'] >= Game.app.root.findByName('TradeUi').script.trade.cityPaths[0].gasCost) {





                        if (Game.town.GetStoredCrafts() >= Game.app.root.findByName('TradeUi').script.trade.cityPaths[0]) {
                      document.querySelector('#destination-target .destination .sell-button').click();
                      let tradeTimeout = setTimeout(function(){
          document.querySelector('.trade-connection .no').click();
        },25000);



//cancel button disabling auto-sell
$(".trade-connection").find(".no").on("click", CheckCancelbutton);

function CheckCancelbutton() {
play();  
$( ".startSelling").prop('checked', false);
localStorage.setItem("startSelling",false);
console.log('Auto-Sell Has been disabled. Please re-enable it manualy via script menu');
document.getElementById("overlay").style.display = "block";
// start timer
  if (($("#overlay").is(':visible'))) {
  var counter = getautoselltime;
  var interval = setInterval(function() {
      counter--;
      // Display 'counter' wherever you want to display it.
      if (counter <= 0 && crossClicked == false) {
        crossClicked = false;
           clearInterval(interval);
          $('#time').html("<h3>Auto-Sell Restart in progress</h3>");
          $( ".startSelling").prop('checked', true);
          localStorage.setItem("startSelling",true);
          $("#overlay").hide();
          return;
      }else{
        crossClicked = false;
        $("#overlay").click(function(){
          crossClicked = true;
          clearInterval(interval);
          $( ".startSelling").prop('checked', false);
          localStorage.setItem("startSelling",false);
          return;
        });
        $('#time').html(counter);
        console.log("Auto-Sell Restart Timer --> " + counter);
      }
  }, 1000);
}
// end timer


//document.querySelector('#autosell-status .bank').textContent = 'LWG TS v.'+versionLWG+' Auto-Sell Disabled';
}

await WaitForCompletion('.trade-connection .compass');


//start log of sold items
if(document.getElementById("auto-selling").checked == true) {
  class Personalsale {
    constructor(itemsellname, itemsellamt) {
      this.itemsellname = itemsellname;
      this.itemsellamt = itemsellamt;
      this.fullname = function () {
        return (`${this.itemsellname} ${this.itemsellamt}`);
      };
    }
  }


  /* store object into array */
  aData.push(new Personalsale(craftedItems[i].item, parseInt(loadeditems)));

  /* convert array of object into string json */
  var jsonString = JSON.stringify(aData);
  //console.log(jsonString)


  var resMap = new Map();

  aData.map((x) => {
  if (!resMap.has(x.itemsellname))
  resMap.set(x.itemsellname, x.itemsellamt);
  else
  resMap.set(x.itemsellname, (x.itemsellamt + resMap.get(x.itemsellname)));
  })
  resMap.forEach((value, key) => {
  outputd.push({
  itemsellname: key,
  itemsellamt: value
  })
  })


  var jsonStringz = JSON.stringify(outputd);

  var array = JSON.parse(jsonStringz);



  array.forEach(function(object) {


  let diff = new Date() - lwgtimeStart;
  var soldsecond = object.itemsellamt / ( diff / 1000 );
  var soldminute = object.itemsellamt / ( diff / 60000 );
  var soldhour = object.itemsellamt / ( diff / 3600000 );


  let startLeftinfoBox = JSON.parse(localStorage.getItem("startLeftProdInfo"));
  if(startLeftinfoBox === true  ){
  $(".hud .contextual").css("height: 50px!important;line-height: 14px!important;");
  } else {$("div.leftareainfo").remove();
  $(".hud .contextual").css("height: 32px;line-height: 14px!important;");}

  $("#lwg-prm-" + object.itemsellname + " .s_second").html(soldsecond.toFixed(2));
  $("#lwg-prm-" + object.itemsellname + " .s_minute").html(soldminute.toFixed(2));
  $("#lwg-prm-" + object.itemsellname + " .s_hour").html(soldhour.toFixed(2));
  $("#lwg-prm-" + object.itemsellname + " .s_itemt").html(object.itemsellamt);



  });

  var arrayz = JSON.parse(jsonString);
    var lastElsale = arrayz[arrayz.length-1];
    let lwgsaleTime = new Date();
    console.log("Sold "+lastElsale.itemsellamt,lastElsale.itemsellname);
    $('#saleLog').prepend('<p style="font-size:18px;color:black;">'+lwgsaleTime.getDate()+'/'+(lwgsaleTime.getMonth()+1)+'/'+lwgsaleTime.getFullYear()+' '+lwgsaleTime.getHours()+':'+(lwgsaleTime.getMinutes()<10?'0':'') + lwgsaleTime.getMinutes()+':'+(lwgsaleTime.getSeconds()<10?'0':'') + lwgsaleTime.getSeconds()+' - Sold '+lastElsale.itemsellamt+' '+lastElsale.itemsellname+'</p>');
}
//end log of sold items

        clearTimeout(tradeTimeout);

                  } else {
                      console.log('Whoops! You have run out of gas.');
                      document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
                      document.querySelector('.container > .trade .close-button').click();
                  }
              }
            }
//          }
      }
    }
}
// normal autosell
if (document.getElementById("auto-dragon").checked == false && Game.town.GetStoredCrafts()['Gasoline'] >= 1) {
  var craftedItems =JSON.parse(document.getElementById("configTxt").value);
    for (let i=0, n=craftedItems.length; i < n; i++) {
      //experimental break action
      if(document.getElementById("auto-selling").checked == false){
        break;
      } else {

      if(Game.town.GetStoredCrafts()['Gasoline'] >= craftedItems[i].gasMin){
        if (Game.town.GetStoredCrafts()[craftedItems[i].item] >= craftedItems[i].sellMin) {
            let targetTradeObj;
            if (Game.town.GetStoredCrafts()[craftedItems[i].item] >= 100 && craftedItems[i].sellMin >= 100) {
                targetTradeObj = GetAvailableTradeObject(100);
                var loadeditems = '100';
            }
            if (!targetTradeObj && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 50 && craftedItems[i].sellMin >= 50){
                targetTradeObj = GetAvailableTradeObject(50);
                var loadeditems = '50';
            }
            if (!targetTradeObj && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 10 && craftedItems[i].sellMin >= 10){
                targetTradeObj = GetAvailableTradeObject(10);
                var loadeditems = '10';
            }
            if (targetTradeObj){
                CloseWindows(document.querySelectorAll('body > .container > .player-confirm .dialog-cell'), false);
                CloseWindows(document.querySelectorAll('.container > div:not(.hud):not(.player-confirm)'), true);
                Game.town.selectObject(targetTradeObj);
                Game.app.fire('SellClicked', {x: targetTradeObj.townX, z: targetTradeObj.townZ});
                await WaitForCompletion('.LoadingOrders');
                document.querySelector('#trade-craft-target [data-name="' + craftedItems[i].item + '"]').click();
                // seling log
                if(strSellingData.length > 0){
                strSellingData = "";
                }
//                  strSellingData += "SELLING ("+loadeditems+") " + craftedItems[i].item + "! \n" ;
//                  console.log(strSellingData);


            await WaitForTradeLoad(targetTradeObj);

                if (Game.town.GetStoredCrafts()['Gasoline'] >= Game.app.root.findByName('TradeUi').script.trade.cityPaths[0].gasCost) {
                    document.querySelector('#destination-target .destination .sell-button').click();
                    let tradeTimeout = setTimeout(function(){
        document.querySelector('.trade-connection .no').click();
      },25000);



//cancel button disabling auto-sell
$(".trade-connection").find(".no").on("click", CheckCancelbutton);

function CheckCancelbutton() {
play();
$( ".startSelling").prop('checked', false);
localStorage.setItem("startSelling",false);
console.log('Auto-Sell Has been disabled. Please re-enable it manualy via script menu');
document.getElementById("overlay").style.display = "block";
// start timer
if (($("#overlay").is(':visible'))) {
var counter = getautoselltime;
var interval = setInterval(function() {
    counter--;
    // Display 'counter' wherever you want to display it.
    if (counter <= 0 && crossClicked == false) {
      crossClicked = false;
         clearInterval(interval);
        $('#time').html("<h3>Auto-Sell Restart in progress</h3>");
        $( ".startSelling").prop('checked', true);
        localStorage.setItem("startSelling",true);
        $("#overlay").hide();
        return;
    }else{
      crossClicked = false;
      $("#overlay").click(function(){
        crossClicked = true;
        clearInterval(interval);
        $( ".startSelling").prop('checked', false);
        localStorage.setItem("startSelling",false);
        return;
      });
      $('#time').html(counter);
      console.log("Auto-Sell Restart Timer --> " + counter);
    }
}, 1000);
}
// end timer


//document.querySelector('#autosell-status .bank').textContent = 'LWG TS v.'+versionLWG+' Auto-Sell Disabled';
}

await WaitForCompletion('.trade-connection .compass');


//start log of sold items
if(document.getElementById("auto-selling").checked == true) {
class Personalsale {
  constructor(itemsellname, itemsellamt) {
    this.itemsellname = itemsellname;
    this.itemsellamt = itemsellamt;
    this.fullname = function () {
      return (`${this.itemsellname} ${this.itemsellamt}`);
    };
  }
}


/* store object into array */
aData.push(new Personalsale(craftedItems[i].item, parseInt(loadeditems)));

/* convert array of object into string json */
var jsonString = JSON.stringify(aData);
//console.log(jsonString)


var resMap = new Map();

aData.map((x) => {
if (!resMap.has(x.itemsellname))
resMap.set(x.itemsellname, x.itemsellamt);
else
resMap.set(x.itemsellname, (x.itemsellamt + resMap.get(x.itemsellname)));
})
resMap.forEach((value, key) => {
outputd.push({
itemsellname: key,
itemsellamt: value
})
})


var jsonStringz = JSON.stringify(outputd);

var array = JSON.parse(jsonStringz);



array.forEach(function(object) {


let diff = new Date() - lwgtimeStart;
var soldsecond = object.itemsellamt / ( diff / 1000 );
var soldminute = object.itemsellamt / ( diff / 60000 );
var soldhour = object.itemsellamt / ( diff / 3600000 );


let startLeftinfoBox = JSON.parse(localStorage.getItem("startLeftProdInfo"));
if(startLeftinfoBox === true  ){
$(".hud .contextual").css("height: 50px!important;line-height: 14px!important;");
} else {$("div.leftareainfo").remove();
$(".hud .contextual").css("height: 32px;line-height: 14px!important;");}

$("#lwg-prm-" + object.itemsellname + " .s_second").html(soldsecond.toFixed(2));
$("#lwg-prm-" + object.itemsellname + " .s_minute").html(soldminute.toFixed(2));
$("#lwg-prm-" + object.itemsellname + " .s_hour").html(soldhour.toFixed(2));
$("#lwg-prm-" + object.itemsellname + " .s_itemt").html(object.itemsellamt);



});

var arrayz = JSON.parse(jsonString);
var lastElsale = arrayz[arrayz.length-1];
let lwgsaleTime = new Date();
console.log("Sold "+lastElsale.itemsellamt,lastElsale.itemsellname);
$('#saleLog').prepend('<p style="font-size:18px;color:black;">'+lwgsaleTime.getDate()+'/'+(lwgsaleTime.getMonth()+1)+'/'+lwgsaleTime.getFullYear()+' '+lwgsaleTime.getHours()+':'+(lwgsaleTime.getMinutes()<10?'0':'') + lwgsaleTime.getMinutes()+':'+(lwgsaleTime.getSeconds()<10?'0':'') + lwgsaleTime.getSeconds()+' - Sold '+lastElsale.itemsellamt+' '+lastElsale.itemsellname+'</p>');

}
//end log of sold items

      clearTimeout(tradeTimeout);

                } else {
                    console.log('Whoops! You have run out of gas.');
                    document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
                    document.querySelector('.container > .trade .close-button').click();
                }
            }
          }
      }
    }
  }
} else {
  if (document.getElementById("auto-dragon").checked == true) {}
  else {
    console.log('Whoops! You have run out of gas.');
    document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
  }
}
}
setTimeout(CheckCrafts, getautoselltime);

}


//end of auto-sell


// start of new left sidebar monitor
function GetLeftDataInfo() {

var infoarr = [ 'Blue_Steel', 'Cake', 'Baguette', 'Pinot_Noir', 'Pumpkin_Pie', 'Batter', 'Steel', 'Cabernet_Sauvignon', 'Uniforms', 'Candy_Canes', 'Dough', 'Chardonnay', 'Wool_Yarn', 'Butter', 'Wine_Bottle', 'Oak_Barrel', 'Chromium', 'Iron', 'Limestone', 'Wool', 'Milk', 'Cotton_Yarn', 'Sugar', 'Pinot_Noir_Grapes', 'Salt', 'Flour', 'Jet_Fuel', 'Cabernet_Grapes', 'Eggs', 'Gasoline', 'Lumber', 'Pumpkin', 'Silica', 'Chardonnay_Grapes', 'Peppermint', 'Petroleum', 'Sugarcane', 'Cotton', 'Feed', 'Brine', 'Wheat', 'Oak_Wood', 'Wood', 'Energy', 'Crude_Oil', 'Water_Drum','Chocolate_Bar', 'Fancy_Cake', 'Decorated_Cake', 'Strawberries', 'Chocolate_Covered_Strawberries', 'Cocoa' ];



if(lwgtimeStart == false){
  return;
}

      // start interval if not already started
      if(lwgtimeStart == true){

for(let i=0, n=infoarr.length; i < n; i++) {


  $('.hud-craft-display-'+infoarr[i]).find('.contextual').prepend('<div id="choseninventory-'+infoarr[i]+'" class="choseninventory-'+infoarr[i]+'" style="width:40px"></div>');
  $('#choseninventory-'+infoarr[i]).append('<input type="checkbox" id="filter-inventory-'+infoarr[i]+'" class="lwg saveButtonl" style="width: 18px; height: 18px;">');
  setInterval(function(){
//      document.getElementById("filter-inventory-"+infoarr[i]).checked

  if ($("#filter-inventory-"+infoarr[i]+":checked" ).length){
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').css("height", "fit-content");
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').removeClass('wide30');
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').removeClass('showleft');

      if($('.lwg-prod-window-'+infoarr[i]).length === 0){

        $('.hud-craft-display-'+infoarr[i]).find('.contextual').append('<div style="margin-right:20px;left:10px;line-height: 14px" class="lwg-prod-window-'+infoarr[i]+' leftareainfo"></div>');
        $('.lwg-prod-window-'+infoarr[i]).append('<p class="salep-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>S:</b> 0.00/s | 0.00/m | 0.00/h</p>');
        $('.lwg-prod-window-'+infoarr[i]).append('<p class="prodd-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>P:</b> 0.00/s | 0.00/m | 0.00/h</p>');
      }
        var num = 0;
        //produce area
        let p_secondleft = $("#lwg-prm-"+infoarr[i]+" .p_second").text();
        let p_minuteleft = $("#lwg-prm-"+infoarr[i]+" .p_minute").text();
        let p_hourleft = $("#lwg-prm-"+infoarr[i]+" .p_hour").text();

        if(p_secondleft === ''){ p_secondleft = num.toFixed(2); }
        if(p_minuteleft === ''){ p_minuteleft = num.toFixed(2); }
        if(p_hourleft === ''){ p_hourleft = num.toFixed(2); }

        $('.prodd-'+infoarr[i]).replaceWith('<p class="prodd-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>P:</b> '+ p_secondleft +'/s | '+ p_minuteleft +'/m | '+ p_hourleft +'/h</p>');
        //sale area
        let s_secondleft = $("#lwg-prm-"+infoarr[i]+" .s_second").text();
        let s_minuteleft = $("#lwg-prm-"+infoarr[i]+" .s_minute").text();
        let s_hourleft = $("#lwg-prm-"+infoarr[i]+" .s_hour").text();

        if(s_secondleft === ''){ s_secondleft = num.toFixed(2); }
        if(s_minuteleft === ''){ s_minuteleft = num.toFixed(2); }
        if(s_hourleft === ''){ s_hourleft = num.toFixed(2); }

        $('.salep-'+infoarr[i]).replaceWith('<p class="salep-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>S:</b> '+ s_secondleft +'/s | '+ s_minuteleft +'/m | '+ s_hourleft +'/h</p>');
  } else {
    $('.lwg-prod-window-'+infoarr[i]).remove();
    $('.salep-'+infoarr[i]).remove();
    $('.prodd-'+infoarr[i]).remove();
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').css("height", "");
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').addClass('wide30');
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').addClass('showleft');
  }
},1000);



setInterval(function(){

    let startLeftinfoBox = JSON.parse(localStorage.getItem("startLeftProdInfo"));
  if(startLeftinfoBox === false  ){
//          $("div.leftareainfo").remove();
    //$('.hud .contextual').removeClass('fiftypxclass');
    $('#hud-craft-target').removeClass('pointerev');
    $("#choseninventory-"+infoarr[i]).hide();
    $('.lwg-prod-window-'+infoarr[i]).hide();
    $('.salep-'+infoarr[i]).hide();
    $('.prodd-'+infoarr[i]).hide();
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').removeClass('wide30');
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').removeClass('showleft');

  } else {
    //$('.hud .contextual').addClass('fiftypxclass');
    //$('#hud-craft-target').addClass('pointerev');
    $("#choseninventory-"+infoarr[i]).show();
    $("#choseninventory-"+infoarr[i]).addClass('pointerev');
    $(".lwg-prod-window-"+infoarr[i]).addClass('pointerevnone');
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').addClass('wide30');
    $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').addClass('showleft');
    $('.lwg-prod-window-'+infoarr[i]).show();
    $('.salep-'+infoarr[i]).show();
    $('.prodd-'+infoarr[i]).show();




    if (Game.town.GetStoredCrafts()[infoarr[i]] >= 1 && $('#choseninventory-'+infoarr[i]).length == 0 ) {

        $('.hud-craft-display-'+infoarr[i]).find('.contextual').prepend('<div id="choseninventory-'+infoarr[i]+'" class="choseninventory-'+infoarr[i]+'" style="width:40px"></div>');
        $('#choseninventory-'+infoarr[i]).append('<input type="checkbox" id="filter-inventory-'+infoarr[i]+'" class="lwg saveButtonl" style="width: 18px; height: 18px;">');

          if ($("#filter-inventory-"+infoarr[i]+":checked" ).length){
            $('.hud-craft-display-'+infoarr[i]).find('.contextual').css("height", "fit-content");
            $('.hud-craft-display-'+infoarr[i]).find('.contextual').removeClass('wide30');
            $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').removeClass('showleft');

              if($('.lwg-prod-window-'+infoarr[i]).length === 0){

                  $('.hud-craft-display-'+infoarr[i]).find('.contextual').append('<div style="margin-right:20px;left:10px;line-height: 14px" class="lwg-prod-window-'+infoarr[i]+' leftareainfo"></div>');
                  $('.lwg-prod-window-'+infoarr[i]).append('<p class="salep-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>S:</b> 0.00/s | 0.00/m | 0.00/h</p>');
                  $('.lwg-prod-window-'+infoarr[i]).append('<p class="prodd-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>P:</b> 0.00/s | 0.00/m | 0.00/h</p>');
              }

                  var num = 0;
                  //produce area
                  let p_secondleft = $("#lwg-prm-"+infoarr[i]+" .p_second").text();
                  let p_minuteleft = $("#lwg-prm-"+infoarr[i]+" .p_minute").text();
                  let p_hourleft = $("#lwg-prm-"+infoarr[i]+" .p_hour").text();

                  if(p_secondleft === ''){ p_secondleft = num.toFixed(2); }
                  if(p_minuteleft === ''){ p_minuteleft = num.toFixed(2); }
                  if(p_hourleft === ''){ p_hourleft = num.toFixed(2); }

                  $('.prodd-'+infoarr[i]).replaceWith('<p class="prodd-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>P:</b> '+ p_secondleft +'/s | '+ p_minuteleft +'/m | '+ p_hourleft +'/h</p>');
                  //sale area
                  let s_secondleft = $("#lwg-prm-"+infoarr[i]+" .s_second").text();
                  let s_minuteleft = $("#lwg-prm-"+infoarr[i]+" .s_minute").text();
                  let s_hourleft = $("#lwg-prm-"+infoarr[i]+" .s_hour").text();

                  if(s_secondleft === ''){ s_secondleft = num.toFixed(2); }
                  if(s_minuteleft === ''){ s_minuteleft = num.toFixed(2); }
                  if(s_hourleft === ''){ s_hourleft = num.toFixed(2); }

                  $('.salep-'+infoarr[i]).replaceWith('<p class="salep-'+infoarr[i]+'" style="text-align: left;font-size:18px;"><b>S:</b> '+ s_secondleft +'/s | '+ s_minuteleft +'/m | '+ s_hourleft +'/h</p>');


        } else {
          $('.lwg-prod-window-'+infoarr[i]).remove();
          $('.salep-'+infoarr[i]).remove();
          $('.prodd-'+infoarr[i]).remove();
          $('.hud-craft-display-'+infoarr[i]).find('.contextual').css("height", "");
          $('.hud-craft-display-'+infoarr[i]).find('.contextual').addClass('wide30');
          $('.hud-craft-display-'+infoarr[i]).find('.contextual').find('hud-craft-amount').addClass('showleft');


        }
    }
  }
  },1000);
  }
  const foozy = document.querySelector('#hud-craft-target')
  foozy.addEventListener('wheel', (event) => { event.stopPropagation();});
  foozy.addEventListener('mousedown', (event) => { event.stopPropagation();});
  foozy.addEventListener('mouseup', (event) => { event.stopPropagation();});

}else{}

//leftinfoceheckbox saving
// LOCALSTORAGE SAVING JSON
setInterval(function(){
$('input.saveButtonl:checkbox').on('change', function(e) {
var checkboxId = $(this).attr('id');
if ($(this).is(":checked")) {
localStorage.setItem(checkboxId, 1);
} else {
localStorage.removeItem(checkboxId);
}
});

for (var i = 0, len = localStorage.length; i < len; i++) {
var key = localStorage.key(i);
var value = localStorage[key];
if (value == 1) {
$('#' + key).attr("checked", "checked");
}
}
},1000);
}
// end of new left sidebar monitor
async function CheckComplete() {

var AutoCompleteCheckBox = document.getElementById("auto-complete");
if (AutoCompleteCheckBox.checked == true) {
let ConstructionSiteArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Construction_Site' );
for(let i=0, n=ConstructionSiteArray.length; i < n; i++){
  if(ConstructionSiteArray[i].logicObject.data.state == "Complete"){
      if( Game.objectData[ConstructionSiteArray[i].logicObject.data.type].LaborCost >= 0){
               ConstructionSiteArray[i].logicObject.OnTapped();
              $('.menu').find('.menu-craft').css("display", "none");
              $('.menu').find('.menu-sell').css("display", "none");
              $('.menu').find('.menu-flush').css("display", "none");
              $('.menu').find('.menu-rotate').css("display", "none");
              $('.menu').find('.menu-nuketown').css("display", "none");
              $('.menu').find('.menu-jimmy').css("display", "none");
              $('.menu').find('.menu-jimmy-cancel').css("display", "none");
              $('.menu').find('.menu-progress').css("display", "none");
              $('.menu').find('.menu-returntree').css("display", "none");
              $('.menu').find('.npc').css("display", "none");
              $('.menu').find('.menu-remove').css("display", "none");
              $('.menu').find('.menu-upgrade').css("display", "none");
      }
  }

  }
}setTimeout(CheckComplete, 2000);
}

async function CheckAllskinsenabled() {

var SkinsCompleteCheckBox = document.getElementById("start-skins-settings");
if (SkinsCompleteCheckBox.checked == true) {
let tempskins = INVENTORY.skins
tempskins.forEach((n=>{
  n.skin === "Mirandus" && n.active != true && (n.active = true,
      Game.town.setSkin(n.object.Name, true ? n.skin : null, !1))
    })),
    true ? API.setUserData("skinSettings", SKINS) : API.setUserData("skinSettings", {})

}setTimeout(CheckAllskinsenabled, 5000);
}


  
//start money
//  async function SetStartMoney() {
//    await WaitForElement('.hud-currency');
//    var startValue = parseFloat($('.hud-currency').html().replace(/,/g, ''));
//    localStorage.setItem("startingMoney", startValue);
//   };
//
//   var num = 0;
//    setInterval(function(){
//
//      if ( $('.lwg-moneygain').length > 0){
//        $('.lwg-moneygain').remove;
//      }
//      else
//      {
//      $('.cash').append('<p class="lwg-moneygain" style="text-align: left;font-size:18px;"> 0/s | 0/m | 0/h</p>');
//      }
//      let laborcost = parseFloat($('.hud-labor-costs').text().replace(/,/g, ''));
//      let startingMoney = localStorage.getItem("startingMoney");
//      let newmoney = parseFloat($('.hud-currency').text().replace(/,/g, ''));
//      let calculateexpenses = (+startingMoney + +laborcost);
//      let diffmoney = Math.floor(newmoney - calculateexpenses);
//
//      //let d = new Date(diff);
//
//      var moneysecond = (diffmoney / 60).toFixed(2);
//      var moneyminute = (diffmoney).toFixed(2);
//      var moneyhour = (diffmoney * 60).toFixed(2);
//
//      if(moneysecond === ''){ moneysecond = num; }
//      if(moneyminute === ''){ moneyminute = num; }
//      if(moneyhour === ''){ moneyhour = num; }
//
//
//      $('.lwg-moneygain').replaceWith('<p class="lwg-moneygain" style="text-align: left;font-size:18px;"><b>M:</b> '+ moneysecond +'/s | '+ moneyminute +'/m | '+ moneyhour +'/h</p>');
//    },1000);
// end money
// start current server




async function ActivateAutoSell() {

let autoSellStatus = document.createElement('div');
autoSellStatus.id = 'autosell-status';
autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 0;';
autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'LWG TS v.'+versionLWG+' Auto-Sell '+displayactivestatement;})
let autoSellContent = document.createElement('div');
autoSellContent.classList.add('bank');
autoSellContent.style.cssText = 'padding-left: 100px;padding-right: 10px;height:20px;margin: 2px 8px 10px 4px;';
autoSellContent.textContent = 'LWG TS v.'+versionLWG+' Auto-Sell '+displayactivestatement;
autoSellStatus.appendChild(autoSellContent);
await WaitForElement('.hud');
document.querySelector('.hud').prepend(autoSellStatus);
CheckCrafts();
GetLeftDataInfo();
//    SetStartMoney();
//    ChkLeftboxes();
CheckComplete();
CheckAllskinsenabled();


}

async function lwgActivateProductionMonitor(){
await WaitForElement('.hud-right');
lwgrun();




/**
 * Resets the tracked items, back to zero!
 */
 function lwgresetList(){
    console.clear();
    console.log("Production Monitor was reseted.");
    console.log(Date.now() + ' ---===LWG TS PLAYER v.'+versionLWG+' ===---');

    // remove existing ui
    $('#production-right').remove();
    $('#lwg-right-resetbox').remove();
    $('#lwg-prm-table').remove();


    // re-add ui
    lwgstartUI();

    // empty list
    lwglist = {};
    aData = [];
    outputd = [];
}

/**
 * Update item in lwglist
 * @param  {[type]} litem
 */
 function lwgupdateItem(litem){

    console.log( litem +" added");

    // increase count
    lwglist[litem].lwgcount++;

    // update minute/hour
    let lwgcount = lwglist[litem].lwgcount;
    let lwgfirst = lwglist[litem].lwgfirst;
    let lwgdiff = Date.now() - lwgfirst;

    lwglist[litem].lwgsecond = lwgcount / ( lwgdiff / 1000 );
    lwglist[litem].lwgminute = lwgcount / ( lwgdiff / 60000 );
    lwglist[litem].lwghour = lwgcount / ( lwgdiff / 3600000 );


}


/**
 * Add new item to tracked lwglist
 * @param  {[type]} litem
 */
 async function lwgnewItem(litem){

    //       console.log("lwgnewItem: " + litem);

           // add new default litem
           lwglist[litem] = {
               lwgcount: 1,
               lwgfirst: Date.now(),
               lwgsecond: 0,
               lwgminute: 0,
               lwghour: 0
           };

           // row's id
           let id = "lwg-prm-" + litem;

           // add new row to table


           let html = "<tr id='" + id + "'>";
           html += "<th rowspan='2' class='item'>" + litem + "</th>";
           html += "<td class='s_item'><b>S:</b></td>";
           html += "<td class='s_itemt' style='font-weight:bold'></td>";
           html += "<td class='s_second'></td>";
           html += "<td class='s_minute'></td>";
           html += "<td class='s_hour'></td>";
             html += "</tr>";
             html += "<tr id='" + id + "'>";
             html += "<td class='p_item' style='border-bottom:1px solid #2e435c;'><b>P:</b></td>";
             html += "<td class='p_itemt' style='font-weight:bold;border-bottom:1px solid #2e435c;'></td>";
             html += "<td class='p_second' style='border-bottom:1px solid #2e435c;'></td>";
             html += "<td class='p_minute' style='border-bottom:1px solid #2e435c;'></td>";
             html += "<td class='p_hour' style='border-bottom:1px solid #2e435c;'></td>";
             html += "</tr>";


           $('#lwg-prm-table').append(html);

           // clone image when available
           let image = await lwgcloneImageWhenAvailable('.hud-craft-display-' + litem);



           // copy image into my table
           $('#' + id + ' .item').html("").append(image);
           $('#' + id + ' .hud-craft-icon').css("width", 24);


           let sale_second = 0;
           let sale_minute = 0;
           let sale_hour = 0;
           let sale_count = 0;


           $("#lwg-prm-"  + litem +  " .s_second").html(sale_second.toFixed(2));
           $("#lwg-prm-"  + litem +  " .s_minute").html(sale_minute.toFixed(2));
           $("#lwg-prm-"  + litem +  " .s_hour").html(sale_hour.toFixed(2));
           $("#lwg-prm-"  + litem +  " .s_itemt").html(sale_count);

       }

       /**
        * Update the UI
        * @param  {[type]} litem
        */
       function lwgupdateUI(litem){

   //        console.log("lwgupdateUI: " + litem);

           let lwgcount = lwglist[litem].lwgcount;
           let lwgsecond = lwglist[litem].lwgsecond.toFixed(2);
           let lwgminute = lwglist[litem].lwgminute.toFixed(2);
           let lwghour = lwglist[litem].lwghour.toFixed(2);

           let p_secondx = lwgsecond;
           let p_minutex = lwgminute;
           let p_hourx = lwghour;

           // update ui

           $("#lwg-prm-" + litem + " .p_second").html(p_secondx);
           $("#lwg-prm-" + litem + " .p_minute").html(p_minutex);
           $("#lwg-prm-" + litem + " .p_hour").html(p_hourx);
           $("#lwg-prm-" + litem + " .p_itemt").html(lwgcount)

       }

       /**
        * Add elements to UI
        */
        async function lwgstartUI(){

           lwgaddTable();
           lwgaddoverlay();
           lwgaddRestartButton();
           lwgaddClock();
               // fix for zoom in out on scroll
               await WaitForElement('.production-right');
               const lwgrightfooz = document.querySelector('.production-right')
               lwgrightfooz.addEventListener('wheel', (event) => { event.stopPropagation();});
               lwgrightfooz.addEventListener('mousedown', (event) => { event.stopPropagation();});
               lwgrightfooz.addEventListener('mouseup', (event) => { event.stopPropagation();});

               await WaitForElement('#lwg-right-resetbox');
               const lwgrightfoozreset = document.querySelector('#lwg-right-resetbox')
               lwgrightfoozreset.addEventListener('wheel', (event) => { event.stopPropagation();});
               lwgrightfoozreset.addEventListener('mousedown', (event) => { event.stopPropagation();});
               lwgrightfoozreset.addEventListener('mouseup', (event) => { event.stopPropagation();});



             //Show hide right side area production monitor area
             await WaitForElement('#production-right');
             await WaitForElement('#lwg-right-resetbox');
             var productionlem = document.getElementById('production-right')
             var productionlemreset = document.getElementById('lwg-right-resetbox'),
             productionBox = document.getElementById('side-production-settings');
             productionBox.checked = JSON.parse(localStorage.getItem("startSideProduction"));
             productionBox.onchange = function productionlopc() {
               productionlem.style.display = this.checked ? 'block' : 'none';
               productionlemreset.style.display = this.checked ? 'block' : 'none';
             };
             productionBox.onchange();



             //Show hide right side area production monitor scrollbar area
             await WaitForElement('#production-right');
             var productionlemscrollbar = document.getElementById('production-right'),
             productionBoxscrollbar = document.getElementById('side-production-settings-scrollbar');
             productionBoxscrollbar.checked = JSON.parse(localStorage.getItem("startSideProductionScrollbar"));
             productionBoxscrollbar.onchange = function productionscrollbarlopc() {
               productionlemscrollbar.style.maxHeight = this.checked ? '332px' : 'none';
               productionlemscrollbar.style.overflowY = this.checked ? 'scroll' : 'hidden';
             };
             productionBoxscrollbar.onchange();



         }




       /**
        * Run!
        */
        function lwgrun() {

            lwgstartUI();



            // making a new class....
            class TrackUnitDeliverOutputTask extends UnitDeliverOutputTask {

                // overwrite the onArrive functionality
                onArrive() {

                    // make sure to do the original onArrive functionality
                    super.onArrive();

                    // let trackedItem = trackedItems.find(item => item.item.toUpperCase() == this.craft.toUpperCase())
                    let litem = this.craft;

                    // if we are already tracking the litem, update its values
                    if(lwglist[litem]){
                        lwgupdateItem(litem);

                    // else make it as a new litem
                    }else{
                        lwgnewItem(litem);

                    }

                    // then update the ui
                    lwgupdateUI(litem);
              }

            }

            // not gonna lie... not too sure what this is doing
            let origfindDeliverOutputTask = TS_UnitLogic.prototype.findDeliverOutputTask;
            TS_UnitLogic.prototype.findDeliverOutputTask = function(t) {

                // this method gets called when someone picks up something or drops it off?
                let origReturn = origfindDeliverOutputTask.call(this, t);
                return origReturn ? new TrackUnitDeliverOutputTask(origReturn.unit,origReturn.targetObject,t) : null

            }



        }

        /**
         * Add table HTML
         */
         function lwgaddTable(){
            let html = "<div id='production-right' class='production-right' style='max-height:332px;overflow-y: scroll;margin-right:10px;margin-top:5px;'>";
                    html += "<table id='lwg-prm-table'>";
                        html += "<tr>";
                            html += "<td>Item</td>";
                            html += "<td></td>";
                            html += "<td></td>";
                            html += "<td>sec</td>";
                            html += "<td>min</td>";
                            html += "<td>hour</td>";
                        html += "</tr>";
                    html += "</table>";
                html += "</div>";
                $('.hud-right').after(html);

                // add some simple css to the table
                $("#lwg-prm-table").css({
                    'border':'4px solid #ccc',
                    'background-color':'#fff',
                    'width':'99%',
                    'margin-top':'2px',
                    'border-radius':'5px',
                    'opacity':'0.8',
                    'border-spacing':'5px',
                    'line-height' :'12px',
                    'border-collapse':'separate',
                });

            }


            /**
             * Add   Text
             */
            function lwgaddoverlay(){
              let htmlzx = "<div id='overlay' style='display:none;'>";
                  htmlzx += "<div id='calceltext'><b>User Action on Cancel Trade Button disabled Auto-Sell</b><br><span style='font-size:22px;'>***Please open menu and activate it again when done with sale settings***</span></br><span style='font-size:16px;color:yellow;font-weight:bold;'>click anywhere to close this message</span></br><div><span id='timer'><span id='time'>15</span> Seconds remaining until auto-sell restarts</span></div></div>"
                  $('body').after(htmlzx);

              }
            // Toggle div display
            await WaitForElement('#overlay');
            $("#overlay").click(function(){
              crossClicked = true;
              $("#overlay").hide();
          });








            /**
             * Add restart button HTML
             */
            function lwgaddRestartButton(){

                // add button with listener
                let html = '<div id="lwg-right-resetbox"><button id="lwg-prm-reset"/>Reset</button></div>';
                $('#production-right').after(html);

                // bind function
                $("#lwg-prm-reset").click(lwgresetList);

                // add some simple css to the button
                $("#lwg-prm-reset").css({
                    'width':'92%',
                    'padding':'10px',
                    'margin-top':'10px',
                    'border-radius':'5px',
                    'border':'solid 1px #ccc'
                });



            }

            /**
             * Add on screen clock to the reset button
             */
            function lwgaddClock(){

                // don't do any on screen clock if time is set to false
                if(lwgtimeStart == false){
                    return;
                }

                // start interval if not already started
                if(lwgtimeStart == true){

                    // update lwgtimeStart
                    lwgtimeStart = Date.now();

                    // every 1 second, update the on screen timer
                    // Note: this might not be the most efficient way to do this
                    setInterval(function(){

                        let lwgdiff = new Date() - lwgtimeStart;
                        let lwgd = new Date(lwgdiff);
                        var diffInHours = Math.floor(Math.abs(lwgdiff) / 36e5);
                        let lwghours = lwgformatTwoDigits(diffInHours); //fix for 00 display
                        let lwgminutes = lwgformatTwoDigits(lwgd.getMinutes());
                        let lwgseconds = lwgformatTwoDigits(lwgd.getSeconds());
                        let lwgstring = "Reset : " + lwghours + ":" + lwgminutes + ":" + lwgseconds;

                        $('#lwg-prm-reset').html(lwgstring);

                    },1000);
        //            console.clear();
                    console.log(Date.now() + ' ---===ACTIVATING LWG TS PLAYER v.'+versionLWG+' ===---');

                }else{

                    // update lwgtimeStart
                    lwgtimeStart = Date.now();

                }

            }

            ////////////
            // UTLITY //
            ////////////

            /**
             * Clone and return image when available
             * @param  {[type]} selector [description]
             */
            async function lwgcloneImageWhenAvailable(selector) {

                while (!$(selector).find('img').length) {
                    await new Promise( r => setTimeout(r, 1000) )
                }

                let lwgimage = $(selector).find('img').clone();

                return lwgimage;

            }


            /**
             * This method helps to format a string of two digits.
             * In case the given number is smaller than 10, it will add a leading zero,
             * e.g. 08 instead of 8
             * @param {Number} n - a number with one or two digits
             * @returns {String} String with two digits
             */
            function lwgformatTwoDigits(n) {
                return n < 10 ? '0' + n : n;
            }
        }


    //**product rate in game  Anfang**//

    'use strict';
    let loaded2 = 0;

    let scoreObserver = new MutationObserver(function(mutations) {
        if (document.querySelector('.hud .right .hud-right') && loaded2 == 0) {
            loaded2 = 1;
            scoreObserver.disconnect();
            LoadPlayerScores();
        }
    });

    scoreObserver.observe(document, {childList: true, subtree: true});

    const playerScores = { startTime: Date.now(), startScore: 0, pph: 0, lastHrTime: Date.now(), lastHrScore: 0, lastHrpph: 0};

    function LoadPlayerScores() {
        playerScores.startScore = GetPlayerScores();
        playerScores.lastHrScore = playerScores.startScore;
        let scoresContainer = document.createElement('div');
        scoresContainer.id = 'player-scores-container';
        scoresContainer.style = 'display: flex;}';
        let scoresElem = document.createElement('div');
        scoresElem.id = 'player-scores-monitor';
        scoresElem.classList.add('PSMbox1', 'PSMbox2');
        scoresElem.style = 'border: 4px solid rgb(204, 204, 204);background-color: rgb(255, 255, 255);width: 99%;border-radius: 5px;opacity: 0.8;padding: 5px;margin-right: 20px;text-align: right;padding-right: 45px;font-size: 16px;}';
        scoresElem.textContent = '<div class="syncIcon"></div>';// reset knopf
        scoresContainer.appendChild(scoresElem);
        let resetScoresButton = document.createElement('div');
        resetScoresButton.id = 'reset-scores';
        resetScoresButton.classList.add('PSMbox1');
        resetScoresButton.style = 'border:solid 2px black; border-radius:200px; position:absolute !important; top:140px!important; right:29px!important; background:#060606a1; cursor: pointer;opacity: 0.8;}';
        resetScoresButton.textContent = '';
        resetScoresButton.onclick = function() { ResetScores(); };
        scoresContainer.appendChild(resetScoresButton);
        let hudRight = document.querySelector('.hud .right .hud-right');
        hudRight.insertBefore(scoresContainer, hudRight.querySelector('.right-hud').nextSibling);
        CheckPlayerScores();
        GenerateServerName();
//hover function
        $('#reset-scores').hover(function() {
            $(this).css("background", "#fff");
        }, function () {
            $(this).css("background", "#00000000");
        });
//hover function
    }

      function GenerateServerName() {
        let rank = document.createElement('div');
        rank.id = 'player-server-rank';
        rank.style = 'font-size: 18px;text-align: center !important;height:20px !important;opacity: 0.8;border: 4px solid rgb(204, 204, 204);background-color: rgb(255, 255, 255);border-radius: 5px;margin-right: 20px;margin-top: 5px;}';
        rank.textContent = '';
        const leaderboardImage = document.querySelector('#player-scores-container');
        leaderboardImage.parentNode.insertBefore(rank, leaderboardImage);
        getServerName();
      }

    async function getServerName()  {
      await API.getGames();
      let userRankServer = Game.gameData.name;
      let pserverElement = document.getElementById('player-server-rank');
      pserverElement.innerHTML = '<span>CS:<b> '+ userRankServer + '</b></span>';
    }

    function GetPlayerScores() {
        return parseInt(document.getElementsByClassName('hud-points')[0].innerText.replace(/[^0-9]/g,''));
    }

    function ResetScores() {
        playerScores.startTime = Date.now();
        playerScores.startScore = GetPlayerScores();
        playerScores.pph = 0;
        playerScores.lastHrTime = playerScores.startTime;
        playerScores.lastHrScore = playerScores.startScore;
        playerScores.lastHrpph = 0;
        SetPlayerScores(0);
    }

    function CheckPlayerScores() {
        let playerScore = GetPlayerScores();
        let timeDiff = Date.now() - playerScores.startTime;
        playerScores.pph = (playerScore - playerScores.startScore) / (timeDiff / 3600000);
        let lastHrDiff = Date.now() - playerScores.lastHrTime;
        if (lastHrDiff > 3600000) {
            playerScores.lastHrpph = (playerScore - playerScores.lastHrScore) / (lastHrDiff / 3600000);
            playerScores.lastHrTime = Date.now();
            playerScores.lastHrScore = playerScore;
        }
        SetPlayerScores(timeDiff);
        setTimeout(CheckPlayerScores, 60000);
    }

    function SetPlayerScores(timeDiff) {
        document.getElementById('player-scores-monitor').innerHTML = playerScores.pph.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' /h [' + (timeDiff / 3600000).toFixed(2) + ' hrs]<br>' + playerScores.lastHrpph.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' /h [last hr]';
    }

        //**product rate in game  ENDE**//

// GROOVY POINTS/H LEADERBOARD
function LoadLWGLeaderboard() {
document.querySelector('.leaderboard').addEventListener('click', e => {
    if (e.target.closest('.player')) {
        let targetTownName = e.target.closest('.player').querySelector('.name').innerHTML;
        let targetTown = Object.values(Game.world.towns).filter(function(el){return el.name == targetTownName})[0];
        let worldPos = Game.world.GetWorldPositionFromMapIndex(targetTown.x, targetTown.y);
        Game.app.root.findByName('CameraWorld').script.cameraController.SetPosition(worldPos.x, worldPos.z);
        document.querySelector('.leaderboard .close-button').click();
        if (HUD.instance && HUD.instance.activeView == 'Town') {Game.app.fire('SetWorldView')};
        Game.app.root.findByName('CameraWorld').script.cameraController.Tap({x: (window.innerWidth/2), y: (window.innerHeight/2)});    
    }
});
}

async function CheckLWGLeaderboard() {
API.scoreLeaderboard(0, 500).then(leaders=>{
    for (let i=0, n=leaders.length; i < n; i++) {
        let tracker = leaderTracker.find(leader => leader.userId == leaders[i].userId)
        if (tracker) {
            let timeDiff = Date.now() - tracker.startTime;
            tracker.pph = (leaders[i].score - tracker.startScore) / (timeDiff / 3600000);
            tracker.rank = leaders[i].rank;
            let lastHrDiff = Date.now() - tracker.lastHrTime;
            if (lastHrDiff > 3600000) {
                tracker.lastHrpph = (leaders[i].score - tracker.lastHrScore) / (lastHrDiff / 3600000);
                tracker.lastHrTime = Date.now();
                tracker.lastHrScore = leaders[i].score;
            }
        } else {
            leaderTracker.push({userId: leaders[i].userId, name: leaders[i].name, rank: leaders[i].rank, startTime: Date.now(), startScore: leaders[i].score, pph: 0, lastHrTime: Date.now(), lastHrScore: leaders[i].score, lastHrpph: 0});
        }
    }
    InsertLWGTrackedLeaders()
    setTimeout(CheckLWGLeaderboard, 60000);
});
}

function InsertLWGTrackedLeaders() {
for (let i=0, n=leaderTracker.length; i < n; i++) {
    if (document.querySelector('.leaderboard-portrait-' + leaderTracker[i].userId)) {
        let trackedLeaderElem = document.querySelector('#tracked-leader-' + leaderTracker[i].userId);
        let trackedLeaderText;
        if (!trackedLeaderElem) {
            trackedLeaderElem = document.createElement('div');
            trackedLeaderElem.id = 'tracked-leader-' + leaderTracker[i].userId;
            trackedLeaderText = document.createElement('div');
            trackedLeaderText.classList.add('bank');
            trackedLeaderText.style.fontSize = '18px';
            trackedLeaderText.style.padding = '4px 8px';
            trackedLeaderElem.appendChild(trackedLeaderText);
            let targetLeader = document.querySelector('.leaderboard-portrait-' + leaderTracker[i].userId)
            targetLeader.insertBefore(trackedLeaderElem, targetLeader.querySelector('.score'));
        } else {
            trackedLeaderText = trackedLeaderElem.querySelector('div');
        }
        let timeDiff = Date.now() - leaderTracker[i].startTime;
        trackedLeaderText.innerHTML = leaderTracker[i].pph.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' /Hour [' + (timeDiff / 3600000).toFixed(2) + 'hrs]<br>' + leaderTracker[i].lastHrpph.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' /Hour [last hr] ';
//                var searchvalue = 'LWG';
//                $(".button-lwg").on('click', function(){
//                    var matcher = new RegExp(searchvalue, 'gi');
//                    $('.leaderboard-portrait-' + leaderTracker[i].userId).show().not(function(){
//                        return matcher.test($(this).find('.name').text())
//                    }).hide();
//                  });
    }
}
}
//    async function AddLWGoptions() {
//        $('.footer-row').find('.tab-buttons').append('<button class="tab button-lwg"><span>Only LWG Members</span></button>');

//    }
async function ActivateLeaderTracker() {
CheckLWGLeaderboard();
Game.app.on("LeaderboardUI-Loaded", t=>{InsertLWGTrackedLeaders()});

}

// ranking profile
'use strict';

let loaded4 = 0;

let rankObserver = new MutationObserver(function(mutations) {
  if (document.querySelector('.hud .hud-right .right-hud .leaderboard') && loaded4 == 0) {
      loaded4 = 1;
      rankObserver.disconnect();
      activateDisplayRank();
  }
});

async function getRank() {
  const user = await API.getGameSelf();
  //** Oizys edited start
  // console.log(user);
  //** Oizys edited end
  const userRank = parseInt(user.pointsRank);
  //** Oizys edited start
  // console.log(userRank);
  //** Oizys edited end
  if (userRank > 0) {
      let rankElement = document.getElementById('player-personal-rank');
      rankElement.innerHTML = '<span style="font-size:18px;">Rank</span><b> '+ userRank + '</b>';
      let fontSize = 20;
      if (userRank > 999) {
          fontSize = 18;
      }
      rankElement.style.fontSize = fontSize + 'px';
  }
  setTimeout(getRank, 30000);
}

function activateDisplayRank() {
  let rank = document.createElement('div');
  rank.id = 'player-personal-rank';
  rank.style = 'font-size: 20px;min-width: 50px !important;text-align: center !important;height:54px !important;opacity: 0.8;border: 4px solid rgb(204, 204, 204);background-color: rgb(255, 255, 255);padding-left: 5px;padding-right: 5px;border-radius: 5px;margin-right: -3px;}';
  rank.textContent = '';
  const leaderboardImage = document.querySelector('#player-scores-monitor');
  leaderboardImage.parentNode.insertBefore(rank, leaderboardImage);
  getRank();
}

rankObserver.observe(document, {childList: true, subtree: true});
// end of ranking

async function CheckDarkMode() {
  await WaitForElement('.hud');
  var DarkCheckBox = localStorage.getItem('startDarkmode');
  if (DarkCheckBox == 'true') {
//main window
GM_addStyle(".bank { background-color: rgba(0,0,0,.63)!important}");
GM_addStyle(".bank { color: white!important}"); 
GM_addStyle(".hud h3 {color: #fff!important;text-shadow: 2px 2px 8px #000!important; }"); 
GM_addStyle(".hud .contextual { background-color: rgba(0,0,0,.63)!important}");  
GM_addStyle("#player-personal-rank { opacity: none!important;border: 4px solid transparent!important;background-color: rgba(0,0,0,.63)!important;color: white!important}");
GM_addStyle("#player-scores-monitor { opacity: none!important;border: 4px solid transparent!important;background-color: rgba(0,0,0,.63)!important;color: white!important}");
GM_addStyle("#player-server-rank { opacity: none!important;border: 4px solid transparent!important;background-color: rgba(0,0,0,.63)!important;color: white!important}");
GM_addStyle("#lwg-prm-table { opacity: none!important;border: 4px solid transparent!important;background-color: rgba(0,0,0,.63)!important;color: white!important}");
GM_addStyle("#lwg-prm-reset { border: 1px solid transparent!important;background-color: rgba(0,0,0,.63)!important;color: white!important}");
GM_addStyle(".hud .top .cell { background: linear-gradient(90deg,#000 0,rgba(255,255,255,.2763480392) 67%,rgba(255,255,255,0) 100%)!important}");
GM_addStyle(".hud .top .right-hud { background: linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2763480392) 45%,#000 100%)!important;width: auto!important;margin-right: 10px!important;}");
GM_addStyle(".progress-container .progress { background:  rgba(0,0,0,.3)!important;color:#FFF!important}");
GM_addStyle(".stroke {-webkit-filter: drop-shadow(3px 3px 0 #000) drop-shadow(-3px 3px 0 #000) drop-shadow(3px -3px 0 #000) drop-shadow(-2px -2px 0 #000)!important }");
GM_addStyle(".stroke {filter: drop-shadow(3px 3px 0 #000) drop-shadow(-3px 3px 0 #000) drop-shadow(3px -3px 0 #000) drop-shadow(-2px -2px 0 #000)!important }");
GM_addStyle(".craft-menu .body-row { display: flex!important;position: relative!important;flex-direction: row!important;justify-content: center!important;align-items: center!important;align-content: center!important;flex-grow: 0!important;padding: 20px 20px 10px 0;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) 0 0/150px auto,linear-gradient(to top,#c2e3ec,#36393F) 0 0/cover;background-blend-mode: overlay!important; animation: 15s linear infinite forwards icon-slide!important;box-shadow: 0 0 0 10px rgb(0 0 0 / 60%)!important;border-radius: 20px!importantborder: 1px solid #2F3136 !importantheight: 500px!importantoverflow-y: visible!important;   }");
GM_addStyle(".craft-menu .transparent-cell {border-radius: 20px!important;background: #36393F!important;box-shadow: 0 3px 6px #00000029!important;}");
GM_addStyle(".craft-menu .product:not(.can-craft) {background: rgba(0 0 0 / 73%)!important;opacity:0.7!important;border: 1px solid #a5a5a5!important;color: #333!important;}");
GM_addStyle(".craft-menu .product:not(.can-craft) .timer {color: #FFF!important;}");
GM_addStyle(".craft-menu .product .reqs {background: rgba(0 0 0 / 53%)!important;color: #FFF!important;}");
// store dark
GM_addStyle(".header-row {background: rgba(0 0 0 / 73%)!important}");
GM_addStyle(".container .folded-tab {background:  #2F3136!important}");
GM_addStyle(".player-bank {background:  #2F3136!important}");
GM_addStyle(".player-bank .bank {color: #FFF!important;background: #2F3136!important;}");
GM_addStyle(".store .transparent-cell {background: rgba(0 0 0 / 73%)!important}");
GM_addStyle(".store .transparent-cell {box-shadow: 0 0 0 10px rgb(0 0 0 / 60%)!important}");
GM_addStyle(".store .transparent-cell h2 {color: #FFF!important}");
GM_addStyle(".store .footer-row { background: #000!important; }");
GM_addStyle(".store .product .construction-cost {color: #FFF!important; }");
GM_addStyle(".store .footer-row div button.selected { background: #2F3136!important; }");
GM_addStyle(".store .footer-row div button { background-color: #a5a5a5!important;border: 2px solid #36393F!important; }");
GM_addStyle(".container .fullscreen { width: 100%!important;height: 100%!important;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) 0 0/150px auto,linear-gradient(to top,#c2e3ec,#36393F) 0 0/cover;background-blend-mode: overlay!important; animation: 15s linear infinite forwards icon-slide!important;}");
GM_addStyle(".scroll-fade { background: linear-gradient(180deg,rgba(170,219,232,0) 0,#000 100%)!important; }");
GM_addStyle('.container .folded-tab:before, .container .tab-shadow:after { content: "";background: url(data:image/svg+xml, %3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.01 37"%3E%3Cpath d="M52,0,20.89,28.9S12,37,0,37V0Z" style="fill:%23edfbfe"/%3E%3C/svg%3E) left top/contain no-repeat;display: block;position: absolute; top: 0;left: 100%;height: 100%;width: 140%;z-index: 1;filter: invert(20%) sepia(15%) saturate(10%) hue-rotate(160deg) brightness(0%) contrast(62%)!important; }');
GM_addStyle(".container .folded-tab .tab-shadow { background: #2F3136!important;opacity: none!important; }");
GM_addStyle(".bottom .menu .cell { background: rgba(0 0 0 / 83%)!important;border-radius: 20px!important;border: 3px solid #000!important;color:#FFF!important;    }");
GM_addStyle(".store .product .labor-requirement:not(.can-purchase) span {color: #FFF!important;}");
GM_addStyle(".store .product .requirement {color: #FFF!important;}");
//trade depot
GM_addStyle(".framed-card {background:rgba(0 0 0 / 73%)!important;border: 10px solid #36393F!important;color: #FFF!important; }");
GM_addStyle(".trade .body-row .destination {background:rgba(0 0 0 / 73%)!important;border: 2px solid #36393F!important;color: #FFF!important; }");
GM_addStyle(".trade .footer-row { background: #000!important;border-top: 2px solid #2F3136!important; }");
GM_addStyle(".craft span.quantity { background-color: #2F3136!important;  }");
GM_addStyle(".craft {background: #36393F!important;}");
GM_addStyle(".craft.selected {border: 6px solid #2F3136!important;background: #c3e5b6!important; }");
//leaderboard
GM_addStyle(".leaderboard .winner-card { background: #36393F!important; }");
GM_addStyle(".score span { color: #f5825b!important;  }");
GM_addStyle(".leaderboard .score-container { position: absolute!important;bottom: -4px!important;-webkit-border-top-right-radius: 100px!important;-moz-border-radius-topright: 100px!important;border-top-right-radius: 100px!important;border: 0px solid #36393F!important!important;background: #36393F!important;  }");
GM_addStyle(".leaderboard .player { background-color: rgba(0,0,0,.63)!important;border: 2px solid #36393F!important; }");
GM_addStyle(".leaderboard .player .rank-bg { background-color: #36393F!important;}");
GM_addStyle(".leaderboard .time-remaining { width: 350px!important;height: 70px!important;position: relative!important;display: flex!important;align-items: center!important;justify-content: center!important;color: #fff!important;line-height: 0!important;margin: 0 auto!important;font-size: 24px!important;font-family: Barlow Condensed!important;font-weight: 600!important;letter-spacing: 2px!important;-webkit-border-top-left-radius: 100px!important;-webkit-border-top-right-radius: 100px!important;-moz-border-radius-topleft: 100px!important;-moz-border-radius-topright: 100px!important;border-top-left-radius: 100px!important;border-top-right-radius: 100px!important;border: 10px solid #36393F!important;border-bottom: none!important;background: rgba(0,0,0,.63)!important;}");
GM_addStyle("#craftui-target .header-row {background:rgba(0,0,0,.00)!important; }");
GM_addStyle(".craftui-target .product transparent-cell {background: rgba(0 0 0 / 73%)!important}");
GM_addStyle(".craftui-target .product transparent-cell {box-shadow: 0 0 0 5px rgb(0 0 0 / 60%)!important}");
GM_addStyle(".craft-menu .close-button{ height:60px!important;width:60px!important; font-size:20px; }");
GM_addStyle("#RemoveItem-confirm .header-row{background: #2F3136!important; }");
GM_addStyle("#RemoveObstacle-confirm .header-row{background: #2F3136!important; }");
GM_addStyle("#FlushStorage-confirm .header-row{background: #2F3136!important; }");
GM_addStyle("#settingsTemplate .header-row{background: #2F3136!important; }");
GM_addStyle(".settings-menu__wrapper .header__wrapper{background: #2F3136!important; }");
GM_addStyle("#NukeTown .header-row{background: #2F3136!important; }");
GM_addStyle(".player-confirm .body-row .text-bg {background:rgba(0 0 0 / 73%);color:#FFF!important;  }");
GM_addStyle(".dialog-cell { background: #c0e2eb;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#2F3136 );background-blend-mode: overlay!important;background-size: 150px auto,cover!important;background-position: 0 0,0 0;animation: 15s linear infinite forwards icon-slide,.6s cubic-bezier(.44,.01,.17,1.27) .1s forwards dialog-in!important;   }");
GM_addStyle(".settings-menu__wrapper {background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#2F3136);   }");
GM_addStyle(".settings-menu  {  background: #c0e2eb;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#2F3136 );background-blend-mode: overlay!important;background-size: 150px auto,cover!important;background-position: 0 0,0 0;animation: 15s linear infinite forwards icon-slide,.6s cubic-bezier(.44,.01,.17,1.27) .1s forwards dialog-in!important; }");
//inventory
GM_addStyle(".inventory-fullscreen { background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#5dc1dd,#2F3136);}");
  }else {
//main window
GM_addStyle(".bank { background-color:rgba(255,255,255,.63)!important}");
GM_addStyle(".bank { color:#555e65!important}");
GM_addStyle(".hud h3 {color: #555e65!important;text-shadow: 0px 0px 0px #000!important; }");
GM_addStyle(".hud .contextual { background-color:rgba(255,255,255,.63)!important}");
GM_addStyle("#player-personal-rank { opacity:0.8!important;border:4px solid rgb(204, 204, 204)!important;background-color:rgb(255, 255, 255)!important;color:#555e65!important}");
GM_addStyle("#player-scores-monitor { opacity:0.8!important;border:4px solid rgb(204, 204, 204)!important;background-color:rgb(255, 255, 255)!important;color:#555e65!important}");
GM_addStyle("#player-server-rank { opacity:0.8!important;border:4px solid rgb(204, 204, 204)!important;background-color:rgb(255, 255, 255)!important;color:#555e65!important}");
GM_addStyle("#lwg-prm-table { opacity:0.8!important;border:4px solid rgb(204, 204, 204)!important;background-color:rgb(255, 255, 255)!important;color:#555e65!important}");
GM_addStyle("#lwg-prm-reset { border:1px solid rgb(204, 204, 204)!important;background-color:rgb(255, 255, 255)!important;opacity:0.8!important;color:#555e65!important}");
GM_addStyle(".hud .top .cell { background:linear-gradient(90deg,#fff 0,rgba(255,255,255,.2763480392) 67%,rgba(255,255,255,0) 100%)!important}");
GM_addStyle(".hud .top .right-hud { background:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.2763480392) 67%,#FFF 100%)!important;width: auto!important;margin-right: 10px!important;}");
GM_addStyle(".progress-container .progress { background: rgba(255,255,255,.6)!important;color:#555e65!important}");
GM_addStyle(".stroke {-webkit-filter: drop-shadow(3px 3px 0 #fff) drop-shadow(-3px 3px 0 #fff) drop-shadow(3px -3px 0 #fff) drop-shadow(-2px -2px 0 #fff)!important }");
GM_addStyle(".stroke {filter: drop-shadow(3px 3px 0 #fff) drop-shadow(-3px 3px 0 #fff) drop-shadow(3px -3px 0 #fff) drop-shadow(-2px -2px 0 #fff)!important }");
GM_addStyle(".bottom .menu .cell { background: #e9f4ec!important;border-radius: 20px!important;border: 3px solid rgba(255,255,255,.73)!important;color:#555e65!important;}");
GM_addStyle(".craft-menu .body-row {display: flex!important;position: relative!important;flex-direction: row!important;justify-content: center!important;align-items: center!important;align-content: center!important;flex-grow: 0!important;padding: 20px 20px 10px 0!important;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) 0 0/150px auto,linear-gradient(to top,#c2e3ec,#5dc1dd) 0 0/cover;background-blend-mode: overlay!important;animation: 15s linear infinite forwards icon-slide!important;box-shadow: 0 0 0 10px rgb(255 255 255 / 60%)!important;border-radius: 20px!important;border: 1px solid #fff!important;height: 500px!important;overflow-y: visible!important;    }");
GM_addStyle("#RemoveItem-confirm .header-row{background: #4c91b6!important; }");
GM_addStyle("#RemoveObstacle-confirm .header-row{background: #4c91b6!important; }");
GM_addStyle("#FlushStorage-confirm .header-row{background: #4c91b6!important; }");
GM_addStyle("#settingsTemplate .header-row{background: #4c91b6!important; }");
GM_addStyle(".settings-menu__wrapper .header__wrapper{background: #4c91b6!important; }");
GM_addStyle("#NukeTown .header-row{background: #4c91b6!important; }");
GM_addStyle(".settings-menu__wrapper {background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#5dc1dd);   }");    
GM_addStyle(".craft-menu .transparent-cell {border-radius: 20px!important;background: #FFF!important;box-shadow: 0 3px 6px #00000029!important;}");
GM_addStyle(".craft-menu .product:not(.can-craft) {background-color: #eee!important;border: 1px solid #a5a5a5!important;color: #333!important;}"); 
GM_addStyle(".craft-menu .product:not(.can-craft) .timer {color: #333!important;}");
GM_addStyle(".craft-menu .product .reqs {background: #c9f6f9!important;color: #555e65!important;}");
// store white
GM_addStyle(".header-row {background: #4c91b6!important}");
GM_addStyle(".container .folded-tab {background: #edfbfe!important}");
GM_addStyle(".player-bank {background: #edfbfe!important}");
GM_addStyle(".player-bank .bank {color: #011315!important;background:none!important;}");
GM_addStyle(".store .transparent-cell {background: #e9f4ec!important;box-shadow: 0 0 0 10px rgb(47 108 155 / 60%)!important}");
GM_addStyle(".store .transparent-cell h2 {color: #555e65!important}");
GM_addStyle(".store .footer-row { background: #e9f4ec!important;}");
GM_addStyle(".store .product .construction-cost {color: #10383e!important; }");
GM_addStyle(".store .footer-row div button.selected { background: #10383e!important; }");
GM_addStyle(".store .footer-row div button { background-color: transparent!important;border: 2px solid #10383e!important; }");
GM_addStyle(".container .fullscreen { width: 100%!important;height: 100%!important;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) 0 0/150px auto,linear-gradient(to top,#c2e3ec,#5dc1dd) 0 0/cover;background-blend-mode: overlay!important; animation: 15s linear infinite forwards icon-slide!important;}");
GM_addStyle(".scroll-fade { background: linear-gradient(180deg,rgba(170,219,232,0) 0,#b6dfea 100%)!important; }");
GM_addStyle('.container .folded-tab:before, .container .tab-shadow:after { content: "";background: url(data:image/svg+xml, %3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.01 37"%3E%3Cpath d="M52,0,20.89,28.9S12,37,0,37V0Z" style="fill:%23edfbfe"/%3E%3C/svg%3E) left top/contain no-repeat;display: block;position: absolute; top: 0;left: 100%;height: 100%;width: 140%;z-index: 1;filter: none!important; }');
GM_addStyle(".container .folded-tab .tab-shadow { background: #edfbfe!important;opacity: .3!important; }");
GM_addStyle(".store .product .labor-requirement:not(.can-purchase) span {color: #333!important;}");
GM_addStyle(".store .product .requirement {color: #333!important;}");
//trade depot
GM_addStyle(".framed-card {background: #edfbfe!important;border: 10px solid #2f6c9b!important;color: #555e65!important; }");
GM_addStyle(".trade .body-row .destination { background: #e9f4ec!important;border: 2px solid rgba(255,255,255,.73)!important;color: #555e65!important; }");
GM_addStyle(".trade .footer-row {background: #e9f4ec!important;border-top: 2px solid #fff!important;  }");
GM_addStyle(".craft span.quantity { background-color: #a6aaa7!important;  }");
GM_addStyle(".craft {background: #d1e2d5!important;}");
GM_addStyle(".craft.selected {border: 6px solid #2f6c9b!important; }");
//leaderboard
GM_addStyle(".leaderboard .winner-card {background: #fff!important;  }");
GM_addStyle(".score span { color: #555e65!important;  }");
GM_addStyle(".leaderboard .score-container { position: absolute!important;bottom: -4px!important;border-radius: 0 0 0 20px!important;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/bg_curvecorner.png) no-repeat!important;width: 100%!important;filter: none!important;  }");
GM_addStyle(".leaderboard .player { background-color: #e9f4ec!important;border:0px solid #36393F!important; }");
GM_addStyle(".leaderboard .player .rank-bg {background-color: #c4d1c7!important; }");
GM_addStyle(".leaderboard .time-remaining {background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/backing_timer.png) no-repeat!important;width: 620px!important;height: 70px!important;position: relative!important;display: flex!important;align-items: center!important;justify-content: center!important;color: #fff!important;line-height: 0!important;margin: 0 auto!important;font-size: 24px!important;font-family: Barlow Condensed!important;font-weight: 600!important;letter-spacing: 2px!important;       }");
GM_addStyle(".craft-menu .close-button{ height:60px!important;width:60px!important; }");
GM_addStyle(".dialog-cell { background: #c0e2eb;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#5dc1dd);background-blend-mode: overlay!important;background-size: 150px auto,cover!important;background-position: 0 0,0 0;animation: 15s linear infinite forwards icon-slide,.6s cubic-bezier(.44,.01,.17,1.27) .1s forwards dialog-in!important;   }");
GM_addStyle(".player-confirm .body-row .text-bg {  background: #fff;color: #555e65!important;}");
GM_addStyle(".settings-menu  {  background: #c0e2eb;background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#c2e3ec,#5dc1dd);background-blend-mode: overlay!important;background-size: 150px auto,cover!important;background-position: 0 0,0 0;animation: 15s linear infinite forwards icon-slide,.6s cubic-bezier(.44,.01,.17,1.27) .1s forwards dialog-in!important; }");
//inventory
GM_addStyle(".inventory-fullscreen {background: url(https://sbg-townstar-assets.s3.us-east-2.amazonaws.com/ts_pattern.png) left top,linear-gradient(to top,#5dc1dd,#5dc1dd); }");
  }
}  
})();
//end of lwg script code