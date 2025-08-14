import { memo, useContext, useEffect, useState } from "react";
import { HiOutlineThumbUp } from "react-icons/hi";
import { authApis, endpoints } from "../../../configs/Apis";
import { AppContext } from "../../../provides/AppProvider";
import { toast } from "react-toastify";
import { EmotionTypeList } from "../constrants/emotionType";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";

const ReactionPickerButton = ({ emotions, setEmotions, selectedEmotion, setSelectedEmotion, objectId, contentType }) => {

    const { currentUser } = useContext(AppContext);

    const [showEmotionMenu, setShowEmotionMenu] = useState(false);



    const handleGiveEmotion = async (emotionTypeValue) => {
        console.info("handleGiveEmotion request: ", {
            object_id: objectId,
            content_type: contentType,
            emotion: emotionTypeValue
        })
        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để thả cảm xúc!");
            return;
        }
        try {
            const api = await authApis();

            let response = await api.post(
                endpoints.reactions.list,
                {
                    object_id: objectId,
                    content_type: contentType,
                    emotion: emotionTypeValue
                }
            );

            if (selectedEmotion && selectedEmotion.emotion) {
                const oldEmotionType = selectedEmotion.emotion.toString();
                setEmotions(prev => ({
                    ...prev,
                    [oldEmotionType]: prev[oldEmotionType] - 1
                }));
            }

            setSelectedEmotion(response.data)

            const newEmotionType = response.data.emotion.toString();
            setEmotions(prev => ({
                ...prev,
                [newEmotionType]: prev[newEmotionType] ? prev[newEmotionType] + 1 : 1
            }));

        } catch (error) {
            console.error("Login error:", error.response || error.message);
        }
    }

    const handleDeleteCurrentEmotion = async () => {
        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để thả cảm xúc!");
            return;
        }
        try {
            const api = await authApis();
            const reactionId = selectedEmotion.id

            let response = await api.delete(
                endpoints.reactions.detail(reactionId)
            );

            const oldEmotionType = selectedEmotion.emotion.toString();
            setEmotions(prev => ({
                ...prev,
                [oldEmotionType]: prev[oldEmotionType] - 1
            }));
            setSelectedEmotion({})
        } catch (error) {
            console.error("Login error:", error.response || error.message);
        }
    }
    return (
        <div
            className="position-relative d-inline-block"
            onMouseEnter={() => setShowEmotionMenu(true)}
            onMouseLeave={() => setShowEmotionMenu(false)}
        >
            <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2 border">
                {selectedEmotion && selectedEmotion.emotion ? (() => {
                    const emotion = EmotionTypeList.find(em => em.value === selectedEmotion.emotion);
                    return (
                        <div onClick={handleDeleteCurrentEmotion}>
                            {/* <span>{e.icon}</span>
                            <span>{e.label}</span> */}
                            <MenuItemWithIcon icon={emotion.icon} label={emotion.label} />
                        </div>
                    );
                })()
                    : <>
                        {/* <span><HiOutlineThumbUp /></span> <span>Thích</span> */}
                        <MenuItemWithIcon icon={<HiOutlineThumbUp />} label={"Thích"} />
                    </>}
            </button>

            {showEmotionMenu && (
                <div
                    className="position-absolute bg-white shadow-sm rounded-pill px-2 py-1 d-flex gap-2 mt-1"
                    style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                    }}
                >
                    {EmotionTypeList.map((emotionType) => (
                        <button
                            key={emotionType.value}
                            className="btn btn-sm bg-white border-0 fs-4"
                            onClick={() => {
                                // setSelectedEmotion(e.id);
                                setShowEmotionMenu(false);
                                handleGiveEmotion(emotionType.value);
                            }}
                            title={emotionType.label}
                        >
                            {emotionType.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default memo(ReactionPickerButton);