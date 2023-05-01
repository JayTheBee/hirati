'use strict';

import util from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'
import  { exec } from 'child_process'

const exec_util = util.promisify(exec);




export const lintC = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.c");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("python -m cpplint --filter=-legal/copyright,-whitespace --quiet " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    console.log("err is ", err)
    const results = { status: 0, output: 'No problems found'}
    return res.status(200).json(results)
  } catch (error) {

    console.log("Error stdout is ", error.stdout)
    let errArr = error.stderr.split('\n')
    errArr = errArr.filter(s=>~s.indexOf("code.c"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.c"))
    });
    console.log("Formatted Error Array is ", errArr)

    const results = { status: 1, output: errArr}
    return res.status(200).json(results)
    
  }
}


export const lintJava = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.java");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {

    const {stdout, stderr, err } = await exec_util("\"../utils/linters/pmd-bin-6.55.0/bin/pmd.bat\" -R rulesets/java/quickstart.xml -f text -d " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    let results = {}
    if(stdout.includes("PMDException")){
       results = { status: 2, output: "Error analyzing. Perhaps not linting java?"}
    }else{
       results = { status: 0, output: 'No problems found'}
    }
    // let lintArr = stdout.split('\n')
    // lintArr = lintArr.filter(s=>~s.indexOf(".java"));
    // lintArr.forEach((element, index) => {
    //   lintArr[index] = element.substring(element.indexOf(".java"))
    // });
    // console.log("Formatted Linter Array is ", lintArr)

    return res.status(200).json(results)

  } catch (error) {
    console.log("Error stderr is ", error.stderr)
    console.log("Error stdout is ", error.stdout)
    let errArr = error.stdout.split('\n')
    errArr = errArr.filter(s=>~s.indexOf("code.java"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.java"))
    });
    console.log("Formatted Error Array is ", errArr)


    const results = { status: 1, output: errArr}
    return res.status(200).json(results)
    
  }
}


export const lintPython = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.py");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("python -m flake8 " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    const results = { status: 0, output: 'No problems found'}
    return res.status(200).json(results)
  } catch (error) {

    const errArr = error.stdout.split('\n')
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.py"))
    })
    errArr.pop()
    console.log("Formatted Error Array is ", errArr)
    const results = { status: 1, output: errArr}
    return res.status(200).json(results)
  }
}


export const lintCPP = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.cpp");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("python -m cpplint --filter=-legal/copyright,-whitespace --quiet " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    const results = { status: 0, output: 'No problems found'}
    return res.status(200).json(results)
  } catch (error) {

    console.log("Error stdout is ", error.stdout)
    let errArr = error.stderr.split('\n')
    errArr = errArr.filter(s=>~s.indexOf("code.c"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.c"))
    });
    console.log("Formatted Error Array is ", errArr)
    const results = { status: 1, output: errArr}
    return res.status(200).json(results)
  }
}
