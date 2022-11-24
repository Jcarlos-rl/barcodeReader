document.addEventListener("DOMContentLoaded", ()=>{
    const resultados = document.getElementById('resultado');
    Quagga.init({
        inputStream:{
            constraints:{
                width: 500,
                height: 300
            },
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('contenedor')
        },
        decoder:{
            readers: ['ean_reader']
        }
    }, function(err){
        if(err){
            console.log(err);
            return;
        }
        console.log("Iniciado correctamente");
        Quagga.start();
    });

    Quagga.onDetected((data)=>{
        resultados.textContent = data.codeResult.code;
        console.log(data)
    });

    /* Quagga.onProcessed((result)=>{
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if(result){
            if(result.boxes){
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
            }

            if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
        }
    }); */
})