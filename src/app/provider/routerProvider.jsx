import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLocation,
} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

// ###

import Home from '~pages/home';
import About from '~pages/about';

import Points_View from '~pages/points/view';
import Points_Apply from '~pages/points/apply';
import Points_History from '~pages/points/history';
import Points_UserHistory from '~pages/points/userHistory';
import Points_Remarks from '~pages/points/remarks';
import Points_Reason from '~pages/points/reason';

import MyPoints_View from '~pages/myPoints/view';

import Dorm_Status from '~pages/dorm/status';
import Dorm_Settings from '~pages/dorm/settings';

import MyDorm_View from '~pages/myDorm/view';
import MyDorm_Repair from '~pages/myDorm/repair';

import Case_Control from '~pages/remote/case/control';
import Case_Schedule from '~pages/remote/case/schedule';
import Case_History from '~pages/remote/case/history';

import PLMA_Accounts from '~pages/plma/accounts';
import IAM_Accounts from '~pages/iam/accounts';

import Page404 from '~pages/404';

// ###

import Navbar from '~shared/ui/navbar';
import Sidebar from '~shared/ui/sidebar';
import { pathKeys } from '~shared/lib/react-router/pathKey.js';
import Dorm_Repair from '../../pages/dorm/repair';

const userType = {
    student: new Set([
        'viewMyPointsView',

        'viewMyDormView',
        'viewMyDormRepair',

        'viewSchoolMyInfo',
        'viewSchoolReportCard',
    ]),
    admin: new Set([
        'viewPointsView',
        'viewPointsApply',
        'viewPointsEdit',
        'viewPointsUserHistory',
        'viewPointsHistory',
        'viewPointsRemarks',
        'viewPointsReason',
        'viewPointsLogs',
        'viewPointsFix',
        'viewMyPointsView',

        'viewDormStatus',
        'viewDormSettings',
        'viewDormRepair',
        'viewMyDormView',
        'viewMyDormRepair',

        'viewRemoteCaseControl',
        'viewRemoteCaseSchedule',
        'viewRemoteCaseHistory',

        'viewPLMAAccounts',
        'viewIAMAccounts',
        'viewIAMAccess',
    ]),
};

// const a = [
//     'viewIAM',
//     'applyAccess',
//     'viewIAMAccess',
//     'viewAll',
//     'viewApply',
//     'viewHistory',
//     'viewCaseControl',
//     'viewReason',
//     'viewBanned',
//     'viewStudent',
//     'viewTeacher',
//     'deleteHistory',
//     'deleteBannedHistory',
//     'deployIAM',
//     'refreshIAM',
//     'addIAMAccount',
//     'applyPoint',
//     'addReason',
//     'editReason',
//     'deleteReason',
//     'editStudent',
//     'editTeacher',
//     'caseOpen',
//     'caseOpenAll',
//     'caseClose',
//     'caseCloseAll',
//     'viewDorm',
//     'viewDormManage',
//     'viewCheckHistory',
//     'addStudent',
//     'deleteStudent',
//     'addTeacher',
//     'deleteTeacher',
//     'najuredhawk',
//     'viewRecovery',
//     'viewCheck',
//     'viewCaseSchedule',
// ];

const userPermissions = userType['admin'];

function Layout() {
    const location = useLocation();
    const isFullScreen = location.pathname === pathKeys.about.root().link;

    return (
        <>
            <Sidebar userPermissions={userPermissions} />
            <Navbar />
            <div className={isFullScreen ? 'fullScreen' : 'panel'}>
                <div className="panel_wrap">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

const routesWithPermissions = [
    { pathKey: pathKeys.home.root(), element: <Home /> },
    { pathKey: pathKeys.about.root(), element: <About /> },

    { pathKey: pathKeys.points.view(), element: <Points_View /> },
    { pathKey: pathKeys.points.apply(), element: <Points_Apply /> },
    { pathKey: pathKeys.points.history(), element: <Points_History /> },
    {
        pathKey: pathKeys.points.user_history(),
        element: <Points_UserHistory />,
    },
    { pathKey: pathKeys.points.remarks(), element: <Points_Remarks /> },
    { pathKey: pathKeys.points.reason(), element: <Points_Reason /> },

    { pathKey: pathKeys.points.myPoints.view(), element: <MyPoints_View /> },

    { pathKey: pathKeys.dorm.status(), element: <Dorm_Status /> },
    { pathKey: pathKeys.dorm.settings(), element: <Dorm_Settings /> },
    { pathKey: pathKeys.dorm.repair(), element: <Dorm_Repair /> },

    { pathKey: pathKeys.dorm.myDorm.view(), element: <MyDorm_View /> },
    { pathKey: pathKeys.dorm.myDorm.repair(), element: <MyDorm_Repair /> },

    { pathKey: pathKeys.plma.accounts(), element: <PLMA_Accounts /> },
    { pathKey: pathKeys.iam.accounts(), element: <IAM_Accounts /> },

    { pathKey: pathKeys.remote.case.control(), element: <Case_Control /> },
    { pathKey: pathKeys.remote.case.schedule(), element: <Case_Schedule /> },
    { pathKey: pathKeys.remote.case.history(), element: <Case_History /> },
];

const filteredRoutes = routesWithPermissions
    .filter(
        (route) =>
            !route.pathKey.permission ||
            userPermissions.has(route.pathKey.permission)
    )
    .map(({ pathKey, element }) => ({ path: pathKey.link, element }));

const browserRouter = createBrowserRouter([
    {
        element: <Layout />,
        children: [...filteredRoutes, { path: '*', element: <Page404 /> }],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={browserRouter} />;
}
