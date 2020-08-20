import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
    padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 0}px;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
`;

export const Title = styled.Text`
    width: 200px;
    text-align: center;
    font-size: 32px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 30px 18px;
`;
export const AppointmentCreatedInfo = styled.Text`
    font-family: 'RobotoSlab-Regular';
    color: #999591;
    font-size: 18px;
    margin-bottom: 10px;
`;
export const OkButton = styled.TouchableOpacity`
    padding: 16px 40px;
    background: #ff9000;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 45px;
`;
export const OkButtonText = styled.Text`
    font-family: 'RobotoSlab-Medium';
    color: #232129;
    font-size: 18px;
`;
