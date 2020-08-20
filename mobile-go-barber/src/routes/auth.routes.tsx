import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
    <App.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#312e38' },
        }}
    >
        <App.Screen name="SignIn" component={SignIn} />
        <App.Screen name="SignUp" component={SignUp} />
    </App.Navigator>
);

export default AppRoutes;
