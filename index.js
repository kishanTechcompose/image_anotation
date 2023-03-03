var eventType = "";
var allShapes = [];
var allHistory = [];
var allDetails = [];
var rotationAngle = 0;
var selectedId = null;
var clickedId = null;
var scale = 1;
let mainContainer = document.getElementsByClassName("main-container")[0];
var mainBody = document.getElementById("main-body");
// var image = document.getElementById("image");
var image = new Image();
// image.src = "https://picsum.photos/1280/720/";
// image.src = "./pexels-pedro-slinger-13519033.jpg";
// image.src = "./cat.jpg";
image.src =
  "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg";
var maxW, maxH;
var mouseX = 0;
var mouseY = 0,
  panning = false,
  pointX = 0,
  pointY = 0,
  start = { x: 0, y: 0 },
  zoom = document.getElementById("main-body");

var OrgImageSize = {
  width: 0,
  height: 0,
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  let x = evt.clientX - rect.left;
  let y = evt.clientY - rect.top;
  // if (scale > 1 || scale < 1) {
  //   return { x: evt.offsetX, y: evt.offsetY };
  // }
  return { x, y };
}

function setType(_type) {
  eventType = _type;
  if (eventType === "clear") {
    clearZone();
  } else if (eventType === "delete") {
    mainBody.addEventListener("click", eraseZone);
  } else if (eventType === "rotate") {
    rotationAngle += 90;
    rotateImage(mainBody, rotationAngle);
  } else if (eventType === "zoomIn") {
    zoomIn();
  } else if (eventType === "zoomOut") {
    zoomOut();
  } else if (eventType === "zoomReset") {
    zoomReset();
  } else if (eventType === "undo") {
    undo();
  } else if (eventType === "redo") {
    redo();
  }
}

function undo() {
  console.log("allHistory :>> ", allHistory);
}
function redo() {
  console.log("allHistory :>> ", allHistory);
}

function rotateImage(mainBody) {
  if (rotationAngle >= 360) {
    rotationAngle = 0;
  }

  let container = mainBody;
  // container.style.transformOrigin = "50% 73%";
  container.style.transformOrigin = "center center";
  container.style.transform = `rotate(${rotationAngle}deg)`;

  if (selectedId != null && allShapes.length > 0) {
    closePopOver(selectedId);
  }

  let buttons = document.getElementById("shapes-btn");

  [...buttons?.children].forEach((value) => {
    if (rotationAngle != 0) {
      value.disabled = true;
      // mainContainer.style.display = "flex";
    } else {
      value.disabled = false;
      // mainContainer.style.display = "block";
    }
  });
}

function eraseZone(e) {
  const arrZones = getZones();
  let { x, y } = getMousePos(mainBody, e);
  let shape = arrZones.filter((value) => isMouseInShape(e, x, y, value))[0];
  if (selectedId) {
    closePopOver(selectedId);
  }
  deleteZone(shape);
  eventType = "";
  mainBody.removeEventListener("click", eraseZone);
}

function clearZone() {
  const arrZones = getZones();
  arrZones.forEach((element) => {
    deleteZone(element);
  });
  eventType = "";

  let popover = document.getElementById("popover");
  popover.style.display = "none";
}

function zoomIn() {
  if (selectedId) {
    closePopOver(selectedId);
  }

  scale = 1 + 1 * 0.1;

  const newWidth = getPixels(mainBody.style.width) * scale;
  const newHeight = getPixels(mainBody.style.height) * scale;

  mainBody.style.width = `${newWidth}px`;
  mainBody.style.height = `${newHeight}px`;

  // mainBody.style.width = `${getPixels(mainBody.style.width) + 100}px`;
  // mainBody.style.height = `${getPixels(mainBody.style.height) + 100}px`;
  // mainBody.click();
  reDraw();
  // scale *= 1.2;
  // zoom.style.transformOrigin = "0px 0px";
  // zoom.style.transform = `scale(${scale})`;
}

function zoomOut() {
  if (
    getPixels(mainBody.style.width) >= 150 ||
    getPixels(mainBody.style.height) >= 150
  ) {
    if (selectedId) {
      closePopOver(selectedId);
    }

    scale = 1 + -1 * 0.1;
    const newWidth = getPixels(mainBody.style.width) * scale;
    const newHeight = getPixels(mainBody.style.height) * scale;

    mainBody.style.width = `${newWidth}px`;
    mainBody.style.height = `${newHeight}px`;

    // mainBody.style.width = `${getPixels(mainBody.style.width) - 100}px`;
    // mainBody.style.height = `${getPixels(mainBody.style.height) - 100}px`;
    // mainBody.click();
    reDraw();
  }

  // scale /= 1.2;
  // zoom.style.transformOrigin = "0px 0px";
  // zoom.style.transform = `scale(${scale})`;
}

function zoomReset() {
  // scale = 1;
  // mainBody.style.transformOrigin = "0px 0px";
  // zoom.style.transform = `scale(${scale})`;
  // image.style.top = "0px";
  // image.style.left = "0px";
  // console.log();
  // console.log(mainBody.getBoundingClientRect());
  // mainBody.style.top = `${
  //   mainBody.offsetTop + mainBody.getBoundingClientRect().x
  // }px`;
  // mainBody.style.left = "0px";
  mainBody.style.position = "initial";
  mainBody.style.transform = `translate(${0}px, ${0}px) `;
  mainBody.style.width = `${OrgImageSize.width}px`;
  mainBody.style.height = `${OrgImageSize.height}px`;
  // mainBody.click();
  // image.width = OrgImageSize.width;
  // image.height = OrgImageSize.height;

  reDraw();
}

