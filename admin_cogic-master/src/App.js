import React, { useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Loader } from "semantic-ui-react";

import Layout from "./layout/Layout";
import { AuthContext } from "./shared/context/auth-context";
import jwt from 'jsonwebtoken'

const Login = React.lazy(() => import("./pages/Login/Login"));
const Stats = React.lazy(() => import("./pages/Stats/Stats"));
const Settings = React.lazy(() => import("./pages/Settings/Settings"));
const Users = React.lazy(() => import("./pages/Users/Users"));
const Library = React.lazy(() => import("./pages/Library/Library"));
const Videos = React.lazy(() => import("./pages/Videos/Videos"));
const Blogs = React.lazy(() => import("./pages/Blogs/Blogs"));
const BlogsCategories = React.lazy(() => import("./pages/BlogsCategories/BlogsCategories"));
const BlogsSubCategories = React.lazy(() => import("./pages/BlogsSubCategories/BlogsSubCategories"));
const Categories = React.lazy(() => import("./pages/Categories/Categories"));
const Questions = React.lazy(() => import("./pages/Questions/Questions"));
const Gallery = React.lazy(() => import("./pages/Gallery/Gallery"));
const Posts = React.lazy(() => import("./pages/Forum/Posts"));
const Topics = React.lazy(() => import("./pages/Forum/Topics"));
const Sections = React.lazy(() => import("./pages/Forum/Sections"));

const App = (props) => {

    const { isLoggedIn, logout } = useContext(AuthContext);

    if (localStorage.admin) {
        let jwtData = JSON.parse(localStorage.admin);
        let decodeData = jwt.decode(jwtData.token);
        const expirationTime = (decodeData.exp * 1000);
        // console.log(new Date().toLocaleString(),new Date(decodeData.exp * 1000))
        if (Date.now() >= expirationTime) {
            logout()
        }
    }
    let allowedRoutes = (
        <Switch>
            <Route exact path="/" component={Login} />
        </Switch>
    );
    
    if (isLoggedIn) {
        
        allowedRoutes = (
            <Switch>
                <Route exact path="/" component={Stats} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/blogs" component={Blogs} />
                <Route exact path="/blogs-categories" component={BlogsCategories} />
                <Route exact path="/blogs-subCategories" component={BlogsSubCategories} />
                <Route exact path="/library" component={Library} />
                <Route exact path="/videos" component={Videos} />
                <Route exact path="/categories" component={Categories} />
                <Route exact path="/questions" component={Questions} />
                <Route exact path="/gallery" component={Gallery} />
                <Route exact path="/forum-posts" component={Posts} />
                <Route exact path="/forum-topics" component={Topics} />
                <Route exact path="/forum-sections" component={Sections} />
            </Switch>
        );
    }

    return (
        <Layout>
            <React.Suspense fallback={<Loader size="massive" active />}>
                {allowedRoutes}
            </React.Suspense>
        </Layout>
    );
}

export default withRouter(App);
