import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Container, ButtonText } from './styles';

// faz isso pra pegar todas as propriedade que um botão poderia ter
// extende as propriedades do rectbutton pra dentro do nosso container
interface ButtonProps extends RectButtonProperties {
    // aproveita e já deixa o children string e obrigatório
    children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
    <Container {...rest}>
        <ButtonText>{children}</ButtonText>
    </Container>
);

export default Button;