function reDraw() {
  console.log("reDraw called");
  // let mBody = document.getElementById("main-body");
  // mBody.style.width = `${image.width}px`;
  // mBody.style.height = `${image.height}px`;

  allShapes?.forEach((objZone) => {
    let ele = document.getElementById(`box${objZone.slug}`);
    ele.remove();
    deleteZone({ ...objZone });
    let { x, y } = PercentageToPx(objZone.x, objZone.y);
    let { x: width, y: height } = PercentageToPx(objZone.width, objZone.height);
    objZone.x = x;
    objZone.y = y;
    objZone.width = width;
    objZone.height = height;
    addZone(objZone);
    addZoneBox(objZone);
  });
  allShapes = [...allShapes];
  mainBody.click();
}

function setTransform() {
  zoom.style.transform =
    "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
  if (e.altKey) {
    // e.preventDefault();
    start = { x: e.pageX - pointX, y: e.pageY - pointY };
    panning = true;
  }
};

mainContainer.onmouseup = function (e) {
  // if (e.altKey) {
  panning = false;
  // }
};

zoom.onmousemove = function (e) {
  if (e.altKey) {
    e.preventDefault();
    if (!panning) {
      return;
    }
    pointX = e.pageX - start.x;
    pointY = e.pageY - start.y;
    setTransform();
  }
};

zoom.onwheel = function (event) {
  if (event.shiftKey) {
    event.preventDefault();
    //   var xs = (e.offsetX - pointX) / scale,
    //     ys = (e.offsetY - pointY) / scale,
    // delta = event.wheelDelta ? event.wheelDelta : -event.deltaY;
    // if (delta > 0) {
    //   scale += 0.1;
    // } else {
    //   scale -= 0.1;
    // }

    //   pointX = e.offsetX - xs * scale;
    //   pointY = e.offsetY - ys * scale;

    //   setTransform();
    // Get the current mouse position relative to the image
    // const mouseX = event.offsetX;
    // const mouseY = event.offsetY;
    let { x: mouseX, y: mouseY } = getMousePos(mainBody, event);

    // Calculate the new width and height based on mouse wheel delta
    const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
    scale = 1 + delta * 0.1;
    const newWidth = getPixels(mainBody.style.width) * scale;
    const newHeight = getPixels(mainBody.style.height) * scale;

    // Calculate the new position of the mouse relative to the scaled image
    const newMouseX = mouseX * scale;
    const newMouseY = mouseY * scale;

    // Calculate the difference between the new and old mouse positions
    const deltaX = newMouseX - mouseX;
    const deltaY = newMouseY - mouseY;

    // Adjust the image position to keep the mouse position fixed

    // Set the new width and height values
    // image.width = newWidth;
    // image.height = newHeight;
    mainBody.style.width = `${newWidth}px`;
    mainBody.style.height = `${newHeight}px`;

    // image.style.position = "absolute";
    // image.style.left = `${image.offsetLeft - deltaX}px`;
    // image.style.top = `${image.offsetTop - deltaY}px`;

    mainBody.style.position = "absolute";
    mainBody.style.left = `${mainBody.offsetLeft - deltaX}px`;
    mainBody.style.top = `${mainBody.offsetTop - deltaY}px`;

    // mainBody.click();
    if (selectedId) {
      closePopOver(selectedId);
    }
    reDraw();
  }
};

// function zoomImageOnWheel(event) {
//   event.preventDefault();

//   // mouseX = event.offsetX;
//   // mouseY = event.offsetY;

//   // var delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));

//   // if (delta < 0) {
//   //   scale -= 0.1;
//   // } else {
//   //   scale += 0.1;
//   // }

//   // var transformOriginX = (mouseX / zoom.offsetWidth) * 100;
//   // var transformOriginY = (mouseY / zoom.offsetHeight) * 100;

//   // mainBody.click();
//   // if (selectedId) {
//   //   closePopOver(selectedId);
//   // }
//   // reDraw();

//   // event.preventDefault();
//   // const delta = Math.sign(event.deltaY);
//   // const mouseX = event.offsetX;
//   // const mouseY = event.offsetY;
//   // console.log("mouseX,mouseY :>> ", mouseX, mouseY);
//   // // var xs = (e.offsetX - pointX) / scale,
//   // //   ys = (e.offsetY - pointY) / scale,
//   // //   delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
//   // delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
//   // // pointX = e.offsetX - xs * scale;
//   // // pointY = e.offsetY - ys * scale;
//   // setTransform(mouseX, mouseY, scale);
//   // var newWidth, newHeight;
//   // const delta = Math.sign(event.deltaY);
//   // const mouseX = event.offsetX;
//   // const mouseY = event.offsetY;
//   // console.log("mouseX,mouseY :>> ", mouseX, mouseY);
//   // const imageRect = image.getBoundingClientRect();
//   // if (delta === 1) {
//   // console.log("image.width,image.height :>> ", image.width, image.height);
//   // newWidth = image.width + image.clientWidth * 0.1;
//   // newHeight = image.height + image.clientHeight * 0.1;
//   // image.width = newWidth;
//   // image.height = newHeight;
//   // const deltaWidth = newWidth - image.width;
//   // const deltaHeight = newHeight - image.height;
//   // console.log("newWidth,newHeight :>> ", newWidth, newHeight);
//   // console.log("deltaWidth,deltaHeight :>> ", deltaWidth, deltaHeight);
//   // image.style.position = "absolute";
//   // image.style.left = image.height - mouseY + "px";
//   // image.style.top = image.width - mouseX + "px";
//   // image.style.left =
//   //   image.offsetLeft - deltaWidth * (mouseX / imageRect.width) + "px";
//   // image.style.top =
//   //   image.offsetTop - deltaHeight * (mouseY / imageRect.height) + "px";
//   // } else {
//   // image.width -= image.clientWidth * 0.1;
//   // image.height -= image.clientHeight * 0.1;
//   // }
// }

