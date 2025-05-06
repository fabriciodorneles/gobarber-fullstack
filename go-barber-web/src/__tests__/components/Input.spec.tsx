import React from 'react';
import { render } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
    return {
        useField() {
            return {
                fieldName: 'name',
                defaultValue: '',
                error: '',
                registerField: jest.fn(),
            };
        },
    };
});

describe('Input Component', () => {
    it('should be able to render input', () => {
        const { getByPlaceholderText } = render(
            <Input name="name" placeholder="Name" />,
        );

        expect(getByPlaceholderText('Name')).toBeTruthy();
    });
});
