import axios from "axios";
import { maintainTokens } from "./maintainTokens";
const API_URL = process.env.API_URL+'/api';
export async function post(url,data){
    const config = {
        header: {
          "Content-Type": "application/json",
        },
    };
    return axios.post(
        API_URL+url,
        data,
        config
    );
};
export async function get(url){
    const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
    return axios.get(API_URL+url,config);
}
export async function put(url,data){
    const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
    return axios.put(API_URL+url,data,config);
}
export async function userPost(url,data,history){
    
    try{
      await maintainTokens();
    }catch(error){
      console.log("error",error);
      history.push('/');
    }
    const token = localStorage.getItem("accessToken");
    if(!token) throw Error('No Token') ;
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    };
    return axios.post(API_URL+url,data,config);
}
export async function userGet(url,history){
  try{
    await maintainTokens();
  }catch(error){
    console.log("error",error);
    history.push('/');
  }
    const token = localStorage.getItem("accessToken");
    if(!token) throw Error('No Token') ;
    const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    };
    return axios.get(API_URL+url,config);
}