// Change the zoom level based on the mouse wheel delta
// const delta = Math.sign(e.deltaY);
// // currentScale += delta * zoomStep;
// // currentScale = Math.max(minScale, Math.min(currentScale, maxScale));

// // Set the width and height of the image to zoom in or out
// const newWidth = image.width * delta + zoomStep;
// const newHeight = image.height * delta + zoomStep;
// console.log("newWidth,newHeight :>> ", newWidth, newHeight);

// // Calculate the mouse position relative to the container
// const containerRect = mainBody.getBoundingClientRect();
// const mouseX = e.clientX - containerRect.left;
// const mouseY = e.clientY - containerRect.top;

// console.log("mouseX,mouseY :>> ", mouseX, mouseY);

// Calculate the new position of the image within the container to keep the mouse position fixed
// const imageX =
//   (mouseX - image.offsetLeft) * (1 - newWidth / mainBody.offsetWidth);
// const imageY =
//   (mouseY - image.offsetTop) * (1 - newHeight / mainBody.offsetHeight);

// console.log("imageX,imageY :>> ", imageX, imageY);

// const centerX = (e.offsetX / mainBody.offsetWidth) * 100;
// const centerY = (e.offsetY / mainBody.offsetHeight) * 100;
// image.style.transformOrigin = `${centerX}% ${centerY}%`;

// image.width = `${newWidth}`;
// image.height = `${newHeight}`;
// image.style.top = `${imageY}px`;
// image.style.left = `${imageX}px`;

// event.preventDefault();
// const zoomFactor = 1.2;
// const direction = Math.sign(event.deltaY);
// const currentWidth = image.offsetWidth;
// const currentHeight = image.offsetHeight;
// const newWidth = currentWidth * zoomFactor ** direction;
// const newHeight = currentHeight * zoomFactor ** direction;

// const cursorX = event.clientX - image.offsetLeft;
// const cursorY = event.clientY - image.offsetTop;

// const leftOffset = ((currentWidth - newWidth) * cursorX) / currentWidth;
// const topOffset = ((currentHeight - newHeight) * cursorY) / currentHeight;

// image.style.width = newWidth + "px";
// image.style.height = newHeight + "px";
// image.style.left = parseFloat(image.style.left) + leftOffset + "px";
// image.style.top = parseFloat(image.style.top) + topOffset + "px";

// const transformOriginX = (cursorX / currentWidth) * 100 + "%";
// const transformOriginY = (cursorY / currentHeight) * 100 + "%";
// image.style.transformOrigin = `${transformOriginX} ${transformOriginY}`;
// console.log("event.wheelDelta :>> ", event.wheelDelta);
// const delta = Math.sign(event.wheelDelta);
// const width = image.width;
// const height = image.height;
// console.log("delta :>> ", delta);
// console.log("width,height :>> ", width, height);
// // let { x: mouseX, y: mouseY } = getMousePos(image, event);
// const mouseX = event.offsetX;
// const mouseY = event.offsetY;
// console.log("mouseX,mouseY :>> ", mouseX, mouseY);
// const newWidth = width + delta + 100;
// const newHeight = height + delta + 100;
// console.log("newWidth,newHeight :>> ", newWidth, newHeight);
// const ratioX = mouseX / width;
// const ratioY = mouseY / height;
// console.log("ratioX,ratioY :>> ", ratioX, ratioY);
// const newMouseX = ratioX * newWidth;
// const newMouseY = ratioY * newHeight;
// console.log("newMouseX,newMouseY :>> ", newMouseX, newMouseY);
// const offsetX = mouseX - newMouseX;
// const offsetY = mouseY - newMouseY;
// console.log("offsetX,offsetY :>> ", offsetX, offsetY);

// mainBody.style.transform = `translate(${image.offsetLeft + offsetX}px ${
//   image.offsetTop + offsetY
// }px)`;

// image.width = newWidth;
// image.height = newHeight;
// mainBody.width = newWidth;
// mainBody.height = newHeight;
// mainBody.style.left = `${mouseX}px`;
// mainBody.style.top = `${mouseY}px`;

// mainBody.click();
// if (selectedId) {
//   closePopOver(selectedId);
// }
// reDraw();
// }

// Get ratio (that is: 2 means original has twice the size; 1/2 means original has half the size)
function getImageRatio(_imgElement) {
  return _imgElement.naturalWidth / _imgElement.width;
}

