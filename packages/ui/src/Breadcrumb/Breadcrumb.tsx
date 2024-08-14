import React, { Fragment } from 'react';
import { getClassNames } from '../utils/getClassNames';
import { ComponentContext } from '../types/ComponentContext';

export interface BreadcrumbSource {
    name: string;
    path?: string;
}

export interface BreadcrumbProps extends Pick<ComponentContext, 'className'> {
    source: BreadcrumbSource[];
    separator?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
    const { source = [], separator = '/' } = props;

    const classes = getClassNames('breadcrumb', props.className);

    function getLabelItemClasses(item: BreadcrumbSource, index: number) {
        return getClassNames(
            'breadcrumb__item',
            index < source.length - 1 ? 'text-secondary' : '',
            item.path && index < source.length - 1 ? 'cursor-pointer hover:text-primary' : '',
        );
    }

    return (
        <div className={classes}>
            {source.map((s, i) => (
                <Fragment key={s.name}>
                    <span className={getLabelItemClasses(s, i)}>{s.name}</span>
                    {i < source.length - 1 ? (
                        <span className={getClassNames('breadcrumb__separator', 'mx-2 text-secondary')}>
                            {separator}
                        </span>
                    ) : null}
                </Fragment>
            ))}
        </div>
    );
};

Breadcrumb.displayName = 'Breadcrumb';
export default Breadcrumb;
