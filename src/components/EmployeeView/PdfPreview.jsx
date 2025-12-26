import { useEffect, useRef } from "react";
// import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "@/pdf-worker";

export default function PdfPreview({ url }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(url);

    loadingTask.promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1.2 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext);
      });
    });
  }, [url]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", borderRadius: "6px" }}
    ></canvas>
  );
}
