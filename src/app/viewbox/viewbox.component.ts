import { Component, OnInit } from '@angular/core';

const imputs = document.querySelectorAll('.sliders input');
const image = document.getElementById('image');

@Component({
  selector: 'app-viewbox',
  templateUrl: './viewbox.component.html',
  styleUrls: ['./viewbox.component.scss']
})

export class ViewboxComponent implements OnInit {

  rangex : number = 50;

  constructor() { }

  ngOnInit() {

  }

}
