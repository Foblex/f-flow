import { IUmlNodeViewModel } from '../i-uml-model';

export const UML_APPLICATION_NODES: IUmlNodeViewModel[] = [
  {
    id: 'checkout-service',
    position: { x: 40, y: 60 },
    parentId: 'pkg-application',
    data: {
      name: 'CheckoutApplicationService',
      layer: 'application',
      stereotype: '<<service>>',
      attributes: ['- orderRepo: OrderRepository', '- paymentGateway: PaymentGateway'],
      methods: ['+ execute(command: CheckoutCommand): CheckoutResult'],
      notes: ['Coordinates use case'],
    },
  },
  {
    id: 'read-model-projector',
    position: { x: 340, y: 230 },
    parentId: 'pkg-application',
    data: {
      name: 'OrderReadModelProjector',
      layer: 'application',
      stereotype: '<<event handler>>',
      attributes: ['- queries: OrderQueries'],
      methods: ['+ onOrderPlaced(event: OrderPlaced): void'],
    },
  },
  {
    id: 'order-repository',
    position: { x: 40, y: 410 },
    parentId: 'pkg-application',
    data: {
      name: 'OrderRepository',
      layer: 'application',
      stereotype: '<<interface>>',
      attributes: [],
      methods: [
        '+ findById(id: OrderId): Promise<Order | null>',
        '+ save(order: Order): Promise<void>',
      ],
    },
  },
  {
    id: 'payment-gateway',
    position: { x: 340, y: 410 },
    parentId: 'pkg-application',
    data: {
      name: 'PaymentGateway',
      layer: 'application',
      stereotype: '<<interface>>',
      attributes: [],
      methods: ['+ charge(input: ChargeInput): Promise<ChargeResult>'],
    },
  },
];
