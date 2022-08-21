import React, { useEffect, useState } from "react";
import { Header, Button, Icon } from "semantic-ui-react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AdminActions = (props) => {
    const { u_id, token } = props;

    const [isMemberWeek, setIsMemberWeek] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {

    //     async function loadAdmin() {

    //         try {
                
    //             const { data } = await axios.get("/user/member-week");

    //             if (parseInt(u_id) === data.u_id) {
    //                 setIsMemberWeek(true);
    //             }

    //         } catch (err) {
    //             console.log(err.response);
    //         }
    //     }

    //     loadAdmin();

    // }, []);

    const handleMemberOfWeek = async () => {

        setIsLoading(true);

        try {

            if (isMemberWeek) {

                const { data } = await axios.patch(
                    "/admin/remove-member-week", { u_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (data) {
                    toast.success("Member of the week removed!");
                    setIsMemberWeek(false);
                }

            } else {

                const { data } = await axios.post(
                    "/admin/member-week", { u_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (data) {
                    toast.success("Successfully added member of the week!");
                    setIsMemberWeek(true);
                }
            }

            setIsLoading(false);

        } catch (err) {
            console.log(err.response);
            setIsLoading(false);
        }
    }

    return (
        <div className="AdminActions profile-padded">
            <Header size="large" dividing>
                Admin Actions
            </Header>
            {/* <div>
                {
                    !isMemberWeek ?
                    <Button 
                        positive 
                        icon 
                        labelPosition="right"
                        onClick={handleMemberOfWeek} 
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Make Member of the Week
                        <Icon name="star" />
                    </Button> :
                    <Button 
                        negative 
                        icon 
                        labelPosition="right"
                        onClick={handleMemberOfWeek} 
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Remove Member of the Week
                        <Icon name="trash" />
                    </Button>
                }
            </div> */}
        </div>
    );
}

export default AdminActions;