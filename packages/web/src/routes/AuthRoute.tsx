import React from "react";
import { RouteComponentProps, Route, RouteProps } from "react-router-dom";

export const AuthRoute = (props: RouteProps) => {
	const renderRoute = (routeProps: RouteComponentProps<{}>) => {
		/**
		 * See this BenAwal ABB Clone Repo: https://github1s.com/benawad/fullstack-graphql-airbnb-clone/blob/HEAD/packages/controller/src/modules/auth/AuthRoute.tsx#L13-L16
		 */
		// if (!data || data.loading) {
		//   // loading screen
		//   return null;
		// }

		// if (!data.me) {
		//   // user not logged in
		//   return (
		//     <Redirect
		//       to={{
		//         pathname: "/login",
		//         state: { next: routeProps.location.pathname }
		//       }}
		//     />
		//   );
		// }

		const Component = props.component as any;

		return <Component {...routeProps} />;
	};

	return <Route render={renderRoute} />;
};
