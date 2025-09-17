import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Effectue une requête GET vers le backend
   * @param path Chemin de l'endpoint relatif à la base URL
   * @param params Paramètres optionnels de requête
   * @returns Observable de la réponse
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  /**
   * Effectue une requête POST vers le backend
   * @param path Chemin de l'endpoint relatif à la base URL
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  /**
   * Effectue une requête PUT vers le backend
   * @param path Chemin de l'endpoint relatif à la base URL
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  /**
   * Effectue une requête PATCH vers le backend
   * @param path Chemin de l'endpoint relatif à la base URL
   * @param body Corps de la requête
   * @returns Observable de la réponse
   */
  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  /**
   * Effectue une requête DELETE vers le backend
   * @param path Chemin de l'endpoint relatif à la base URL
   * @returns Observable de la réponse
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
} 