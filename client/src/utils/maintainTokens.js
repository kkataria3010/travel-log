import jwt_decode from "jwt-decode";
import { post } from "./requests";
export const maintainTokens = async (refreshUrl) => {
    const {exp} =jwt_decode(localStorage.getItem('accessToken'))
    if(exp*1000>Date.now()){return;}
    const {refExp} =jwt_decode(localStorage.getItem('refreshToken'))
    // console.log("");
    if(refExp*1000>Date.now()){
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        throw Error('RT Expired');
    };
    try{
        const newAccessToken =  await post("/auth/refresh",{refreshToken:localStorage.getItem('refreshToken')})
    // newAccessToken.data.accessToken
        localStorage.setItem('accessToken',newAccessToken.data.accessToken);
    }catch(err){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}