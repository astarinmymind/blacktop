/*
Note: We wrap App in Provider to pass all store instances to all child components wrapped within.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import App from "./components/App/App"

ReactDOM.render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>,
    document.getElementById("root")
);