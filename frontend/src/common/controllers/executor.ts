import axios from 'axios';

export class Executor {
    static makeRequest = async (options: any) => {
        try {
            const response = await axios(options);
            return response;
        } catch (error) {            
            return error.response;
        }
    };
}
