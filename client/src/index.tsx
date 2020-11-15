import React from "react";
import ReactDOM from "react-dom";
import 'semantic-ui-css/semantic.min.css'
import App from "./App";
import { CardProvider } from './components/card/card';

ReactDOM.render(
    <CardProvider>
        <App />
    </CardProvider>,
    document.getElementById("root")
);