import { Component } from '@angular/core';

@Component({
  selector: 'app-home-connected',
  imports: [],
  templateUrl: './home-connected.component.html',
  styleUrl: './home-connected.component.css'
})
export class HomeConnectedComponent {
  user! : string;
  getInfo(){
    this.user = localStorage.getItem('email') || '';
  }

}