function setImageInViewPort() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  var maxWidth = viewportWidth * 0.8;
  var maxHeight = viewportHeight * 0.8;

  if (image) {
    const origWidth = image.width;
    const origHeight = image.height;

    const aspectRatio = origWidth / origHeight;

    let newWidth = maxWidth;
    let newHeight = maxHeight;
    if (newWidth / aspectRatio > maxHeight) {
      newWidth = maxHeight * aspectRatio;
      newHeight = maxHeight;
    } else {
      newHeight = newWidth / aspectRatio;
    }
    // image.width = newWidth;
    // image.height = newHeight;
    console.log("newWidth, newHeight :>> ", newWidth, newHeight);
    OrgImageSize.width = newWidth;
    OrgImageSize.height = newHeight;
    mainBody.style.width = newWidth + "px";
    mainBody.style.height = newHeight + "px";
    mainBody.style.backgroundImage = `url(${image.src})`;
    mainBody.style.backgroundSize = "cover";
  }

  // var maxWidth = tempViewportWidth;
  // var maxHeight = tempViewportHeight;
  // var ratio = 0;
  // var width = image.naturalWidth;
  // var height = image.naturalHeight;
  // if (width > height) {
  //   console.log("width :>> ", width);
  //   ratio = maxWidth / width;
  //   console.log("ratio :>> ", ratio);
  //   width = width * ratio;
  // } else {
  //   console.log("height :>> ", height);
  //   ratio = maxHeight / height;
  //   console.log("ratio :>> ", ratio);
  //   height = height * ratio;
  // }
  // console.log("width,height :>> ", width, height);
  // while (tempImageWidth >= tempViewportWidth) {
  //   tempImageWidth = tempImageWidth - tempImageWidth * 0.1;
  // }

  // while (tempImageHeight >= tempViewportHeight) {
  //   tempImageHeight = tempImageHeight - tempImageHeight * 0.1;
  // }

  // if (image) {
  // set new width and height of image
  // image.width = maxW;
  // image.height = maxH;
  // // image.width = "498";
  // // image.height = "340";
  // if (image.width >= viewportWidth || image.height >= viewportHeight) {
  //   let container = document.getElementById("container");
  //   container.style.width = `${image.width}px`;
  //   container.style.height = `${image.height}px`;
  // }
  // OrgImageSize.width = maxW;
  // OrgImageSize.height = maxH;
  // tempImageHeight -= viewportHeight * 0.1;
  // image.width = tempImageWidth;
  // image.height = tempImageHeight + viewportHeight * 0.1;
  // OrgImageSize.width = tempImageWidth;
  // OrgImageSize.height = tempImageHeight + viewportHeight * 0.1;
  // let mBody = document.getElementById("main-body");
  // mBody.style.width = `${tempImageWidth}px`;
  // mBody.style.height = `${tempImageHeight}px`;
  // if (
  //   imageNWidth >= tempViewportWidth ||
  //   imageNHeight >= tempViewportHeight
  // ) {
  //   let container = document.getElementById("container");
  //   container.style.width = `${tempImageWidth}px`;
  //   container.style.height = `${tempImageHeight}px`;
  // }
  // }
}

window.onload = () => {
  if (image.src) {
    // OrgImageSize.width = image.naturalWidth;
    // OrgImageSize.height = image.naturalHeight;
    setImageInViewPort();
    initZones();
  }
};

mainBody.addEventListener("click", newZone);
// mainBody.addEventListener("wheel", zoomImageOnWheel);

