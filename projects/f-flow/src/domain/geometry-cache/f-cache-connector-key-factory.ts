export type FCacheConnectorKey = string;

export class FCacheConnectorKeyFactory {
  public static build(connectorId: string, kind: string): FCacheConnectorKey {
    return `${connectorId}:${kind}`;
  }
}
