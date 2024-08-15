'use client';
import { Button, Dialog, Drawer, Form, Input, useMobileMediaQuery } from '@swai/ui';
import { observer } from 'mobx-react-lite';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import touristStore from '@/store/touristStore';
import CaptchaSVG from './CaptchaSVG';
import { DEFAULT_AVATAR_SEARCH, DEFAULT_AVATAR_STYLE, createDiceBearAvatar } from '@/utils/diceBearAvatar';
import type { DrawerProps } from '@swai/ui/lib/Drawer/Drawer';
import type { DialogProps } from '@swai/ui/lib/Dialog/Dialog';
import { emailVerify } from '@/api/tourist/emailVerify';
import { findByEmail, register } from '@/api/tourist/register';

const EXPLAIN_DATA = {
    styleName: '',
    search: '',
    nickname: '',
    email: '',
    userSite: '',
    captchaCode: '',
    verifyCode: '',
};
const TouristDialog = observer(({ store }: { store: typeof touristStore }) => {
    const isMobile = useMobileMediaQuery();

    const formRef = useRef<HTMLFormElement | null>(null);
    const [editType, setEditType] = useState<'register' | 'login'>('register');
    const [submitting, setSubmitting] = useState(false);
    const [avatarParams, setAvatarParams] = useState({
        styleName: '',
        search: '',
    });
    const [formData, setFormData] = useState({
        ...EXPLAIN_DATA,
        styleName: 'avataaars-neutral',
        search: 'seed=Felix',
    });
    const [formError, setFormError] = useState({
        ...EXPLAIN_DATA,
    });

    const touristProfile = useMemo(() => store.state.profile, [store.state.profile]);

    useEffect(() => {
        console.log('是否是移动端？', isMobile);
    }, [isMobile]);

    useEffect(() => {
        if (store.state.openEditDialog) {
            if (store.state.profile) {
                const { nickname, email, avatar_style, avatar_search = '', website = '' } = store.state.profile;

                setFormData({
                    ...formData,
                    nickname,
                    email,
                    userSite: website,
                    styleName: avatar_style,
                    search: avatar_search,
                });

                setAvatarParams({
                    styleName: avatar_style,
                    search: avatar_search,
                });
            } else {
                setFormData({
                    ...formData,
                    styleName: DEFAULT_AVATAR_STYLE,
                    search: DEFAULT_AVATAR_SEARCH,
                });

                setAvatarParams({
                    styleName: DEFAULT_AVATAR_STYLE,
                    search: DEFAULT_AVATAR_SEARCH,
                });
            }
        }
    }, [store.state.openEditDialog]);

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

    function onAvatarFiledChange(filed: keyof typeof avatarParams) {
        return function () {
            if (!formError[filed]) {
                setAvatarParams({
                    ...avatarParams,
                    [filed]: formData[filed],
                });
            }
        };
    }

    function onCloseEdit() {
        store.setEditDialogVisible(false);
        setFormData({
            ...EXPLAIN_DATA,
        });
        setFormError({
            ...EXPLAIN_DATA,
        });
        setEditType('register');
    }

    function createAvatar() {
        const { styleName, search } = avatarParams;
        if (styleName) {
            return createDiceBearAvatar(styleName, search);
        }

        return '';
    }

    function onEditTypeChange() {
        setEditType(editType === 'login' ? 'register' : 'login');
    }

    function onSubmit() {
        const valid = formRef.current && formRef.current.checkValidity();
        if (valid) {
            setSubmitting(true);
            (editType === 'register' ? doRegisterTourist : doFindTourist)()
                .then((res) => {
                    onCloseEdit();

                    store.setTouristProfile(res);
                })
                .catch((e) => {
                    console.error('get some error: ', e.message);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        } else {
            console.error('表单校验未通过');
        }
    }

    function doRegisterTourist() {
        return register({
            email: formData.email,
            nickname: formData.nickname,
            website: formData.userSite,
            verifyCode: formData.verifyCode,
            avatar_style: formData.styleName,
            avatar_search: formData.search,
        });
    }

    function doFindTourist() {
        return findByEmail({
            email: formData.email,
            verifyCode: formData.verifyCode,
        });
    }

    function formActionsRender() {
        return (
            <div className="flex items-center tablet:justify-end">
                <Button
                    color="secondary"
                    size="large"
                    className="mobile:w-1/2 me-2.5"
                    disabled={submitting}
                    onClick={onCloseEdit}
                >
                    取消
                </Button>
                <Button size="large" className="mobile:w-1/2" loading={submitting} onClick={onSubmit}>
                    提交
                </Button>
            </div>
        );
    }

    function sendEmailVerify() {
        emailVerify({
            code: formData.captchaCode,
            email: formData.email,
        }).then((res) => {
            console.log(res);
        });
    }

    function formRender() {
        return (
            <>
                {touristProfile ? null : (
                    <div className="mb-4">
                        <Button color="secondary" onClick={onEditTypeChange}>
                            {editType === 'login' ? '我未订阅该站点' : '我订阅过该站点'}
                        </Button>
                    </div>
                )}
                {editType === 'register' ? (
                    <div className="mb-6">
                        <img className="mx-auto w-24 h-24 rounded-full" src={createAvatar()} alt="" />
                    </div>
                ) : null}
                <Form ref={formRef} labelAlign="right" size="large">
                    {editType === 'register' ? (
                        <>
                            <Form.Item
                                error={formError.nickname}
                                onInvalid={onFiledInvalid('nickname')}
                                label="头像样式"
                                required
                                helpText={
                                    <>
                                        头像使用DiceBear，使用参考
                                        <a
                                            className="text-link dark:text-link-dark"
                                            href="https://www.dicebear.com/how-to-use/http-api/"
                                            target="_blank"
                                        >
                                            点击查阅
                                        </a>
                                    </>
                                }
                            >
                                <Input
                                    value={formData.styleName}
                                    placeholder="头像样式"
                                    onInput={onFormFieldChange('styleName')}
                                    onBlur={onAvatarFiledChange('styleName')}
                                />
                            </Form.Item>
                            <Form.Item
                                error={formError.nickname}
                                onInvalid={onFiledInvalid('nickname')}
                                label="头像定制参数"
                                helpText={
                                    <>
                                        头像定制参数可参考
                                        <a
                                            className="text-link dark:text-link-dark"
                                            href="https://www.dicebear.com/how-to-use/http-api/#options"
                                            target="_blank"
                                        >
                                            点击查阅
                                        </a>
                                    </>
                                }
                            >
                                <Input
                                    value={formData.search}
                                    onInput={onFormFieldChange('search')}
                                    onBlur={onAvatarFiledChange('search')}
                                    placeholder="tips: seed=Felix&rotate=200"
                                />
                            </Form.Item>
                            <Form.Item
                                required
                                name="nickname"
                                label="昵称"
                                error={formError.nickname}
                                onInvalid={onFiledInvalid('nickname')}
                            >
                                <Input
                                    value={formData.nickname}
                                    onInput={onFormFieldChange('nickname')}
                                    placeholder="请输入你的昵称"
                                />
                            </Form.Item>
                        </>
                    ) : null}
                    <Form.Item
                        required
                        name="captchaCode"
                        label="验证码"
                        error={formError.captchaCode}
                        onInvalid={onFiledInvalid('captchaCode')}
                    >
                        <Input
                            value={formData.captchaCode}
                            onInput={onFormFieldChange('captchaCode')}
                            placeholder="请输入验证码"
                            append={<CaptchaSVG />}
                        />
                    </Form.Item>
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
                            append={
                                <Button disabled={!formData.captchaCode || !formData.email} onClick={sendEmailVerify}>
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
                    {editType === 'register' ? (
                        <Form.Item
                            name="site"
                            label="个人站点"
                            error={formError.userSite}
                            onInvalid={onFiledInvalid('userSite')}
                        >
                            <Input
                                value={formData.userSite}
                                onInput={onFormFieldChange('userSite')}
                                placeholder="如果你有个人博客或站点，可以在这里留下"
                                type="url"
                            />
                        </Form.Item>
                    ) : null}
                </Form>
            </>
        );
    }

    return React.createElement<DrawerProps & DialogProps>(
        isMobile ? Drawer : Dialog,
        {
            title: '编辑信息',
            open: store.state.openEditDialog,
            onClose: onCloseEdit,
            closeOnClickOverlay: false,
            actions: formActionsRender(),
            size: isMobile ? '100%' : undefined,
            direction: isMobile ? 'right' : undefined,
            width: isMobile ? undefined : '500px',
        },
        formRender(),
    );
});

export default () => <TouristDialog store={touristStore} />;
