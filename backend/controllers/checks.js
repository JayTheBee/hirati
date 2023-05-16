import Question from "../models/Question";
import Task from "../models/Task";

export const autoCheck = async (taskId, answerData) => {
	try {

		
		const task = await Task.findById(taskId);
		//Call judge0 batch submissions, like in frontend/src/component/editor jb/CodeSubmit.jsx
		//test student code from answerData with different input/output testcase from questionId
		//fetch every other question from taskId, and do the same
		//Each item will have a different result in  batchsubmission, to serve for checking
		//put results in db
	   } catch (err) {
		
	   }	
}