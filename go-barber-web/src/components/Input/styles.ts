import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #232129;
    border-radius: 10px;
    padding: 16px;
    width: 100%;
    display: flex;
    align-items: center;

    border: 2px solid #232129;
    color: #666360;

    & + div {
        margin-top: 8px;
    }
    ${(props) =>
        props.isErrored &&
        css`
            border-color: #c53030;
        `}
    ${(props) =>
        props.isFocused &&
        css`
            border: 2px solid #ff9000;
            color: #ff9000;
        `}

    ${(props) =>
        props.isFilled &&
        css`
            color: #ff9000;
        `}

    input {
        color: #f4ede8;
        flex: 1;
        background: transparent;
        border: 0;
        &::placeholder {
            color: #666360;
        }
    }

    svg {
        margin-right: 16px;
    }
`;
export const Error = styled(Tooltip)`
    height: 20px;
    margin-left: 16px;
    svg {
        margin-right: 0px;
    }

    span {
        background: #c53030;

        color: #ffffff;

        &::before {
            border-color: #c53030 transparent;
        }
    }
`;
