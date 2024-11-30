import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'




const ViewForm = () => {
    const {id} =useParams();
    const[form,setForm]=useState(null);
    const [loading ,setLoading]=useState(true);
    const [responses,setResponses]=useState({});
    const navigate = useNavigate();
    

    useEffect(()=>{

        const formUrl = `https://form-builder-backend-sigma.vercel.app/form/${id}`;
        //fetch form data by ID

        axios
        .get(formUrl)
        .then((response)=>{
            setForm(response.data.form);
            setLoading(false);
        })
        .catch((error)=>{
            console.log('Error fetching form:',error.response || error.message || error);
            setLoading(false);
        });

    },[id])

    const handleInputChange= (e)=>{
        const {name,value}=e.target;
        setResponses((prevResponses)=>({
            ...prevResponses,
            [name]:value,
        }));
    };


    const handleSubmit = (e) =>{
        e.preventDefault();

        const responseArray = Object.keys(responses).map((key) => ({
            inputTitle: key,
            response: responses[key],
        }));
    

        const responseData={
            formId: id,
            responses:responseArray,
        };
        

        axios
        .post(`https://form-builder-backend-sigma.vercel.app/form/${id}/submitForm`,responseData)
        .then((response)=>{
            alert('Form submitted successfully!');
            console.log('Response from backend:', response.data);
            navigate("/");
        })
        .catch((error) => {
          alert('Error submitting form');
          console.log('Error:', error.response || error.message || error);
        });
            
    };


    if(loading){
        return<p>Loading form...</p>
    }
    if(!form){
        return <p>Form not Found</p>
    }
  return (
    <div className='w-[60vw] mx-auto my-10 p-6 flex flex-col items-center border-2'>
        <h1 className='text-3xl mb-14'>{form.title}</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center' >
            <div className='grid  lg:grid-cols-2   md:grid-cols-2 gap-4 '>
            { form.inputs.map((input,index)=>(
                <div key={index} className='input-group'>
                    <label >{input.title}</label>
                    <input
                    id={input._id || input.title}
                     type={input.type}
                     name={input.title} 
                     placeholder={input.placeholder}
                     value={responses[input.title] || ''}
                     onChange={handleInputChange}
                     className='focus:outline-none border-b-2 border-gray-500 focus:border-b-2 focus:border-blue-600  transition-colors duration-300 ease-in'
                     />
                </div>
            ))}
            </div>
            <button type='submit' className='mt-4 w-20  bg-green-700 text-white px-3 py-1 rounded-sm'>Submit</button>
        </form>

    </div>
  )
}

export default ViewForm;
