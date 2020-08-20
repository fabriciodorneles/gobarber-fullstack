import React, { useRef, useCallback } from 'react';
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';
import {
    Container,
    Title,
    UserAvatar,
    UserAvatarButton,
    BackButton,
} from './styles';

interface UpdateProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const UpdateProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>({} as TextInput);
    const oldPasswordInputRef = useRef<TextInput>({} as TextInput);
    const passwordInputRef = useRef<TextInput>({} as TextInput);
    const confirmPasswordInputRef = useRef<TextInput>({} as TextInput);
    const navigation = useNavigation();

    const handleUpdateProfile = useCallback(
        async (data: UpdateProfileFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo Obrigatório'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: val => !!val.length,
                            then: Yup.string().required('Campo Obrigatório'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            'Confirmação incorreta.',
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const formData = {
                    name: data.name,
                    email: data.email,
                    ...(data.old_password
                        ? {
                              old_password: data.old_password,
                              password: data.password,
                              password_confirmation: data.password_confirmation,
                          }
                        : {}),
                };

                const response = await api.put('profile', formData);

                updateUser(response.data.user);

                Alert.alert('Perfil Atualizado com sucesso!');

                navigation.goBack();
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }
                Alert.alert(
                    'Erro na Atualização do Perfil',
                    'Ocorreu um erro na atualização do Perfil, tente novamente.',
                );
            }
        },
        [navigation, updateUser],
    );

    const handleUpdateAvatar = useCallback(() => {
        ImagePicker.showImagePicker(
            {
                title: 'Selecione um Avatar',
                cancelButtonTitle: 'Cancelar',
                takePhotoButtonTitle: 'Usar câmera',
                chooseFromLibraryButtonTitle: 'Escolher da Galeria',
            },
            response => {
                if (response.didCancel) {
                    return;
                }

                if (response.error) {
                    Alert.alert('ImagePicker Error: ', response.error);
                    return;
                }

                const data = new FormData();

                data.append('avatar', {
                    type: 'image/jpeg',
                    name: `${user.id}.jpg`,
                    uri: response.uri,
                });

                api.patch('/users/avatar', data).then(apiResponse => {
                    updateUser(apiResponse.data);
                });

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            },
        );
    }, [updateUser, user.id]);

    const handleNavigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    // contentContainerStyle={{ flex: 1 }}
                >
                    <Container>
                        <BackButton onPress={handleNavigateBack}>
                            <Icon
                                name="chevron-left"
                                size={24}
                                color="#999591"
                            />
                        </BackButton>
                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>
                        <View>
                            <Title>Meu Perfil</Title>
                        </View>
                        <Form
                            initialData={user}
                            ref={formRef}
                            onSubmit={handleUpdateProfile}
                        >
                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current.focus();
                                }}
                                blurOnSubmit={false}
                            />
                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    oldPasswordInputRef.current.focus();
                                }}
                                blurOnSubmit={false}
                            />
                            <Input
                                ref={oldPasswordInputRef}
                                name="old_password"
                                icon="lock"
                                placeholder="Senha Atual"
                                secureTextEntry
                                textContentType="newPassword"
                                containerStyle={{ marginTop: 16 }}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Nova Senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={confirmPasswordInputRef}
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmar Senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />
                            <Button
                                onPress={() => formRef.current?.submitForm()}
                            >
                                Confirmar mudanças
                            </Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default UpdateProfile;
