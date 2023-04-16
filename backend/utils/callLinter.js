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
    return res.status(200).send('console log is ' + stdout)
  } catch (error) {
    console.log("stderr is ", error.stderr)
    console.log("stdout is ", error.stdout)
    return res.status(200).send('console log is ' + error.stdout)
    
  }
}


export const lintJava = async (req, res) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const tmpFilePath = path.join(tmpDir, "code.java");
  fs.writeFileSync(tmpFilePath, req.body.code);

  try {
    const {stdout, stderr, err } = await exec_util("java -jar ../../utils/linters/checkstyle.jar /google_checks.xml " + tmpFilePath) 
    console.log("stderr is ", stderr)
    console.log("stdout is ", stdout)
    return res.status(200).send('console log is ' + stdout)
  } catch (error) {
    console.log("stderr is ", error.stderr)
    console.log("stdout is ", error.stdout)
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
    console.log("stderr is ", error.stderr)
    console.log("stdout is ", error.stdout)
    return res.status(200).send('console log is ' + error.stdout)
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
    console.log("stderr is ", error.stderr)
    console.log("stdout is ", error.stdout)
    return res.status(200).send('console log is ' + error.stdout)
  }
}
