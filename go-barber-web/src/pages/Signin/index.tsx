import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, AnimationContainer, Background } from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();

    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().required('Senha Obrigatória'),
                });
                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({
                    email: data.email,
                    password: data.password,
                });

                history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na autenticação',
                    description:
                        'Ocorreu um erro na autenticação. Cheque as credenciais',
                });
            }
        },
        [signIn, addToast, history],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="Go Barber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu Logon</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Senha"
                        />
                        <Button type="submit">Entrar</Button>

                        <Link to="forgot-password">Esqueci minha senha</Link>
                    </Form>
                    <Link to="/signup">
                        <FiLogIn />
                        Criar Conta
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};
export default SignIn;
