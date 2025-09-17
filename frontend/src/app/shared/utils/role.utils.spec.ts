import { RoleUtils } from './role.utils';

describe('RoleUtils', () => {
  describe('canDelete', () => {
    it('should return true for Admin role', () => {
      expect(RoleUtils.canDelete('Admin')).toBe(true);
    });

    it('should return false for Member role', () => {
      expect(RoleUtils.canDelete('Member')).toBe(false);
    });

    it('should return false for Observer role', () => {
      expect(RoleUtils.canDelete('Observer')).toBe(false);
    });
  });

  describe('canModify', () => {
    it('should return true for Admin role', () => {
      expect(RoleUtils.canModify('Admin')).toBe(true);
    });

    it('should return true for Member role', () => {
      expect(RoleUtils.canModify('Member')).toBe(true);
    });

    it('should return false for Observer role', () => {
      expect(RoleUtils.canModify('Observer')).toBe(false);
    });
  });

  describe('canManageMembers', () => {
    it('should return true for Admin role', () => {
      expect(RoleUtils.canManageMembers('Admin')).toBe(true);
    });

    it('should return false for Member role', () => {
      expect(RoleUtils.canManageMembers('Member')).toBe(false);
    });

    it('should return false for Observer role', () => {
      expect(RoleUtils.canManageMembers('Observer')).toBe(false);
    });
  });

  describe('canCreateTask', () => {
    it('should return true for Admin role', () => {
      expect(RoleUtils.canCreateTask('Admin')).toBe(true);
    });

    it('should return true for Member role', () => {
      expect(RoleUtils.canCreateTask('Member')).toBe(true);
    });

    it('should return false for Observer role', () => {
      expect(RoleUtils.canCreateTask('Observer')).toBe(false);
    });
  });
});
