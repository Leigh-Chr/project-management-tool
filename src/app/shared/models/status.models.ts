import type { StatusEntity } from './entities';

export type Status = {
  id: StatusEntity['id'];
  name: StatusEntity['name'];
};

export type GetStatusesResponse = Status[];
