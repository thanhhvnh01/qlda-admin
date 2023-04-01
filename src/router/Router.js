import React from 'react';
// ** React Imports
import { Suspense, useEffect, useMemo } from 'react';
// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom';

// ** Store
import { useDispatch, useSelector } from 'react-redux';
import { checkRememberedUserAC, getUserInfoAC } from '@store/actions/auth';

import { UserTypeTypeEnum } from '@utilities/constants';
import { AdminRoute, Routes } from './routes';
import MainLayout from '@layouts/main-layout';
import NotFound from '@views/not-found/NotFound';

const Router = () => {
  // ** User redux
  const dispatch = useDispatch();
  const { isCheckingRememberedUser, isUserLoggedIn, userData } = useSelector((state) => state.auth);

  const defaultRoute = useMemo(() => (userData?.userTypeId === UserTypeTypeEnum.Admin ? AdminRoute : ''), [userData]);

  useEffect(() => {
    const checkRemenberedUser = async () => {
      dispatch(checkRememberedUserAC());
    };
    checkRemenberedUser();
  }, [dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (isUserLoggedIn && !isCheckingRememberedUser) {
        dispatch(getUserInfoAC());
      }
    };
    getUserInfo();
  }, [dispatch, isCheckingRememberedUser, isUserLoggedIn]);

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = () => {
    const ListRoute = [];
    const Paths = [];

    if (Routes) {
      Routes.filter((route) => {
        ListRoute.push(route);
        Paths.push(route.path);
        return null;
      });
    }

    return { ListRoute, Paths };
  };

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = (props) => {
    const { route } = props;

    // return <Redirect to="/categories" />;

    return <route.component {...props} />;
  };

  // ** Return Route to Render
  const ResolveRoutes = () => {
    // ** Get Routes and Paths of the Layout
    const { ListRoute, Paths } = LayoutRoutesAndPaths();

    // ** We have freedom to display different layout for different route
    // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
    // ** that we want to implement like VerticalLayout or HorizontalLayout
    // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

    // ** RouterProps to pass them to Layouts
    const routerProps = {};

    return (
      <Route path={Paths}>
        <Switch>
          {ListRoute.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact === true}
                render={(props) => {
                  // ** Assign props to routerProps
                  Object.assign(routerProps, {
                    ...props,
                    meta: route.meta,
                  });

                  return (
                    <>
                      {!!route.meta ? (
                        <Suspense fallback={null}>
                          <FinalRoute route={route} {...props} />
                        </Suspense>
                      ) : (
                        <MainLayout>
                          <Suspense fallback={null}>
                            <FinalRoute route={route} {...props} />
                          </Suspense>
                        </MainLayout>
                      )}
                    </>
                  );
                }}
              />
            );
          })}
        </Switch>
      </Route>
    );
  };

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path="/"
          render={() => (!!isUserLoggedIn && !!userData ? <Redirect to={defaultRoute} /> : <Redirect to="/login" />)}
        />

        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Suspense fallback={null}>
          <Route path="*" component={NotFound} />
        </Suspense>
      </Switch>
    </AppRouter>
  );
};

export default Router;
