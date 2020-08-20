import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    Title,
    Container,
    AppointmentCreatedInfo,
    OkButton,
    OkButtonText,
} from './styles';

interface RouteParams {
    date: number;
    providerName: string;
}

const AppointmentCreated: React.FC = () => {
    const { reset } = useNavigation();
    const { params } = useRoute();

    const routeParams = params as RouteParams;

    const formattedDate = useMemo(() => {
        return format(
            routeParams.date,
            "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
            { locale: ptBR },
        );
    }, [routeParams.date]);

    const handleOkPressed = useCallback(() => {
        reset({
            routes: [{ name: 'Dashboard' }],
            index: 0,
        });
    }, [reset]);
    return (
        <Container>
            <Icon name="check" size={80} color="#04d361" />
            <Title>Agendamento Concluído</Title>
            <AppointmentCreatedInfo>{formattedDate}</AppointmentCreatedInfo>
            <AppointmentCreatedInfo>
                com {routeParams.providerName}
            </AppointmentCreatedInfo>
            <OkButton onPress={handleOkPressed}>
                <OkButtonText>Ok</OkButtonText>
            </OkButton>
        </Container>
    );
};

export default AppointmentCreated;
