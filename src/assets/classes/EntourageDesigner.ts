
//This classs handles most image manipulation and processing
export class EntourageDesigner {
    //Initial state for new instances
    constructor() {
        this.sayHello();
    }

    sayHello() {
        console.log("Hello from EntourageDesigner class");
    }

    //Canavas image processing
    canvasRendering(doc) {
        var canvas = <HTMLCanvasElement>doc.getElementById('canvasProcessor');
        var context = canvas.getContext('2d');

        var img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
        }
        img.src = '../../assets/images/Student-alpha-2.png';

        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;

        for (var i = 0; i < data.length; i += 4) {
            if (data[i] != 0 && data[i + 1] != 0 && data[i + 2] != 0) {
                imgData.data[i + 3] = 0;
            }
        }

        var canvasResult = <HTMLCanvasElement>document.getElementById(`canvasResult`);
        var contextResult = canvasResult.getContext('2d');
        canvasResult.width = canvas.width;
        canvasResult.height = canvas.height;

        contextResult.putImageData(imgData, 0, 0);
    }
}