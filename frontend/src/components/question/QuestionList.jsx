import axios from 'axios';
import React, { useState, useEffect,useReducer,useRef  } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { Link, useParams } from 'react-router-dom';
import QuestionItem from './QuestionItem';
import classes from './QuestionList.module.scss';
import { useLocation } from 'react-router-dom';

let questionData = {
  description: null ,
  cputime: null ,
  memory: null ,
  score:null ,
  input:[],
  output:[],
  example:[],
  constraints:[],
}

const reducerCounter = (state, action) => {
  switch (action.type) {
    case 'questionCount':
      return { ...state, count: state.count + 1};
    case 'caseCount':
      return { ...state, caseCount: state.caseCount + 1};
    case 'exampleCount':
      return { ...state, exampleCount: state.exampleCount + 1 };
    case 'constCount':
      return { ...state, constCount: state.constCount + 1 };
    default:
      throw new Error();
  }
}

function QuestionList() {
  const [state, dispatch] = useReducer(reducerCounter, 
      { count: 1, 
        caseCount: 1, 
        exampleCount:1,
        constCount:1,
      }
    );

  //references to inputs
  const inputRef = useRef();
  const outputRef = useRef();
  const sampleRef = useRef();
  const constRef = useRef();
  const [questionList, setQuestionList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUpdatingNew, setIsUpdatingNew] = useState(false);

  const location = useLocation();
  const data = location.state;

  const getQuestion = async () => {
    try {
      const myquestion= await axios.get(`/api/question/${data.taskId}`);
      console.log(myquestion.data);
      if (myquestion) {
        setQuestionList(
          myquestion.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getQuestion();
  }, []);
  // useEffect(() => {
  // }, [newTask]);

  const addNewButtonClick = () => {
    setIsAddingNew(!isAddingNew);
    setIsUpdatingNew(false);
  };

  const cancleButtonClick = () => {
    setIsUpdatingNew(false);
  };


  const updateButtonClick = async (eachTask) => {
    await setNewTask(eachTask);
    await setIsAddingNew(false);
    setIsUpdatingNew(!isUpdatingNew);
    await window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  //handleAdditionalLogic
  const handleAdditionalCase = async () => {
    questionData[inputRef.current.name] = [...questionData[inputRef.current.name] , inputRef.current.value];
    questionData[outputRef.current.name] = [...questionData[outputRef.current.name] , outputRef.current.value];
    inputRef.current.value = '';
    outputRef.current.value = '';
    console.log(questionData.input.length);
    console.log(questionData.input);
    dispatch({ type: 'caseCount' })  ;
    toast.success('Additional Case Added');
  }

  const handleAdditionalExample = async () => {
    questionData[sampleRef.current.name] = [...questionData[sampleRef.current.name] , sampleRef.current.value];
    sampleRef.current.value = '';
    console.log(questionData);
    dispatch({ type: 'exampleCount' })  ;
    toast.success('Additional Sample Added');
  }

  const handleAdditionalConst = async () => {
    questionData[constRef.current.name] = [...questionData[constRef.current.name] , constRef.current.value];
    constRef.current.value = '';
    console.log(questionData)
    dispatch({ type: 'constCount' })  ;
    toast.success('Additional Constraints Added');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    questionData = {
      description: e.target.description.value,
      cputime:e.target.cputime.value,
      memory: e.target.memory.value,
      input: [...questionData.input, e.target.input.value],
      output: [...questionData.output, e.target.output.value],
      example: [...questionData.example, e.target.example.value],
      constraints: [...questionData.constraints, e.target.constraints.value],
      taskId: data.taskId,
      questionNumber: state.count,
    };
    console.log(questionData);
    dispatch({ type: 'questionCount' });
    // console.log(Object.keys(questionData).length);
    if (Object.keys(description).length <= 0) {
      toast.error('Task is empty');
      return;
    }
    try {
      const { result } = await axios.post('/api/question/', questionData);
      toast.success('New Question added');
      setIsAddingNew(false);
      questionData = {
        description: null ,
        cputime: null ,
        memory: null ,
        score:null ,
        input:[],
        output:[],
        example:[],
        constraints:[],
      }
      setQuestionList([{ ...result }, ...questionList]);
    } catch (err) {
      console.log(err);
    }
  };

  // const updateTask = async (e) => {
  //   e.preventDefault();
    
  //   const taskData = {
  //     title: e.target.title.value,
  //     category: e.target.category.value,
  //     dateExp: e.target.dateExp.value,
  //     classId: params.id,
  //     completed: true,
  //   };
  //   if(moment().isBefore(taskData.dateExp))
  //     taskData.completed =  false;
  //   if (taskData.length <= 0) {
  //     toast.error('Task is empty');
  //     return;
  //   }
  //   // console.log(newTask._id);
  //   try {
  //     const { data } = await axios.put(`/api/tasks/${params.id}/${newTask._id}`, taskData);
  //     toast.success('New task added');
  //     setIsUpdatingNew(false);
  //     // setNewTask('');
  //     getTasks();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${params.id}/${id}`);
      toast.success('Task deleted');
      setquestionList(questionList.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Question List</h1>
      <h2>{data.taskName}</h2>
      <hr></hr>

      <div className={classes.containerflex}>
      <Link to='/'>Class >></Link>

      <Link to={`/class/${data.classId}`}>Task </Link>
      <p> >> Question </p>
      </div>
      <div className={classes.topBar}>
        <button
          type="button"
          className={classes.addNew}
          onClick={addNewButtonClick}
        >
          Add New
        </button>
      </div>

      {isAddingNew && (
        <form className={classes.addNewForm} onSubmit={handleSubmit}>
        <h1>Question: #{state.count}</h1>
          <div className={classes.flex}>
          <label htmlFor="description">
            Description:
          <textarea name="description" type="areatext" placeholder="Enter Description . ." id="description"   /> 
          
          </label>

          <label htmlFor="performance">
            Performance:
            <input name="cputime" type="number" placeholder="cputime" id="performance" />
            <input name="memory" type="number" placeholder="memory" id="memory"  />
            <input name="score" type="number" placeholder="score" id="score"/>
          </label>

          <label htmlFor="testcase">
            Test Case{ ` #${state.caseCount}`}
            <input name="input" type="text" id="input" placeholder='input' ref={inputRef}/>
            <input name="output" type="text" id="output" placeholder='output' ref={outputRef}/>
            <button type='button' onClick={handleAdditionalCase}>
              Set Additional 
            </button>
          </label>  

          <label htmlFor="example">
            Example{ ` #${state.exampleCount}`}
            <input name="example" type="text" id="example" placeholder='Input example' ref={sampleRef}/>
            {/* <button type='button' onClick={() => dispatch({ type: 'exampleCount' })}> */}
            <button type='button' onClick={handleAdditionalExample}>
            Set Additional 
            </button>
          </label>  

          <label htmlFor="constraints">
          Constraint{ ` #${state.constCount}`}
            <input name="constraints" type="text" placeholder="Input constraints" id="constraints"ref={constRef}/>
            <button type='button' onClick={handleAdditionalConst}>
            Set Additional 
            </button>
          </label>


          </div>

      <button type='button' onClick={() => dispatch({ type: 'questionCount' })}>
        Add another Question
      </button>
          <button type="submit">Submit</button>
        </form>
      )}
{/*       
      {isUpdatingNew && (
        <form className={classes.addNewForm} onSubmit={updateTask}>
        <label htmlFor="title">
          Enter Title:
          <input name="title" type="text" placeholder="Title" defaultValue={newTask.title} id="title" required />
        </label>

        <label htmlFor="category">
          Enter Category:
          <input name="category" type="text" placeholder="Category eg. Programming"defaultValue={newTask.category} id="category" />
        </label>

        <label htmlFor="dateExp">
          Enter Validity/Expiration for task:
          <input name="dateExp" type="datetime-local" defaultValue={moment(newTask.dateExp).format("YYYY-MM-DDTkk:mm")} id="dateExp" required />
        </label>
        <button type="submit">Add</button>
        <button type="button" onClick={cancleButtonClick}>cancel</button>
      </form>
      )}  */}
      {questionList.length > 0 ? (
        <table className={classes.questionList_table}>
          <tbody>
            <tr>
              <td>Description</td>
              <td>memory</td>
              <td>CPU time</td>
              <td>Input</td>
              <td>Output</td>
              
            </tr>
            {questionList.map((question) => (
              <QuestionItem key={question._id} question={question}  />
            ))}
          </tbody>
        </table>
      ) : (
        'No Questions Found. Create a new Question'
      )}
    </div>
  );
}

export default QuestionList;
