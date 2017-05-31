import React from 'react';
import UserList from '../containers/user-list';
import UserDetails from '../containers/user-detail';
require('../../scss/style.scss');

const App = ({onEnterText}) => (
    <div>
        <h2>User List</h2>
        <input onKeyPress={onEnterText} />
    </div>
)

export default App;
