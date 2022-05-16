// ==UserScript==
// @name         LWG TS Player safe for weekly
// @namespace    http://tampermonkey.net/
// @version      0.042a-safe
// @description  custom LWG Script!
// @author       CRYPTODUDE + LWG DEVS - Modify from exisiting scripts + add different GUI
// @credits      Groovy and Mohkari
// @match        https://*.sandbox-games.com/*
// @resource     IMPORTED_CSS https://www.w3schools.com/w3css/4/w3.css
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

// LWG TS PLAYER vers. 0.042a-safe weekly version along to current GALA TOS
// changes 
//  - Added Dragon trade-depot

// LWG TS PLAYER vers. 0.041a-safe weekly version along to current GALA TOS
// changes 
//  - Fix for looking for connection cancel trade(if u encounter this it will use start auto-sell custom timer, and it will restart auto-sell after that amount of seconds pass). Still if u manually press to hide the stop auto-sell window it will not start auto-sell until you toggle it again form menu.
//  - Fixed css on Current rank for stars/h rightside tracker (now it should be shown on left correctly along with the /h).
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.040a-safe weekly version along to current GALA TOS
// changes 
//  - Fix for Cancel Trade (still experimental, now it should correctly track and remove the window on click).
//  - Added stars/h rightside tracker with reset button inside it(Special thanks to Thaimachine for allowing this to be used here, with some modifications).
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.039a-safe weekly version along to current GALA TOS
// changes 
//  - Fix for sale reset, now it should correctly display sale as 0 when reseted.
//  - Fix for larger Custom input timer for auto-sell
//  - minor fixes on some other css/functions.

// LWG TS PLAYER vers. 0.038a-safe weekly version along to current GALA TOS
// changes 
//  - Fix for Townstar Window Settings and additional settings not showing correctly(global css has been removed)
//  - Fix for Auto-search filter now will work even if u use your keybinding or not.(it wont close window if for example u press d while typing)
//  - Added clear option to filter (while you type u will see X shown on the right inside the input field, just press it to delete filter)
//  - Special Window Overlay added when you press cancel trade button (you wont miss it now that script autosell is disabled)
//  - added special donation info down on auto-sell area (some of you might like it and some wont) No one is obliged to donate, feel free to do if u want to. Its my gala ETH address.
//  - minor fixes on some other functions to make it more smooth.

// LWG TS PLAYER vers. 0.037a-safe weekly version along to curent GALA TOS
// changes 
//  - Fix for % loading game.

// LWG TS PLAYER vers. 0.036a
// changes 
//  - Removed Auto-complete because its against Gala TOS.
//  - Removed Auto-Skins because its against Gala TOS.
//  - Removed Close Start Popup because its against Gala TOS.
//  - Removed GMT zone input for your right side production monitor (normal fix was applied and no need to GMT timezone).
//  - Added Groovy Leaderboard and increase its volume to display stars to players 1-5000
//  - Added function to stop and disable auto-sell option if user clicks on cancel trade (it will disable auto-sell button + will display in console)
//  - Increased the timer for first startup sell (because as i have seen it bugs the script if no town is shown 3x times with 10 secs timer)
//  - minor other css and code cleanup

// LWG TS PLAYER vers. 0.035a
// changes 
//  - Added new timer input for how long to wait before it triggers auto-sell minimum is 5 seconds.
//  - Added GMT zone input for your right side production monitor for Reset Button to show corectly.
//  - Change jquery link on script due to i found problem where normal jquery link was blocked by ISP/Firewall on one member.
//  - minor other css code cleanup

// LWG TS PLAYER vers. 0.034a
// changes 
//  - Totally New Redesigned Left Inventory Info Management with toggle option (whatever you choose it will show and its a bit experimental, lets see how it will go).
//  - Removed Some unwanted console log info.
//  - Because many LWG members asked I'm putting back again Rights Side Monitor Reset Button
//  - minor other css code cleanup

