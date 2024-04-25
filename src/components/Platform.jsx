import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Platform({ platform }) {
    const imgPlatform = (id) => {
        switch (id) {
            case 1: return 'windows'; break;
            case 2: return 'playstation'; break;
            case 3: return 'xbox'; break;
            case 4: return 'apple'; break;      // TODO: Change this to 'ios' ?
            case 5: return 'apple'; break;
            case 6: return 'linux'; break;
            case 7: return 'nintendo'; break;
            case 8: return 'android'; break;
        }
    }

    if (platform.platform.id >= 1 && platform.platform.id <= 8) {
        return (
            <>
                <li key={platform.platform.id}>
                    <img src={`../src/images/platforms/${imgPlatform(platform.platform.id)}.png`} alt={`${imgPlatform(platform.platform.id)}`} className="platform-icon"/>
                </li>
            </>
        )
    } else 
        return null;
}
