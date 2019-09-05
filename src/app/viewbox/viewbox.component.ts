import { Component, OnInit } from '@angular/core';
import { EntourageDesigner } from '../../assets/classes/EntourageDesigner';

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {
  //EntourageDesigner class instance for process handleing
  designer: EntourageDesigner;

  //Image source  
  imgsrc: string;

  //The parameters that will be updated
  rangex: number = -50;
  rangey: number = 0.2;

  //Translation values for viewbox
  movex: number = 0;
  movey: number = 0;

  //Properties to change
  translatey: number = 0;
  skewx: number = 0;
  translatex: number = 0;
  scaley: number = 0;
  xval: number = 0;

//CONSTRUCTOR AND LIFE HOOKS////////////////////////////////////////////////////////////////////////////////////////////////
  constructor() { }

  //Executed before showing anything
  ngOnInit() {
    document.getElementById("shadow").style.filter = "brightness(1%) blur(5px) opacity(35%)";
    document.getElementById("gradient-overlay").style.filter = "brightness(100%) blur(50px) opacity(30%)";

    //Loads an image to the canvas
    //this.canvasRendering();
    
    //var context = canvas.getContext('2D');
  }

  //Every time something changes this gets executed. First I need to change the values using the input.
  ngDoCheck() {
    //This method hadles the DOM updates
    this.updateComponents();
  }

//UTILITARIAN METHODS//////////////////////////////////////////////////////////////////////////////////////////////////////////

  //This method habdles the DOM updating process
  updateComponents() {
    //Recalculates the values
    this.skewx = this.rangex;
    this.scaley = this.rangey;

    this.xval = (250 * (Math.tan(this.skewx * 0.0174533))) / 2;
    this.translatex = this.xval - (this.xval * (1 - this.scaley));

    this.translatey = (250 * (1 - this.scaley)) / 2;

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

  //Retrives an loads the URL defined by the user
  changeImage() {
    if (this.imgsrc != null) {
      document.getElementById("shadow").setAttribute("src", `${this.imgsrc}`);
      document.getElementById("image-top").setAttribute("src", `${this.imgsrc}`);
      document.getElementById("caracter-selection").setAttribute("src", `${this.imgsrc}`);
    } else {
      alert("You need an image URL!");
    }
  }

  //Calculates tha percentage at wich the lighting should be
  calculateLighting(angle: number): number {
    //The math function calculates the lighting overlay (0.5 + (angle/80)/2)*100 << TODO: Still needs calibration
    return (0.5 + (angle / 80) / 2) * 100;
  }

  //Depending on height it returns correct color
  colorByHeight(height: number): string {
    if (height > 0) {
      return "255, 255, 255, 0.5";
    } else {
      return "0, 0, 0, 0.5";
    }
  }

  //Depending on height it returns correct color but negated
  notColorByHeight(height: number): string {
    if (height > 0) {
      return "0, 0, 0, 0.5";
    } else {
      return "255, 255, 255, 0.5";
    }
  }

  //Canavas image processing
  canvasRendering() {
    //Retrive the reference to the onject that we are gona modify
    var canvas = <HTMLCanvasElement>document.getElementById('canvasProcessor');
    var context = canvas.getContext('2d');

    //Instance of an image object
    var img = new Image();

    //This gets executed when the image is loaded
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
    } 

    //This is when we load the image, the function on top will get executed after
    img.src = '../../assets/images/Student-alpha-2.png';

    //Load an object with the array of pixel in the canvas
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;

    //Runs through the image data and changes its values to 0 if the pixel is not black
    for(var i = 0; i < data.length; i+=4) {
      if(data[i]==0 && data[i+1]==0 && data[i+2]==0){
        imgData.data[i+3]=0;
      }
    }

    //Get a reference to another canvas that will be used to display the result
    var canvasResult = <HTMLCanvasElement>document.getElementById(`canvasResult`);
    var contextResult = canvasResult.getContext('2d');
      canvasResult.width = canvas.width;
      canvasResult.height = canvas.height;

    //Loads the resulting image to the new canvas
    contextResult.putImageData(imgData, 0, 0);
  }

  //Renders an image loaded in a canvas to a given URL
  imageRendering() {
    var canvas = <HTMLCanvasElement>document.getElementById(`canvasResult`);

    var image = new Image();
    image.src = canvas.toDataURL("image/png");

    var loader = document.getElementById("imgLoader");
    loader.setAttribute("src", image.src);
  }
}
