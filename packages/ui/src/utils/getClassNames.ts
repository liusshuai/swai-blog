import classNames from 'classnames';

const __COMPONENT_PREFIX__ = 'sw-';
export function getClassNames(name: string, ...names: classNames.ArgumentArray) {
    return classNames(`${__COMPONENT_PREFIX__}${name}`, names);
}
