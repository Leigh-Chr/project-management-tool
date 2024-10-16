import { inject, Injectable } from '@angular/core';
import { DataMockService, Role } from './data-mock.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly dataMockService = inject(DataMockService);

  getRoles(): Role[] {
    return this.dataMockService.getRoles();
  }
}
