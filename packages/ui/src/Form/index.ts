import Form from './Form';
import FormItem, { FormItemProps } from './FormItem';

(Form as any).Item = FormItem;

export default Form as typeof Form & {
    Item: React.FC<FormItemProps>;
};
