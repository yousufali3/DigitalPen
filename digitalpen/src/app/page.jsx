"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  //states
  const [drawing, setDrawing] = useState(false);
  const [penSize, setPenSize] = useState(1);
  const [eraserSize, setEraserSize] = useState(10);

  const [penSelect, setPenSelect] = useState(true);
  const [eraserSelect, setEraserSelect] = useState(false);

  const [penColor, setPenColor] = useState("black");

  //state that manages canvas Height and Width
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 1200,
    height: 400,
  });

  //function to toggle between pen and eraser
  const eraserClicked = () => {
    setPenSelect(!penSelect);
    setEraserSelect(!eraserSelect);

    // setPenSelect(false);
    // setEraserSelect(true);
    if (eraserSelect === true) {
      console.log("eraser selected: true");
    } else {
      console.log("eraser selected: false");
    }
  };

  //getting reference to the canvas and the context
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  //getting the context of the canvas using useRef

  useEffect(() => {
    const canvasBody = canvasRef.current;
    const canvasContext = canvasBody.getContext("2d");

    // const canvasContext = canvasBody?.getContext('2d');

    //condition checking if the canvas has been initialized, then this code block does not run, if canvas is empty, then this code block runs

    // this code block is written to give a white bg to the downloaded image otherwise we are getting a transparent png
    if (!canvasBody?.getAttribute("data-initialized")) {
      canvasContext.fillStyle = "#ffffff";
      canvasContext.fillRect(0, 0, canvasBody.width, canvasBody.height);
      canvasBody?.setAttribute("data-initialized", true);
    }

    canvasContext.lineCap = "round";

    if (penSelect === true) {
      canvasContext.strokeStyle = `${penColor}`;
      canvasContext.lineWidth = `${penSize}`;
    } else if (eraserSelect === true) {
      canvasContext.strokeStyle = "white";
      canvasContext.lineWidth = `${eraserSize}`;
    }

    contextRef.current = canvasContext;
  }, [penSelect, eraserSelect, penSize, eraserSize, penColor]);

  //useEffect that gets the screen height and width and then sets the canvas height and width according to the the screen

  useEffect(() => {
    function updateCanvasDimensions() {
      const canvas = canvasRef.current;
      const parent = canvas.parentNode;
      const width = parent.offsetWidth - 70;
      const height = 400;

      canvas.width = width;
      canvas.height = height;

      const canvasContext = canvas.getContext("2d");
      canvasContext.fillStyle = "#ffffff";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      setCanvasDimensions({ width, height });
    }

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, []);

  //functions to draw/write
  const startWriting = ({ nativeEvent }) => {
    //this line helps in defining the path where the line will be drawn
    const { offsetX, offsetY } = nativeEvent;

    //beginning the path and then moving it to nativeEvent called
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  //function to stop the pen
  const stopWriting = () => {
    contextRef.current?.closePath();
    setDrawing(false);
  };

  //function to cater if the user is drawing
  const writing = ({ nativeEvent }) => {
    if (!drawing) {
      return;
    }

    //again same thing, used to define the path where the line will be drawn
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  //function to clear the whole board, this function is set on a button click
  const clearBoard = () => {
    const canvas = contextRef.current.canvas;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  //function to download the image when download button is clicked
  const download = () => {
    // changing the canvas to png image
    var imageData = canvasRef.current.toDataURL("image/png");
    //creating a new A tag to link it to download
    var link = document.createElement("a");
    link.href = imageData;

    link.download = "your_sign.png";

    link.click();
  };

  return (
    <>
      <div className="h-full w-full text-[#fdf0d5] flex flex-col justify-center items-center sm:h-full sm:w-full sm:text-[#fdf0d5] sm:flex sm:flex-col sm:justify-center sm:items-center md:h-full md:w-full md:text-[#fdf0d5] md:flex md:flex-col md:justify-center md:items-center lg:h-full lg:w-full lg:text-[#fdf0d5] lg:flex lg:flex-col lg:justify-center lg:items-center xl:h-full xl:w-full xl:text-[#fdf0d5] xl:flex xl:flex-col xl:justify-center xl:items-center 2xl:h-full 2xl:w-full 2xl:text-[#fdf0d5] 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center">
        <h1 className="my-8 text-4xl font-bold sm:my-8 sm:text-6xl sm:font-bold md:my-8 md:text-6xl md:font-bold lg:my-8 lg:text-6xl lg:font-bold xl:my-8 xl:text-6xl xl:font-bold 2xl:my-8 2xl:text-6xl 2xl:font-bold">
          {" "}
          DIGITAL PEN
        </h1>

        <canvas
          className="border-4 rounded-xl bg-white border-[#223029] hover:cursor-crosshair"
          height={canvasDimensions.height}
          width={canvasDimensions.width}
          onMouseDown={startWriting}
          onMouseUp={stopWriting}
          onMouseMove={writing}
          ref={canvasRef}
        ></canvas>

        <button
          className="text-base mt-8 h-8 w-28 text-[#223029] font-bold bg-[#fdf0d5] rounded-md hover:bg-[#223029] hover:text-[#fdf0d5] hover:border-2 hover:border-[#fdf0d5]
        
        sm:text-base sm:mt-8 sm:h-8 sm:w-28 sm:text-[#223029] sm:font-bold sm:bg-[#fdf0d5] sm:rounded-md sm:hover:bg-[#223029] sm:hover:text-[#fdf0d5] sm:hover:border-2 sm:hover:border-[#fdf0d5]
        
        md:text-base md:mt-8 md:h-8 md:w-28 md:text-[#223029] md:font-bold md:bg-[#fdf0d5] md:rounded-md md:hover:bg-[#223029] md:hover:text-[#fdf0d5] md:hover:border-2 md:hover:border-[#fdf0d5]
        
        lg:text-base lg:mt-8 lg:h-8 lg:w-28 lg:text-[#223029] lg:font-bold lg:bg-[#fdf0d5] lg:rounded-md lg:hover:bg-[#223029] lg:hover:text-[#fdf0d5] lg:hover:border-2 lg:hover:border-[#fdf0d5]
        
        xl:text-base xl:mt-8 xl:h-8 xl:w-28 xl:text-[#223029] xl:font-bold xl:bg-[#fdf0d5] xl:rounded-md xl:hover:bg-[#223029] xl:hover:text-[#fdf0d5] xl:hover:border-2 xl:hover:border-[#fdf0d5]
        
        2xl:text-base 2xl:mt-8 2xl:h-8 2xl:w-28 2xl:text-[#223029] 2xl:font-bold 2xl:bg-[#fdf0d5] 2xl:rounded-md 2xl:hover:bg-[#223029] 2xl:hover:text-[#fdf0d5] 2xl:hover:border-2 2xl:hover:border-[#fdf0d5]"
          onClick={clearBoard}
        >
          Clear Board
        </button>

        <div
          className="w-[100%] my-8 flex flex-col justify-evenly items-center
        
        sm:w-[100%] sm:my-8 sm:flex sm:flex-col sm:justify-evenly sm:items-center
        
        md:w-[100%] md:my-8 md:flex md:flex-row md:justify-evenly md:items-center
        
        lg:w-[100%] lg:my-8 lg:flex lg:flex-row lg:justify-evenly lg:items-center
        
        xl:w-[100%] xl:my-8 xl:flex xl:flex-row xl:justify-evenly xl:items-center
        
        2xl:w-[70%] 2xl:my-8 2xl:flex 2xl:flex-row 2xl:justify-evenly 2xl:items-center"
        >
          <div
            className="flex flex-row
              
              sm:flex sm:flex-row 
              
              md:flex md:flex-row 
              
              lg:flex lg:flex-row 
              
              xl:flex xl:flex-row 
              
              2xl:flex 2xl:flex-row"
          >
            <h1
              className="text-xs my-3 mx-4 font-bold
              
              sm:text-xs sm:my-3 sm:mx-4 sm:font-bold
              
              md:text-xs md:my-3 md:mx-2 md:font-bold
              
              lg:text-xs lg:my-3 lg:mx-2 lg:font-bold
              
              xl:text-xs xl:my-3 xl:mx-3 xl:font-bold
              
              2xl:text-xs 2xl:my-3  2xl:mx-3 2xl:font-bold"
            >
              PEN SIZE
            </h1>

            <input
              type="range"
              name=""
              id=""
              min={1}
              max={10}
              value={penSize}
              onChange={(e) => setPenSize(e.target.value)}
              className="w-32 hover:cursor-pointer sm:w-32 sm:hover:cursor-pointer md:w-16 md:hover:cursor-pointer lg:w-[50%] lg:hover:cursor-pointer  xl:hover:cursor-pointer 2xl:hover:cursor-pointer"
            />

            <h1
              className="font-bold mx-4 my-2
              
              sm:font-bold sm:mx-4 sm:my-2
              
              md:font-bold md:mx-2 md:my-2
              
              lg:font-bold lg:my-2 lg:mx-2
              
              xl:font-bold xl:mx-3
              
              2xl:font-bold 2xl:mx-4"
            >
              {penSize}
            </h1>
          </div>

          <label
            className="my-4 inline-flex items-center cursor-pointer
            
            sm:my-4 sm:inline-flex sm:items-center sm:cursor-pointer
            
            md:mx-2 md:inline-flex md:items-center md:cursor-pointer
            
            lg:mx-4 lg:inline-flex lg:items-center lg:cursor-pointer
            
            xl:mx-2 xl:inline-flex xl:items-center xl:cursor-pointer
            
            2xl:mx-4 2xl:inline-flex 2xl:items-center 2xl:cursor-pointer"
          >
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={eraserSelect}
              onChange={eraserClicked}
            />

            <span
              className="mx-3 text-sm font-bold text-[#fdf0d5]
              
              sm:mx-1 sm:text-sm sm:font-bold sm:text-[#fdf0d5]
              
              md:mx-1 md:text-sm md:font-bold md:text-[#fdf0d5]
              
              lg:mx-2 lg:text-sm lg:font-bold lg:text-[#fdf0d5]
              
              xl:mx-2 xl:text-sm xl:font-bold xl:text-[#fdf0d5]
              
              2xl:mx-2 2xl:text-sm 2xl:font-bold 2xl:text-[#fdf0d5] "
            >
              PEN
            </span>

            <div
              className="relative w-11 h-6 mx-0 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fdf0d5] dark:peer-focus:ring-[#fdf0d5] rounded-full peer dark:bg-[#344e41] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[#fdf0d5] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#fdf0d5] after:border-[#fdf0d5] after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#344e41]
              
              sm:relative sm:w-11 sm:h-6 sm:mx-0 sm:bg-gray-200 sm:peer-focus:outline-none sm:peer-focus:ring-4 sm:peer-focus:ring-[#fdf0d5] sm:dark:peer-focus:ring-[#fdf0d5] sm:rounded-full sm:peer sm:dark:bg-[#344e41] sm:peer-checked:after:translate-x-full sm:rtl:peer-checked:after:-translate-x-full sm:peer-checked:after:border-[#fdf0d5] sm:after:content-[''] sm:after:absolute sm:after:top-[2px] sm:after:start-[2px] sm:after:bg-[#fdf0d5] sm:after:border-[#fdf0d5] sm:after:border sm:after:rounded-full sm:after:h-5 sm:after:w-5 sm:after:transition-all sm:dark:border-gray-600 sm:peer-checked:bg-[#344e41]
              
              md:relative md:w-11 md:h-6 md:mx-0 md:bg-gray-200 md:peer-focus:outline-none md:peer-focus:ring-4 md:peer-focus:ring-[#fdf0d5] md:dark:peer-focus:ring-[#fdf0d5] md:rounded-full md:peer md:dark:bg-[#344e41] md:peer-checked:after:translate-x-full md:rtl:peer-checked:after:-translate-x-full md:peer-checked:after:border-[#fdf0d5] md:after:content-[''] md:after:absolute md:after:top-[2px] md:after:start-[2px] md:after:bg-[#fdf0d5] md:after:border-[#fdf0d5] md:after:border md:after:rounded-full md:after:h-5 md:after:w-5 md:after:transition-all md:dark:border-gray-600 md:peer-checked:bg-[#344e41]
              
              lg:relative lg:w-11 lg:h-6 lg:mx-1 lg:bg-gray-200 lg:peer-focus:outline-none lg:peer-focus:ring-4 lg:peer-focus:ring-[#fdf0d5] lg:dark:peer-focus:ring-[#fdf0d5] lg:rounded-full lg:peer lg:dark:bg-[#344e41] lg:peer-checked:after:translate-x-full lg:rtl:peer-checked:after:-translate-x-full lg:peer-checked:after:border-[#fdf0d5] lg:after:content-[''] lg:after:absolute lg:after:top-[2px] lg:after:start-[2px] lg:after:bg-[#fdf0d5] lg:after:border-[#fdf0d5] lg:after:border lg:after:rounded-full lg:after:h-5 lg:after:w-5 lg:after:transition-all lg:dark:border-gray-600 lg:peer-checked:bg-[#344e41]
              
              xl:relative xl:w-11 xl:h-6 xl:mx-1 xl:bg-gray-200 xl:peer-focus:outline-none xl:peer-focus:ring-4 xl:peer-focus:ring-[#fdf0d5] xl:dark:peer-focus:ring-[#fdf0d5] xl:rounded-full xl:peer xl:dark:bg-[#344e41] xl:peer-checked:after:translate-x-full xl:rtl:peer-checked:after:-translate-x-full xl:peer-checked:after:border-[#fdf0d5] xl:after:content-[''] xl:after:absolute xl:after:top-[2px] xl:after:start-[2px] xl:after:bg-[#fdf0d5] xl:after:border-[#fdf0d5] xl:after:border xl:after:rounded-full xl:after:h-5 xl:after:w-5 xl:after:transition-all xl:dark:border-gray-600 xl:peer-checked:bg-[#344e41]
              
              2xl:relative 2xl:w-11 2xl:h-6 2xl:mx-1 2xl:bg-gray-200 2xl:peer-focus:outline-none 2xl:peer-focus:ring-4 2xl:peer-focus:ring-[#fdf0d5] 2xl:dark:peer-focus:ring-[#fdf0d5] 2xl:rounded-full 2xl:peer 2xl:dark:bg-[#344e41] 2xl:peer-checked:after:translate-x-full 2xl:rtl:peer-checked:after:-translate-x-full 2xl:peer-checked:after:border-[#fdf0d5] 2xl:after:content-[''] 2xl:after:absolute 2xl:after:top-[2px] 2xl:after:start-[2px] 2xl:after:bg-[#fdf0d5] 2xl:after:border-[#fdf0d5] 2xl:after:border 2xl:after:rounded-full 2xl:after:h-5 2xl:after:w-5 2xl:after:transition-all 2xl:dark:border-gray-600 2xl:peer-checked:bg-[#344e41]"
            ></div>

            <span
              className="mx-3 text-sm font-bold text-[#fdf0d5]
              
              sm:mx-1 sm:text-sm sm:font-bold sm:text-[#fdf0d5]
              
              md:mx-1 md:text-sm md:font-bold md:text-[#fdf0d5]
              
              lg:mx-2 lg:text-sm lg:font-bold lg:text-[#fdf0d5]
              
              xl:mx-2 xl:text-sm xl:font-bold xl:text-[#fdf0d5]
              
              2xl:mx-2 2xl:text-sm 2xl:font-bold 2xl:text-[#fdf0d5] "
            >
              ERASER
            </span>
          </label>

          <div
            className="mb-2 flex flex-row
              
              sm:mb-2 sm:flex sm:flex-row
              
              md:mx-2 md:flex md:flex-row
              
              lg:mx-4 lg:flex lg:flex-row
              
              xl:mx-5 xl:flex xl:flex-row 
              
              2xl:mx-4 2xl:flex 2xl:flex-row"
          >
            <h1
              className="text-xs my-5 mx-2 font-bold
                
                sm:text-xs sm:my-5 sm:mx-2 sm:font-bold
                
                md:text-xs md:my-5 md:mx-2 md:font-bold
                
                lg:text-xs lg:my-5 lg:mx-2 lg:font-bold
                
                xl:text-xs xl:my-5 xl:mx-2 xl:font-bold
                
                2xl:w-24 2xl:text-xs 2xl:my-5 2xl:mx-1 2xl:font-bold"
            >
              ERASER SIZE
            </h1>

            <input
              type="range"
              name=""
              id=""
              min={5}
              max={20}
              value={eraserSize}
              onChange={(e) => setEraserSize(e.target.value)}
              className="w-32 hover:cursor-pointer  sm:w-32 sm:hover:cursor-pointer md:w-16 md:hover:cursor-pointer lg:w-[50%] lg:hover:cursor-pointer  xl:hover:cursor-pointer 2xl:hover:cursor-pointer"
            />

            <h1
              className="mx-2 my-4 font-bold
                
                sm:mx-2 sm:my-4 sm:font-bold
                
                md:mx-2 md:my-4 md:font-bold
                
                lg:mx-2 lg:font-bold
                
                xl:mx-2 xl:font-bold
                
                2xl:mx-4 2xl:font-bold"
            >
              {eraserSize}
            </h1>
          </div>

          <input
            type="color"
            name=""
            id=""
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="mb-2 w-20 rounded-md hover:cursor-pointer
            
            sm:mb-2 sm:w-20 sm:rounded-md sm:hover:cursor-pointer
            
            md:mx-2 md:w-20 md:rounded-md md:hover:cursor-pointer
            
            lg:mx-4 lg:w-20 lg:rounded-md lg:hover:cursor-pointer
            
            xl:mx-2 xl:w-20 xl:rounded-md xl:hover:cursor-pointer
            
            2xl:mx-4 2xl:w-20 2xl:rounded-md 2xl:hover:cursor-pointer"
          />

          <button
            className="text-sm my-3 h-8 w-24 text-[#223029] font-bold bg-[#fdf0d5] rounded-md hover:bg-[#223029] hover:text-[#fdf0d5] hover:border-2 hover:border-[#fdf0d5]
            
            sm:text-sm sm:my-4 sm:h-8 sm:w-24 sm:text-[#223029] sm:font-bold sm:bg-[#fdf0d5] sm:rounded-md sm:hover:bg-[#223029] sm:hover:text-[#fdf0d5] sm:hover:border-2 sm:hover:border-[#fdf0d5]
            
            md:text-sm md:mx-4 md:mb-6 md:h-8 md:w-24 md:text-[#223029] md:font-bold md:bg-[#fdf0d5] md:rounded-md md:hover:bg-[#223029] md:hover:text-[#fdf0d5] md:hover:border-2 md:hover:border-[#fdf0d5]
            
            lg:text-base lg:mx-5 lg:mb-6  lg:h-8 lg:w-28 lg:text-[#223029] lg:font-bold lg:bg-[#fdf0d5] lg:rounded-md lg:hover:bg-[#223029] lg:hover:text-[#fdf0d5] lg:hover:border-2 lg:hover:border-[#fdf0d5]
            
            xl:text-base xl:mx-5 xl:mb-6 xl:h-8 xl:w-28 xl:text-[#223029] xl:font-bold xl:bg-[#fdf0d5] xl:rounded-md xl:hover:bg-[#223029] xl:hover:text-[#fdf0d5] xl:hover:border-2 xl:hover:border-[#fdf0d5]
            
            2xl:text-base 2xl:mx-10 2xl:mb-6 2xl:h-8 2xl:w-28 2xl:text-[#223029] 2xl:font-bold 2xl:bg-[#fdf0d5] 2xl:rounded-md 2xl:hover:bg-[#223029] 2xl:hover:text-[#fdf0d5] 2xl:hover:border-2 2xl:hover:border-[#fdf0d5]"
            onClick={download}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
}
