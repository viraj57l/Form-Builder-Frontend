import React, { useEffect, useState } from 'react'
import axios from'axios'
import { useNavigate } from 'react-router-dom';


const Home = () => {

    const navigate=useNavigate();


    const [forms,setForms]=useState([]);

    useEffect (()=>{
        axios.get('https://form-builder-backend-sigma.vercel.app/')
        .then((response)=>{
            setForms(response.data.forms);
        })
        .catch((error)=>{
            console.log('Error fetching forms',error);
            
        });
    },[]);

    const handleDelete =(id) =>{
      if(window.confirm('Are you sure want to delete this form?')){
        axios
            .delete(`https://form-builder-backend-sigma.vercel.app/form/${id}`)
            .then((response)=>{
              //after deletion updating states
              setForms(forms.filter((form)=> form._id !== id));
              alert('Form deleted succesfully')
            })
            .catch((error)=>{
              console.log('Error deleting form :',error);
              alert('Failed to delete the form');
            });
      }
    };


  return (
    <div className=' mx-auto w-[80vw]'>
        {/* titles */}
      <div className=' w-full h-[22vh] flex flex-col  items-center p-8 border-b-2 border-gray-400 '>
        <h1 className='text-4xl '>Welcome to Form.com </h1>
        <h2>This is simple form  Builder.</h2>
        <button
        onClick={()=>navigate('/form/create-form')}
        className='text-white bg-green-700 mx-auto px-2 py-1 border-none rounded-md uppercase font-semibold text-sm mt-6'>
            Create New Form
        </button>
      </div>

      {/* show forms  */}
      <div className='p-2'>
        <h1 className='text-3xl mb-4'>Forms</h1>
        {
            forms.length===0 ?(
                <p className='text-md text-gray-500'>You have no forms created yet.</p>
            ):(
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grids-cols-5 gap-4 py-4'>
                  {
                    forms.map((form)=>(
                        <div key={form._id} className='px-4 py-5 border rounded-md shadow-xl'>
                            <h2 className='text-lg'>{form.title}</h2>
                            <div className='flex mt-4 justify-between'>
                            <button onClick={()=>navigate(`/form/${form._id}`)} className=' pl-2 py-1 text-green-700 border-none hover:bg-slate-300'>View</button>
                            <button onClick={()=>navigate(`/form/edit/${form._id}`)}  className=' py-1 text-blue-700 border-none hover:bg-slate-300'>Edit</button>
                            <button onClick={() => handleDelete(form._id)} className=' py-1 text-red-700 border-none hover:bg-slate-300'>Delete</button>
                            </div> 
                        </div>
                    ))
                  }  
                </div>
            )
        }
      </div>


    </div>
  )
}

export default Home