// LWG TS PLAYER vers. 0.033a
// changes 
//  - New Left sidebar options with special toggle when you enable left side production monitor info.
//  - Removed Money /s/m/h (logic didnt work, and tbh its huge formula with multiple vars which will make a loooong time to be made)
//  - Fixed keybinding to open menu (now it wont matter if u pressed D or d or whatever a-z or A-Z value you input in settings keybinding area)
//  - Auto-complete Fix (now no more mistake on removal items. Enjoy it)
//  - minor other css code cleanup

// LWG TS PLAYER vers. 0.032a
// changes 
//  - Finaly fixed left sidebar info tracking (needed to recreate everything).
//  - Added Money /s/m/h (this is experimental still)
//  - minor other code cleanup

// LWG TS PLAYER vers. 0.031a
// changes 
//  - Auto-sell will be paused if you have any craft window popup open, store fullscreen window or even remove window popup open. It will auto sell after you choose your building to be build, or you click remove item, or switch to some other type of craft.
//  - Due to gala level to be vissible toggle button for menu is move to the right near the LWG V. Auto sell text
//  - minor other code cleanup

// LWG TS PLAYER vers. 0.030a
// changes 
//  - added toggle for left production info
//  - Removed left Sale info due to it doesnt work and its bugged. Only way you can see your sell /s/m/h will be on rightside monitor until fix is done
//  - enjoy it

