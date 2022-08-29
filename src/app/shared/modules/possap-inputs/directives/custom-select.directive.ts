import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCustomSelect]',
})
export class CustomSelectDirective {
  private observer: MutationObserver;

  constructor(private el: ElementRef) {
    const node = this.el.nativeElement;

    this.observer = new MutationObserver((mutations) => {
      // Mutations arrived, try to remove arrow
      this.customStyle();
    });

    this.observer.observe(node, {
      childList: true,
    });
  }

  private customStyle() {
    // Check if the arrow element is already here
    if (
      this.el.nativeElement.shadowRoot.querySelector('.select-icon') === null
    ) {
      // Note yet, ignore this mutation
      return;
    }
    // This mutation has added the arrow. Remove it.
    this.el.nativeElement.shadowRoot
      .querySelector('.select-icon')
      .setAttribute('style', 'display: none !important');
    // Also set the placeholder text to the same color as other placeholders
    // If a default value was selected, no placeholder element will be present, so check for null on this one again
    if (this.el.nativeElement.shadowRoot.querySelector('button') !== null) {
      const qB = this.el.nativeElement.shadowRoot.querySelector('button');
      qB.setAttribute('class', 'text-normal-important font-reset');
      qB.setAttribute(
        'style',
        'font: var(--app-select-placeholder-font, inherit) !important; ' +
          'color: var(--app-select-placeholder-color) !important; ' +
          'font-size: var(--app-select-placeholder-font-size) !important; ' +
          'line-height: var(--app-select-placeholder-line-height) !important; '
      );
    }
    // Stop listening for mutations
    this.observer.disconnect();
  }
}
