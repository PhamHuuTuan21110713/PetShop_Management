import { useEffect, useState } from "react"
import { UserFetch } from "~/REST_API_Client";

export const fetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState();
    const [error, setError] = useState();

    const recipientId = chat?.members.find((id) => id !== user?._id);
    useEffect(() => {
        const getUser = () => {
            if(!recipientId) return null;
            UserFetch.getById(recipientId)
                .then(data => {
                    setRecipientUser(data.data);
                })
                .catch(err =>{
                    console.log("Loi nguoi dung: ",err);
                    return setError(err);
                })
        }
        getUser();
    }, [recipientId]);
    return {recipientUser, error};
}