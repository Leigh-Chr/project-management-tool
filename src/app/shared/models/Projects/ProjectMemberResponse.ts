import { ProjectMemberEntity } from "../../services/mock/database/entities";

export interface ProjectMemberResponse {
  projectId: ProjectMemberEntity['projectId'];
  userId: ProjectMemberEntity['userId'];
  roleId: ProjectMemberEntity['roleId'];
}
