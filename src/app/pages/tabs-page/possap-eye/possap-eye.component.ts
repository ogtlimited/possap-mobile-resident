import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-possap-eye',
  templateUrl: './possap-eye.component.html',
  styleUrls: ['./possap-eye.component.scss'],
})
export class PossapEyeComponent implements OnInit {
  infoServices = [
    {
      title: 'CMR',
      subtitle: 'Apply for CMR services',
      icon: 'cmr',
      slug: 'CMR',
      code: 'CMR',
      id: 3,
    },
    {
      title: 'Guard Services',
      subtitle: 'Apply for CMR services',
      icon: 'egs',
      slug: 'egs',
      code: 'egs',
      id: 3,
    },
  ];
  constructor(private modal: ModalController, private router: Router) {}
  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }

  navigate(path, title, type = '') {
    console.log(path);
    if (path === 'cmr') {
      this.router.navigate(['/general-form/cmr'], {
        queryParams: { service: path, title, type },
      }).then(e =>  this.modal.dismiss());
    }else {
      this.router.navigate(['/egs'], {
        queryParams: { service: path, title, type },
      }).then(e =>  this.modal.dismiss());
    }
  }
}
