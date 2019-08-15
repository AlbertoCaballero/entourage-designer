import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {

  //Retriveing the image references
  imputs : any = document.querySelectorAll('.sliders input');
  image : any = document.getElementById('image');

  //The parameters that will be updated
  rangex : number = 50;
  rangey : number = 50;

  constructor() { }

  ngOnInit() { }

  ngDoCheck() {
    //Every time something changes this gets executed

  }

}
