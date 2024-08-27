import { IFlowNodeStorageModel } from './node/i-flow-node-storage-model';
import { IFlowConnectionStorageModel } from './connection/i-flow-connection-storage-model';
import { EDbTableFieldType } from './e-db-table-field-type';

export interface IFlowStorage {

  nodes: IFlowNodeStorageModel[];

  connections: IFlowConnectionStorageModel[];
}

export const FLOW_STORAGE: IFlowStorage = {

  nodes: [ {
    id: 'courses',
    name: 'Courses',
    position: { x: 300, y: 100 },
    fields: [{
      id: 'course_id',
      name: 'id',
      type: EDbTableFieldType.INT,
    }, {
      id: 'course_name',
      name: 'name',
      type: EDbTableFieldType.TEXT,
    }, {
      id: 'course_price',
      name: 'price',
      type: EDbTableFieldType.FLOAT,
    }, {
      id: 'course_currency',
      name: 'currency',
      type: EDbTableFieldType.VARCHAR,
    }]
  }, {
    id: 'course_settings1',
    name: 'Course Settings1',
    position: { x: 500, y: 100 },
    fields: [  ]
  }, {
    id: 'course_settings2',
    name: 'Course Settings2',
    position: { x: 400, y: 300 },
    fields: [  ]
  } ],
  connections: [
    { from: 'input_output', to: 'assign_input' },
    { from: 'assign_output', to: 'cycle1_input' },
    { from: 'cycle1_output', to: 'switch1_input' },
  ]
};
