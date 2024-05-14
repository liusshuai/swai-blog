import classNames from 'classnames';

export function formControlClasses() {
    return classNames([
        'has-[:enabled]:hover:shadow-form-control has-[:focus]:border-primary',
        'rounded-feedback border',
        'has-[:valid]:border-form-control has-[:invalid]:border-error dark:has-[:valid]:border-form-control-dark',
        'bg-white overflow-hidden dark:bg-[#292A2E]',
        'text-primary text-sm dark:text-primary-dark',
        'transition-all duration-150',
    ]);
}
