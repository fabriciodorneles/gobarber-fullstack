import { ValidationError } from 'yup';

interface Errors {
    // isso aqui deixa dinâmico, pode ser qualquer chave em formato de string
    // ser key não é obrigatório
    [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
    const validationErrors: Errors = {};

    err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
    });

    return validationErrors;
}
