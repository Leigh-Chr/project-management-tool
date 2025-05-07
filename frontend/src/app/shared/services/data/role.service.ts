import { Injectable, inject } from '@angular/core';
import type { RoleEntity } from '../../models/entities';
import type { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly apiService = inject(ApiService);

  getRoles(): Observable<RoleEntity[]> {
    return this.apiService.get<RoleEntity[]>('/roles');
  }

  getRole(roleId: number): Observable<RoleEntity | null> {
    return this.apiService.get<RoleEntity>(`/roles/${roleId}`).pipe(
      map(role => role || null)
    );
  }
}
