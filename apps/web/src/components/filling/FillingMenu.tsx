import { Menu } from '@swai/ui';
import tocStore from '../../store/tocStore';
import { MenuItem, MenuEmitors } from '@swai/ui/lib/Menu';
import { ArrowOneIcon, MinusIcon, PlusIcon } from '@swai/icon';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface FillingMenuProps {
    onMenuChange?: (name: string) => void;
}
const FillingMenu = observer(
    ({ store, onMenuChange }: { store: typeof tocStore; onMenuChange: FillingMenuProps['onMenuChange'] }) => {
        function onSelect(name: string) {
            store.setActiveToc(name);
            onMenuChange && onMenuChange(name);
        }

        function getMenuItemData(menu: MenuItem, level: number, active: boolean = false) {
            const docData = store.titleMap.get(menu.name);

            const style = {
                paddingInlineStart: 16 + 24 * level + 'px',
            };

            const classes = [
                'flex items-center justify-between py-2.5 px-4 cursor-pointer rounded-feedback select-none',
                active
                    ? 'text-white bg-primary'
                    : 'text-primary hover:text-brand hover:bg-gray-50 dark:text-primary-dark dark:hover:bg-blue-100',
            ];

            return { docData, style, classes: classes.join(' ') };
        }

        function renderItem(menu: MenuItem, level: number, active: boolean) {
            const { docData, style, classes } = getMenuItemData(menu, level, active);

            return (
                <div className={classes} style={style}>
                    <span className={active ? 'font-semibold' : ''}>{menu.label}</span>
                    {docData ? <span>({docData.docs.length})</span> : null}
                </div>
            );
        }

        const renderMenuTitle: MenuEmitors['renderSubMenuTitle'] = (menu, level, open, activeName, options) => {
            const isActive = activeName === menu.name;
            const { docData, style, classes } = getMenuItemData(menu, level, isActive);

            function onSubMenuTitleClick() {
                onSelect(menu.name);
                options?.setActiveName(menu.name);
            }

            return (
                <div className={classes} style={style} onClick={onSubMenuTitleClick}>
                    <div className="flex items-center">
                        {React.createElement(open ? MinusIcon : PlusIcon, {
                            className: 'me-2.5',
                            size: 16,
                            onClick: options?.toggleOpen,
                        })}
                        <span className={isActive ? 'font-semibold' : ''}>{menu.label}</span>
                    </div>
                    {docData ? <span>({docData.docs.length})</span> : null}
                </div>
            );
        };

        return (
            <Menu
                activeName={store.state.activeTocName}
                menus={store.menus}
                onSelect={onSelect}
                renderItem={renderItem}
                renderSubMenuTitle={renderMenuTitle}
            />
        );
    },
);

export default ({ onMenuChange }: FillingMenuProps) => <FillingMenu store={tocStore} onMenuChange={onMenuChange} />;
