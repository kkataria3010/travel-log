import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
import {ErrorMessage} from '@hookform/error-message';
import { userPost } from '../../utils/requests';
import './LogEntryForm.css';
const LogEntryForm = ({location,onClose,addLogEntry,history}) => {
    const {register,handleSubmit,formState:{errors}} = useForm();
    const [error,setError] = useState('');
    const [loading,setloading] = useState(false);
    const onSubmit = async(data) =>{
        try{
            setloading(true);
            data.longitude = location.longitude;
            data.latitude = location.latitude;
            const {data:created} = await userPost('/user/addLogEntry',data,history);
            setloading(false);
            if(created.stack)throw created.message;
            // console.log("created",created);
            addLogEntry(created);
            onClose();
        }catch(error){
            setError(error);
            console.log(error);
        }
        
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="logEntry__form" autoComplete="off">
            {error ? <h3 className="error">{error}</h3>:null}
            <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" {...register('title',{required:{value:true,message:'Title is required'}})}/>
            <ErrorMessage className="error" errors={errors} name="title" as="p" />
            </div>
            <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea rows={3} {...register('comments')}></textarea>
            </div>
            <div className="form-group">
            <label htmlFor="image">Image</label>
            <input type="text" {...register('image')}/>
            </div>
            <div className="form-group">
            <label htmlFor="visitDate">Rating</label>
            <input type="number" {...register('rating',{min:{value:0,message:'Minimum rating is 0'},max:{value:10,message:'Maximum rating is 10'}})}/>
            <ErrorMessage className="error" errors={errors} name="rating" as="p" />
            </div>
            <div className="form-group">
            <label htmlFor="visitDate">Visit Date</label>
            <input type="date" {...register('visitDate',{required:{value:true,message:'Visit Date is required'}})}/>
            <ErrorMessage className="error" errors={errors} name="visitDate" as="p" />
            </div>
            <button disabled={loading} className="btn btn-primary">{loading?'Loading...':'Create Log Entry'}</button>
        </form>
    )
}
export default LogEntryForm;