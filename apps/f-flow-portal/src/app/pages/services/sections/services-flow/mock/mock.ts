import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';
import { ServicesFlowConfiguration } from '../models/services-flow-configuration';
import { ServiceNodeType } from '../enums/service-node-type';
import { ServiceConnectionStyle } from '../enums/service-connection-style';

/**
 * Services hero-flow — a vertical timeline of engagement steps.
 *
 * Four wide horizontal cards stacked top-to-bottom, connected by
 * subtle dotted guides. The Build card is the compound step that
 * owns the work itself: it lists concrete deliverables as a bullet
 * grid plus two pills for the ongoing ceremonies — Weekly review
 * (happens during build) and Retainer (optional ongoing support
 * after handoff).
 *
 *   ┌───────────────────────────┐
 *   │ 01  Intro email           │
 *   └─────────────┬─────────────┘
 *                 ┊
 *   ┌───────────────────────────┐
 *   │ 02  Proposal              │
 *   └─────────────┬─────────────┘
 *                 ┊
 *   ┌───────────────────────────┐
 *   │ 03  Build                 │
 *   │     ──────────────────    │
 *   │     ✓ bullets (2×2)       │
 *   │     [Weekly review] [Retainer] │
 *   └─────────────┬─────────────┘
 *                 ┊
 *   ┌───────────────────────────┐
 *   │ 04  Handoff               │
 *   └───────────────────────────┘
 */
export const SERVICES_FLOW: ServicesFlowConfiguration = {
  nodes: [
    {
      uid: 'intro-email',
      position: { x: 0, y: 0 },
      type: ServiceNodeType.STEP,
      rotate: 0,
      data: {
        step: '01',
        title: 'Intro email',
        meta: 'Async · free',
      },
    },
    {
      uid: 'proposal',
      position: { x: 500, y: 160 },
      type: ServiceNodeType.STEP,
      rotate: 0,
      data: {
        step: '02',
        title: 'Proposal',
        meta: 'Within 3 business days',
      },
    },
    {
      uid: 'build',
      position: { x: 0, y: 320 },
      type: ServiceNodeType.BUILD,
      rotate: 0,
      data: {
        step: '03',
        title: 'Build',
        meta: 'Fixed duration per tier',
        bullets: ['Architecture', 'Custom nodes', 'Connection rules', 'Tests & docs'],
        chips: [
          {
            icon: 'refresh',
            title: 'Weekly review',
            meta: 'demo · feedback',
          },
          {
            icon: 'clock',
            title: 'Retainer',
            meta: 'optional · monthly',
          },
        ],
      },
    },
    {
      uid: 'handoff',
      position: { x: 500, y: 700 },
      type: ServiceNodeType.STEP,
      rotate: 0,
      data: {
        step: '04',
        title: 'Handoff',
        meta: 'Docs · walkthrough · Q&A',
      },
    },
  ],
  connections: [
    {
      source: 'intro-email',
      sourceSide: EFConnectionConnectableSide.BOTTOM,
      target: 'proposal',
      targetSide: EFConnectionConnectableSide.TOP,
      style: ServiceConnectionStyle.DOTTED,
      type: EFConnectionType.SEGMENT,
      behaviour: EFConnectionBehavior.FIXED,
    },
    {
      source: 'proposal',
      sourceSide: EFConnectionConnectableSide.BOTTOM,
      target: 'build',
      targetSide: EFConnectionConnectableSide.TOP,
      style: ServiceConnectionStyle.DOTTED,
      type: EFConnectionType.SEGMENT,
      behaviour: EFConnectionBehavior.FIXED,
    },
    {
      source: 'build',
      sourceSide: EFConnectionConnectableSide.BOTTOM,
      target: 'handoff',
      targetSide: EFConnectionConnectableSide.TOP,
      style: ServiceConnectionStyle.DOTTED,
      type: EFConnectionType.SEGMENT,
      behaviour: EFConnectionBehavior.FIXED,
    },
  ],
};
