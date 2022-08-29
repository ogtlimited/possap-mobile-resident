import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss'],
})
export class MyMapComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navigate(){
    this.router.navigate(['nearest-places'])
  }

}
