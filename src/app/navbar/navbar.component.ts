import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router) {

  }
  navigate() {
    this.router.navigate(['/concrete']);

  }

  @ViewChild('printableContent') printableContent!: ElementRef;

  printPage() {
    const printContents = this.printableContent.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  printPDF() {
    window.print();
  }
}
