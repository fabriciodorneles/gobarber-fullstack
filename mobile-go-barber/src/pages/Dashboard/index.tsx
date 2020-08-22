import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
    ProvidersListTitle,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText,
} from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const { navigate } = useNavigation();
    const { signOut, user } = useAuth();

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

    useEffect(() => {
        api.get('providers').then(response => {
            console.log(response.data);
            setProviders(response.data);
        });
    }, []);

    const navigateToCreateAppointment = useCallback(
        (providerId: string) => {
            navigate('CreateAppointment', { providerId });
        },
        [navigate],
    );
    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem Vindo, {'\n'}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>
            <ProvidersList
                data={providers}
                keyExtractor={provider => provider.id}
                ListHeaderComponent={
                    <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer
                        onPress={() => navigateToCreateAppointment(provider.id)}
                    >
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />
                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>
                            <ProviderMeta>
                                <Icon
                                    name="calendar"
                                    size={14}
                                    color="#ff9000"
                                />
                                <ProviderMetaText>
                                    Segunda à Sexta
                                </ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
};

export default Dashboard;
