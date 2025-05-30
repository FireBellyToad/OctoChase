// listen to keystrokes
window.addEventListener(
    "keydown",
    function (e) {
      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );
  // load the game
  window.onload = Game.init();
  // focus on the canvas
  window.focus();