// LWG TS PLAYER vers. 0.029a
// changes 
//  - added custom toggle for removal of scrollbar on side bar production monitor
//  - added filter-search option for fast find autosell options
//  - changed mohkarl production monitor code functions (still wont load 2x of them at same time, waiting for him to return and will try to fix on tuesday when he is back)
//  - some other minor changes in css/code.
//  - enjoy it

 
      function GM_addStyle(style) {
        document.head.innerHTML += "\n<style>\n"+style+"\n</style>\n";
      }
  
  (function() {
      'use strict';
        var versionLWG = "0.042a-safe";
        var strSellingData = "";
        var displayactivestatement = "";
        
        let getautoscriptload = 0;
        let loaded = 0;
        let leaderTracker = [];

        let apiTokenSet = false;
        let timeleft = 15;

        var crossClicked = false;

  ///////////
    // NOTES //
    ///////////

    // will auto populate/display while game is running
    let lwglist = {};

    // if true, you will get a onscreen "stop watch", otherwise set to false
    let lwgtimeStart = true;


    //adding data for selling
    let aData = [];
    let outputd = [];

      // css style

      GM_addStyle("#toggle {z-index:9999!important;} ");
      GM_addStyle(".w3-bar-item {text-align:right!important;}");
      GM_addStyle("input.lwg {width:55px!important;}");
      GM_addStyle("#box, #box_c, #box_d, #box_e {min-width:100%; height: 55vh; overflow-y: scroll;border:1px solid #2e435c; -webkit-border-top-left-radius: 20px;-webkit-border-bottom-left-radius: 20px;-moz-border-radius-topleft: 20px;-moz-border-radius-bottomleft: 20px;border-top-left-radius: 20px;border-bottom-left-radius: 20px;}");
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
      GM_addStyle(".tabs {display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-flow: column wrap;flex-flow: column wrap;text-align: center;border-right: 1px solid rgba(51, 51, 51, 0.5);background: #333333cc;max-height: 166px;}");
      GM_addStyle(".tab {display: -webkit-box;padding: 1rem;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;gap: 1rem;-webkit-box-flex: 1;-ms-flex: 1;flex: 1;-ms-flex-wrap: wrap;flex-wrap: wrap;cursor: pointer;-webkit-transition: all 300ms ease-in-out;transition: all 300ms ease-in-out;max-height:72px;}");
      GM_addStyle(".tab:focus,.tab:hover,.tab:active {background: #3333334d;}");
      GM_addStyle(".tab-active {background: #1a1a1a80;}");
      GM_addStyle(".content-pane {cursor: default;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-flow: column wrap;flex-flow: column wrap;padding-top: 1rem;padding-left: 1.5rem;padding-right:1.5rem;padding-bottom:0.5rem;max-height:95vh;background: #333333cc;}");
      GM_addStyle(".content-pane h2 {margin-bottom:5px;}");
      GM_addStyle(".tab-content {display: none;-webkit-animation: scaleUp 500ms ease-in-out;animation: scaleUp 500ms ease-in-out;}");
      GM_addStyle(".tab-content p {margin: 1rem 0;}");
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
  if(localStorage.getItem("startSelling") === null){    
    localStorage.setItem("startSelling",false)
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
  
      //add main GUI
      var nodegui = "<button type='button' class='rounded-button' title='Open Settings' id='toggle'><span><img loading='lazy'  src='https://img.icons8.com/material/50/000000/settings--v5.png' alt='main_settings_button' width='32' height='32'></span></button>";
      nodegui+="<div id='guiwindow' class='lwgbody avoid-clicks'><main id='gui'>";
      nodegui+="<section class='tabbed-window-list'>";
  
      nodegui+="<section class='tabs'>";
      nodegui+="<span style='padding:10px;font: 16px Arial, Helvetica, sans-serif;'>LWG TS v."+versionLWG+"</span>";
      nodegui+="<div class='tab tab-active' style='flex: 0;'>";
      nodegui+="<img loading='lazy' src='https://img.icons8.com/external-those-icons-fill-those-icons/24/ffffff/external-dollar-money-currency-those-icons-fill-those-icons-1.png' alt='auto-sell' width='32' height='32'>";
      nodegui+="<h2 style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Auto-Sell</h2>";
      nodegui+="</div>";   
  
//      nodegui+="<div class='tab' style='flex: 0;'>";
//      nodegui+="<img loading='lazy' src='https://img.icons8.com/ios-filled/50/ffffff/fast-moving-consumer-goods.png' alt='auto-craft' width='32' height='32'>";
//      nodegui+="<h2 class='lwgbody' style='font: 16px Arial, Helvetica, sans-serif;'>Auto-Craft</h2>";
//      nodegui+="</div>";
  
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
      nodegui+="<b style='font: 16px Arial, Helvetica, sans-serif;'>Filter-Search : </b></b><input type='text' class='lwg clearable' id='lwgsearch' placeholder='Example. Cake' autocomplete='off' style='width: 200px!important; height: 18px; font-size: 16px;margin-left:10px!important;margin-bottom:10px!important;border:1px solid #ddd;margin-right:10px;'></input>";
//      nodegui+="<label class='switch switch-green'><input type='checkbox' class='displayChecked switch-input' id='display-checked' name='display-checked'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 20px;padding-left:5px;font-size:16px;vertical-align: middle;'>Display only checked</span>";
      nodegui+="<div id='box' class='box tab-content-white'></div>";
// testing toggle switch
      nodegui+="<div style='float:left;'>";
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startSelling switch-input' id='auto-selling' name='auto-selling'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Start Auto-Sell</span>";
// check timer input for auto-sell
      nodegui+="<span style='line-height: 26px;padding-left:20px;font-size:18px;'>Custom Timer : </span> <span class='input-help'><input type='number' min='5' class='autosellTimerkey' id='autosell-timer-key' name='autosell-timer-key' style='width: 40px; height: 18px; font-size: 16px; border: 1px solid;' value=''></input><span style='line-height: 26px;padding-left:5px;font-size:18px;padding-right:5px'> Seconds</span><button class='savelwgbutton'>Save</button><small id='autoselltimerHelpBlock' class='form-text text-muted' style='padding-left:3px'>Min. 5 seconds</small> </span>";
      nodegui+="</p>";
      nodegui+="<iframe width='575' height='72' src='https://www.dnkdesign.com.mk/lwgscript/dude-donations-small.html' frameborder='0' scrolling='no' style='overflow: hidden;padding-left:10px;'></iframe>";
      nodegui+="</div>";
//      nodegui+="<button class='button-reset resetTown'>New Town Reset Settings</button><p>testing-purpose";     
      nodegui+="</div>";
//      nodegui+="<div class='tab-content'>";
//      nodegui+="<h2 style='text-align:center;'>Auto-Craft Options</h2>";
//      nodegui+="<div id='box_c' class='tab-content-white'>IN PROGRESS!</div>";
//      nodegui+="</div>";
//      nodegui+="<div class='tab-content'>";
//      nodegui+="<h2 style='text-align:center;'>Auto-Build Options</h2>";
//      nodegui+="<div id='box_d' class='tab-content-white'>IN PROGRESS!</div>";
//      nodegui+="</div>";
      nodegui+="<div class='tab-content'>";
      nodegui+="<h2 class='lwgbody' style='font: 22px Arial, Helvetica, sans-serif;font-weight:bold;'>Settings Options</h2>";
      nodegui+="<div style='float:left;margin-top:13px;margin-right:10px'>";
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startDeveloper switch-input' id='developer-settings' name='developer-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Developer Settings</span></p>";
      // custom keybind area
      nodegui+="<p><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Custom Keybind for Menu</span> <input type='text' class='lwg menucustomKey' id='custom-key' name='custom-key' style='width: 24px; height: 18px; font-size: 16px; border: 1px solid;' value=''><button class='savelwgbutton'>Save</button><span style='color:orange;font-size:16px;padding-left:3px'> Use only a-z keys (1 key only)</span></p>";
      // leftsideproduction switch info
      nodegui+="<p><label class='switch switch-green'><input type='checkbox' class='lwg startLeftProdInfo switch-input' id='side-production-left-info' name='side-production-left-info'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Display Left Sidebar Production Monitor Info</span></p>";
      // sideproduction switch
      nodegui+="<div id='production-settings-scrollbar' style='border: 1px solid #ddd;'><p><label class='switch switch-green'><input type='checkbox' class='lwg startSideProduction switch-input' id='side-production-settings' name='side-production-settings'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Right Sidebar Production Monitor</span></p>";
//      nodegui+="</p>";
      // sideproduction switch scrollbar
      nodegui+="<p style='padding-left:20px;'><label class='switch switch-green'><input type='checkbox' class='lwg startSideProductionScrollbar switch-input' id='side-production-settings-scrollbar' name='side-production-settings-scrollbar'><span class='switch-label' data-on='On' data-off='Off'></span><span class='switch-handle'></span></label><span style='line-height: 26px;padding-left:5px;font-size:18px;'>Display Right Sidebar Production Monitor Scrollbar</span></p></div>";
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
        newNode.style.cssText = 'overflow: auto;pointer-events: all!important; position: fixed; left: 65px;top:0;z-index:9999;';
        newNode.innerHTML = nodegui;
        await WaitForElement('.hud');
        document.querySelector('.hud').prepend(newNode);

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
    {id : 46, name : "Water Drum",	id_name : "Water_Drum",	price : "50",	stars : "1"}
                  ];

                  var model = "ts_crafts";
                  var asell = "<ul class='border_bottom' style='margin-top:0px;'>";
                  for (var i = 0; i < rows.length; i++) {

                    asell+="<li style='margin-top: 5px; border-bottom: 1px solid #444;margin-bottom: 5px;padding-bottom: 5px;'><table id='"+rows[i].id_name+"'><tr><span class='textgreen' style='padding-left:15px;'><b>"+rows[i].name+" ("+rows[i].stars+" points and $"+rows[i].price+" per item)</b></span>";
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
      "#Blue_Steel, #Cake, #Baguette, #Pinot_Noir, #Pumpkin_Pie, #Batter, #Steel, #Cabernet_Sauvignon, #Uniforms, #Candy_Canes, #Dough, #Chardonnay, #Wool_Yarn, #Butter, #Wine_Bottle, #Oak_Barrel, #Chromium, #Iron, #Limestone, #Wool, #Milk, #Cotton_Yarn, #Sugar, #Pinot_Noir_Grapes, #Salt, #Flour, #Jet_Fuel, #Cabernet_Grapes, #Eggs, #Gasoline, #Lumber, #Pumpkin, #Silica, #Chardonnay_Grapes, #Peppermint, #Petroleum, #Sugarcane, #Cotton, #Feed, #Brine, #Wheat, #Oak_Wood, #Wood, #Energy, #Crude_Oil, #Water_Drum"
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

      //Show hide dev area
      var develem = document.getElementById('developer-extra'),
      devcheckBox = document.getElementById('developer-settings');
      devcheckBox.checked = false;
      devcheckBox.onchange = function developc() {
        develem.style.display = this.checked ? 'block' : 'none';
      };
      devcheckBox.onchange();

  
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
  
  if (Game.town.GetStoredCrafts()['Gasoline'] >= 1) {          
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
              if (!targetTradeObj && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 25 && craftedItems[i].sellMin >= 25){
                targetTradeObj = GetAvailableTradeObject(25);
                var loadeditems = '25';
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
  
  //  console.log("Sold "+object.itemsellamt,object.itemsellname);
  });
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
      console.log('Whoops! You have run out of gas.');
      document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
  }
}
  setTimeout(CheckCrafts, getautoselltime);
  
  }
  

