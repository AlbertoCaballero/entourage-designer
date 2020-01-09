import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { EntourageDesigner } from '../../assets/classes/EntourageDesigner';

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {
  /** Test designer object */
  EDObject : EntourageDesigner = new EntourageDesigner();
  
  /** Image source - Defaults to a student image */
  imgsrc: string = "assets/images/Student.png";
  
  /** Local File property */
  imageLocal: File;

  //The parameters that will be updated
  rangex: number = -70;
  rangey: number = 0.25;
  blurNum: number = 5;
  opacityNum: number = 35;
  brightNum: number = 1;
  contNum: number = 1;
  satNum: number = 1;

  /** Translation values for viewbox X coordinates */
  movex: number = 0;
  /** Translation values for viewbox Y coordinates */
  movey: number = 0;

  //Properties to change
  translatey: number = 0;
  skewx: number = 0;
  translatex: number = 0;
  scaley: number = 0;
  xval: number = 0;

  /** Executes before showing anything */
  constructor(private activatedRoute: ActivatedRoute) {
    //Retrives the url parameter and logs to the console
    this.activatedRoute.queryParams.subscribe(params => {
      let urlParam = params['imgurl'];
      console.log(urlParam);
      if (urlParam != null) {
        console.log(urlParam);
        this.imgsrc = urlParam;
      } else {
        console.log("No url param specified");
        this.imgsrc = "assets/images/Student.png";
      }
    });
  }

  /** Executed before showing anything */
  ngOnInit() {
    //Sets up the shadow element
    document.getElementById("shadow").style.filter = `brightness(1%) blur(${this.blurNum}px) opacity(${this.opacityNum}%)`;
    //Sets up de overlay effects
    document.getElementById("gradient-overlay").style.filter = `brightness(100%) blur(50px) opacity(30%)`;
    //Sets up the instance of the choosen image
    document.getElementById("image-top").style.filter = `brightness(${this.brightNum}) contrast(${this.contNum}) saturate(${this.satNum})`;
    //Handdles opening files
    document.getElementById("file-input").addEventListener('change', this.fileInput, false);
  }

  /** Every time something changes this gets executed. First I need to change the values using the input. */
  ngDoCheck() {
    this.updateComponents();
  }

  /** This method handles the DOM updating process */
  updateComponents() {
    //Recalculates the values
    this.skewx = this.rangex;
    this.scaley = this.rangey;

    this.xval = (250 * (Math.tan(this.skewx * 0.0174533))) / 2;

    this.translatex = this.xval - (this.xval * (1 - this.scaley));
    this.translatey = (250 * (1 - this.scaley)) / 2;

    //Update shadow properties
    document.getElementById("shadow").style.filter = `brightness(1%) blur(${this.blurNum}px) opacity(${this.opacityNum}%)`;
    //Update character in viewbox properties
    document.getElementById("image-top").style.filter =
      `brightness(${this.brightNum}) contrast(${this.contNum}) saturate(${this.satNum})`;

    //Applies the new values for the shadow
    document.getElementById("shadow").style.transform =
      `translateY(${this.translatey}px) skewX(${this.skewx}deg) translateX(${-this.translatex}px) scaleY(${this.scaley})`;

    //Modify gradient overlay properties
    document.getElementById("gradient-overlay").style.background =
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.notColorByHeight(this.scaley)})
      ${this.calculateLighting(this.skewx)}%, rgba(255,255,255,0) 100%)`;
    //Modify gradient overlay 2 properties
    document.getElementById("gradient-overlay-2").style.background =
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.notColorByHeight(this.scaley)})
      ${this.calculateLighting(this.skewx)}%, rgba(0,0,0,0) 100%)`;

    //Modify gradient overlay properties for the alternative
    document.getElementById("gradient-overlay-sec").style.background =
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.colorByHeight(this.scaley)})
      ${this.calculateLighting(this.skewx)}%, rgba(255,255,255,0) 100%)`;
    //Modify gradient overlay 2 properties for the alternative
    document.getElementById("gradient-overlay-sec-2").style.background =
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.colorByHeight(this.scaley)})
      ${this.calculateLighting(this.skewx)}%, rgba(0,0,0,0) 100%)`;
  }

  /** Loads the current file selected in the file input */
  changeImageLocal() {
    console.log("Changing for a local file");
    //Since we are only reading one file, we dont need to loop the array
    var file = this.imageLocal[0];
    //With this line we know the file type of the file
    console.log("Source: " + file.type);
    //We need to make sure the file is of type image
    if (file.type.match('image/png')) {
      //File reader instance
      var reader = new FileReader();
      //Closure to capture the file when loaded
      reader.onload = (function (tf) {
        return function (e: any) {
          //Here we change the images we want in the editor
          document.getElementById("shadow").setAttribute("src", `${e.target.result}`);
          document.getElementById("image-top").setAttribute("src", `${e.target.result}`);
          document.getElementById("caracter-selection").setAttribute("src", `${e.target.result}`);
          console.log(tf.name);
          //Save the image to local storage
          localStorage.setItem('img', e.target.result);
        };
      })(file);
      //Now we read the file
      reader.readAsDataURL(file);
    } else {
      alert("Wrong file type: Only PNG and JPEG allowed.");
    }
  }

  /** Handles the event listener for file input */
  fileInput(event: any) {
    //Show the evet type of the listener
    console.log("Is executing " + event.type);

    //Shows the name of the selected file
    this.imgsrc = event.target.files[0].name;
    console.log(this.imgsrc);

    //Changes the value of the text field for the name of the selected file
    var textfield: any = document.getElementById("imgurl");
    textfield.value = this.imgsrc;
  }

  /** Calculates tha percentage at wich the lighting should be */
  calculateLighting(angle: number): number {
    //The math function calculates the lighting overlay (0.5 + (angle/80)/2)*100
    return (0.5 + (angle / 80) / 2) * 100;
  }

  /** Depending on height it returns correct color */
  colorByHeight(height: number): string {
    if (height > 0) {
      return "255, 255, 255, 0.5";
    } else {
      return "0, 0, 0, 0.5";
    }
  }

  /** Depending on height it returns correct color but negated */
  notColorByHeight(height: number): string {
    if (height > 0) {
      return "0, 0, 0, 0.5";
    } else {
      return "255, 255, 255, 0.5";
    }
  }

  /** Canavas image processing for light zones */
  canvasRendering(procesor: string = 'canvasProcessor', result: string = 'canvasResult') {
    //Retrive the reference to the object that we are going to modify
    const canvas = <HTMLCanvasElement>document.getElementById(procesor);
    const context = canvas.getContext('2d');

    //Instance of an image object
    var img = new Image();

    //This gets executed when the image is loaded
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
    }

    //This is when we load the image, the onload function will get executed after
    img.src = this.imgsrc;

    //Load an object with the array of pixel data in the canvas
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    //Runs through the image data and changes its values to 0 if the pixel is not black
    for (var i = 0; i < data.length; i += 4) {
      if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
        imgData.data[i + 3] = 0;
      }
    }

    //Get a reference to another canvas that will be used to display the result
    var canvasResult = <HTMLCanvasElement>document.getElementById(result);
    var contextResult = canvasResult.getContext('2d');
    canvasResult.width = canvas.width;
    canvasResult.height = canvas.height;

    //Loads the resulting image to the new canvas
    contextResult.putImageData(imgData, 0, 0);
  }

  /** Canavas image processing for dark zones */
  notCanvasRendering(procesor: string = 'canvasProcessor', result: string = 'canvasResult') {
    //Retrive the reference to the onject that we are gona modify
    const canvas = <HTMLCanvasElement>document.getElementById(procesor);
    const context = canvas.getContext('2d');

    //Instance of an image object
    var img = new Image();

    //This gets executed when the image is loaded
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
    }

    //This is when we load the image, the onload function will get executed after
    img.src = this.imgsrc;

    //Load an object with the array of pixel in the canvas
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    //Runs through the image data and changes its values to 0 if the pixel is not black
    for (var i = 0; i < data.length; i += 4) {
      if (data[i] != 0 && data[i + 1] != 0 && data[i + 2] != 0) {
        imgData.data[i + 3] = 0;
      }
    }

    //Get a reference to another canvas that will be used to display the result
    var canvasResult = <HTMLCanvasElement>document.getElementById(result);
    var contextResult = canvasResult.getContext('2d');
    canvasResult.width = canvas.width;
    canvasResult.height = canvas.height;

    //Loads the resulting image to the new canvas
    contextResult.putImageData(imgData, 0, 0);
  }

  /** Renders an image loaded in a canvas to a given URL */
  imageRendering() {
    var canvas = <HTMLCanvasElement>document.getElementById(`canvasResult`);

    var image = new Image();
    image.src = canvas.toDataURL("image/png");

    var loader = document.getElementById("imgLoader");
    loader.setAttribute("src", image.src);

    console.log(image.src);

    //Set the images as masks
    document.getElementById("gradient-overlay").style.maskImage = image.src;
    document.getElementById("gradient-overlay-2").style.maskImage = image.src;
    document.getElementById("gradient-overlay-sec").style.maskImage = image.src;
    document.getElementById("gradient-overlay-sec-2").style.maskImage = image.src;
  }

  /**Gets the base 64 bit image from the given URL */
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // Create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /** Gets the base 64 bit image from the given HTML element */
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");

    // This will draw image
    ctx.drawImage(img, 0, 0);

    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  /** Process and applies filter for the masking creation also renders the canvas and saves it */
  renderCanvas(renderX: number = 500, renderY: number = 500) {
    //Here we get reference to the canvas and it's context
    const canvas = <HTMLCanvasElement>document.getElementById('canvasProcessor');
    const context = canvas.getContext('2d');

    //Here we get reference to the character image loaded in page
    const imageCharacter = <any>document.getElementById('shadow');

    //Set canvas to image size
    canvas.width = renderX;
    canvas.height = renderY;

    //Loads the image into canvas
    context.drawImage(imageCharacter, 0, 0, imageCharacter.width, imageCharacter.height);

    //Add filters to the canvas, for now we only make it brighter
    context.filter = `translateY(${this.translatey}px) skewX(${this.skewx}deg) translateX(${-this.translatex}px) scaleY(${this.scaley})`;

    //Apply modifications to the image
    context.transform(1, 1, this.skewx, this.scaley, this.translatex, this.translatey);

    // Very important to replace the image, you will get a DOM 18 exception otherwise
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    //Now we will save it locally
    window.location.href = image;
  }
}