// User has clicked on the image so create a new zone
function newZone(_event) {
  if (eventType === "rectangle") {
    let { x, y } = getMousePos(mainBody, _event);
    const objZone = {
      x,
      y,
      width: 50,
      height: 50,
      slug: getNextZoneSequence(),

      type: "rectangle",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  } else if (eventType === "point") {
    let { x, y } = getMousePos(mainBody, _event);
    const objZone = {
      width: 10,
      height: 10,
      x,
      y,
      slug: getNextZoneSequence(),
      type: "point",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  } else if (eventType === "oval") {
    let { x, y } = getMousePos(mainBody, _event);
    const objZone = {
      x,
      y,
      width: 50,
      height: 50,
      slug: getNextZoneSequence(),
      type: "oval",
    };
    addZone(objZone);
    addZoneBox(objZone, _event);
  } else {
    clickedId = _event.target.id.toString().replace("link", "");
  }
  eventType = "";
}

function isMouseInShape(event, mx, my, shape) {
  let { x, y } = PercentageToPx(shape.x, shape.y);
  let { x: width, y: height } = PercentageToPx(shape.width, shape.height);
  var rLeft = x;
  var rRight = x + width;
  var rTop = y;
  var rBott = y + height;
  if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
    return true;
  }
  return false;
}

// Draw the box on the screen for given zone
function addZoneBox(_objZone, _event) {
  const theDiv = document.createElement("div");
  theDiv.className =
    _objZone.type === "oval" || _objZone.type === "point"
      ? "boxNotActive oval"
      : "boxNotActive";
  if (_objZone.type === "point") {
    theDiv.classList.add("point");
  }

  theDiv.id = `box${_objZone.slug}`;
  theDiv.addEventListener("click", () => selectBox(_objZone.slug));
  theDiv.style.position = "absolute";

  let { x, y } = PercentageToPx(_objZone.x, _objZone.y);
  let { x: width, y: height } = PercentageToPx(_objZone.width, _objZone.height);

  theDiv.style.width = `${width}px`;
  theDiv.style.height = `${height}px`;
  theDiv.style.top = `${y}px`;
  theDiv.style.left = `${x}px`;

  // console.log("scale :>> ", scale);
  // if (scale > 1 || scale < 1) {
  //   console.log(
  //     "image.style.left :>> ",
  //     Number.parseFloat(image.style.left.toString().replace("px", ""))
  //   );
  //   console.log(
  //     "image.style.top :>> ",
  //     Number.parseFloat(image.style.top.toString().replace("px", ""))
  //   );

  //   if (Number(image.style.top.toString().replace("px", "")) < 0) {
  //     console.log("if");
  //     theDiv.style.top = `${
  //       y - Number.parseFloat(image.style.top.toString().replace("px", ""))
  //     }px`;
  //     theDiv.style.left = `${
  //       x - Number.parseFloat(image.style.left.toString().replace("px", ""))
  //     }px`;
  //   } else {
  //     console.log("else");
  //     theDiv.style.top = `${
  //       y + Number.parseFloat(image.style.top.toString().replace("px", ""))
  //     }px`;
  //     theDiv.style.left = `${
  //       x + Number.parseFloat(image.style.left.toString().replace("px", ""))
  //     }px`;
  //   }

  // theDiv.style.top = `${y}px`;
  // theDiv.style.left = `${x}px`;
  // } else {

  // }

  makeDraggable(theDiv, _objZone);
  if (_objZone.type != "point") {
    makeResizable(theDiv, _objZone);
  }

  document.getElementById("main-body").appendChild(theDiv);
}

// Make element draggable
function makeDraggable(_element, _objZone) {
  var isDown;
  _element.addEventListener("mousedown", handelMouseDown);
  var endX = 0,
    endY = 0,
    startX = 0,
    startY = 0;

  function handelMouseDown(e) {
    isDown = true;
    if (isDown) {
      let { x, y } = getMousePos(mainBody, e);
      startX = x;
      startY = y;
      document.addEventListener("mouseup", handelMouseUp);
      document.addEventListener("mousemove", handelMouseMove);

      _element.className =
        _objZone.type === "oval" || _objZone.type === "point"
          ? "box oval"
          : "box";
      if (_objZone.type === "point") {
        _element.classList.add("point");
      }
    }
  }

  function handelMouseMove(e) {
    if (isDown) {
      let popover = document.getElementById("popover");
      popover.style.position = "absolute";
      popover.style.top = `${0}px`;
      popover.style.left = `${0}px`;
      popover.style.display = "none";

      if (!_element) {
        return;
      }

      let { x, y } = getMousePos(mainBody, e);
      endX = x;
      endY = y;
      let diffX = endX - startX;
      let diffY = endY - startY;
      startX = x;
      startY = y;
      _element.style.top = `${_element.offsetTop + diffY}px`;
      _element.style.left = `${_element.offsetLeft + diffX}px`;

      _element.style.border = "3px solid red";
    }
  }

  function handelMouseUp(e) {
    if (isDown) {
      if (!_element) {
        return;
      }

      document.onmouseup = null;
      document.onmousemove = null;
      document.onmousedown = null;

      _element.className =
        _objZone.type === "oval" || _objZone.type === "point"
          ? "boxNotActive oval"
          : "boxNotActive";

      if (_objZone.type === "point") {
        _element.classList.add("point");
      }

      const objZone = getZoneFromBox(_element);

      if (zoneOutsideImage(objZone)) {
        console.log("deleteZone called.");
        deleteZone({ ...objZone });
      } else {
        console.log("calling updateZone");
        if (clickedId !== "image") {
          updateZone(objZone);
        }
      }
      isDown = false;
    }
  }
}

function makeResizable(_element, _objZone) {
  var startX, startY, className;
  function addResizeHandles() {
    const left = document.createElement("div");
    left.className = "resizer-left";
    _element.appendChild(left);
    left.addEventListener(
      "mousedown",
      (e) => initDrag(e, "resizer-left"),
      false
    );
    left.parentPopup = _element;

    const right = document.createElement("div");
    right.className = "resizer-right";
    _element.appendChild(right);
    right.addEventListener(
      "mousedown",
      (e) => initDrag(e, "resizer-right"),
      false
    );
    right.parentPopup = _element;

    const top = document.createElement("div");
    top.className = "resizer-top";
    _element.appendChild(top);
    top.addEventListener("mousedown", (e) => initDrag(e, "resizer-top"), false);
    top.parentPopup = _element;

    const bottom = document.createElement("div");
    bottom.className = "resizer-bottom";
    _element.appendChild(bottom);
    bottom.addEventListener(
      "mousedown",
      (e) => initDrag(e, "resizer-bottom"),
      false
    );
    bottom.parentPopup = _element;

    if (_objZone.type !== "oval") {
      const handleTopLeft = document.createElement("div");
      handleTopLeft.className = "resize-top-left";
      _element.appendChild(handleTopLeft);
      handleTopLeft.addEventListener(
        "mousedown",
        (e) => initDrag(e, "resize-top-left"),
        false
      );
      handleTopLeft.parentPopup = _element;

      const handleTopRight = document.createElement("div");
      handleTopRight.className = "resize-top-right";
      _element.appendChild(handleTopRight);
      handleTopRight.addEventListener(
        "mousedown",
        (e) => initDrag(e, "resize-top-right"),
        false
      );
      handleTopRight.parentPopup = _element;

      const handleBottomLeft = document.createElement("div");
      handleBottomLeft.className = "resize-bottom-left";
      _element.appendChild(handleBottomLeft);
      handleBottomLeft.addEventListener(
        "mousedown",
        (e) => initDrag(e, "resize-bottom-left"),
        false
      );
      handleBottomLeft.parentPopup = _element;

      const handleBottomRight = document.createElement("div");
      handleBottomRight.className = "resize-bottom-right";
      _element.appendChild(handleBottomRight);
      handleBottomRight.addEventListener(
        "mousedown",
        (e) => initDrag(e, "resize-bottom-right"),
        false
      );
      handleBottomRight.parentPopup = _element;
    }
  }

  addResizeHandles();

  function initDrag(e, _className) {
    className = _className;
    startX = e.clientX;
    startY = e.clientY;

    e.stopPropagation();
    startWidth = parseFloat(
      document.defaultView.getComputedStyle(_element).width,
      10
    );
    startHeight = parseFloat(
      document.defaultView.getComputedStyle(_element).height,
      10
    );

    document.documentElement.addEventListener("mousemove", doDrag, false);
    document.documentElement.addEventListener("mouseup", stopDrag, false);

    _element.className =
      _objZone.type === "oval" || _objZone.type === "point"
        ? "box oval"
        : "box";
    if (_objZone.type === "point") {
      _element.classList.add("point");
    }
  }

  function doDrag(e) {
    e.stopPropagation();

    let popover = document.getElementById("popover");
    popover.style.position = "absolute";
    popover.style.top = `${0}px`;
    popover.style.left = `${0}px`;
    popover.style.display = "none";

    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (className === "resizer-top") {
      _element.style.height = `${_element.offsetHeight - diffY}px`;
      _element.style.top = `${_element.offsetTop + diffY}px`;
    } else if (className === "resizer-right") {
      _element.style.width = `${_element.offsetWidth + diffX}px`;
    } else if (className === "resizer-left") {
      _element.style.width = `${_element.offsetWidth - diffX}px`;
      _element.style.left = `${_element.offsetLeft + diffX}px`;
    } else if (className === "resizer-bottom") {
      _element.style.height = `${_element.offsetHeight + diffY}px`;
    } else if (className === "resize-top-left") {
      _element.style.width = `${_element.offsetWidth - diffX}px`;
      _element.style.left = `${_element.offsetLeft + diffX}px`;
      _element.style.height = `${_element.offsetHeight - diffY}px`;
      _element.style.top = `${_element.offsetTop + diffY}px`;
    } else if (className === "resize-top-right") {
      _element.style.width = `${_element.offsetWidth + diffX}px`;
      _element.style.height = `${_element.offsetHeight - diffY}px`;
      _element.style.top = `${_element.offsetTop + diffY}px`;
    } else if (className === "resize-bottom-left") {
      _element.style.width = `${_element.offsetWidth - diffX}px`;
      _element.style.left = `${_element.offsetLeft + diffX}px`;
      _element.style.height = `${_element.offsetHeight + diffY}px`;
    } else if (className === "resize-bottom-right") {
      _element.style.width = `${_element.offsetWidth + diffX}px`;
      _element.style.height = `${_element.offsetHeight + diffY}px`;
    }
    startX = e.clientX;
    startY = e.clientY;
  }

  function stopDrag() {
    document.documentElement.removeEventListener("mousemove", doDrag, false);
    document.documentElement.removeEventListener("mouseup", stopDrag, false);

    _element.className =
      _objZone.type === "oval" || _objZone.type === "point"
        ? "boxNotActive oval"
        : "boxNotActive";
    if (_objZone.type === "point") {
      _element.classList.add("point");
    }
    // mainBody.click();
    updateZone(getZoneFromBox(_element));
  }
}

function initZones() {
  let tempAllShape = [];
  // tempAllShape.push({
  //   slug: "94414",
  //   type: "rectangle",
  //   x: 0,
  //   y: 0,
  //   width: 50,
  //   height: 50,
  // });

  // tempAllShape.push({
  //   height: 8.957654723127035,
  //   slug: "94415",
  //   type: "rectangle",
  //   width: 11.491442542787286,
  //   x: 43.76528117359413,
  //   y: 79.96742671009773,
  // });

  // tempAllShape.push({
  //   slug: "94415",
  //   type: "point",
  //   x: 50,
  //   y: 50,
  //   width: 10,
  //   height: 10,
  // });

  // tempAllShape.push({
  //   slug: "94416",
  //   type: "oval",
  //   x: 50,
  //   y: 30,
  //   width: 30,
  //   height: 15,
  // });

  if (tempAllShape.length > 0) {
    tempAllShape?.forEach((objZone) => {
      let { x, y } = PercentageToPx(objZone.x, objZone.y);
      let { x: width, y: height } = PercentageToPx(
        objZone.width,
        objZone.height
      );
      objZone.x = x;
      objZone.y = y;
      objZone.width = width;
      objZone.height = height;
      if (zoneOutsideImage(objZone)) {
        deleteZone(objZone);
      } else {
        addZone(objZone);
        addZoneBox(objZone);
      }
    });
  }
}

// Get the next slug (by adding 1 to the highest slug so far)
function getNextZoneSequence() {
  return Math.floor(Math.random().toFixed(5) * 100000);
}

// User has selected a box on the screen, get the associated objZone
function getZoneFromBox(_element) {
  const intSequence = parseFloat(_element.id.replace("box", ""));
  var objReturn = null;

  getZones().forEach((objZone) => {
    if (objZone.slug.toString() === intSequence.toString()) {
      objReturn = objZone;

      // Make sure coordinates still in line with image on the screen
      objReturn.x = getPixels(_element.style.left);
      objReturn.y = getPixels(_element.style.top);
      objReturn.width = getPixels(_element.style.width);
      objReturn.height = getPixels(_element.style.height);
      objReturn.type = objZone.type;
    }
  });
  return objReturn;
}

// True when zone is dragged outside of the image
function zoneOutsideImage(_objZone) {
  // const elImage = mainBody;

  if (
    mainBody.offsetLeft + mainBody.width < _objZone?.x ||
    mainBody.offsetTop + mainBody.height < _objZone?.y
  ) {
    return true;
  } else {
    return false;
  }
}

// Get pixels from a style
function getPixels(_x) {
  try {
    const intReturn = parseFloat(_x.replace("px", ""));
    return intReturn;
  } catch (error) {
    return 0;
  }
}

// Replace zone with zone passed as parameter
function updateZone(_objZone) {
  console.log("updateZone");
  if (eventType !== "erase" || (eventType !== "clear" && eventType === "")) {
    const arrZones = new Array();
    getZones().forEach((objZone) => {
      if (objZone.slug === _objZone?.slug) {
        let { x, y } = pxToPercentage(_objZone.x, _objZone.y);
        let { x: width, y: height } = pxToPercentage(
          _objZone.width,
          _objZone.height
        );
        _objZone.x = x;
        _objZone.y = y;
        _objZone.width = width;
        _objZone.height = height;
        arrZones.push(_objZone);
        allHistory.push(_objZone);
      } else {
        arrZones.push(objZone);
      }
    });
    allShapes = arrZones;
    console.log("allShapes :>> ", allShapes);

    // localStorage.setItem("allShapes", JSON.stringify(arrZones));
    saveZones(arrZones);
  }
}

// Delete a zone from zone collection
function deleteZone(_objZone) {
  let arrZones = new Array();
  getZones().forEach((item) => {
    if (item.slug.toString() !== _objZone?.slug.toString()) {
      arrZones.push(item);
    }
  });

  allShapes = arrZones;
  saveZones(arrZones);

  document.getElementById(`box${_objZone?.slug}`)?.remove();
}

// Add a zone to zone collection
function addZone(_objZone) {
  const arrZones = getZones();
  let { x, y } = pxToPercentage(_objZone.x, _objZone.y);
  let { x: width, y: height } = pxToPercentage(
    _objZone.type !== "point" ? _objZone.width : 10,
    _objZone.type !== "point" ? _objZone.height : 10
  );
  _objZone.x = x;
  _objZone.y = y;
  // if (_objZone.type !== "point") {
  _objZone.width = width;
  _objZone.height = height;
  // }
  arrZones.push(_objZone);
  allHistory.push(_objZone);
  allShapes = arrZones;
  // localStorage.setItem("allShapes", JSON.stringify(allShapes));
  saveZones(
    arrZones.sort(function (a, b) {
      a.slug - b.slug;
    })
  );
}

// Save zone collection in the field that is submitted
function saveZones(_arr) {
  var strZones = "";
  // const elImage = mainBody;
  // const elImage = document.getElementById("image");

  // const dblRatio = getImageRatio(elImage);

  _arr.forEach((objZone) => {
    if (strZones.length > 0) {
      strZones += "\n";
    }
    strZones +=
      parseFloat(objZone.x) +
      " " +
      parseFloat(objZone.y) +
      " " +
      parseFloat(objZone.width) +
      " " +
      parseFloat(objZone.height) +
      " " +
      objZone.slug +
      " " +
      objZone.type;
  });
  generateList();
  document.getElementsByName("ctrZones")[0].value = strZones;
}

// Get zone collection from fields on the screen
function getZones() {
  const strZones = document.getElementsByName("ctrZones")[0].value;
  const arrZones = new Array();
  // const elImage = document.getElementById("image");
  // const dblRatio = getImageRatio(elImage);

  strZones.split(/\r?\n/).forEach((strLine) => {
    if (strLine.trim().length > 0) {
      const arrTokens = strLine.split(" ").filter((e) => e.trim().length > 0);
      arrZones.push({
        x: parseFloat(arrTokens[0]),
        y: parseFloat(arrTokens[1]),
        width: parseFloat(arrTokens[2]),
        height: parseFloat(arrTokens[3]),
        slug: arrTokens[4],
        type: arrTokens[5],
      });
    }
  });
  return arrZones;
}

// Return x,y for a given element
function getElementPosition(_element) {
  var xPos = 0,
    yPos = 0;

  if (typeof _element.getBoundingClientRect === "function") {
    return {
      x: _element.getBoundingClientRect().x,
      y: _element.getBoundingClientRect().y,
    };
  } else {
    while (_element) {
      xPos += _element.offsetLeft - _element.scrollLeft + _element.clientLeft;
      yPos += _element.offsetTop - _element.scrollTop + _element.clientTop;
      _element = _element.offsetParent;
    }

    return { x: xPos, y: yPos };
  }
}

// convert px To Percentage
function pxToPercentage(_startX, _startY) {
  let width = getPixels(mainBody.style.width);
  let height = getPixels(mainBody.style.height);
  let xPercent = parseFloat((_startX / width) * 100);
  let yPercent = parseFloat((_startY / height) * 100);
  return { x: xPercent, y: yPercent };
}

// convert Percentage To Px
function PercentageToPx(_startX, _startY) {
  let width = getPixels(mainBody.style.width);
  let height = getPixels(mainBody.style.height);
  let orgX = parseFloat((_startX / 100) * width);
  let orgY = parseFloat((_startY / 100) * height);
  return { x: orgX, y: orgY };
}

// select div box
function selectBox(ID) {
  if (eventType === "") {
    let _id = Number(ID);
    if (selectedId === _id) {
      // mainBody.click();
      const boxes = document.querySelectorAll(".boxNotActive");
      boxes.forEach((box) => {
        box.style.border = "3px solid black";
      });

      const links = document.querySelectorAll(".annotation-link");
      links.forEach((link) => {
        link.style.textDecoration = "none";
      });

      closePopOver(_id);
      selectedId = null;
    } else {
      selectedId = Number(_id);

      const boxes = document.querySelectorAll(".boxNotActive");
      boxes.forEach((box) => {
        box.style.border = "3px solid black";
      });

      const links = document.querySelectorAll(".annotation-link");
      links.forEach((link) => {
        link.style.color = "#0d6efd";
        link.style.textDecoration = "none";
      });

      const selectedBox = document.getElementById(`box${selectedId}`);
      selectedBox.style.border = "3px solid red";

      const link = document.getElementById(`link${ID}`);
      link.style.color = "black";
      link.style.textDecoration = "underline";

      openPopOver(selectedId);
    }
  }
}

// open popover
function openPopOver(_selectedId) {
  // mainBody.click();
  let _shape = allShapes.filter(
    (item) => item.slug == _selectedId.toString()
  )[0];
  let { x, y } = PercentageToPx(_shape.x, _shape.y);
  let { y: height } = PercentageToPx(_shape?.width, _shape?.height);

  let popover = document.getElementById("popover");
  popover.style.display = "block";
  popover.style.position = "absolute";
  popover.style.transform = `rotate(0deg)`;
  if (_shape.type !== "point") {
    popover.style.top = `${y + height}px`;
    popover.style.left = `${x}px`;
  } else {
    popover.style.top = `${y}px`;
    popover.style.left = `${x}px`;
  }

  const ul = document.getElementById("details-list");
  ul.innerHTML = "";
  let details = allDetails.filter((item) => item.id == _shape?.slug)[0]
    ?.details;
  for (const idx in details) {
    const li = document.createElement("li");
    li.innerHTML = details[idx];
    ul.appendChild(li);
  }
}

// close popover
function closePopOver(ID) {
  const ul = document.getElementById("details-list");
  const listItems = Object.assign(
    {},
    Array.from(ul.children).map((li) => li.innerHTML)
  );

  let temp = allDetails.filter((item) => item.id === ID)[0]?.details;

  if (temp) {
    const item = allDetails.find((item) => item.id === ID);
    item.details = listItems;
    item.id = ID;
  } else {
    allDetails.push({ id: ID, details: listItems });
  }

  ul.innerHTML = "";

  const selectedBox = document.getElementById(`box${ID}`);
  selectedBox.style.border = "3px solid black";

  const link = document.getElementById(`link${ID}`);
  link.style.color = "#0d6efd";
  link.style.textDecoration = "none";

  let popover = document.getElementById("popover");
  popover.style.position = "absolute";
  popover.style.top = `${0}px`;
  popover.style.left = `${0}px`;
  popover.style.display = "none";

  selectedId = null;
  // mainBody.click();
}

// close popover
function handelClose() {
  let input = document.getElementById("details");
  input.value = "";
  closePopOver(selectedId);
}

// add item in popover list
function handelSubmit() {
  let input = document.getElementById("details");
  const ul = document.getElementById("details-list");
  const li = document.createElement("li");
  let val = input.value.toString().trim();
  if (val.length > 0) {
    li.innerHTML = val;
    ul.appendChild(li);
    input.value = "";
  } else {
    window.alert("Please enter details.");
  }
}

// generate list of annotation
function generateList() {
  var ul = document.getElementById("annotationList");
  ul.innerHTML = "";
  allShapes?.forEach((value) => {
    var li = document.createElement("li");
    var a = document.createElement("a");
    let text = document.createTextNode(`Annotation ${value.slug}`);
    a.appendChild(text);
    a.setAttribute("href", "#");
    a.setAttribute("id", `link${value.slug}`);
    a.setAttribute("class", "annotation-link");
    li.appendChild(a);
    ul.appendChild(li);
    a.addEventListener("click", handelListItemClick);
  });
}

function handelListItemClick(e) {
  let id = e.target.id.toString().replace("link", "");
  selectBox(id);
}

function getRotationAngle(ele) {
  const style = window.getComputedStyle(ele);
  const transform = style.getPropertyValue("transform");
  const matrix = transform.substr(7).split(",");
  const angle = Math.round(Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI));
  return angle;
}
