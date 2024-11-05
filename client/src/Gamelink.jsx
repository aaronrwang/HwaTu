import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck, FaLinkedinIn } from 'react-icons/fa';

const Gamelink = ({ link }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
    };

    return (
        <CopyToClipboard text={link} onCopy={handleCopy}>
            <div className='link'>
                <p>{link}</p>
                {copied ? <FaCheck /> : <FaRegCopy />}
            </div>
        </CopyToClipboard>
    );
};

export default Gamelink;