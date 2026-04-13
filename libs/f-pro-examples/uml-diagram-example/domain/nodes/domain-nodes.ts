import { IUmlNodeViewModel } from '../i-uml-model';

export const UML_DOMAIN_NODES: IUmlNodeViewModel[] = [
  {
    id: 'order',
    position: { x: 40, y: 40 },
    parentId: 'pkg-domain',
    data: {
      name: 'Order',
      layer: 'domain',
      attributes: ['- id: OrderId', '- status: OrderStatus', '- total: Money'],
      methods: [
        '+ addLine(productId: string, qty: number): void',
        '+ checkout(customerId: string): void',
      ],
      notes: ['Aggregate Root'],
    },
  },
  {
    id: 'order-line',
    position: { x: 430, y: 40 },
    parentId: 'pkg-domain',
    data: {
      name: 'OrderLine',
      layer: 'domain',
      attributes: ['- productId: string', '- quantity: number', '- unitPrice: Money'],
      methods: ['+ subtotal(): Money'],
    },
  },
  {
    id: 'customer',
    position: { x: 40, y: 300 },
    parentId: 'pkg-domain',
    data: {
      name: 'Customer',
      layer: 'domain',
      attributes: ['- id: CustomerId', '- email: string', '- defaultAddress: Address'],
      methods: ['+ rename(name: string): void'],
    },
  },
  {
    id: 'address',
    position: { x: 430, y: 300 },
    parentId: 'pkg-domain',
    data: {
      name: 'Address',
      layer: 'domain',
      stereotype: '<<value object>>',
      attributes: ['+ country: string', '+ city: string', '+ zipCode: string'],
      methods: ['+ format(): string'],
    },
  },
  {
    id: 'money',
    position: { x: 40, y: 560 },
    parentId: 'pkg-domain',
    data: {
      name: 'Money',
      layer: 'domain',
      stereotype: '<<value object>>',
      attributes: ['+ amount: number', '+ currency: string'],
      methods: ['+ add(value: Money): Money', '+ isNegative(): boolean'],
    },
  },
  {
    id: 'priority-order',
    position: { x: 430, y: 560 },
    parentId: 'pkg-domain',
    data: {
      name: 'PriorityOrder',
      layer: 'domain',
      attributes: ['- escalationLevel: number'],
      methods: ['+ recalculatePriority(): void'],
    },
  },
];
