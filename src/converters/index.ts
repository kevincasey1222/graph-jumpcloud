import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export * from "./constants";
export * from "./account";
export * from "./user";
export * from "./group";

export function createHasRelationships(
  fromEntityKey: string,
  toEntityKeys: string[],
  relationshipType: string,
  relationshipProperties?: any,
) {
  const relationships: RelationshipFromIntegration[] = [];
  for (const toEntityKey of toEntityKeys) {
    relationships.push(
      createHasRelationship(
        fromEntityKey,
        toEntityKey,
        relationshipType,
        relationshipProperties,
      ),
    );
  }
  return relationships;
}

export function createHasRelationship(
  fromEntityKey: string,
  toEntityKey: string,
  relationshipType: string,
  relationshipProperties?: any,
) {
  const relationship: RelationshipFromIntegration = {
    _key: `${fromEntityKey}|has|${toEntityKey}`,
    _type: relationshipType,
    _class: "HAS",
    _fromEntityKey: fromEntityKey,
    _toEntityKey: toEntityKey,
    displayName: "HAS",
    ...relationshipProperties,
  };

  return relationship;
}
