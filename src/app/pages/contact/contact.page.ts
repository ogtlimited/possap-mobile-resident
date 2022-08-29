import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', ],
      body: ['', Validators.required],
    });
  }

  submitForm(){
    
  }

  get name(){
    return this.contactForm.get('name')
  }
  get email(){
    return this.contactForm.get('email')
  }
  get subject(){
    return this.contactForm.get('subject')
  }
  get body(){
    return this.contactForm.get('body')
  }

}
