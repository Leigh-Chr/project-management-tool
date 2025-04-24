import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupComponent],
      providers: [Title]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('popupTitle', 'Test Popup');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render popup content', () => {
    const popupContent = fixture.nativeElement.querySelector('.popup__content');
    expect(popupContent).toBeTruthy();
  });

  it('should render action buttons', () => {
    const cancelButton = fixture.nativeElement.querySelector('.btn--secondary');
    const submitButton = fixture.nativeElement.querySelector('.btn--primary');
    expect(cancelButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });
}); 