import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // 1. Importa esto
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule // 2. Añade esta línea
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Nota: He visto que este test también podría fallar si tu 'app.html' no tiene un <h1>.
    // El error principal es el de ActivatedRoute, pero mantén esto en mente.
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});