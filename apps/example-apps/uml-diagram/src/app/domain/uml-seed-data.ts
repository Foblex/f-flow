import { IUmlClass } from './i-uml-class';
import { IUmlConnection } from './i-uml-connection';
import { IUmlPackage } from './i-uml-package';

export const UML_SEED_PACKAGES: IUmlPackage[] = [
  {
    id: 'pkg-domain',
    name: 'Domain Layer',
    description: 'Business entities and value objects that define the core model.',
    layer: 'domain',
    position: { x: 40, y: 90 },
    size: { width: 780, height: 720 },
  },
  {
    id: 'pkg-application',
    name: 'Application Layer',
    description: 'Use cases, orchestration, and service contracts.',
    layer: 'application',
    position: { x: 880, y: 90 },
    size: { width: 660, height: 620 },
  },
  {
    id: 'pkg-infrastructure',
    name: 'Infrastructure Layer',
    description: 'Adapters for database and external systems.',
    layer: 'infrastructure',
    position: { x: 40, y: 840 },
    size: { width: 1500, height: 300 },
  },
];

export const UML_SEED_CLASSES: IUmlClass[] = [
  // Domain Layer
  {
    id: 'order',
    name: 'Order',
    layer: 'domain',
    packageId: 'pkg-domain',
    attributes: [
      { visibility: '-', name: 'id', type: 'OrderId' },
      { visibility: '-', name: 'status', type: 'OrderStatus' },
      { visibility: '-', name: 'total', type: 'Money' },
    ],
    methods: [
      {
        visibility: '+',
        name: 'addLine',
        params: 'productId: string, qty: number',
        returnType: 'void',
      },
      { visibility: '+', name: 'checkout', params: 'customerId: string', returnType: 'void' },
    ],
    notes: ['Aggregate Root'],
    position: { x: 80, y: 130 },
  },
  {
    id: 'order-line',
    name: 'OrderLine',
    layer: 'domain',
    packageId: 'pkg-domain',
    attributes: [
      { visibility: '-', name: 'productId', type: 'string' },
      { visibility: '-', name: 'quantity', type: 'number' },
      { visibility: '-', name: 'unitPrice', type: 'Money' },
    ],
    methods: [{ visibility: '+', name: 'subtotal', params: '', returnType: 'Money' }],
    position: { x: 470, y: 130 },
  },
  {
    id: 'customer',
    name: 'Customer',
    layer: 'domain',
    packageId: 'pkg-domain',
    attributes: [
      { visibility: '-', name: 'id', type: 'CustomerId' },
      { visibility: '-', name: 'email', type: 'string' },
      { visibility: '-', name: 'defaultAddress', type: 'Address' },
    ],
    methods: [{ visibility: '+', name: 'rename', params: 'name: string', returnType: 'void' }],
    position: { x: 80, y: 390 },
  },
  {
    id: 'address',
    name: 'Address',
    layer: 'domain',
    stereotype: 'value object',
    packageId: 'pkg-domain',
    attributes: [
      { visibility: '+', name: 'country', type: 'string' },
      { visibility: '+', name: 'city', type: 'string' },
      { visibility: '+', name: 'zipCode', type: 'string' },
    ],
    methods: [{ visibility: '+', name: 'format', params: '', returnType: 'string' }],
    position: { x: 470, y: 390 },
  },
  {
    id: 'money',
    name: 'Money',
    layer: 'domain',
    stereotype: 'value object',
    packageId: 'pkg-domain',
    attributes: [
      { visibility: '+', name: 'amount', type: 'number' },
      { visibility: '+', name: 'currency', type: 'string' },
    ],
    methods: [
      { visibility: '+', name: 'add', params: 'value: Money', returnType: 'Money' },
      { visibility: '+', name: 'isNegative', params: '', returnType: 'boolean' },
    ],
    position: { x: 80, y: 650 },
  },
  {
    id: 'priority-order',
    name: 'PriorityOrder',
    layer: 'domain',
    packageId: 'pkg-domain',
    attributes: [{ visibility: '-', name: 'escalationLevel', type: 'number' }],
    methods: [{ visibility: '+', name: 'recalculatePriority', params: '', returnType: 'void' }],
    position: { x: 470, y: 650 },
  },

  // Application Layer
  {
    id: 'checkout-service',
    name: 'CheckoutApplicationService',
    layer: 'application',
    stereotype: 'service',
    packageId: 'pkg-application',
    attributes: [
      { visibility: '-', name: 'orderRepo', type: 'OrderRepository' },
      { visibility: '-', name: 'paymentGateway', type: 'PaymentGateway' },
    ],
    methods: [
      {
        visibility: '+',
        name: 'execute',
        params: 'command: CheckoutCommand',
        returnType: 'CheckoutResult',
      },
    ],
    notes: ['Coordinates use case'],
    position: { x: 920, y: 150 },
  },
  {
    id: 'read-model-projector',
    name: 'OrderReadModelProjector',
    layer: 'application',
    stereotype: 'event handler',
    packageId: 'pkg-application',
    attributes: [{ visibility: '-', name: 'queries', type: 'OrderQueries' }],
    methods: [
      { visibility: '+', name: 'onOrderPlaced', params: 'event: OrderPlaced', returnType: 'void' },
    ],
    position: { x: 1220, y: 320 },
  },
  {
    id: 'order-repository',
    name: 'OrderRepository',
    layer: 'application',
    stereotype: 'interface',
    isAbstract: true,
    packageId: 'pkg-application',
    attributes: [],
    methods: [
      {
        visibility: '+',
        name: 'findById',
        params: 'id: OrderId',
        returnType: 'Promise<Order | null>',
      },
      { visibility: '+', name: 'save', params: 'order: Order', returnType: 'Promise<void>' },
    ],
    position: { x: 920, y: 500 },
  },
  {
    id: 'payment-gateway',
    name: 'PaymentGateway',
    layer: 'application',
    stereotype: 'interface',
    isAbstract: true,
    packageId: 'pkg-application',
    attributes: [],
    methods: [
      {
        visibility: '+',
        name: 'charge',
        params: 'input: ChargeInput',
        returnType: 'Promise<ChargeResult>',
      },
    ],
    position: { x: 1220, y: 500 },
  },

  // Infrastructure Layer
  {
    id: 'postgres-order-repository',
    name: 'PostgresOrderRepository',
    layer: 'infrastructure',
    stereotype: 'adapter',
    packageId: 'pkg-infrastructure',
    attributes: [{ visibility: '-', name: 'pool', type: 'PgPool' }],
    methods: [
      {
        visibility: '+',
        name: 'findById',
        params: 'id: OrderId',
        returnType: 'Promise<Order | null>',
      },
      { visibility: '+', name: 'save', params: 'order: Order', returnType: 'Promise<void>' },
    ],
    position: { x: 100, y: 910 },
  },
  {
    id: 'stripe-payment-gateway',
    name: 'StripePaymentGateway',
    layer: 'infrastructure',
    stereotype: 'adapter',
    packageId: 'pkg-infrastructure',
    attributes: [{ visibility: '-', name: 'client', type: 'StripeClient' }],
    methods: [
      {
        visibility: '+',
        name: 'charge',
        params: 'input: ChargeInput',
        returnType: 'Promise<ChargeResult>',
      },
    ],
    position: { x: 620, y: 910 },
  },
  {
    id: 'order-queries',
    name: 'OrderQueries',
    layer: 'infrastructure',
    stereotype: 'read model',
    packageId: 'pkg-infrastructure',
    attributes: [{ visibility: '-', name: 'db', type: 'DatabaseClient' }],
    methods: [
      {
        visibility: '+',
        name: 'listByCustomer',
        params: 'customerId: string',
        returnType: 'Promise<OrderListItem[]>',
      },
    ],
    position: { x: 1140, y: 910 },
  },
];

