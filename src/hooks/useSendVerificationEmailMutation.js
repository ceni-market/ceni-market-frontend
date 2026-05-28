import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

export const useSendVerificationEmailMutation = () => {
  return useMutation({
    mutationFn: async (email) => {
      const response = await apiClient.post('/auth/signup/email-request', {
        email: email,      // 백엔드 String email과 매칭
        purpose: 'SIGNUP'  // 백엔드 String purpose와 매칭 (VerificationPurpose.SIGNUP으로 변환됨)
      });
      return response.data;
    }
  });
};