import { CalculateConnectionLineByBehaviorRequest } from './calculate-connection-line-by-behavior-request';
import { Injectable } from '@angular/core';
import { EFConnectionBehavior, EFConnectionConnectableSide } from '../../../f-connection';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { ILine } from '@foblex/2d';
import { floatingBehavior } from './utils/floating-behavior';
import { fixedCenterBehavior } from './utils/fixed-center-behavior';
import { fixedOutboundBehavior } from './utils/fixed-outbound-behavior';
import { EFConnectableSide } from '../../../f-connectors';
import { CalculateBehaviorRequest } from './models/calculate-behavior-request';

/**
 * Small epsilon to treat near-zero differences as negligible.
 */
const EPSILON = 0.5;

/**
 * Function signature for behavior-specific connection line handlers.
 */
type BehaviorHandler = (args: CalculateBehaviorRequest) => ILine;

/**
 * Registry of all connection behavior handlers.
 */
const BEHAVIOR_HANDLERS: Record<string, BehaviorHandler> = {
  [EFConnectionBehavior.FLOATING]: floatingBehavior,
  [EFConnectionBehavior.FIXED_CENTER]: fixedCenterBehavior,
  [EFConnectionBehavior.FIXED]: fixedOutboundBehavior,
};

/**
 * Represents the directional deltas between two rectangles.
 */
interface IDirectionalVectors {
  sourceToTargetX: number;
  sourceToTargetY: number;
  targetToSourceX: number;
  targetToSourceY: number;
}

/**
 * Calculates connection lines based on behavior rules.
 * It determines which sides of the source and target should connect,
 * then delegates to a registered behavior handler.
 */
@Injectable()
@FExecutionRegister(CalculateConnectionLineByBehaviorRequest)
export class CalculateConnectionLineByBehavior
  implements IExecution<CalculateConnectionLineByBehaviorRequest, ILine>
{
  /**
   * Main execution entry point.
   *
   * @param request The request containing source, target, and connection details.
   * @returns A calculated connection line (ILine).
   */
  public handle(request: CalculateConnectionLineByBehaviorRequest): ILine {
    const vectors = this._calculateDirectionalVectors(
      request.sourceRect.gravityCenter.x,
      request.sourceRect.gravityCenter.y,
      request.targetRect.gravityCenter.x,
      request.targetRect.gravityCenter.y,
    );

    const sourceSide = this._determineSourceSide(request, vectors);
    const targetSide = this._determineTargetSide(request, vectors);

    request.connection._applyResolvedSidesToConnection(sourceSide, targetSide);

    const handler = this._getBehaviorHandler(request.connection.fBehavior);

    return handler({
      sourceRect: request.sourceRect,
      targetRect: request.targetRect,
      sourceConnectableSide: sourceSide,
      targetConnectableSide: targetSide,
    });
  }

  /**
   * Computes the directional deltas between two rectangles.
   */
  private _calculateDirectionalVectors(
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
  ): IDirectionalVectors {
    const sourceToTargetX = targetX - sourceX;
    const sourceToTargetY = targetY - sourceY;

    return {
      sourceToTargetX,
      sourceToTargetY,
      targetToSourceX: -sourceToTargetX,
      targetToSourceY: -sourceToTargetY,
    };
  }

  /**
   * Determines the side for the source element.
   */
  private _determineSourceSide(
    request: CalculateConnectionLineByBehaviorRequest,
    vectors: IDirectionalVectors,
  ): EFConnectableSide {
    return this._resolveConnectableSide(
      request.connection.fOutputSide(),
      vectors.sourceToTargetX,
      vectors.sourceToTargetY,
      request.sourceConnectableSide,
    );
  }

  /**
   * Determines the side for the target element.
   */
  private _determineTargetSide(
    request: CalculateConnectionLineByBehaviorRequest,
    vectors: IDirectionalVectors,
  ): EFConnectableSide {
    return this._resolveConnectableSide(
      request.connection.fInputSide(),
      vectors.targetToSourceX,
      vectors.targetToSourceY,
      request.targetConnectableSide,
    );
  }

  /**
   * Resolves which side of a shape to connect to based on direction, fallback, and connection mode.
   *
   * @param requestedSide The side mode (e.g. CALCULATE, CALCULATE_HORIZONTAL, FIXED, etc.).
   * @param deltaX Difference in X between source and target.
   * @param deltaY Difference in Y between source and target.
   * @param fallbackSide The default fallback side if calculation is ambiguous.
   */
  private _resolveConnectableSide(
    requestedSide: EFConnectionConnectableSide,
    deltaX: number,
    deltaY: number,
    fallbackSide: EFConnectableSide,
  ): EFConnectableSide {
    if (requestedSide === EFConnectionConnectableSide.DEFAULT) {
      return fallbackSide;
    }

    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);
    const isNearZero = absoluteX < EPSILON && absoluteY < EPSILON;

    if (isNearZero) {
      return fallbackSide;
    }

    const isHorizontalDominant = absoluteX >= absoluteY;

    switch (requestedSide) {
      case EFConnectionConnectableSide.CALCULATE:
        return isHorizontalDominant
          ? deltaX >= 0
            ? EFConnectableSide.RIGHT
            : EFConnectableSide.LEFT
          : deltaY >= 0
            ? EFConnectableSide.BOTTOM
            : EFConnectableSide.TOP;

      case EFConnectionConnectableSide.CALCULATE_HORIZONTAL:
        if (absoluteX < EPSILON) {
          return fallbackSide;
        }

        return deltaX >= 0 ? EFConnectableSide.RIGHT : EFConnectableSide.LEFT;

      case EFConnectionConnectableSide.CALCULATE_VERTICAL:
        if (absoluteY < EPSILON) {
          return fallbackSide;
        }

        return deltaY >= 0 ? EFConnectableSide.BOTTOM : EFConnectableSide.TOP;

      case EFConnectionConnectableSide.TOP:
        return EFConnectableSide.TOP;
      case EFConnectionConnectableSide.BOTTOM:
        return EFConnectableSide.BOTTOM;
      case EFConnectionConnectableSide.LEFT:
        return EFConnectableSide.LEFT;
      case EFConnectionConnectableSide.RIGHT:
        return EFConnectableSide.RIGHT;

      default:
        return fallbackSide;
    }
  }

  /**
   * Returns the appropriate handler for the given connection behavior.
   *
   * @throws Error if no handler is registered for the behavior.
   */
  private _getBehaviorHandler(behavior: EFConnectionBehavior): BehaviorHandler {
    const handler = BEHAVIOR_HANDLERS[behavior];
    if (!handler) {
      throw new Error(`[Behavior] No handler for behavior: ${behavior}`);
    }

    return handler;
  }
}
