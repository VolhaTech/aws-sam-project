import {AttributeValue} from "@aws-sdk/client-dynamodb";

// @ts-ignore
export class UUIDEntity implements Record<string, AttributeValue> {
  id!: AttributeValue.SMember;

  created!: AttributeValue.SMember;

  updated!: AttributeValue.SMember;
}

export class UUIDDto {
  id!: string;

  created!: number;

  updated!: number;
}