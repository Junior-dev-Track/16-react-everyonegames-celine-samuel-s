// npm install react-icons --save
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { DiWindows, DiApple, DiLinux, DiAndroid } from "react-icons/di";
import { SiNintendo } from "react-icons/si";

export default function Platform({ platform }) {
    const imgPlatform = (id) => {
        switch (id) {
            case 1: return <DiWindows />; break;
            case 2: return <FaPlaystation />; break;
            case 3: return <FaXbox />; break;
            case 4: return <DiApple />; break;      // TODO: Change this to 'ios' ?
            case 5: return <DiApple />; break;
            case 6: return <DiLinux />; break;
            case 7: return <SiNintendo />; break;
            case 8: return <DiAndroid />; break;
        }
    }

    if (platform.platform.id >= 1 && platform.platform.id <= 8) {
        return (
            <>
                <li key={platform.platform.id}>
                    {/* <img 
                        src={`../src/images/platforms/${imgPlatform(platform.platform.id)}.png`} 
                        alt={`${imgPlatform(platform.platform.id)}`} 
                        className="platform-icon"/> */}
                    <div className="platform-icon">
                        {imgPlatform(platform.platform.id)}
                    </div>
                </li>
            </>
        )
    } else 
        return null;
}
