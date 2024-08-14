import { Button, Card, Form, Input } from '@swai/ui';
import logo from '@/assets/images/logo.png';
import './index.less';
import { FormEvent, useRef, useState } from 'react';
import { login, sendEmailVerifyCode } from '../../api/login';
import { useNavigate } from 'react-router-dom';

export default () => {
    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        verifyCode: '',
    });

    const [formError, setFormError] = useState({
        email: '',
        verifyCode: '',
    });

    function onFiledInvalid(filed: keyof typeof formError) {
        return function (e: React.FormEvent<Element>) {
            const target = e.target as HTMLInputElement;
            if (target.validationMessage) {
                setFormError({
                    ...formError,
                    [filed]: target.validationMessage,
                });
            }
        };
    }

    function onFormFieldChange(filed: keyof typeof formData) {
        return function (e: FormEvent<HTMLInputElement>) {
            setFormData({
                ...formData,
                [filed]: (e.target as HTMLInputElement).value,
            });
            setFormError({
                ...formError,
                [filed]: '',
            });
        };
    }

    function onSendEmail() {
        if (formData.email) {
            sendEmailVerifyCode(formData.email).then((res) => {
                console.log(res);
            });
        }
    }

    function onLogin() {
        const valid = formRef.current && formRef.current.checkValidity();
        valid &&
            login({
                email: formData.email,
                code: formData.verifyCode,
            }).then(() => {
                navigate('/', { replace: true });
            });
    }

    return (
        <div className="login-page pt-[10%]">
            <Card className="w-[400px] mx-auto">
                <img className="w-auto h-16 mx-auto mb-10" src={logo} alt="" />
                <Form ref={formRef} size="large">
                    <Form.Item
                        required
                        name="email"
                        label="电子邮箱"
                        error={formError.email}
                        onInvalid={onFiledInvalid('email')}
                    >
                        <Input
                            value={formData.email}
                            placeholder="请输入你的电子邮箱"
                            type="email"
                            onInput={onFormFieldChange('email')}
                            append={
                                <Button disabled={!formData.email} onClick={onSendEmail}>
                                    发送验证码
                                </Button>
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        required
                        name="verifyCode"
                        label="邮箱验证码"
                        error={formError.verifyCode}
                        onInvalid={onFiledInvalid('verifyCode')}
                    >
                        <Input
                            value={formData.verifyCode}
                            placeholder="请输入邮箱验证码"
                            onInput={onFormFieldChange('verifyCode')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button fullWidth onClick={onLogin}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
