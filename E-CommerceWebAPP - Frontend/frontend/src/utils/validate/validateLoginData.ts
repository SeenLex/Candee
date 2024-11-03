
interface FormErrors {
    [key: string]: string;
}

export const validateLoginData = (formData: any): FormErrors => {
    const errors: FormErrors = {};

    const isEmpty = (value: string) => !value || value.trim() === '';

    if (isEmpty(formData.email)) {
        errors.email = 'Email is required';
    }

    if (isEmpty(formData.password)) {
        errors.password = 'Password is required';
    }

    return errors;
};