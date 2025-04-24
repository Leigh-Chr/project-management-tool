import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('class', 'test-icon');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render icon with correct class', () => {
    const iconElement = fixture.nativeElement.querySelector('i');
    expect(iconElement).toBeTruthy();
    expect(iconElement.classList.contains('test-icon')).toBeTruthy();
  });

  it('should set aria-label when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Test Icon');
    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('i');
    expect(iconElement.getAttribute('aria-label')).toBe('Test Icon');
  });
}); 