//end of auto-sell


// start of new left sidebar monitor
function GetLeftDataInfo() {
   
  var infoarr = [ 'Blue_Steel', 'Cake', 'Baguette', 'Pinot_Noir', 'Pumpkin_Pie', 'Batter', 'Steel', 'Cabernet_Sauvignon', 'Uniforms', 'Candy_Canes', 'Dough', 'Chardonnay', 'Wool_Yarn', 'Butter', 'Wine_Bottle', 'Oak_Barrel', 'Chromium', 'Iron', 'Limestone', 'Wool', 'Milk', 'Cotton_Yarn', 'Sugar', 'Pinot_Noir_Grapes', 'Salt', 'Flour', 'Jet_Fuel', 'Cabernet_Grapes', 'Eggs', 'Gasoline', 'Lumber', 'Pumpkin', 'Silica', 'Chardonnay_Grapes', 'Peppermint', 'Petroleum', 'Sugarcane', 'Cotton', 'Feed', 'Brine', 'Wheat', 'Oak_Wood', 'Wood', 'Energy', 'Crude_Oil', 'Water_Drum' ];

  
  
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
     * Add Overlay Text
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
            scoresElem.style = 'border: 4px solid rgb(204, 204, 204);background-color: rgb(255, 255, 255);width: 99%;margin-top: 10px;border-radius: 5px;opacity: 0.8;padding: 5px;margin-right: 20px;text-align: right;padding-right: 45px;font-size: 16px;}';
            scoresElem.textContent = '<div class="syncIcon"></div>';// reset knopf
            scoresContainer.appendChild(scoresElem);
            let resetScoresButton = document.createElement('div');
            resetScoresButton.id = 'reset-scores';
            resetScoresButton.classList.add('PSMbox1');
            resetScoresButton.style = 'border:solid 2px black; border-radius:200px; position:absolute !important; top:115px!important; right:29px!important; background:#060606a1; cursor: pointer;opacity: 0.8;}';
            resetScoresButton.textContent = '';
            resetScoresButton.onclick = function() { ResetScores(); };
            scoresContainer.appendChild(resetScoresButton);
            let hudRight = document.querySelector('.hud .right .hud-right');
            hudRight.insertBefore(scoresContainer, hudRight.querySelector('.right-hud').nextSibling);
            CheckPlayerScores();
    //hover function
            $('#reset-scores').hover(function () {
                $(this).css("background", "#fff");
            }, function () {
                $(this).css("background", "#00000000");
            });
    //hover function
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
  API.scoreLeaderboard(0, 5000).then(leaders=>{
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
  rank.style = 'font-size: 20px;min-width: 50px !important;text-align: center !important;height:54px !important;opacity: 0.8;border: 4px solid rgb(204, 204, 204);background-color: rgb(255, 255, 255);padding-left: 5px;padding-right: 5px;border-radius: 5px;margin-right: -3px;margin-top: 10px;}';
  rank.textContent = '';
  const leaderboardImage = document.querySelector('#player-scores-monitor');
  leaderboardImage.parentNode.insertBefore(rank, leaderboardImage);
  getRank();
}

rankObserver.observe(document, {childList: true, subtree: true});
// ranking

})();
