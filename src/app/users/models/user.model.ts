import {AttributeValue} from "@aws-sdk/client-dynamodb";

import {UUIDDto, UUIDEntity} from "shared/models/uuid.model";

export class UserEntity extends UUIDEntity {
  password!: AttributeValue.SMember;

  first_name!: AttributeValue.SMember;

  last_name!: AttributeValue.SMember;

  middle_name?: AttributeValue.SMember;
}

export class UserDto extends UUIDDto {
  firstName!: string;

  lastName!: string;

  middleName?: string;

  static fromEntity(entity: UserEntity) {
    const it = new UserDto();
    it.id = entity.id.S;
    it.created = new Date(entity.created.S).valueOf();
    it.updated = new Date(entity.updated.S).valueOf();
    it.firstName = entity.first_name.S;
    it.lastName = entity.last_name.S;
    it.middleName = entity.middle_name?.S;
    return it;
  }
}