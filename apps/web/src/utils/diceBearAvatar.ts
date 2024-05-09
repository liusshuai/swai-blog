export function createDiceBearAvatar(styleName: string, options?: string) {
    if (styleName) {
        return `https://api.dicebear.com/8.x/${styleName}/svg${options ? `?${options}` : ''}`;
    }

    return '';
}

export const DEFAULT_AVATAR_STYLE = 'micah';
export const DEFAULT_AVATAR_SEARCH = 'backgroundColor=b6e3f4';

export const DEFAULT_TOURIST_AVATAR = createDiceBearAvatar(DEFAULT_AVATAR_STYLE, DEFAULT_AVATAR_SEARCH);
