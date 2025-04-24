import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome message and have login button', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    const buttonElement =
      fixture.nativeElement.querySelector('.btn.btn--primary');

    expect(titleElement.textContent).toContain(
      'Welcome to Project Management Tool'
    );
    expect(buttonElement.textContent.trim()).toBe('Get Started');
    expect(buttonElement.getAttribute('ng-reflect-router-link')).toBe('/login');
  });
});
