import { generateGuid } from '@foblex/utils';
import { EColumnKey, EColumnType, ERelationType, IConnection, IGroup, ITable } from './models';

const CUSTOMERS: ITable = {
  id: 'customers',
  name: 'Customers',
  parentId: 'customer_group',
  position: { x: 700, y: 50 },
  columns: [
    { id: 'customer_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'customer_name', name: 'name', type: EColumnType.VARCHAR, key: EColumnKey.INDEX },
    { id: 'customer_email', name: 'email', type: EColumnType.VARCHAR, key: EColumnKey.UNIQUE },
    { id: 'customer_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const ORDERS: ITable = {
  id: 'orders',
  name: 'Orders',
  parentId: 'order_group',
  position: { x: 220, y: -50 },
  columns: [
    { id: 'order_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'order_customer_id', name: 'customer_id', type: EColumnType.INT, key: EColumnKey.INDEX },
    { id: 'order_total', name: 'total', type: EColumnType.VARCHAR },
    { id: 'order_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const PRODUCTS: ITable = {
  id: 'products',
  name: 'Products',
  parentId: 'product_group',
  position: { x: 760, y: 310 },
  columns: [
    { id: 'product_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'product_name', name: 'name', type: EColumnType.VARCHAR, key: EColumnKey.INDEX },
    { id: 'product_description', name: 'description', type: EColumnType.TEXT },
    { id: 'product_price', name: 'price', type: EColumnType.VARCHAR },
    { id: 'product_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const ORDER_ITEMS: ITable = {
  id: 'order_items',
  name: 'Order Items',
  parentId: 'order_group',
  position: { x: -210, y: 100 },
  columns: [
    { id: 'order_item_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'order_item_order_id', name: 'order_id', type: EColumnType.INT, key: EColumnKey.INDEX },
    {
      id: 'order_item_product_id',
      name: 'product_id',
      type: EColumnType.INT,
      key: EColumnKey.INDEX,
    },
    { id: 'order_item_quantity', name: 'quantity', type: EColumnType.INT },
    { id: 'order_item_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const CATEGORIES: ITable = {
  id: 'categories',
  name: 'Categories',
  parentId: 'product_group',
  position: { x: 700, y: 600 },
  columns: [
    { id: 'category_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'category_name', name: 'name', type: EColumnType.VARCHAR, key: EColumnKey.UNIQUE },
    { id: 'category_description', name: 'description', type: EColumnType.TEXT },
    { id: 'category_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const PRODUCT_CATEGORIES: ITable = {
  id: 'product_categories',
  name: 'Product Categories',
  parentId: 'product_group',
  position: { x: 220, y: 400 },
  columns: [
    { id: 'product_category_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    {
      id: 'product_category_product_id',
      name: 'product_id',
      type: EColumnType.INT,
      key: EColumnKey.INDEX,
    },
    {
      id: 'product_category_category_id',
      name: 'category_id',
      type: EColumnType.INT,
      key: EColumnKey.INDEX,
    },
  ],
};

const SUPPLIERS: ITable = {
  id: 'suppliers',
  name: 'Suppliers',
  position: { x: 700, y: 800 },
  columns: [
    { id: 'supplier_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'supplier_name', name: 'name', type: EColumnType.VARCHAR, key: EColumnKey.INDEX },
    { id: 'supplier_contact', name: 'contact', type: EColumnType.VARCHAR },
    { id: 'supplier_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const INVENTORY: ITable = {
  id: 'inventory',
  name: 'Inventory',
  position: { x: 320, y: 600 },
  columns: [
    { id: 'inventory_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    {
      id: 'inventory_product_id',
      name: 'product_id',
      type: EColumnType.INT,
      key: EColumnKey.INDEX,
    },
    {
      id: 'inventory_supplier_id',
      name: 'supplier_id',
      type: EColumnType.INT,
      key: EColumnKey.INDEX,
    },
    { id: 'inventory_quantity', name: 'quantity', type: EColumnType.INT },
    { id: 'inventory_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const EMPLOYEES: ITable = {
  id: 'employees',
  name: 'Employees',
  position: { x: -50, y: 650 },
  columns: [
    { id: 'employee_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'employee_name', name: 'name', type: EColumnType.VARCHAR, key: EColumnKey.INDEX },
    { id: 'employee_position', name: 'position', type: EColumnType.VARCHAR },
    { id: 'employee_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const PAYMENTS: ITable = {
  id: 'payments',
  name: 'Payments',
  parentId: 'order_group',
  position: { x: -220, y: -190 },
  columns: [
    { id: 'payment_id', name: 'id', type: EColumnType.INT, key: EColumnKey.PRIMARY },
    { id: 'payment_order_id', name: 'order_id', type: EColumnType.INT, key: EColumnKey.INDEX },
    { id: 'payment_amount', name: 'amount', type: EColumnType.VARCHAR },
    { id: 'payment_method', name: 'method', type: EColumnType.VARCHAR },
    { id: 'payment_created_at', name: 'created_at', type: EColumnType.DATETIME },
  ],
};

const SEED_TABLES: readonly ITable[] = [
  CUSTOMERS,
  ORDERS,
  PRODUCTS,
  ORDER_ITEMS,
  CATEGORIES,
  PRODUCT_CATEGORIES,
  SUPPLIERS,
  INVENTORY,
  EMPLOYEES,
  PAYMENTS,
];

const SEED_CONNECTIONS: readonly Omit<IConnection, 'id'>[] = [
  {
    type: ERelationType.ONE_TO_MANY,
    from: 'order_customer_id',
    to: 'customer_id',
  },
  {
    type: ERelationType.ONE_TO_MANY,
    from: 'order_item_order_id',
    to: 'order_id',
  },
  {
    type: ERelationType.ONE_TO_MANY,
    from: 'order_item_product_id',
    to: 'product_id',
  },
  {
    type: ERelationType.MANY_TO_MANY,
    from: 'product_category_product_id',
    to: 'product_id',
  },
  {
    type: ERelationType.MANY_TO_MANY,
    from: 'product_category_category_id',
    to: 'category_id',
  },
  {
    type: ERelationType.ONE_TO_MANY,
    from: 'inventory_supplier_id',
    to: 'supplier_id',
  },
  {
    type: ERelationType.ONE_TO_MANY,
    from: 'payment_order_id',
    to: 'order_id',
  },
];

const SEED_GROUPS: readonly IGroup[] = [
  {
    id: 'order_group',
    name: 'Order',
    position: { x: -260, y: -240 },
    parentId: 'customer_group',
  },
  {
    id: 'customer_group',
    name: 'Customer',
    position: { x: -300, y: -290 },
  },
  {
    id: 'product_group',
    name: 'Product',
    position: { x: 190, y: 300 },
  },
];

function cloneTables(): ITable[] {
  return SEED_TABLES.map((table) => ({
    ...table,
    position: { ...table.position },
    columns: table.columns.map((column) => ({ ...column })),
  }));
}

function cloneGroups(): IGroup[] {
  return SEED_GROUPS.map((group) => ({
    ...group,
    position: { ...group.position },
  }));
}

function cloneConnections(): IConnection[] {
  return SEED_CONNECTIONS.map((connection) => ({
    ...connection,
    id: generateGuid(),
  }));
}

export function createSeedState(): {
  tables: ITable[];
  connections: IConnection[];
  groups: IGroup[];
} {
  return {
    tables: cloneTables(),
    connections: cloneConnections(),
    groups: cloneGroups(),
  };
}
