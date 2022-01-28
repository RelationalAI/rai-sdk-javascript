import { LabeledAction } from '../transaction/types';

export function makeLabeledAction(
  name: string,
  action: LabeledAction['action'],
) {
  const labeledAction: LabeledAction = {
    type: 'LabeledAction',
    name: name,
    action,
  };

  return labeledAction;
}
