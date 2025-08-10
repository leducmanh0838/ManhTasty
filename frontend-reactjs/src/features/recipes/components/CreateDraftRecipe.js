import { useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../../configs/Apis';
import MySpiner from '../../../components/ui/MySpinner'
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../../provides/AppProvider';
import { toast } from 'react-toastify';

const CreateDraftRecipe = () => {
    const { currentUser } = useContext(AppContext);
    const calledOnce = useRef(false);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGetLastestOrCreateDraftRecipe = async () => {
        if (calledOnce.current) return; // nếu đã gọi rồi thì không gọi lại
        calledOnce.current = true;

        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để đăng món ăn!");
            return;
        }
        try {
            setLoading(true)
            // Gọi API tạo món mới trạng thái nháp
            const api = await authApis()
            let response;
            let newRecipeId;

            response = await api.get(endpoints.recipes.draft.lastest);
            newRecipeId = response.data._id;
            if (!newRecipeId) {
                response = await api.post(endpoints.recipes.draft.list);
                newRecipeId = response.data._id;
            }

            // Điều hướng sang trang edit với id mới
            navigate(`${newRecipeId}/edit`);
            // throw new Error('Dữ liệu trả về không hợp lệ');
        } catch (error) {
            console.error('Tạo món nháp thất bại:', error);
        } finally {
            setLoading(false)
        }
        calledOnce.current = false;
    };

    useEffect(() => {
        // handleAddNewRecipe();
        handleGetLastestOrCreateDraftRecipe();
    }, [])

    return (
        <div>
            {loading ? <MySpiner text='Đang tạo nháp' /> : <>
                <span>Không tạo được món mới. Vui lòng thử lại.</span>
            </>}

        </div>
    );
}

export default CreateDraftRecipe;