export const UML_SEED_CONNECTIONS: IUmlConnection[] = [
  // Domain relations
  {
    id: 'conn-order-order-line',
    from: 'order',
    to: 'order-line',
    kind: 'composition',
    label: 'contains',
    sourceMultiplicity: '1',
    targetMultiplicity: '1..*',
  },
  {
    id: 'conn-order-customer',
    from: 'order',
    to: 'customer',
    kind: 'association',
    label: 'placed by',
    sourceMultiplicity: '*',
    targetMultiplicity: '1',
  },
  {
    id: 'conn-customer-address',
    from: 'customer',
    to: 'address',
    kind: 'aggregation',
    label: 'uses',
    sourceMultiplicity: '1',
    targetMultiplicity: '1',
  },
  {
    id: 'conn-order-money',
    from: 'order',
    to: 'money',
    kind: 'composition',
    label: 'total',
    sourceMultiplicity: '1',
    targetMultiplicity: '1',
  },
  {
    id: 'conn-priority-order-order',
    from: 'priority-order',
    to: 'order',
    kind: 'inheritance',
    label: 'extends',
  },

  // Application relations
  {
    id: 'conn-checkout-order',
    from: 'checkout-service',
    to: 'order',
    kind: 'association',
    label: 'creates/updates',
  },
  {
    id: 'conn-projector-order',
    from: 'read-model-projector',
    to: 'order',
    kind: 'dependency',
    label: 'subscribes to events',
  },

  // Cross-layer relations
  {
    id: 'conn-checkout-order-repo',
    from: 'checkout-service',
    to: 'order-repository',
    kind: 'dependency',
    label: 'loads/saves',
  },
  {
    id: 'conn-checkout-payment-gateway',
    from: 'checkout-service',
    to: 'payment-gateway',
    kind: 'dependency',
    label: 'charges',
  },
  {
    id: 'conn-postgres-order-repo',
    from: 'postgres-order-repository',
    to: 'order-repository',
    kind: 'realization',
    label: 'implements',
  },
  {
    id: 'conn-stripe-payment-gateway',
    from: 'stripe-payment-gateway',
    to: 'payment-gateway',
    kind: 'realization',
    label: 'implements',
  },
  {
    id: 'conn-projector-queries',
    from: 'read-model-projector',
    to: 'order-queries',
    kind: 'association',
    label: 'updates read model',
  },
];
