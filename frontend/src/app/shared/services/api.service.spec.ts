import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make GET request with correct URL', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';

      service.get(endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle GET request errors', () => {
      const endpoint = '/test';
      const errorMessage = 'Error occurred';

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('POST requests', () => {
    it('should make POST request with correct URL and body', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';
      const body = { name: 'Test' };

      service.post(endpoint, body).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockData);
    });

    it('should handle POST request errors', () => {
      const endpoint = '/test';
      const body = { name: 'Test' };
      const errorMessage = 'Error occurred';

      service.post(endpoint, body).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request with correct URL and body', () => {
      const mockData = { id: 1, name: 'Updated Test' };
      const endpoint = '/test/1';
      const body = { name: 'Updated Test' };

      service.put(endpoint, body).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockData);
    });
  });

  describe('PATCH requests', () => {
    it('should make PATCH request with correct URL and body', () => {
      const mockData = { id: 1, name: 'Patched Test' };
      const endpoint = '/test/1';
      const body = { name: 'Patched Test' };

      service.patch(endpoint, body).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(body);
      req.flush(mockData);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request with correct URL', () => {
      const mockData = { message: 'Deleted successfully' };
      const endpoint = '/test/1';

      service.delete(endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockData);
    });

    it('should handle DELETE request errors', () => {
      const endpoint = '/test/1';
      const errorMessage = 'Not found';

      service.delete(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
});
