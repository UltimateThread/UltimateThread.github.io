import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openHome(): void {
    this.router.navigate(['']);
  }

  openProjects(): void {
    this.router.navigate(['projects']);
  }

  openAboutMe(): void {
    this.router.navigate(['about']);
  }

  openContact(): void {
    this.router.navigate(['contact']);
  }
}
