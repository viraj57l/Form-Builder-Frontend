import axios from "axios";
import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [title, setTitle] = useState("Untitled Form");
  const [editingIndex, setEditingIndex] = useState(null);
  const [showInputTypes, setShowInputTypes] = useState(false);
  const [inputs, setInputs] = useState([]); //  no input boxes at first
  const [inputData, setInputData] = useState({
    title: "",
    placeholder: "",
  });

  const [isTitleEditing, setIsTitleEditing] = useState(false); // to track title editing mode
  const [loading, setLoading] = useState(isEditMode);

  useEffect(()=>{
    if(isEditMode){
        axios
           .get(`http://localhost:5000/form/${id}`)
           .then((response)=>{
            const {title,inputs} =response.data.form;
            setTitle(title);
            setInputs(inputs);
            setLoading(false);
           })
           .catch((error)=>{
            console.log("Error fetching form data",error);
            setLoading(false);
           })
    }
  },[id,isEditMode])

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInputs = [...inputs];
    updatedInputs[index][name] = value;
    setInputs(updatedInputs);
  };

  const toggleInputTypes = () => {
    setShowInputTypes((prev) => !prev);
  };

  const handleInputTypeSelect = (type) => {
    const newInput = {
      title: "New Input",
      type: type, 
      placeholder: "",
    };
    setInputs([...inputs, newInput]); 
    setShowInputTypes(false); // hding the  buttons after selecting one input type
  };

  const handleRemoveInput = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setInputData(inputs[index]); // set input data for editing
  };

  const handleCancelEdit = () => {
    setEditingIndex(null); // cancelling edit
    setInputData({ title: "", placeholder: "" }); // resetting to initial value to the input fields
  };

  const handleUpdateInput = () => {
    const updatedInputs = [...inputs];
    updatedInputs[editingIndex] = inputData; // update the edited data
    setInputs(updatedInputs);
    setEditingIndex(null); // xit editing mode
  };

  const handleTitleEditClick = () => {
    setIsTitleEditing(true); 
  };

  
  const handleTitleBlur = () => {
    setIsTitleEditing(false); // stop editing ,when the input loses focus
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validaion
    const allFieldsFilled = inputs.every(input => input.title && input.placeholder);

    if (!allFieldsFilled) {
      alert("Please fill all input fields before submitting.");
      return;
    }

    const formData = {
      title,
      inputs,
    };

    const request = isEditMode
      ? axios.put(`http://localhost:5000/form/${id}/edit`, formData)
      : axios.post("http://localhost:5000/form/create", formData);

    request
      .then(() => {
        alert(`Form ${isEditMode ? "updated" : "created"} successfully!`);
        navigate("/"); // navigate back to home or forms list
      })
      .catch((error) => {
        console.error(`Error ${isEditMode ? "updating" : "creating"} form:`, error);
      }); 
  };

  if (loading) {
    return <p>Loading form data...</p>; //loading while fetching data
  }

  return (
    <div className="w-[60vw] mx-auto my-6 px-4 py-1 flex flex-col items-center ">
      <h1 className="text-3xl mb-2">
      {isEditMode ? "Edit Form" : "Create New Form"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="lg:w-[60vw] md:w-[80vw] h-[60vh] flex "
      >
        {/* Left Panel */}
        <div className="flex flex-col  lg:w-[40vw] h-[80vh]  md:w-[60vw]  p-4 border-2 border-r-0 border-gray-300">
          <div className="flex mx-auto mb-4 ">
            <h1 className="text-2xl">{title}</h1>
            <i
              className="fa-solid fa-pen flex pl-3 mt-2 text-blue-500 hover:text-red-500"
              onClick={handleTitleEditClick} // Start editing the title
            ></i>
          </div>
          
          {/* Input Box */}
          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto ">
            {inputs.map((input, index) => (
              <div key={index} className=" w-50 h-18 mt-4  border  rounded-xl shadow-xl px-3 py-1 flex justify-between items-center ">
                <div>
                  <h3 className="text-md mb-2">{input.title || "Untitled Input"}</h3>
                  <p className="text-md text-gray-400 border-b border-gray-700">{input.placeholder || "No placeholder"}</p>
                </div>
                <div className="space-x-3">
                <i
                  className="fa-solid fa-pen text-blue-500 cursor-pointer"
                  onClick={() => handleEditClick(index)} // Show the selected input in the right panel
                ></i>
                <i
                  className="fa-solid fa-trash text-red-500 cursor-pointer"
                  onClick={() => handleRemoveInput(index)} // Remove the input
                ></i>
                </div>
                
              </div>
            ))}
          </div>

          {/* Button Boxes */}
          <div className="flex flex-col mx-auto mt-40">
            {inputs.length < 20 && (
              <button
                type="button"
                className="w-46 border font-semibold text-blue-600 border-blue-600 bg-white p-2 rounded"
                onClick={toggleInputTypes}
              >
                {showInputTypes ? "Close Add Input" : "Add Input"}
              </button>
            )}

            {showInputTypes && (
              <div className="mt-4 space-x-4">
                <button
                  type="button"
                  onClick={() => handleInputTypeSelect("text")}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Text
                </button>

                <button
                  type="button"
                  onClick={() => handleInputTypeSelect("number")}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Number
                </button>

                <button
                  type="button"
                  onClick={() => handleInputTypeSelect("email")}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Email
                </button>

                <button
                  type="button"
                  onClick={() => handleInputTypeSelect("password")}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Password
                </button>

                <button
                  type="button"
                  onClick={() => handleInputTypeSelect("date")}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Date
                </button>
              </div>
            )}
            <button type="submit" className="mt-4 w-36 bg-green-700 text-white px-3 py-1 rounded-sm">
            {isEditMode ? "Update Form" : "Submit Form"}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[20vw] h-[80vh] md:w-[20vw] border-2 p-4 border-gray-300 flex flex-col items-center">
          {/* Title Edit */}
          <div className="mb-10">
            <h1 className="text-xl mb-5">Form editor</h1>
            {isTitleEditing ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur} // Save title when input loses focus
                  placeholder="Edit Form Title"
                  className="w-full border-b-2 border-gray-500 focus:border-b-2 focus:border-blue-600 mb-2"
                />
              </div>
            ) : (
              <p>Select an input to edit</p>
            )}
          </div>

          {/* Input Edit */}
          <div className="p-2">
            {editingIndex !== null ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData({ ...inputData, title: e.target.value })
                  }
                  placeholder="Input title"
                  className="w-full border-b-2 border-gray-500 focus:border-b-2 focus:border-blue-600 mb-2"
                />
                <input
                  type="text"
                  name="placeholder"
                  value={inputData.placeholder}
                  onChange={(e) =>
                    setInputData({ ...inputData, placeholder: e.target.value })
                  }
                  placeholder="Input placeholder"
                  className="w-full border-b-2 border-gray-500 focus:border-b-2 focus:border-blue-600 mb-2"
                />
                <button
                  type="button"
                  onClick={handleUpdateInput}
                  className="bg-blue-500 text-white py-1 px-3 mt-2 mr-4 rounded"
                >
                  Update Input
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white py-1 px-3 mt-2 rounded"
                >
                  Cancel Edit
                </button>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
