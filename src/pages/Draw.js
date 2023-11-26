import React, { useState } from "react";
import {
  //CanvasPath,
  //ExportImageType,
  ReactSketchCanvas,
  //ReactSketchCanvasProps,
  //ReactSketchCanvasRef,
} from "react-sketch-canvas";
import firebase from "../utils/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

const equalParam = window.location.href.lastIndexOf("=") + 1;
const playUrl = window.location.href.substring(equalParam);
//console.log("currentUrl: " , currentUrl);
//console.log("equalParam: " , equalParam);
//console.log("playUrl: " , playUrl);

const lastParam = window.location.href.lastIndexOf("/") + 1;
const SID = window.location.href.substring(lastParam);
//console.log("SID: " , SID);
const svgRef = ref(storage, `svgs/${ SID + ".svg" } `);


const Handlers = [
  ["string", () => {}, "string"],
];

function InputField({
  fieldName,
  type = "text",
  canvasProps,
  setCanvasProps,
  displayName,
}) {
  const handleChange = ({
    target,
  }) => {
    setCanvasProps((prevCanvasProps) => ({
      ...prevCanvasProps,
      [fieldName]: target.value,
    }));
  };

  const id = `validation${fieldName}`;

  return (
    <div className="p-2 col-10">
      <label htmlFor={id} className="form-label">
        {displayName}
      </label>
      <input
        name={fieldName}
        type={type}
        className="form-control"
        id={id}
        value={canvasProps[fieldName]}
        onChange={handleChange}
        min={1}
        max={30}
      />
    </div>
  );
}

