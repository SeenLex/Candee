import React from 'react'
import { _get, _post } from '../utils/api';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
interface useVerifyResult {
    handleResendVerificationEmail: () => Promise<string | undefined>;
}
const useVerify = (): useVerifyResult => {
    const {user,token} = useAuth();
    const handleResendVerificationEmail = async () => {
        try {
           const res = await _get(`/users/resendVerificationEmail`, token);
            return res.message;

        } catch (error) {
            console.error("Failed to resend verification email:", error);
        }
    };

    return {handleResendVerificationEmail}

    
}

export default useVerify