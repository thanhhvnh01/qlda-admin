import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';

// ** Document title
const TemplateTitle = '%s - AndreaHair';

// ** Default Route
const AdminRoute = '/';

const Routes = [...AuthRoutes, ...AdminRoutes];

export { TemplateTitle, Routes, AdminRoute };
