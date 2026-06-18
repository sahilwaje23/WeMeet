// module imports

import { useRef, useEffect, useState } from "react";

//file imports
import socket from "../socket/socket";

export default function Whiteboard({ onClose, roomId }) {
  // declaring state variables
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const [eraserSize, setEraserSize] = useState(25);
  const lastPoint = useRef(null);
  // useEffects

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //seems whiteboard draw sync with server
    socket.on("draw", (data) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.beginPath();

      ctx.strokeStyle = data.isErasing ? "white" : data.color;
      ctx.lineWidth = data.isErasing ? 25 : data.brushSize;
      ctx.lineCap = "round";

      ctx.moveTo(data.x0, data.y0);
      ctx.lineTo(data.x1, data.y1);

      ctx.stroke();
    });

    socket.on("draw-start", (data) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    });

    socket.on("draw-end", () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");

      ctx.beginPath();
    });

    // whenever new user joins get the whiteboard updates

    socket.emit("get-whiteboard-history", roomId);

    socket.on("whiteboard-history", (strokes) => {
      console.log(
        "we got the whiteboard history and strokes from backend bro , here we go: ",
        strokes,
      );
      console.log(strokes[0]);

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      strokes.forEach((stroke) => {
        ctx.beginPath();

        ctx.strokeStyle = stroke.isErasing ? "white" : stroke.color;

        ctx.lineWidth = stroke.isErasing ? 20 : stroke.brushSize;

        ctx.lineCap = "round";

        ctx.moveTo(stroke.x0, stroke.y0);

        ctx.lineTo(stroke.x1, stroke.y1);

        ctx.stroke();
      });
    });

    socket.on("clear-board", () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("draw");
      socket.off("draw-start");
      socket.off("draw-end");
      socket.off("whiteboard-history");
      socket.off("get-whiteboard-history");
      socket.off("clear-board");
    };
  }, []);

  // Functions

  const startDrawing = (e) => {
    isDrawing.current = true;

    lastPoint.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    socket.emit("draw-start", {
      roomId,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    if (!lastPoint.current) return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    // ctx.lineWidth = 3;
    ctx.lineWidth = brushSize;

    ctx.lineCap = "round";

    // ctx.strokeStyle = "black";
    // ctx.strokeStyle = color;
    if (isErasing) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = eraserSize;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctx.stroke();

    socket.emit("draw", {
      roomId,

      x0: lastPoint.current.x,
      y0: lastPoint.current.y,

      x1: e.nativeEvent.offsetX,
      y1: e.nativeEvent.offsetY,

      color,
      brushSize,
      isErasing,
    });

    lastPoint.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const stopDrawing = () => {
    isDrawing.current = false;

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();

    socket.emit("draw-end", { roomId });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;

    const link = document.createElement("a");

    link.download = `whiteboard-${Date.now()}.png`;

    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // inform the server about the whiteboard status change
    socket.emit("clear-board", roomId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="w-[90vw] h-[85vh] bg-[#111111] rounded-xl overflow-hidden flex flex-col">
        {/*Header section */}

        <div className="bg-[#111111] flex justify-between items-center p-3">
          <span className="font-bold text-white">Whiteboard</span>

          <div className="flex gap-2">
            {/*Eraser */}
            <button
              onClick={() => setIsErasing(!isErasing)}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                isErasing ? "bg-red-500 text-white" : "bg-[#111111] text-white"
              }`}
            >
              Eraser
            </button>

            {/* Brush Size */}
            <div className="flex items-center gap-1 bg-[#1A1A2E] px-2 py-1 rounded-lg">
              <button
                onClick={() => setBrushSize(2)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  brushSize === 2
                    ? "bg-[#00D4FF] text-black"
                    : "bg-[#111111] text-white"
                }`}
              >
                S
              </button>

              <button
                onClick={() => setBrushSize(4)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  brushSize === 4
                    ? "bg-[#00D4FF] text-black"
                    : "bg-[#111111] text-white"
                }`}
              >
                M
              </button>

              <button
                onClick={() => setBrushSize(8)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  brushSize === 8
                    ? "bg-[#00D4FF] text-black"
                    : "bg-[#111111] text-white"
                }`}
              >
                L
              </button>
            </div>

            {/* Color Picker */}
            <div className="bg-[#1A1A2E] px-2 py-1 rounded-lg flex gap-2">
              {/* <button
                  onClick={() => setColor("#000000")}
                  className="w-6 h-6 rounded-full bg-black border"
                /> */}

              <button
                onClick={() => setColor("#000000")}
                className={`w-6 h-6 rounded-full bg-black-500 transition-all ${
                  color === "#000000"
                    ? "ring-2 ring-white scale-110"
                    : "opacity-70"
                }`}
              />

              {/* <button
                  onClick={() => setColor("#ef4444")}
                  className="w-6 h-6 rounded-full bg-red-500"
                /> */}

              <button
                onClick={() => setColor("#ef4444")}
                className={`w-6 h-6 rounded-full bg-red-500 transition-all ${
                  color === "#ef4444"
                    ? "ring-2 ring-white scale-110"
                    : "opacity-70"
                }`}
              />
              {/* 
              <button
                onClick={() => setColor("#3b82f6")}
                className="w-6 h-6 rounded-full bg-blue-500"
              /> */}

              <button
                onClick={() => setColor("#3b82f6")}
                className={`w-6 h-6 rounded-full bg-blue-500 transition-all ${
                  color === "#3b82f6"
                    ? "ring-2 ring-white scale-110"
                    : "opacity-70"
                }`}
              />
              {/* 
              <button
                onClick={() => setColor("#22c55e")}
                className="w-6 h-6 rounded-full bg-green-500"
              /> */}

              <button
                onClick={() => setColor("#22c55e")}
                className={`w-6 h-6 rounded-full bg-green-500 transition-all ${
                  color === "#22c55e"
                    ? "ring-2 ring-white scale-110"
                    : "opacity-70"
                }`}
              />

              {/* <button
                onClick={() => setColor("#eab308")}
                className="w-6 h-6 rounded-full bg-yellow-500"
              /> */}

              <button
                onClick={() => setColor("#eab308")}
                className={`w-6 h-6 rounded-full bg-yellow-500 transition-all ${
                  color === "#eab308"
                    ? "ring-2 ring-white scale-110"
                    : "opacity-70"
                }`}
              />
            </div>

            <button
              onClick={clearCanvas}
              className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-400"
            >
              Clear
            </button>

            <button
              onClick={downloadCanvas}
              className="bg-[#00D4FF] text-black px-3 py-1 rounded text-sm font-semibold hover:opacity-90"
            >
              Download
            </button>

            <button
              onClick={onClose}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <canvas
            ref={canvasRef}
            width={4000}
            height={3000}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            style={{ touchAction: "none" }}
            className="bg-white rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
