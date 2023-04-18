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
    return res.status(200).send('console log is ' + stdout)
  } catch (error) {

    console.log("Error stdout is ", error.stdout)
    let errArr = error.stderr.split('\n')
    errArr = errArr.filter(s=>~s.indexOf("code.c"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.c"))
    });
    console.log("Formatted Error Array is ", errArr)


    return res.status(200).send(errArr)
    
  }
}


export const lintJava = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.java");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("java -jar ../utils/linters/checkstyle.jar -c /google_checks.xml " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)

    let lintArr = stdout.split('\n')
    lintArr = lintArr.filter(s=>~s.indexOf(".java"));
    lintArr.forEach((element, index) => {
      lintArr[index] = element.substring(element.indexOf(".java"))
    });
    console.log("Formatted Linter Array is ", lintArr)

    return res.status(200).send('console log is ' + lintArr)
  } catch (error) {
    console.log("Error stderr is ", error.stderr)
    console.log("Error stdout is ", error.stdout)
    let errArr = error.stderr.split('\n')
    errArr = errArr.filter(s=>~s.indexOf(".java"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf(".java"))
    });
    console.log("Formatted Error Array is ", errArr)


    return res.status(200).send('console log is ' + error.stdout)
    
  }
}


export const lintPython = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.py");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("flake8 " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    return res.status(200).send('console log is ' + stdout)
  } catch (error) {

    const errArr = error.stdout.split('\n')
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.py"))
    });
    console.log("Formatted Error Array is ", errArr)

    return res.status(200).send(errArr)
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
    return res.status(200).send('console log is ' + stdout)
  } catch (error) {

    console.log("Error stdout is ", error.stdout)
    let errArr = error.stderr.split('\n')
    errArr = errArr.filter(s=>~s.indexOf("code.c"));
    errArr.forEach((element, index) => {
      errArr[index] = element.substring(element.indexOf("code.c"))
    });
    console.log("Formatted Error Array is ", errArr)

    return res.status(200).send(errArr)
  }
}
