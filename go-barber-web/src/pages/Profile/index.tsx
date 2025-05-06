import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: (val) => !!val.length,
                        then: Yup.string().required('Campo Obrigatório'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: (val) => !!val.length,
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

                const response = await api.put('/profile', formData);

                updateUser(response.data.user);
                history.push('/');
                addToast({
                    type: 'sucess',
                    title: 'Perfil Atualizado!',
                    description:
                        'Suas informações do perfil foram atualizadas com sucesso.',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na atualização',
                    description:
                        'Ocorreu um erro no atualização, tente novamente.',
                });
            }
        },
        [addToast, history, updateUser],
    );
    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();
                data.append('avatar', e.target.files[0]);

                api.patch('/users/avatar', data).then((response) => {
                    updateUser(response.data.user);

                    addToast({
                        type: 'sucess',
                        title: 'Avatar atualizado',
                    });
                });
            }
        },
        [addToast, updateUser],
    );
    return (
        <Container>
            <header>
                <div>
                    <Link to="/">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            <Content>
                <Form
                    ref={formRef}
                    initialData={{
                        name: user.name,
                        email: user.email,
                    }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>
                    <h1>Meu Perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha Atual"
                    />

                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Nova Senha"
                    />

                    <Input
                        name="password_confirmation"
                        icon={FiLock}
                        type="password"
                        placeholder="Confirmar Senha"
                    />
                    <Button type="submit">Confirm</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
