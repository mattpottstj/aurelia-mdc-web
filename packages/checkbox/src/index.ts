import { IContainer, AppTask, IAttrMapper, NodeObserverLocator } from 'aurelia';
import { MdcCheckbox } from './mdc-checkbox';
import { RippleConfiguration } from '@aurelia-mdc-web/ripple';
import { CheckedObserver } from '@aurelia/runtime-html';

export { MdcCheckbox, IMdcCheckboxElement } from './mdc-checkbox';

let configured = false;

export const CheckboxConfiguration = {
  register(container: IContainer): IContainer {
    if (!configured) {
      AppTask.beforeCreate(IContainer, c => {
        const attrMapper = c.get(IAttrMapper);
        const nodeObserverLocator = c.get(NodeObserverLocator);
        attrMapper.useTwoWay((el, property) => el.tagName === 'MDC-CHECKBOX' ? property === 'checked' : false);
        nodeObserverLocator.useConfig({ 'MDC-CHECKBOX': { checked: { events: ['change'], type: CheckedObserver } } });
      }).register(container);
      configured = true;
    }
    return container.register(MdcCheckbox, RippleConfiguration);
  }
};
