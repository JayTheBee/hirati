import axios from 'axios';
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { AiFillPlusCircle } from 'react-icons/ai';
import ClassItem from './ClassItem';
import classes from './ClassList.module.scss';

function ClassList(userData) {
  const [classList, setClassList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUpdatingNew, setIsUpdatingNew] = useState(false);
  const [classData, setClassData] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalJoin, setModalJoin] = useState(false);
  const [error, setError] = useState('');
  let subtitle;
  // class fetch
  const getClass = async () => {
    // console.log(userData.data.email);
    try {
      // const { data } = await axios.get('/api/class/myClass');
      const { data } = await axios.get('/api/class/myClass');
      setClassList(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  
  function checkRole (){
    if (userData.data){
      // console.log(userData.data.role);  
      return (userData.data.role === 'student'? true: false )
    }
    else 
      return false;
  }

  useEffect(() => {
    getClass();
  }, [userData]);




  const addNewClass = async (e) => {
    e.preventDefault();
    let classData = {
      className: e.target.className.value,
      studentEmail: e.target.studentEmail.value,
      teamCode: makeid(5),
    };
    // classData = {...classData,studentEmail: [...classData.studentEmail, userData.data.email]};
    classData.studentEmail = classData.studentEmail.split(',').map((item) => item.trim()).filter((a) => a);
    classData.studentEmail.push(userData.data.email);
    const valid = ValidateEmails(classData.studentEmail);

    // console.log(valid);

    if(!valid){
      toast.error('Please enter valid Email');
    }
    else if (classData.className.length <= 0) {
      toast.error('Please enter Classname');
    }

    else{
      try {
        const { data } = await axios.post('/api/class/', classData);
        toast.success('Class Created Succesfully');
        setIsOpen(false);
        e.target.className.value = '';
        e.target.studentEmail.value = '';
        setClassList([{ ...data }, ...classList]);
      } catch (error) {
        if (teamCode)
        toast.error('Something went wrong');
        console.log(error);
      }
    }
  };

  const deleteClass = async (id) => {
    try {
      // console.log(`/api/class/${id}`);
      await axios.delete(`/api/class/${id}`);
      toast.success('Class deleted');
      setClassList(classList.filter((eachClass) => eachClass._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const updateButtonClick = async (eachClass) => {
    await setClassData(eachClass);
    console.log(classData);
    openModalUpdate(true);
  };

  

  const updateClass = async (e) => {
    e.preventDefault();
    const dataForUpdate = {
      className: e.target.className.value,
      studentEmail: e.target.studentEmail.value,
    };
    dataForUpdate.studentEmail = dataForUpdate.studentEmail.split(',').map((item) => item.trim()).filter((a) => a);
    // console.log(dataForUpdate);
    const valid = ValidateEmails(dataForUpdate.studentEmail);

    if(!valid){
      toast.error('Please enter valid Email');
    }
    else if (classData.className.length <= 0) {
      toast.error('Please enter Classname');
    }

    else{
      try {
        await axios.put(`/api/class/${classData._id}`, dataForUpdate);
        toast.success('Class Updated Succesfully');
        getClass();
      } catch (error) {
        toast.error('Something went wrong updating');
        console.log(error);
      }
    }
  };

  const joinClass = async (e) => {
    e.preventDefault();
    if(!e.target.teamCode.value){
      toast.error('Please enter team code');
    }
    else {
      const data = {
        teamCode: e.target.teamCode.value,
        email: userData.data.email
      };
      // console.log(data);
      try{
        await axios.put(`/api/class/joinClass/${e.target.teamCode.value}`, data);
        getClass();
        setError('');
        toast.success('Class Joined Succesfully');
        setModalJoin(false);
      }catch(e){
        if (
          e.response && e.response.status >= 400 && e.response.status <= 500
        ) {
          setError(e.response.data.message);
          toast.error('Something went wrong');
        }
      }
    }
  };



  function openModalNew() {
    setClassData({});
    setIsOpen(true);
  }

  function openModalJoin() {
    setModalJoin(true);
  }

  // generate random teamcode
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    // console.log(result);
    return result;
}

  function openModalUpdate() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    subtitle.style.color = '#f5f5f5';
  }

  function closeModal() {
    setIsOpen(false);
    setModalJoin(false);
  }
  //check textarea
  function ValidateEmails(email) {  
      for (let i=0;i<email.length;i++)
      {
         var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
         return regex.test(email[i]);
      }
  }

  return (
      <div>
    <div className={classes.title}>
      <h1 className={classes.pageTitle}> {checkRole()?'MY CLASSES': 'MY CLASS LIST'} </h1>
    </div>

  <div className='container-fluid rounded-pill px-4 py-0 ' style={{backgroundColor:'#187f524b' }} >
        <p class='text-white my-auto fs-4 fw-bolder'> Class {' '}  >></p>
    </div>
    
      <div>
        {/* //// test */}
        <button onClick={openModalNew} type="button" className={checkRole()? 'd-none' :'d-flex align-items-center  px-4 btn btn-success mt-4 rounded-pill text-white fs-4 fw-bold'} >
          <AiFillPlusCircle />
          <p className='my-auto p-2'>&nbsp;Add</p>
        </button>


        <button onClick={openModalJoin} type="button" className={!checkRole()?'d-none' :'d-flex align-items-center  px-4 btn btn-success mt-4 rounded-pill text-white fs-4 fw-bold'} >
          <AiFillPlusCircle />
          <p className='my-auto p-2'>&nbsp;Join</p>
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={classes.customModal}
        overlayClassName={classes.overlay}
        contentLabel="Assign Task"
        ariaHideApp={false}
      >


        {/* modal render */}
        <button onClick={closeModal} type="button" className={classes.modalClose}> X </button>
        <h1 className={classes.titleTask}>
          {classData.className ? 'Updating Class': 'Creating New Class'}      
        </h1>
        <h3> CLASS CODE: &nbsp; {classData.teamCode}</h3>
        <form className='row align-center fs-4 fw-bold ' onSubmit={classData.className ? updateClass : addNewClass}>
          <label htmlFor="" className=' my-4'>
            Classname:
            <input name="className" className='mx-4 p-2 rounded-3' type="text" placeholder="Classname" defaultValue={classData.className} disabled={checkRole()?true:false}/>
          </label>

          <span htmlFor="" className=''>
            Email:
          </span>
            <textarea type="textarea" className='d-inline mx-4 h-100 w-75' name="studentEmail" id='email' rows="10" defaultValue={classData.studentEmail} placeholder="Enter Student Email Participants with comma seperated. Eg. Juan@gmail.com, Maria@gmail.com " disabled={checkRole()?true:false} />
          
          <button type="submit"className={checkRole()? 'd-none' :'w-25 btn btn-success p-3 m-4 fs-4 text-center rounded-pill' } > <AiFillPlusCircle/> &nbsp; { checkRole() ?'Disabled' : 'Confirm'}</button>
        </form>
      </Modal>  
        {/* modal render */}

      {/* modal for join class */}
        <Modal
        isOpen={modalJoin}
        // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
        className={classes.modalSmall}
        overlayClassName={classes.overlay}
        contentLabel="Assign Task"
        ariaHideApp={false}
      >
        {/* modal render */}
        <button onClick={closeModal} type="button" className={classes.modalClose}> X </button>
        <h1 className={classes.title}>
          Joining Class       
        </h1>

        <form className={classes.addNewForm} onSubmit={ joinClass}>
          <h3 className='text-center'>Class Code is Case Sensitive and requires only 5 alphanumeric String</h3>
          <br />
          <label htmlFor="" className='text-center fs-4 my-4 p-3'>
            Please Enter Valid Class Code <br /> 
            
            <input className='w-100' maxLength="5" minLength={5} name="teamCode" type="text" placeholder="Class Code" defaultValue={classData.className} disabled={!checkRole()?true:false}/>
          </label>
            <button className='mx-4 d-flex align-items-center my-4' type="submit" disabled={!checkRole() ?true:false}> <AiFillPlusCircle/> &nbsp; { !checkRole() ?'Disabled' : 'Add'}</button>
        </form>
        {error && <div className={classes.error_msg}>{error}</div>} 
      </Modal> 
      {/* modal for join class */}





      {classList.length > 0 ? (
        <div className='d-grid container-fluid fs-5 px-4 gap-4 overflow-auto '>

        <table className={classes.taskList_table}>
          <tbody>
            <tr className='my-2 fw-bold'>
              <td>Classname</td>
              <td>Date Created</td>
              <td>List Of Participants Email</td>
              <td>Total Students</td>
              <td>Team Code</td>
              <td>Action</td>
            </tr>
            {classList.map((each) => (
              <ClassItem
                key={each._id}
                eachClass={each}
                role = {checkRole()?'student':'teacher'}
                deleteClass={deleteClass}
                updateButtonClick={updateButtonClick}
              />
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        'No Class Found. Create a new class'
      )}
    </div>
  );
}

export default ClassList;
