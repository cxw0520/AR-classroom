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
    <div className="p-0 col-10">
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
  const [playUrl, setPlayUrl] = React.useState("");
  const [svgRef, setSvgRef] = React.useState(null);
  React.useEffect(() => {
    const equalParam = window.location.href.lastIndexOf("=") + 1;
    const playUrl = window.location.href.substring(equalParam);
    setPlayUrl(playUrl);
    
    const lastParam = window.location.href.lastIndexOf("/") + 1;
    const SID = window.location.href.substring(lastParam);
    const computedSvgRef = ref(storage, `svgs/${SID + ".svg"}`);
    setSvgRef(computedSvgRef);
  }, []);
  //console.log("playUrl:", playUrl);
  
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
    //["eraserWidth", "range", "橡皮擦粗細"],
  ];

  const canvasRef = React.createRef();

  const [penButtonOutline, setPenButtonOutline] = React.useState("");
  const [eraserButtonOutline, setEraserButtonOutline] = React.useState("outline-");
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
      //console.log(blob);
      uploadBytes(svgRef, blob).then((snapshot) => {
          console.log('SVG upload to Firebase succeed');
      }).catch((error) => {
          console.error('SVG upload to Firebase failed', error);
      });
    }
    
  };
  
  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;
    
    if (eraseMode) {
      setPenButtonOutline("");
      setEraserButtonOutline("outline-");
      eraseMode(false);
    }
  };

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;
    
    if (eraseMode) {
      setPenButtonOutline("outline-");
      setEraserButtonOutline("");
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
    themeColor,
    outline,
    spacingClass,
    disabled = false
  ) => (
    <button
      key={label}
      className={`btn btn-${outline}${themeColor} ${spacingClass} mb-3 btn-lg`}
      type="button"
      onClick={handler}
      disabled={disabled}
    >
      {label}
    </button>
  );

  const goToNext = () =>{
      if(isDone) {
        window.location.href = `/Avatar-classroom/#${playUrl}`;
      }
      else{
        alert("請先畫圖並按完成")
      }
  };

  const buttonsPenEraser = [
    ["畫筆", penHandler, "primary", penButtonOutline, ""],
    ["橡皮擦", eraserHandler, "primary", eraserButtonOutline, "mr-3"],
  ];

  const buttonsWithHandlers = [
    ["復原", undoHandler, "primary", "outline-", ""],
    ["取消復原", redoHandler, "primary", "outline-", ""],
    ["清除畫板", clearHandler, "primary", "outline-", ""],
    //["重置", resetCanvasHandler, "secondary", "outline-", "mr-3"],
    //["Export Image", imageExportHandler, "success"],
    //["Get Sketching time", getSketchingTimeHandler, "success"],
  ];

  const buttonsDone = [
    ["完成", svgExportHandler, "success", "", "mr-3"],
  ];

  const buttonsNext = [
    ["下一步", goToNext, "success", "", "mr-3", !isDone],
  ];

  const onChange = (updatedPaths) => {
    setPaths(updatedPaths);
  };

  return (
    <main className="container-fluid p-2 justify-content-center">
      <div className="row">
        <section className="col-12">
          <div class="row justify-content-center">
            <h1>畫出你的虛擬化身</h1>
          </div>
          <section className="row no-gutters canvas-area m-1 p-0">
            <div className="col-12 canvas p-0">
              <ReactSketchCanvas
                ref={canvasRef}
                onChange={onChange}
                onStroke={(stroke, isEraser) =>
                  setLastStroke({ stroke, isEraser })
                }
                {...canvasProps}
              />
            </div>
          </section>
          <form className="d-flex flex-column align-items-center">
            <div class="row justify-content-center">
              <div className="col-12 panel d-flex flex-column align-items-center mt-2">
                <div class="btn-group" role="group" aria-label="buttonsWithHandlers">
                  {buttonsWithHandlers.map(([label, handler, themeColor, outline, spacingClass]) =>
                    createButton(label, handler, themeColor, outline, spacingClass)
                  )}
                </div>
              </div>
              <div className="col-12 panel d-flex flex-column align-items-center">
                <div>
                  <div class="btn-group" role="group" aria-label="buttonsDone">
                    {buttonsDone.map(([label, handler, themeColor, outline, spacingClass]) =>
                      createButton(label, handler, themeColor, outline, spacingClass)
                    )}
                  </div>
                  <div class="btn-group" role="group" aria-label="buttonsNext">
                    {buttonsNext.map(([label, handler, themeColor, outline, spacingClass, disabled]) =>
                      createButton(label, handler, themeColor, outline, spacingClass, disabled)
                    )}
                  </div>
                </div>
              </div>
              <div className="col-10 d-flex flex-column align-items-center">
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
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Draw;
