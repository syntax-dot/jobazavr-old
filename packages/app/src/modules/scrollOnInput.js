const $body = document.querySelector("body");

function preventDefault(e) {
  e.preventDefault();
}

function enable() {
  document.body.addEventListener("touchmove", preventDefault, {
    passive: false,
  });
}
function disable() {
  document.body.removeEventListener("touchmove", preventDefault, {
    passive: false,
  });
}

export default {
  enable,
  disable,
};