function Draw() {
  const [canvasProps, setCanvasProps] = React.useState({
    className: "react-sketch-canvas",
    width: "100%",
    height: "450PX",
    backgroundImage:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Graph_paper_scan_1600x1000_%286509259561%29.jpg",
    preserveBackgroundImageAspectRatio: "none",
    strokeWidth: 4,
    eraserWidth: 5,
    strokeColor: "#000000",
    canvasColor: "#FFFFFF",
    style: { borderRight: "1px solid #CCC" },
    svgStyle: {},
    exportWithBackgroundImage: false,
    withTimestamp: true,
    allowOnlyPointerType: "all",
    withViewBox: false,
  });

  const inputProps = [
    //["className", "text"],
    //["width", "text"],
    //["height", "text"],
    //["backgroundImage", "text"],
    //["preserveBackgroundImageAspectRatio", "text"],
    ["strokeWidth", "range", "畫筆粗細"],
    ["eraserWidth", "range", "橡皮擦粗細"],
  ];

  const canvasRef = React.createRef();

  const [penButtonColor, setPenButtonColor] = React.useState("primary");
  const [eraserButtonColor, setEraserButtonColor] = React.useState("secondary");
  const [dataURI, setDataURI] = React.useState("");
  const [svg, setSVG] = React.useState("");
  const [paths, setPaths] = React.useState([]);
  const [lastStroke, setLastStroke] = React.useState({
    stroke: null,
    isEraser: null,
  });
  //const [pathsToLoad, setPathsToLoad] = React.useState("");
  //const [sketchingTime, setSketchingTime] = React.useState(0);
  const [exportImageType, setexportImageType] = React.useState("png");

 /* const imageExportHandler = async () => {
    const exportImage = canvasRef.current?.exportImage;

    if (exportImage) {
      const exportedDataURI = await exportImage(exportImageType);
      setDataURI(exportedDataURI);
    }
  };*/

  const [isDone, setIsDone] = useState(false);
  
  const svgExportHandler = async () => {
    const exportSvg = canvasRef.current?.exportSvg;

    if (exportSvg) {
      var exportedDataURI = await exportSvg();
      setSVG(exportedDataURI);
      setIsDone(true);
      console.log(exportedDataURI);
      
      exportedDataURI = exportedDataURI
        .replace('<rect id="react-sketch-canvas__mask-background" x="0" y="0" width="100%" height="100%" fill="white"></rect></g><defs></defs><g id="react-sketch-canvas__canvas-background-group"><rect id="react-sketch-canvas__canvas-background" x="0" y="0" width="100%" height="100%" fill="#FFFFFF"></rect>', '');
      const blob = new Blob([exportedDataURI], { type: 'image/svg+xml' });
      uploadBytes(svgRef, blob).then((snapshot) => {
          console.log('SVG upload to Firebase succeed');
      }).catch((error) => {
          console.error('SVG upload to Firebase failed', error);
      });
    }
    
  };

  /*const getSketchingTimeHandler = async () => {
    const getSketchingTime = canvasRef.current?.getSketchingTime;

    try {
      if (getSketchingTime) {
        const currentSketchingTime = await getSketchingTime();
        setSketchingTime(currentSketchingTime);
      }
    } catch {
      setSketchingTime(0);
      console.error("With timestamp is disabled");
    }
  };*/

  
  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;
    
    if (eraseMode) {
      setPenButtonColor("primary");
      setEraserButtonColor("secondary");
      eraseMode(false);
    }
  };

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;
    
    if (eraseMode) {
      setPenButtonColor("secondary");
      setEraserButtonColor("primary");
      eraseMode(true);
    }
  };
  
  const undoHandler = () => {
    const undo = canvasRef.current?.undo;

    if (undo) {
      undo();
    }
  };

  const redoHandler = () => {
    const redo = canvasRef.current?.redo;

    if (redo) {
      redo();
    }
  };

  const clearHandler = () => {
    const clearCanvas = canvasRef.current?.clearCanvas;

    if (clearCanvas) {
      clearCanvas();
    }
  };

  const resetCanvasHandler = () => {
    const resetCanvas = canvasRef.current?.resetCanvas;

    if (resetCanvas) {
      resetCanvas();
    }
  };

  const createButton = (
    label,
    handler,
    themeColor
  ) => (
    <button
      key={label}
      className={`btn btn-${themeColor} btn-block`}
      type="button"
      onClick={handler}
    >
      {label}
    </button>
  );

  const goToNext = () =>{
      if(isDone) {
        window.location.href = `/AR-classroom/#${playUrl}`;
      }
      else{
        alert("請先畫圖並按完成")
      }
  };

  const buttonsWithHandlers = [
    ["復原", undoHandler, "dark"],
    ["取消復原", redoHandler, "dark"],
    ["清除全部", clearHandler, "dark"],
    ["重置", resetCanvasHandler, "dark"],
    ["畫筆", penHandler, penButtonColor],
    ["橡皮擦", eraserHandler, eraserButtonColor],
    ["完成", svgExportHandler, "success"],
    ["下一步", goToNext, "success"],
    //["Export Image", imageExportHandler, "success"],
    
    //["Get Sketching time", getSketchingTimeHandler, "success"],
  ];

  //const buttonNext = [
    
  //];

  const onChange = (updatedPaths) => {
    setPaths(updatedPaths);
  };

  return (
    <main className="container-fluid p-2">
      <div className="row">
        
      
        <section className="col-12">
          <header className="my-5">
            <h1>畫出你的虛擬替身</h1>
          </header>
          <section className="row no-gutters canvas-area m-0 p-0">
            <div className="col-9 canvas p-0">
              <ReactSketchCanvas
                ref={canvasRef}
                onChange={onChange}
                onStroke={(stroke, isEraser) =>
                  setLastStroke({ stroke, isEraser })
                }
                {...canvasProps}
              />
            </div>
            <div className="col-3 panel">
              <div className="d-grid gap-2">
                {buttonsWithHandlers.map(([label, handler, themeColor]) =>
                  createButton(label, handler, themeColor)
                )}
              </div>
            </div>
          </section>
          <form>
              {inputProps.map(([fieldName, type, displayName]) => (
                <InputField
                  key={fieldName}
                  fieldName={fieldName}
                  displayName={displayName}
                  type={type}
                  canvasProps={canvasProps}
                  setCanvasProps={setCanvasProps}
                />
              ))}
          </form>
          
        </section>
      </div>
    </main>
  );
}

export default Draw;
