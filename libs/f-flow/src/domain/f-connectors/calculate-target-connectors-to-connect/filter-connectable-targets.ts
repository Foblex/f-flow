import { FConnectorBase, FSourceConnectorBase } from '../../../f-connectors';

/**
 * Applies the public connectability rules to a candidate target list.
 *
 * The `fCanBeConnectedTo` allow-list NARROWS the candidates; it never overrides the
 * base rules — a disabled or at-capacity target stays unconnectable, and connecting
 * a node to itself still requires `isSelfConnectable`. Every gesture (drag, click,
 * keyboard) resolves its targets through this filter.
 */
export function filterConnectableTargets(
  source: FSourceConnectorBase,
  targets: FConnectorBase[],
): FConnectorBase[] {
  let result = targets.filter((x) => x.canBeConnected);

  if (source.hasConnectionLimits) {
    result = result.filter((x) => source.canConnectTo(x));
  }

  if (!source.isSelfConnectable) {
    result = result.filter((x) => x.fNodeId !== source.fNodeId);
  }

  return result;
}
