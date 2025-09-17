import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let metaService: jasmine.SpyObj<Meta>;

  beforeEach(async () => {
    const metaSpy = jasmine.createSpyObj('Meta', ['addTag']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: Meta, useValue: metaSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    metaService = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toast provider', () => {
    fixture.detectChanges();
    const toastProvider = fixture.nativeElement.querySelector('pmt-toast-provider');
    expect(toastProvider).toBeTruthy();
    expect(toastProvider.getAttribute('providerId')).toBe('root');
  });

  it('should render router outlet', () => {
    fixture.detectChanges();
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should add meta description tag', () => {
    fixture.detectChanges();
    expect(metaService.addTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Project Management Tool'
    });
  });
});
