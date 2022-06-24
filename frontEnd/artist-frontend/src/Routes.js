import react from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Register from './artist/register';
import Login from './artist/login';
import Home from './core/Home';

const Routes = () => {
    return (<BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            
        </Switch>
    </BrowserRouter>);
};

export default Routes;