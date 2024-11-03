import { Injectable, inject } from '@angular/core';
import { Role } from '../backend-mock.service';
import { RoleControllerService } from '../mock/backend/role-controller.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleController = inject(RoleControllerService);

  async getRoles(): Promise<Role[]> {
    return this.roleController.getRoles();
  }
}
