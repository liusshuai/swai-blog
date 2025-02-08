import { Outlet } from 'react-router-dom';
import AppSide from './components/layout/AppSide';
import AppToolbar from './components/layout/AppToolbar';
import { useState } from 'react';

function App() {
    const [menuFold, setMenuFold] = useState<boolean>(false);

    function toggleMenuFold() {
        setMenuFold(!menuFold);
    }

    return (
        <div className="h-full flex">
            <AppSide menuFold={menuFold} />
            <div className="h-full flex flex-col grow overflow-x-hidden">
                <AppToolbar menuFold={menuFold} toggleMenuFold={toggleMenuFold} />
                <div className="grow bg-gray-50 p-7 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default App;
