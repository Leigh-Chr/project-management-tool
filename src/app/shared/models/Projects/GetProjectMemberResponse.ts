import { ProjectMemberEntity } from "../../services/mock/database/entities";

export interface GetProjectMemberResponse {
  projectId: ProjectMemberEntity['projectId'];
  userId: ProjectMemberEntity['userId'];
  roleId: ProjectMemberEntity['roleId'];
}
