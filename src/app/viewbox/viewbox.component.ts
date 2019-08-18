import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {

  //Retriveing the image references
  imputs : any = document.querySelectorAll('.sliders input');
  imgsrc : string;

  //The parameters that will be updated
  rangex : number = 0;
  rangey : number = 0.5;

  //Properties to change
  translatey : number = 0;
  skewx : number = 0;
  translatex : number = 0;
  scaley : number = 0;
  xval : number = 0;

  constructor() { }

  //Executed before showing anything
  ngOnInit() { 
    document.getElementById("shadow").style.filter = "brightness(1%) blur(5px) opacity(35%)";
    document.getElementById("gradient-overlay").style.filter = "brightness(100%) blur(0px) opacity(20%)";
  }

  //Every time something changes this gets executed. First I need to change the values using the input.
  ngDoCheck() {
    //Reverse the previous changes
    document.getElementById("shadow").style.transform = 
      `translateY(${-this.translatey}px) skewX(${-this.skewx}deg) translateX(${this.translatex}px) scaleY(${-this.scaley})`;

    //Recalculates the values
    this.skewx = this.rangex;
    this.scaley = this.rangey;

    this.xval = (250*(Math.tan(this.skewx*0.0174533)))/2;
    this.translatex = this.xval - (this.xval*(1-this.scaley));

    this.translatey = (250*(1-this.scaley))/2;

    //Applies the new values
    document.getElementById("shadow").style.transform = 
      `translateY(${this.translatey}px) skewX(${this.skewx}deg) translateX(${-this.translatex}px) scaleY(${this.scaley})`;

    //Modify gradient overlay properties
    document.getElementById("gradient-overlay").style.background = 
      `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(212, 37, 37) ${ this.calculateLighting(this.skewx) }%, rgb(255, 255, 255) 50%, rgba(0,0,0,0) 100%)`;
  }

  changeImage() {
    if(this.imgsrc != null) {
      document.getElementById("shadow").setAttribute("src", `${this.imgsrc}`);
      document.getElementById("image-top").setAttribute("src", `${this.imgsrc}`);
    } else {
      alert("You need a URL");
    }
  }

  calculateLighting(angle : number) : number {
    //return (0.5 + (angle/80)/2)*100; //this is correct!
    console.log((angle/80));
    if(angle >= 0) {
      return (0.5 + (angle/80)/2)*100; //this is correct!
    } else {
      return (0.5 + (angle/80)/2)*100; //This more less...
    }
  }

}
