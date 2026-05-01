import { Directive, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input('appTooltip') text = '';

  private instance: any;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    this.instance?.dispose();
    this.instance = undefined;
    if (this.text) {
      this.instance = new (window as any).bootstrap.Tooltip(this.el.nativeElement, {
        title: this.text,
        trigger: 'hover',
        placement: 'top',
      });
    }
  }

  ngOnDestroy(): void {
    this.instance?.dispose();
  }
}
