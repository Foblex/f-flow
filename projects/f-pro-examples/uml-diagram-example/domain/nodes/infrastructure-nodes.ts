import { IUmlNodeViewModel } from '../i-uml-model';

export const UML_INFRASTRUCTURE_NODES: IUmlNodeViewModel[] = [
  {
    id: 'postgres-order-repository',
    position: { x: 60, y: 70 },
    parentId: 'pkg-infrastructure',
    data: {
      name: 'PostgresOrderRepository',
      layer: 'infrastructure',
      stereotype: '<<adapter>>',
      attributes: ['- pool: PgPool'],
      methods: [
        '+ findById(id: OrderId): Promise<Order | null>',
        '+ save(order: Order): Promise<void>',
      ],
    },
  },
  {
    id: 'stripe-payment-gateway',
    position: { x: 580, y: 70 },
    parentId: 'pkg-infrastructure',
    data: {
      name: 'StripePaymentGateway',
      layer: 'infrastructure',
      stereotype: '<<adapter>>',
      attributes: ['- client: StripeClient'],
      methods: ['+ charge(input: ChargeInput): Promise<ChargeResult>'],
    },
  },
  {
    id: 'order-queries',
    position: { x: 1100, y: 70 },
    parentId: 'pkg-infrastructure',
    data: {
      name: 'OrderQueries',
      layer: 'infrastructure',
      stereotype: '<<read model>>',
      attributes: ['- db: DatabaseClient'],
      methods: ['+ listByCustomer(customerId: string): Promise<OrderListItem[]>'],
    },
  },
];
