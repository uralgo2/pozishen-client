import React, {useEffect, useState} from 'react'
import './resources/styles/main.css'
import Header from "./components/Header"
import Queries from "./components/Queries";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Projects from "./components/Projects";
import ProjectsCreate from "./components/Projects.Create";
import {IProject, IUser} from "./types";
import {Api} from "./api";

function App() {
    const [user, setUser] = useState<IUser>({
        accountCreatedAt: new Date(),
        balance: 0,
        discount: 0,
        email: "",
        executedTasksForDay: 0,
        executedTasksForMonth: 0,
        executedTasksForWeek: 0,
        id: 0,
        loadLimit: 0,
        maxResourceLimit: 0
    })
    const [projects, setProjects] = useState<IProject[]>([])
    const fetchUser = async () => {
        const _user = await Api.GetMe()

        if("message" in _user)
            return alert(_user.message)

        _user.balance = Number(_user.balance)

        setUser(_user)
    }

    const fetchProjects = async () => {
        const _projects = await Api.GetProjects()

        if("message" in _projects)
            return alert(_projects.message)

        _projects.forEach(project => {
            if(project.lastCollection as any as string == '-')
                project.lastCollection = null
            else
                project.lastCollection = new Date(project.lastCollection as any as string)
        })
        setProjects(_projects)
    }

    useEffect(() => {
        fetchUser()
        fetchProjects()
    }, [])
  return (
      <div className="app">
          <Router>
              <Header user = {user}/>

              <Routes>
                  <Route path={'*'} element={<Navigate to='queries'/>}/>
                  <Route path='queries' element={<Queries/>}/>
                  <Route path='projects/create' element={<ProjectsCreate/>}/>
                  <Route path='projects' element={<Projects projects={projects} setProjects={setProjects}/>}/>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
