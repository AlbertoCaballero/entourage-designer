import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {
  //Image source  
  imgsrc : string;

  //The parameters that will be updated
  rangex : number = -50;
  rangey : number = 0.2;

  //Translation values for viewbox
  movex : number = 0;
  movey : number = 0;

  //Properties to change
  translatey : number = 0;
  skewx : number = 0;
  translatex : number = 0;
  scaley : number = 0;
  xval : number = 0;

  //CONSTRUCTOR AND LIFE HOOKS

  constructor() { }

  //Executed before showing anything
  ngOnInit() { 
    document.getElementById("shadow").style.filter = "brightness(1%) blur(5px) opacity(35%)";
    document.getElementById("gradient-overlay").style.filter = "brightness(100%) blur(0px) opacity(20%)";
  }

  //Every time something changes this gets executed. First I need to change the values using the input.
  ngDoCheck() {
    //This method hadles the DOM updates
    this.updateComponents();
  }

  //UTILITARIAN METHODS

  //This method habdles the DOM updating process
  updateComponents() {

    //Recalculates the values
    this.skewx = this.rangex;
    this.scaley = this.rangey;

    this.xval = (250*(Math.tan(this.skewx*0.0174533)))/2;
    this.translatex = this.xval - (this.xval*(1-this.scaley));

    this.translatey = (250*(1-this.scaley))/2;

    //Applies the new values for the shadow
    document.getElementById("shadow").style.transform = 
      `translateY(${this.translatey}px) skewX(${this.skewx}deg) translateX(${-this.translatex}px) scaleY(${this.scaley})`;

    //Modify gradient overlay properties
    document.getElementById("gradient-overlay").style.background = 
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.colorByHeight(this.scaley)}) ${ this.calculateLighting(this.skewx) + 0 }%, rgba(255,255,255,0) 100%)`;

    //Modify gradient overlay 2 properties
    document.getElementById("gradient-overlay-2").style.background =
      `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgb(${this.colorByHeight(this.scaley)}) ${ this.calculateLighting(this.skewx) + 4 }%, rgba(255,255,255,0) 100%)`;
  }

  //Retrives an loads the URL defined by the user
  changeImage() {
    if(this.imgsrc != null) {
      document.getElementById("shadow").setAttribute("src", `${this.imgsrc}`);
      document.getElementById("image-top").setAttribute("src", `${this.imgsrc}`);
      document.getElementById("caracter-selection").setAttribute("src", `${this.imgsrc}`);
    } else {
      alert("You need an image URL!");
    }
  }

  //Calculates tha percentage at wich the lighting should be
  calculateLighting(angle : number) : number {
    //The math function calculates the lighting overlay (0.5 + (angle/80)/2)*100 << TODO: Still needs calibration
    return (0.5 + (angle/80)/2)*100;
  }

  //Depending on height it returns correct color
  colorByHeight(height : number) : string {
    if(height > 0) {
      return "255, 255, 255, 0.25";
    } else {
      return "0, 0, 0, 0.5";
    }
  }

}
