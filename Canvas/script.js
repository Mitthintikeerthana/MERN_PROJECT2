const colorPicker = document.getElementById("color");
const brushSizeSelector = document.getElementById("BrushSize");
const penTool = document.getElementById("pen");
const eraserTool = document.getElementById("eraser");
const drawSquareBtn = document.getElementById("square");
const clearCanvasBtn = document.getElementById("clean");
const DownloadDrawingBtn = document.getElementById("download");
const canvas = document.getElementById("canvas");

// Line , eraser , clear drawing , downaload, Square

const ctx = canvas.getContext("2d");

canvas.height = 420;
canvas.width = 800;

let isDrawing = false;
let currentTool = "pen";
let isDrawingSquare = false;
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSizeSelector.value;
ctx.lineCap = "round";

let startX = 0;
let startY = 0;
let snapshot;

function startDraw(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();

    if (isDrawingSquare) {
        // Save the canvas state before starting to drag the square
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
        ctx.moveTo(e.offsetX, e.offsetY);
    }
}

function draw(e) {
    if (!isDrawing) return;

    if (isDrawingSquare) {
        // Restore the original state to avoid trails, then draw the new rect
        ctx.putImageData(snapshot, 0, 0);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSizeSelector.value;
        let width = e.offsetX - startX;
        let height = e.offsetY - startY;
        ctx.strokeRect(startX, startY, width, height);
    } else {
        ctx.strokeStyle = currentTool == "eraser" ? "#ffffff" : colorPicker.value;
        ctx.lineWidth = brushSizeSelector.value;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
}

function stopDrawing(e) {
    isDrawing = false;
}

eraserTool.addEventListener("click", function() {
    isDrawingSquare = false;
    penTool.classList.remove("active");
    eraserTool.classList.add("active");
    drawSquareBtn.classList.remove("active");
    currentTool = "eraser";
});
penTool.addEventListener("click", function() {
    isDrawingSquare = false;
    penTool.classList.add("active");
    eraserTool.classList.remove("active");
    drawSquareBtn.classList.remove("active");
    currentTool = "pen";
});

drawSquareBtn.addEventListener("click", function() {
    penTool.classList.remove("active");
    eraserTool.classList.remove("active");
    drawSquareBtn.classList.add("active");
    isDrawingSquare = true;
});

clearCanvasBtn.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

DownloadDrawingBtn.addEventListener("click", function() {
    let canvasImage = canvas.toDataURL("image/png");
    let anchorEle = document.createElement("a");
    anchorEle.href = canvasImage;
    anchorEle.download = "WhiteBoard.png";
    document.body.appendChild(anchorEle);
    anchorEle.click();
    document.body.removeChild(anchorEle);
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);