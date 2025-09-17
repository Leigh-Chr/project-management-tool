/**
 * Constantes pour les rôles utilisateur
 */
export const ROLES = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
  OBSERVER: 'Observer'
} as const;

/**
 * Type pour les rôles utilisateur
 */
export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Utilitaires pour la gestion des permissions basées sur les rôles
 */
export const RoleUtils = {
  /**
   * Vérifie si l'utilisateur est un Admin
   */
  isAdmin: (role?: string): boolean => role === ROLES.ADMIN,

  /**
   * Vérifie si l'utilisateur est un Member
   */
  isMember: (role?: string): boolean => role === ROLES.MEMBER,

  /**
   * Vérifie si l'utilisateur est un Observer
   */
  isObserver: (role?: string): boolean => role === ROLES.OBSERVER,

  /**
   * Vérifie si l'utilisateur peut modifier (Admin ou Member)
   */
  canModify: (role?: string): boolean => 
    role === ROLES.ADMIN || role === ROLES.MEMBER,

  /**
   * Vérifie si l'utilisateur peut supprimer (Admin seulement)
   */
  canDelete: (role?: string): boolean => role === ROLES.ADMIN,

  /**
   * Vérifie si l'utilisateur peut gérer les membres (Admin seulement)
   */
  canManageMembers: (role?: string): boolean => role === ROLES.ADMIN,

  /**
   * Vérifie si l'utilisateur peut créer des projets (Admin seulement)
   */
  canCreateProject: (role?: string): boolean => role === ROLES.ADMIN,

  /**
   * Vérifie si l'utilisateur peut créer des tâches (Admin ou Member)
   */
  canCreateTask: (role?: string): boolean => 
    role === ROLES.ADMIN || role === ROLES.MEMBER,

  /**
   * Vérifie si l'utilisateur peut voir le contenu (tous les rôles)
   */
  canView: (role?: string): boolean => 
    role === ROLES.ADMIN || role === ROLES.MEMBER || role === ROLES.OBSERVER,

  /**
   * Vérifie si l'utilisateur est Admin dans au moins un des projets fournis
   */
  isAdminInAnyProject: (projects: Array<{ myRole?: string }>): boolean =>
    projects.some(project => project.myRole === ROLES.ADMIN)
};
