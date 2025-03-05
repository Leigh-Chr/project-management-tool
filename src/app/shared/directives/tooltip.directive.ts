import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
  Renderer2,
  inject,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private tooltip: HTMLElement | null = null;

  @Input('tooltip') tooltipText: string = '';
  @HostBinding('class.tooltip-visible') isTooltipVisible = false;

  @HostListener('mouseenter') onMouseEnter(): void {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.hideTooltip();
  }

  @HostListener('focus') onFocus(): void {
    this.showTooltip();
  }

  @HostListener('blur') onBlur(): void {
    this.hideTooltip();
  }

  @HostListener('window:scroll') onWindowScroll(): void {
    if (this.tooltip) this.updateTooltipPosition();
  }

  private showTooltip(): void {
    if (this.tooltipText.trim() === '') return;
    if (!this.tooltip) this.createTooltip();
    this.isTooltipVisible = true;
  }

  private hideTooltip(): void {
    this.isTooltipVisible = false;
    this.removeTooltip();
  }

  private createTooltip(): void {
    const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 10)}`;

    this.tooltip = this.renderer.createElement('span') as HTMLElement;
    this.renderer.setAttribute(this.tooltip, 'id', tooltipId);
    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipText)
    );

    this.renderer.setAttribute(
      this.el.nativeElement,
      'aria-describedby',
      tooltipId
    );

    this.addTooltipClasses();
    this.setTooltipStyles();
    this.setTooltipAccessibility();

    this.renderer.appendChild(document.body, this.tooltip);
    this.updateTooltipPosition();
  }

  private setTooltipStyles(): void {
    this.renderer.setStyle(this.tooltip, 'position', 'fixed');
    this.renderer.setStyle(this.tooltip, 'z-index', '1000');
    this.renderer.setStyle(this.tooltip, 'pointer-events', 'none');
  }

  private addTooltipClasses(): void {
    const classes = [
      'tooltip',
      'tooltip--visible'
    ];
    classes.forEach((className) =>
      this.renderer.addClass(this.tooltip!, className)
    );
  }

  private setTooltipAccessibility(): void {
    this.renderer.setAttribute(this.tooltip, 'aria-hidden', 'true');
  }

  private updateTooltipPosition(): void {
    const nativeElement = this.el.nativeElement as HTMLElement;
    const rect = nativeElement.getBoundingClientRect();

    this.renderer.setStyle(this.tooltip, 'top', `${rect.top + rect.height}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${rect.left}px`);
  }

  private removeTooltip(): void {
    if (this.tooltip) {
      this.renderer.removeAttribute(this.el.nativeElement, 'aria-describedby');
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }
}
