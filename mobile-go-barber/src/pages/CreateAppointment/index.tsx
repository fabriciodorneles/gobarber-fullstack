import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import DateTimePicker from '@react-native-community/datetimepicker';

import { useRoute, useNavigation } from '@react-navigation/native';
import { format, isWeekend } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
    Container,
    Header,
    Content,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionContent,
    SectionTitle,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentButtonText,
    WeekendWarningText,
} from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface RouteParams {
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute();
    const { goBack, navigate } = useNavigation();
    const routeParams = route.params as RouteParams;

    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId,
    );

    useEffect(() => {
        if (isWeekend(selectedDate)) {
            const newDate = selectedDate;
            while (isWeekend(selectedDate)) {
                newDate.setDate(newDate.getDate() + 1);
            }
            setSelectedDate(newDate);
        }
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, [selectedDate]);

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleSelectedProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(state => !state);
    }, []);

    const handleDateChanged = useCallback(
        (event: any, date: Date | undefined) => {
            if (Platform.OS === 'android') {
                setShowDatePicker(false);
            }
            if (date) {
                setSelectedDate(date);
            }
        },
        [],
    );

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);
            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('appointments', {
                provider_id: selectedProvider,
                date,
            });

            const providerChosen = providers.find(
                provider => provider.id === selectedProvider,
            );

            navigate('AppointmentCreated', {
                date: date.getTime(),
                providerName: providerChosen?.name,
            });
        } catch (err) {
            Alert.alert(
                'Erro ao Criar Agendamento',
                'Ocorreu um erro ao tentar criar agendamento, tente novamente',
            );
        }
    }, [navigate, selectedDate, selectedHour, selectedProvider, providers]);

    const morningAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                };
            });
    }, [availability]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>
                <HeaderTitle>Agendamento</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>
            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={provider => provider.id}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer
                                onPress={() =>
                                    handleSelectedProvider(provider.id)
                                }
                                selected={provider.id === selectedProvider}
                            >
                                <ProviderAvatar
                                    source={{ uri: provider.avatar_url }}
                                />
                                <ProviderName
                                    selected={provider.id === selectedProvider}
                                >
                                    {provider.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>
                <Calendar>
                    <Title>
                        {format(selectedDate, "EEEE', dia' dd 'de' MMMM ", {
                            locale: ptBR,
                        })}
                    </Title>

                    <OpenDatePickerButton onPress={handleToggleDatePicker}>
                        <OpenDatePickerButtonText>
                            Selecionar outra data
                        </OpenDatePickerButtonText>
                    </OpenDatePickerButton>
                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            display="calendar"
                            onChange={handleDateChanged}
                            value={selectedDate}
                        />
                    )}
                </Calendar>
                {!isWeekend(selectedDate) ? (
                    <>
                        <Schedule>
                            <Title>Escolha o Horário</Title>

                            <Section>
                                <SectionTitle>Manhã</SectionTitle>
                                <SectionContent>
                                    {morningAvailability.map(
                                        ({
                                            hourFormatted,
                                            available,
                                            hour,
                                        }) => (
                                            <Hour
                                                enabled={available}
                                                selected={selectedHour === hour}
                                                available={available}
                                                key={hourFormatted}
                                                onPress={() =>
                                                    handleSelectHour(hour)
                                                }
                                            >
                                                <HourText
                                                    selected={
                                                        selectedHour === hour
                                                    }
                                                >
                                                    {hourFormatted}
                                                </HourText>
                                            </Hour>
                                        ),
                                    )}
                                </SectionContent>
                            </Section>
                            <Section>
                                <SectionTitle>Tarde</SectionTitle>
                                <SectionContent>
                                    {afternoonAvailability.map(
                                        ({
                                            hourFormatted,
                                            available,
                                            hour,
                                        }) => (
                                            <Hour
                                                enabled={available}
                                                selected={selectedHour === hour}
                                                available={available}
                                                key={hourFormatted}
                                                onPress={() =>
                                                    handleSelectHour(hour)
                                                }
                                            >
                                                <HourText
                                                    selected={
                                                        selectedHour === hour
                                                    }
                                                >
                                                    {hourFormatted}
                                                </HourText>
                                            </Hour>
                                        ),
                                    )}
                                </SectionContent>
                            </Section>
                        </Schedule>

                        <CreateAppointmentButton
                            onPress={handleCreateAppointment}
                        >
                            <CreateAppointmentButtonText>
                                Agendar
                            </CreateAppointmentButtonText>
                        </CreateAppointmentButton>
                    </>
                ) : (
                    <Schedule>
                        <WeekendWarningText>
                            Atendemos de Segunda a Sexta. Favor Escolher uma
                            Outra Data.
                        </WeekendWarningText>
                    </Schedule>
                )}
            </Content>
        </Container>
    );
};

export default CreateAppointment;
