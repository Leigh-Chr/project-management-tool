import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  setBaseUrl(url: string): this {
    this.baseUrl = url;
    return this;
  }

  private getFullUrl(url: string): string {
    return this.baseUrl + url;
  }

  async fetchData<T>(url: string, errorMessage: string): Promise<T> {
    return this.handleRequest<T>(
      () => this.http.get<T>(this.getFullUrl(url)),
      errorMessage
    );
  }

  async postData<T>(
    url: string,
    data: object,
    errorMessage: string
  ): Promise<T> {
    return this.handleRequest<T>(
      () => this.http.post<T>(this.getFullUrl(url), data),
      errorMessage
    );
  }

  async putData<T>(
    url: string,
    data: object,
    errorMessage: string,
    headers?: HttpHeaders
  ): Promise<T> {
    const options = this.createOptions(headers);
    return this.handleRequest<T>(
      () => this.http.put<T>(this.getFullUrl(url), data, options),
      errorMessage
    );
  }

  private createOptions(headers?: HttpHeaders): { headers?: HttpHeaders } {
    return headers ? { headers } : {};
  }

  private async handleRequest<T>(
    requestFn: () => Observable<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      const response = await lastValueFrom(requestFn());
      if (response === null || response === undefined)
        return [] as unknown as T;

      return response;
    } catch (error) {
      this.handleError(error as Error, errorMessage);
      return [] as unknown as T;
    }
  }

  private handleError(error: Error, errorMessage: string): void {
    console.error(`${errorMessage} : `, error.message);
  }
}
