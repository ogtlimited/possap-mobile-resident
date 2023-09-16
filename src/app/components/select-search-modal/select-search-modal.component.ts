import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-search-modal',
  templateUrl: './select-search-modal.component.html',
  styleUrls: ['./select-search-modal.component.scss'],
})
export class SelectSearchModalComponent implements OnInit {
  @Input() control;
  @Input() serviceId;
  @Input() placeholder;
  @Input() list;
  selected = null;
  term = '';
  listStore = [];
  constructor(private modal: ModalController) {}

  ngOnInit() {
    this.listStore = this.list;
  }

  selectItem(val) {
    this.selected = val;
  }
  save() {
    this.term = '';
    this.modal.dismiss(this.selected);
  }
  filterList() {
    console.log(this.term);
    const filtered = this.list.filter((e) => e.Name.toLowerCase().includes(this.term.toLowerCase()));
    this.listStore = filtered;
  }

  clear(){
    console.log('clear');
    this.listStore = this.list;
    this.term = '';
  }
}
