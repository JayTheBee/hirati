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
  let subtitle;
  // class fetch
  const getClass = async () => {
    try {
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
      console.log(userData.data.role);  
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
    const classData = {
      className: e.target.className.value,
      studentEmail: e.target.studentEmail.value,
      teamCode: makeid(5),
    };
    classData.studentEmail = classData.studentEmail.split(',').map((item) => item.trim()).filter((a) => a);
    const valid = ValidateEmails(classData.studentEmail);

    console.log(valid);

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
    console.log(result);
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
      <h1 className={classes.pageTitle}>Class List </h1>
    </div>

    <div className={classes.containerflex}>

        <p> Class >></p>
    </div>
      <div>
        <button onClick={openModalNew} type="button" className={checkRole()? classes.hideBtn :classes.addNew} hidden>
          <AiFillPlusCircle />
          <p>&nbsp;Class</p>
        </button>

        <button onClick={openModalJoin} type="button" className={checkRole()?classes.addNew  :classes.hideBtn} hidden>
          <AiFillPlusCircle />
          <p>&nbsp;Join Class</p>
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
        className={classes.modal}
        overlayClassName={classes.overlay}
        contentLabel="Assign Task"
      >
        {/* modal render */}
        <button onClick={closeModal} type="button" className={classes.modalClose}> X </button>
        <h1 className={classes.titleTask}>
          {classData.className ? 'Updating Class': 'Creating New Class'}      
        </h1>
        <h3> CLASS CODE: &nbsp; {classData.teamCode}</h3>
        <form className={classes.addNewForm} onSubmit={classData.className ? updateClass : addNewClass}>
          <label htmlFor="">
            Classname
            <input name="className" type="text" placeholder="Classname" defaultValue={classData.className} disabled={checkRole()?true:false}/>
          </label>
          <label htmlFor="">
            Email
            <textarea type="textarea" name="studentEmail" id='email' rows="10" defaultValue={classData.studentEmail} placeholder="Enter Student Email Participants with comma seperated. Eg. Juan@gmail.com, Maria@gmail.com " disabled={checkRole()?true:false} />
          </label>
            <button type="submit"className={checkRole()? classes.disabledBtn :'' } disabled={checkRole() ?true:false}> <AiFillPlusCircle/> &nbsp; { checkRole() ?'Disabled' : 'Add'}</button>
        </form>
      </Modal>  
        {/* modal render */}


        <Modal
        isOpen={modalJoin}
        onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
        className={classes.modalSmall}
        overlayClassName={classes.overlay}
        contentLabel="Assign Task"
      >
        {/* modal render */}
        <button onClick={closeModal} type="button" className={classes.modalClose}> X </button>
        <h1 className={classes.titleTask}>
          Joining Class       
        </h1>

        <form className={classes.addNewForm} onSubmit={classData.className ? updateClass : addNewClass}>
          <h4>Warning! Code is Case Sensitive and requires only 5 alphanumeric String</h4>
          <br />
          <label htmlFor="">
            Please Enter Valid Class Code <br /> 
            
            <input maxlength="5" minLength={5} name="className" type="text" placeholder="Class Code" defaultValue={classData.className} disabled={!checkRole()?true:false}/>
          </label>
            <button type="submit" disabled={!checkRole() ?true:false}> <AiFillPlusCircle/> &nbsp; { !checkRole() ?'Disabled' : 'Add'}</button>
        </form>
      </Modal> 






      {classList.length > 0 ? (
        <div className={classes.tableContainer}>

        <table className={classes.taskList_table}>
          <tbody>
            <tr>
              <td>Classname</td>
              <td>Date Created</td>
              <td>List Of Student Participants Email</td>
              <td>Number of Students</td>
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
