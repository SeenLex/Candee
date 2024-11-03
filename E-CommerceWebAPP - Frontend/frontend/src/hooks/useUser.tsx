import { useCallback, useEffect, useState } from "react";
import { userData } from "../types/UserType";
import toast from 'react-hot-toast'
import { _delete, _get, _put } from "../utils/api";
import { useAuth } from "./useAuth";
import Cookies from 'js-cookie';

interface UseUserResult{
    user: userData | null;
    loading: boolean;
    editUser: (updates: Partial<userData>) => Promise<void>;
    fetchUsers : () => Promise<userData[] | undefined>;
    editUserByAdmin: (updates: Partial<userData>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

const useUser = (): UseUserResult => {

    const [loading, setLoading] = useState<boolean>(true);
    
    const {token,user} = useAuth();
    


    const editUser = useCallback(
        async (updates: Partial<userData>) => {
            setLoading(true);
            try{
                
                const response = await _put(`/users/edit`, updates,token);
                Cookies.set('accessToken', response.accessToken);
                
                toast.success('User updated successfully');
            
            }
            catch(error: any){
                console.error(error);
                toast.error('Failed to update user');
            }
            finally{
                setLoading(false);
            }
        }   
    ,[token]);
    const editUserByAdmin = useCallback(
        async (updates: Partial<userData>) => {
            setLoading(true);
            try{
                
                const response = await _put(`/users/editByAdmin`, updates,token);
                if (response.message === 'User has been updated') {
                    toast.success('User updated successfully');
                }
            
            }
            catch(error: any){
                console.error(error);
                toast.error('Failed to update user');
            }
            finally{
                setLoading(false);
            }
        }
    ,[token]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try{
            const response = await _get(`/users/all`,token);
            return response;
        }
        catch{
            console.error('Error fetching users');
            toast.error('Error fetching users');
        }
        finally{
            setLoading(false);
        }
    },[token]);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        try{
            const response = await _delete (`/users/delete`,{id},token);

            if (response.message === 'User has been deleted') {
                toast.success('User deleted successfully');
            }
        }
        catch{
            console.error('Error deleting user');
            toast.error('Error deleting user');
        }
        finally{
            setLoading(false);
        }
    }
    ,[token]);


    return {user,loading,editUser,fetchUsers,editUserByAdmin,deleteUser};
};

export default useUser;