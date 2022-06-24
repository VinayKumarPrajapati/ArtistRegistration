import react from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Register from './artist/register';
import Login from './artist/login';

const Routes = () => {
    return (<BrowserRouter>
        <Switch>
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            
        </Switch>
    </BrowserRouter>);
};

export default Routes;