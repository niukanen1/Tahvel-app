import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {Home} from './Home.jsx';


// function render() {
//   ReactDOM.render(
//   <div>
//     <Home/>
//   </div>, 
//   document.body);
// }

const container = document.getElementById("document");
const root = createRoot(container);

root.render(<Home/>)