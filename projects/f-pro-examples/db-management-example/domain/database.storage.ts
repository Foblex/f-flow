import { ITableStorageModel } from './table';
import { ITableConnectionStorageModel } from './connection';
import { ETableRelationType } from './connection';
import { ETableColumnKey, ETableColumnType } from './table';
import { IGroupStorageModel } from './group';
import { generateGuid } from '@foblex/utils';

export interface IDatabaseStorage {

  tables: ITableStorageModel[];

  connections: ITableConnectionStorageModel[];

  groups: IGroupStorageModel[];
}

const CUSTOMERS: ITableStorageModel = {
  id: 'customers',
  name: 'Customers',
  parentId: 'customer_group',
  connectOnNode: true,
  position: { x: 700, y: 50 },
  columns: [ {
    id: 'customer_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'customer_name',
    name: 'name',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'customer_email',
    name: 'email',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.UNIQUE,
  }, {
    id: 'customer_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const ORDERS = {
  id: 'orders',
  name: 'Orders',
  parentId: 'order_group',
  position: { x: 220, y: -50 },
  columns: [ {
    id: 'order_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'order_customer_id',
    name: 'customer_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'order_total',
    name: 'total',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'order_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const PRODUCTS = {
  id: 'products',
  name: 'Products',
  parentId: 'product_group',
  position: { x: 760, y: 310 },
  columns: [ {
    id: 'product_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'product_name',
    name: 'name',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'product_description',
    name: 'description',
    type: ETableColumnType.TEXT,
  }, {
    id: 'product_price',
    name: 'price',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'product_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const ORDER_ITEMS = {
  id: 'order_items',
  name: 'Order Items',
  parentId: 'order_group',
  position: { x: -210, y: 100 },
  columns: [ {
    id: 'order_item_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'order_item_order_id',
    name: 'order_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'order_item_product_id',
    name: 'product_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'order_item_quantity',
    name: 'quantity',
    type: ETableColumnType.INT,
  }, {
    id: 'order_item_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const CATEGORIES = {
  id: 'categories',
  name: 'Categories',
  parentId: 'product_group',
  position: { x: 700, y: 600 },
  columns: [ {
    id: 'category_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'category_name',
    name: 'name',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.UNIQUE,
  }, {
    id: 'category_description',
    name: 'description',
    type: ETableColumnType.TEXT,
  }, {
    id: 'category_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const PRODUCT_CATEGORIES = {
  id: 'product_categories',
  name: 'Product Categories',
  parentId: 'product_group',
  position: { x: 220, y: 400 },
  columns: [ {
    id: 'product_category_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'product_category_product_id',
    name: 'product_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'product_category_category_id',
    name: 'category_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  } ]
};

const SUPPLIERS = {
  id: 'suppliers',
  name: 'Suppliers',
  position: { x: 700, y: 800 },
  columns: [ {
    id: 'supplier_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'supplier_name',
    name: 'name',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'supplier_contact',
    name: 'contact',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'supplier_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const INVENTORY = {
  id: 'inventory',
  name: 'Inventory',
  position: { x: 320, y: 600 },
  columns: [ {
    id: 'inventory_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'inventory_product_id',
    name: 'product_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'inventory_supplier_id',
    name: 'supplier_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'inventory_quantity',
    name: 'quantity',
    type: ETableColumnType.INT,
  }, {
    id: 'inventory_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const EMPLOYEES = {
  id: 'employees',
  name: 'Employees',
  position: { x: -50, y: 650 },
  columns: [ {
    id: 'employee_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'employee_name',
    name: 'name',
    type: ETableColumnType.VARCHAR,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'employee_position',
    name: 'position',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'employee_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

const PAYMENTS = {
  id: 'payments',
  name: 'Payments',
  parentId: 'order_group',
  position: { x: -220, y: -190 },
  columns: [ {
    id: 'payment_id',
    name: 'id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.PRIMARY,
  }, {
    id: 'payment_order_id',
    name: 'order_id',
    type: ETableColumnType.INT,
    key: ETableColumnKey.INDEX,
  }, {
    id: 'payment_amount',
    name: 'amount',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'payment_method',
    name: 'method',
    type: ETableColumnType.VARCHAR,
  }, {
    id: 'payment_created_at',
    name: 'created_at',
    type: ETableColumnType.DATETIME,
  } ]
};

export const DATABASE_STORAGE: IDatabaseStorage = {
  tables: [
    CUSTOMERS, ORDERS, PRODUCTS, ORDER_ITEMS, CATEGORIES,
    PRODUCT_CATEGORIES, SUPPLIERS, INVENTORY, EMPLOYEES, PAYMENTS
  ],
  connections: [
    {
      id: generateGuid(),
      type: ETableRelationType.ONE_TO_MANY,
      from: 'order_customer_id',
      to: 'customer_id'
    },
    {
      id: generateGuid(),
      type: ETableRelationType.ONE_TO_MANY,
      from: 'order_item_order_id',
      to: 'order_id'
    },
    {
      id: generateGuid(),
      type: ETableRelationType.ONE_TO_MANY,
      from: 'order_item_product_id',
      to: 'product_id'
    },
    {
      id: generateGuid(),
      type: ETableRelationType.MANY_TO_MANY,
      from: 'product_category_product_id',
      to: 'product_id'
    },
    {
      id: generateGuid(),
      type: ETableRelationType.MANY_TO_MANY,
      from: 'product_category_category_id',
      to: 'category_id'
    },
    {
      id: generateGuid(),
      type: ETableRelationType.ONE_TO_MANY,
      from: 'inventory_supplier_id',
      to: 'supplier_id'
    },
    { id: generateGuid(), type: ETableRelationType.ONE_TO_MANY, from: 'payment_order_id', to: 'order_id' },
  ],
  groups: [
    { id: 'order_group', name: 'Order', position: { x: -260, y: -240 }, size: { width: 780, height: 600 }, parentId: 'customer_group' },
    { id: 'customer_group', name: 'Customer', position: { x: -300, y: -290 }, size: { width: 1300, height: 800 } },
    { id: 'product_group', name: 'Product', position: { x: 190, y: 300 }, size: { width: 900, height: 800 } },
  ]
};

