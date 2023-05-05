import Select from 'react-select';
import { useState } from 'react';
import reservedC from '../../constants/c-constructs';
import reservedCPP from '../../constants/cpp-constructs';
import reservedJava from '../../constants/java-constructs';
import reservedPython from '../../constants/python-constructs';


const CheckOutputs = ({detConstructs}) => {
	return(
	<>
		<h1> reserved words are</h1>
		{detConstructs.map((element, index) => {
			return (
				<h2 key={index}>{element.value}</h2>);
			})}
	</>
	);
} 



const ConstructCheck = ({code, lang}) => {
	let reservedWords = []

	switch(lang.name){
		case 'c':
			reservedWords = reservedC
			break;
		case 'cpp':
			reservedWords = reservedCPP
			break;
		case 'java':
			reservedWords = reservedJava
			break;
		case 'python':
			reservedWords = reservedPython
			break;
		default:
			console.log("Language not detected")

	}

	const [reservedArr, setReservedArr] = useState([...reservedWords])
	const [detConstructs, setDetConstructs] = useState([]) //possibly just an array
	const [selConstructs, setSelConstructs] = useState([reservedArr[0]])
	
	console.log("Selected is  ", selConstructs)
	console.log("Remaining options are ", reservedArr)

	const handleAddSelect = () => {
		setReservedArr(reservedWords.filter(n => !selConstructs.includes(n)))
		setSelConstructs([...selConstructs, reservedArr[1]])

	}

	const handleRemoveSelect = (index) => {
		let newConstructs = [...selConstructs]
		newConstructs.splice(index, 1)
		setSelConstructs(newConstructs)
		setReservedArr(reservedWords.filter(n => !selConstructs.includes(n)))
	}

	const handleChangeSelect = (selectedWord, index) => {
		let newSelConstructs =  [...selConstructs]
		newSelConstructs[index] = selectedWord
		setSelConstructs(newSelConstructs)
		setReservedArr(reservedWords.filter(n => !selConstructs.includes(n)))
	}

	const handleSearch = async (e) => {
		e.preventDefault()
		const words = code.match(/[a-zA-Z]+/g)
		const detectedWords = words.filter(word => reservedWords.includes(word));
		setDetConstructs(detectedWords)


	}

	return(
		<>
			<h1>Construct Checking</h1>
			<button  type="submit" onClick={handleSearch}>Lint</button>

			{selConstructs.map ((element, index) => {
				return(
					<div className="constructs" key={index}>
						<Select
						name="Construct selects"
						options={reservedWords.filter(n => !selConstructs.includes(n))}
						value={selConstructs[index]}
						onChange={(selectedConstruct) => handleChangeSelect(selectedConstruct, index)}
						/>

						{index > 0 &&
							<button type="button"  className="button remove" onClick={() => handleRemoveSelect(index)}>Remove Word</button>  
						}
					</div>

				)

			})}
			<button className="button add" type="button" onClick={() => handleAddSelect()}>Add More Words</button>
			{detectedWords && <CheckOutputs detConstructs={detConstructs}/>}
		</>
	)
} 

export default ConstructCheck