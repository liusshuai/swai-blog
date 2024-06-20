import { Button, Card, Form, Input } from '@swai/ui';
import logo from '@/assets/images/logo.png';
import './index.less';
import { FormEvent, useState } from 'react';

export default () => {
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

    return (
        <div className="login-page pt-[10%]">
            <Card className="w-[400px] mx-auto">
                <img className="w-auto h-16 mx-auto mb-10" src={logo} alt="" />
                <Form size="large">
                    <Form.Item
                        required
                        name="email"
                        label="电子邮箱"
                        helpText="电子邮件用于接收消息回复，不会公开"
                        error={formError.email}
                        onInvalid={onFiledInvalid('email')}
                    >
                        <Input
                            value={formData.email}
                            placeholder="请输入你的电子邮箱"
                            type="email"
                            onInput={onFormFieldChange('email')}
                            append={<Button>发送验证码</Button>}
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
                        <Button fullWidth>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
