import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  faqData = [
    {
      question: 'Request Duration',
      answer: 'Request takes two days to process',
    },
    {
      question: 'Request verification error',
      answer: 'Check that the application ref id is correct',
    },
    {
      question: 'Change request info',
      answer: 'You can edit a request before it status changed to processing',
    },
  ];
  constructor() {}
  ngOnInit() {}
}
