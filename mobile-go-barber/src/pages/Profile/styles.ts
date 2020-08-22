import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
    position: relative;
`;

export const Header = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
export const Title = styled.Text`
    font-size: 24px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity``;

export const UserAvatarButton = styled.TouchableOpacity`
    margin-top: 20px;
    margin-bottom: 32px;
`;

export const UserAvatar = styled.Image`
    width: 186px;
    height: 186px;
    border-radius: 99px;
    align-self: center;
`;
