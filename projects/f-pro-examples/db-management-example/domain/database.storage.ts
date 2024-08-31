import { ITableStorageModel } from './table/i-table-storage-model';
import { ITableConnectionStorageModel } from './connection/i-table-connection-storage-model';
import { GuidExtensions, IPoint } from '@foblex/core';
import { ETableRelationType } from './connection';
import { ETableColumnKey, ETableColumnType } from './table';

export interface IDatabaseStorage {

  tables: ITableStorageModel[];

  connections: ITableConnectionStorageModel[];

  groups: { groupId: string, groupName: string, position: IPoint }[];
}

const CUSTOMERS = {
  id: 'customers',
  name: 'Customers',
  parentId: 'sales',
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
  parentId: 'sales',
  position: { x: 320, y: 50 },
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
  parentId: 'inventory',
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
  parentId: 'sales',
  position: { x: -110, y: 200 },
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
  parentId: 'inventory',
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
  parentId: 'inventory',
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
  parentId: 'inventory',
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
  parentId: 'inventory',
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
  parentId: 'management',
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
  parentId: 'sales',
  position: { x: -120, y: -100 },
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
    { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'order_customer_id', to: 'customer_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'order_item_order_id', to: 'order_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'order_item_product_id', to: 'product_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.MANY_TO_MANY, from: 'product_category_product_id', to: 'product_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.MANY_TO_MANY, from: 'product_category_category_id', to: 'category_id' },
    // { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'inventory_product_id', to: 'product_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'inventory_supplier_id', to: 'supplier_id' },
    { id: GuidExtensions.generate(), type: ETableRelationType.ONE_TO_MANY, from: 'payment_order_id', to: 'order_id' },
  ],
  groups: [
    { groupId: 'sales', groupName: 'Sales', position: { x: 20, y: 20 } },
    { groupId: 'inventory', groupName: 'Inventory', position: { x: 20, y: 180 } },
    { groupId: 'management', groupName: 'Management', position: { x: 20, y: 620 } }
  ]
};

