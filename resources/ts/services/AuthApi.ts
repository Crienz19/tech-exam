import { ApiRequest, ApiRequestWithoutAuth } from '@/lib/apiRequest';
import { AxiosResponse } from 'axios';

export default {
    login (email : string, password : string) : Promise<AxiosResponse> {
        return ApiRequestWithoutAuth.post('/login', { email, password });
    },
    logout () : Promise<AxiosResponse<void>> {
        return ApiRequest.post('/logout');
    }
}