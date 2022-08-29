import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slide-to-confirm',
  templateUrl: './slide-to-confirm.component.html',
  styleUrls: ['./slide-to-confirm.component.scss'],
})
export class SlideToConfirmComponent implements OnInit {

  @ViewChild('dragItem') dragItem: ElementRef;
  @ViewChild('track') container: ElementRef;
  @ViewChild('before') before: ElementRef;
  @ViewChild('after') after: ElementRef;
  @ViewChild('end') end: ElementRef;
  dragWidth: number;
  active: boolean;
  currentX: number;
  initialX: number;
  xOffset: number;
  
  constructor() {
    this.active = false;
    this.xOffset = 0;
  }
  
  ngOnInit() {
    this.dragWidth = this.container.nativeElement.clientWidth - this.dragItem.nativeElement.clientWidth - 20;

    this.container.nativeElement.addEventListener("touchstart", this.dragStart, false);
    this.container.nativeElement.addEventListener("touchend", this.dragEnd, false);
    this.container.nativeElement.addEventListener("touchmove", this.drag, false);

    this.container.nativeElement.addEventListener("mousedown", this.dragStart, false);
    this.container.nativeElement.addEventListener("mouseup", this.dragEnd, false);
    this.container.nativeElement.addEventListener("mousemove", this.drag, false);
  }
  

  dragStart = (e) => {
    this.dragWidth = this.container.nativeElement.clientWidth - this.dragItem.nativeElement.clientWidth - 20;
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX - this.xOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
    }

    if (e.target === this.dragItem.nativeElement) {
      this.active = true;
    }
  }

  dragEnd = (e) => {
    if (this.currentX < (this.dragWidth - 5)) {
      this.animateBack();
    } else {
      this.completed();
    }

    this.initialX = this.currentX;
    this.active = false;
  }

  drag = (e) => {
    if (this.active) {

      e.preventDefault();

      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
      } else {
        this.currentX = e.clientX - this.initialX;
      }

      // xOffset = currentX;

      if (this.currentX > 0 && this.currentX < this.dragWidth) { 
        this.setTranslate(this.currentX, this.dragItem);
      }
    }
  }

  setTranslate = (xPos, el) => {
    el.nativeElement.style.transform = "translate3d(" + xPos + "px, " + 0 + "px, 0)";
    this.end.nativeElement.style.opacity = 0;
    if (xPos > this.dragWidth / 2) {
      this.after.nativeElement.style.opacity = 1;
      this.before.nativeElement.style.opacity = 0;
      this.container.nativeElement.style.backgroundColor = 'rgb(25, 233, 118)';
    } else {
      this.after.nativeElement.style.opacity = 0;
      this.before.nativeElement.style.opacity = 1;
      this.container.nativeElement.style.backgroundColor = 'rgb(66, 79, 227)';
    }
  }

  animateBack = () => {
    // turn off/on animations to speed up the fallback
    this.dragItem.nativeElement.classList.toggle('animate');
    this.container.nativeElement.classList.toggle('animate');
    this.before.nativeElement.classList.toggle('animate');
    this.after.nativeElement.classList.toggle('animate');
    this.setTranslate(0, this.dragItem);
    setTimeout(() => { 
      // wait for the animation is done before turning animations back on/off
      this.dragItem.nativeElement.classList.toggle('animate');
      this.container.nativeElement.classList.toggle('animate');
      this.before.nativeElement.classList.toggle('animate');
      this.after.nativeElement.classList.toggle('animate');
    }, 600);
  }

  completed = () => {
    this.end.nativeElement.style.opacity = 1;
    this.after.nativeElement.style.opacity = 0;
    this.before.nativeElement.style.opacity = 0;
    alert("Confirmed!");
  }

}
