import { NotificationTypeList } from "../../features/notifications/constants/notificationType";


const NotificationTypeUI = ({ value }) => {
    // const tag = tags.find(t => t.id === tagIdToFind);
    const recipeStatus = NotificationTypeList.find(i => i.value === value);
    return (
        <span className="badge" style={{
            backgroundColor: recipeStatus.color,
        }}>
            {recipeStatus.label}
        </span>)
}

export default NotificationTypeUI;