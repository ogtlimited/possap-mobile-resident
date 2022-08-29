import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-possap-eye',
  templateUrl: './possap-eye.component.html',
  styleUrls: ['./possap-eye.component.scss'],
})
export class PossapEyeComponent implements OnInit {
  constructor(private modal: ModalController, private router: Router) {}

  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }

  navigate(path, title) {
    console.log(path);

    this.router
      .navigate(['/general-form'], {
        queryParams: { service: path, title},
      })
      .then((e) => {
        this.dismiss();
      });
  }
}
