export const enum MailSendType {
    NEW_DOC = 'new_doc',
    NEW_REPAY = 'new_reply',
    EMAIL_VERIFY = 'email_verify',
}

export const enum MailSendState {
    PENDING = 0,
    FAIL = -1,
    SUCCESS = 1,
}
