import { Injectable, inject } from '@angular/core';
import { RoleControllerService } from '../mock/backend/role-controller.service';
import { RoleResponse } from '../../models/RoleResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleController = inject(RoleControllerService);

  async getRoles(): Promise<RoleResponse[]> {
    return this.roleController.getRoles();
  }
}
