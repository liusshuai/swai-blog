'use client';
import { Button } from '@swai/ui';
import { RssIcon } from '@swai/icon';

export default function RssButton() {
    function handleClick() {}

    return (
        <>
            <Button className="my-5" size="large" round fullWidth icon={<RssIcon size={20} />} onClick={handleClick}>
                订阅我
            </Button>
        </>
    );
}
